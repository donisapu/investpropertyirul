<?php

namespace App\Services\Cashout;

use App\Models\CompanyCashout;
use App\Models\User;
use App\Models\WithdrawalSetting;
use App\Models\XenditTransaction;
use App\Services\Wallet\WalletReserve;
use App\Services\Withdrawal\PayoutFailure;
use App\Services\Withdrawal\PayoutResult;
use App\Services\Xendit\Exceptions\XenditException;
use App\Services\Xendit\Exceptions\XenditRejectedException;
use App\Services\Xendit\Exceptions\XenditUnknownOutcomeException;
use App\Services\Xendit\XenditGateway;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Company Cash-out (spec Q3, Q4, Q7, D3): admin picks settled money-in Xendit
 * Transactions and sends their total in ONE Payout to the saved Company Bank
 * Account. User money (the Reserve) is never touched:
 *
 *   total <= fresh CASH - Reserve - Cash-outs still in flight without a payout
 *
 * and if CASH cannot be read, nothing is sent (fail closed). Cash-outs are
 * serialized with a database row lock so two admins cannot pass the limit together.
 */
class CashoutService
{
    public const MAX_ROWS = 500;

    private const FINAL_PAYOUT_STATUSES = [
        'SUCCEEDED' => CompanyCashout::STATUS_SUCCEEDED,
        'FAILED' => CompanyCashout::STATUS_FAILED,
        'CANCELLED' => CompanyCashout::STATUS_FAILED,
        'COMPLIANCE_REJECTED' => CompanyCashout::STATUS_FAILED,
        'REVERSED' => CompanyCashout::STATUS_REVERSED,
    ];

    /** Not a clear refusal (see WithdrawalService): never release rows on these. */
    private const AMBIGUOUS_ERRORS = ['DUPLICATE_ERROR'];

    public function __construct(
        private readonly XenditGateway $gateway,
        private readonly WalletReserve $reserve,
    ) {}

    /**
     * Max Cash-out right now for a given CASH balance.
     */
    public function maxCashout(int|float $cash): int
    {
        return max(0, (int) floor($cash) - $this->reserve->total() - $this->inFlight());
    }

    /**
     * D3: oldest eligible rows first, keep each that still fits under the max.
     *
     * @return EloquentCollection<int, XenditTransaction>
     */
    public function autoSelect(int $max): EloquentCollection
    {
        $picked = new EloquentCollection;
        $total = 0;

        foreach (XenditTransaction::cashoutEligible()->orderBy('xendit_created_at')->orderBy('id')->limit(self::MAX_ROWS)->get() as $t) {
            $net = $t->netAmount();
            if ($net > 0 && $total + $net <= $max) {
                $picked->push($t);
                $total += $net;
            }
        }

        return $picked;
    }

    /**
     * @param  list<int>  $transactionIds
     *
     * @throws CashoutRejected when the selection or the limit does not allow it (nothing sent)
     */
    public function create(User $admin, array $transactionIds): CashoutAttempt
    {
        $ids = array_values(array_unique(array_map('intval', $transactionIds)));

        if ($ids === []) {
            throw new CashoutRejected('Pilih minimal satu transaksi uang masuk yang sudah settle.');
        }
        if (count($ids) > self::MAX_ROWS) {
            throw new CashoutRejected('Maksimal '.self::MAX_ROWS.' transaksi per Cash-out.');
        }

        $account = WithdrawalSetting::current()->companyAccount();
        if (! $account) {
            throw new CashoutRejected('Rekening perusahaan belum diatur di Settings.');
        }

        return $this->send($this->reserveRows($admin, $ids, $account));
    }

    /**
     * Apply a Payout result (webhook or status check) to a Cash-out. Idempotent;
     * a failure or reversal releases the transactions once.
     */
    public function applyPayoutResult(CompanyCashout $cashout, array $payout): string
    {
        $status = strtoupper((string) ($payout['status'] ?? ''));
        $payoutId = is_string($payout['id'] ?? null) ? $payout['id'] : null;
        $target = self::FINAL_PAYOUT_STATUSES[$status] ?? null;

        return DB::transaction(function () use ($cashout, $status, $payoutId, $target, $payout) {
            $locked = CompanyCashout::query()->whereKey($cashout->id)->lockForUpdate()->firstOrFail();

            if ($locked->xendit_id !== null && $payoutId !== null && $locked->xendit_id !== $payoutId) {
                Log::warning('Cash-out payout result for a different payout id ignored', ['cashout_id' => $locked->id]);

                return PayoutResult::IGNORED;
            }
            $locked->xendit_id ??= $payoutId;

            $allowed = match ($target) {
                CompanyCashout::STATUS_SUCCEEDED, CompanyCashout::STATUS_FAILED => $locked->status === CompanyCashout::STATUS_PROCESSING,
                CompanyCashout::STATUS_REVERSED => in_array($locked->status, [CompanyCashout::STATUS_PROCESSING, CompanyCashout::STATUS_SUCCEEDED], true),
                default => false,
            };

            if (! $allowed) {
                if ($target === null && $locked->isOpen() && $status !== '') {
                    $locked->payout_status = $status;
                }
                $locked->save();

                return PayoutResult::IGNORED;
            }

            $failureCode = is_string($payout['failure_code'] ?? null) ? $payout['failure_code'] : null;
            $locked->forceFill([
                'status' => $target,
                'payout_status' => $status,
                'failure_code' => $target === CompanyCashout::STATUS_SUCCEEDED ? null : $failureCode,
                'failure_reason' => $target === CompanyCashout::STATUS_SUCCEEDED ? null : PayoutFailure::message($failureCode),
                'processed_at' => now(),
            ])->save();

            if ($target !== CompanyCashout::STATUS_SUCCEEDED) {
                $this->release($locked);
            }

            return PayoutResult::APPLIED;
        });
    }

    /**
     * Ask Xendit for the Cash-out's Payout and apply it (by id, or by reference
     * when the send had an unknown result).
     *
     * @throws XenditException
     */
    public function checkStatus(CompanyCashout $cashout): string
    {
        if ($cashout->xendit_id) {
            return $this->applyPayoutResult($cashout, $this->gateway->getPayout($cashout->xendit_id));
        }

        $payouts = $this->gateway->findPayoutsByReference($cashout->external_id);

        return $payouts === [] ? PayoutResult::NOT_FOUND : $this->applyPayoutResult($cashout, $payouts[0]);
    }

    /** Lock + validate the rows, re-check the limit with a fresh balance, and record the Cash-out. */
    private function reserveRows(User $admin, array $ids, array $account): CompanyCashout
    {
        return DB::transaction(function () use ($admin, $ids, $account) {
            // One Cash-out at a time, across processes and servers: lock the settings row.
            WithdrawalSetting::query()->orderBy('id')->lockForUpdate()->first();

            try {
                // Fresh and read inside the lock, so an earlier Cash-out is either still
                // counted as in flight or already gone from CASH, never neither.
                $cash = $this->gateway->getBalance(XenditGateway::BALANCE_CASH);
            } catch (XenditException $e) {
                Log::warning('Cash-out blocked: CASH balance could not be read', ['admin_id' => $admin->id, 'error' => $e->getMessage()]);

                throw new CashoutRejected('Saldo Xendit tidak bisa dibaca sekarang, jadi Cash-out diblokir. Coba lagi nanti.');
            }

            $rows = XenditTransaction::query()->whereKey($ids)->orderBy('id')->lockForUpdate()->get();

            if ($rows->count() !== count($ids)) {
                throw new CashoutRejected('Sebagian transaksi tidak ditemukan. Muat ulang halaman.');
            }

            $invalid = $rows->reject->isCashoutEligible();
            if ($invalid->isNotEmpty()) {
                throw new CashoutRejected($invalid->count().' transaksi sudah dicairkan, belum settle, atau bukan uang masuk. Muat ulang dan pilih lagi.');
            }

            $total = (int) $rows->sum(fn (XenditTransaction $t) => $t->netAmount());
            if ($total < 1) {
                throw new CashoutRejected('Total Cash-out harus lebih dari Rp 0.');
            }

            $reserve = $this->reserve->total();
            $max = max(0, (int) floor($cash) - $reserve - $this->inFlight());

            if ($total > $max) {
                throw new CashoutRejected(sprintf(
                    'Diblokir: total Rp %s melebihi batas Rp %s (Reserve milik user tidak boleh dipakai). Kurangi Rp %s.',
                    number_format($total, 0, ',', '.'), number_format($max, 0, ',', '.'), number_format($total - $max, 0, ',', '.'),
                ), $total, $max);
            }

            $cashout = CompanyCashout::create([
                'external_id' => CompanyCashout::REFERENCE_PREFIX.Str::ulid(),
                'amount' => $total,
                'transaction_count' => $rows->count(),
                'bank_code' => $account['bank_code'],
                'account_number' => $account['account_number'],
                'account_holder' => $account['account_holder'],
                'status' => CompanyCashout::STATUS_PROCESSING,
                'balance_at_request' => (int) floor($cash),
                'reserve_at_request' => $reserve,
                'created_by' => $admin->id,
            ]);

            $cashout->transactions()->attach($rows->mapWithKeys(fn (XenditTransaction $t) => [$t->id => ['amount' => $t->netAmount()]])->all());
            XenditTransaction::query()->whereKey($rows->modelKeys())->update(['company_cashout_id' => $cashout->id]);

            Log::info('Company cash-out created', [
                'cashout_id' => $cashout->id, 'external_id' => $cashout->external_id, 'admin_id' => $admin->id,
                'amount' => $total, 'rows' => $rows->count(), 'cash' => (int) floor($cash), 'reserve' => $reserve,
            ]);

            return $cashout;
        });
    }

    private function send(CompanyCashout $cashout): CashoutAttempt
    {
        try {
            $payout = $this->gateway->createPayout(
                idempotencyKey: $cashout->external_id,
                referenceId: $cashout->external_id,
                channelCode: $cashout->bank_code,
                accountNumber: $cashout->account_number,
                holderName: $cashout->account_holder,
                amount: $cashout->amount,
                description: 'Company cash-out '.$cashout->external_id,
            );
        } catch (XenditUnknownOutcomeException) {
            return new CashoutAttempt(CashoutAttempt::UNKNOWN, $cashout->fresh(),
                'Hasil dari Xendit belum pasti. Cash-out tetap diproses (transaksi tetap terkunci); cek status di riwayat.');
        } catch (XenditRejectedException $e) {
            if ($e->is(...self::AMBIGUOUS_ERRORS)) {
                return new CashoutAttempt(CashoutAttempt::UNKNOWN, $cashout->fresh(), 'Xendit melaporkan '.$e->errorCode.'. Cek status di riwayat.');
            }

            $this->fail($cashout, $e->errorCode, $e->errorMessage);

            return new CashoutAttempt(CashoutAttempt::FAILED, $cashout->fresh(),
                'Xendit menolak Cash-out ('.$e->errorCode.'). Transaksi dilepas dan bisa dipilih lagi.');
        } catch (\InvalidArgumentException $e) {
            $this->fail($cashout, 'INVALID_COMPANY_ACCOUNT', $e->getMessage());

            return new CashoutAttempt(CashoutAttempt::FAILED, $cashout->fresh(), 'Rekening perusahaan tidak valid: '.$e->getMessage());
        }

        $cashout->forceFill(['xendit_id' => $payout['id'], 'payout_status' => $payout['status']])->save();

        return new CashoutAttempt(CashoutAttempt::SENT, $cashout, 'Cash-out dikirim ke Xendit.');
    }

    private function fail(CompanyCashout $cashout, ?string $code, ?string $reason): void
    {
        DB::transaction(function () use ($cashout, $code, $reason) {
            $locked = CompanyCashout::query()->whereKey($cashout->id)->lockForUpdate()->firstOrFail();
            if (! $locked->isOpen()) {
                return;
            }
            $locked->forceFill([
                'status' => CompanyCashout::STATUS_FAILED,
                'failure_code' => $code,
                'failure_reason' => $reason ? mb_substr($reason, 0, 255) : null,
                'processed_at' => now(),
            ])->save();
            $this->release($locked);
        });
    }

    /** Free the rows so they can be selected again. The pivot keeps the history. */
    private function release(CompanyCashout $cashout): void
    {
        if ($cashout->released_at !== null) {
            return;
        }

        XenditTransaction::query()->where('company_cashout_id', $cashout->id)->update(['company_cashout_id' => null]);
        $cashout->forceFill(['released_at' => now()])->save();
    }

    /** Cash-outs that took money but Xendit has not moved it out of CASH yet (no payout id). */
    private function inFlight(): int
    {
        return (int) CompanyCashout::query()
            ->where('status', CompanyCashout::STATUS_PROCESSING)
            ->whereNull('xendit_id')
            ->sum('amount');
    }
}
