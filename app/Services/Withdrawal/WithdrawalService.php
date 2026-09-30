<?php

namespace App\Services\Withdrawal;

use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use App\Notifications\WithdrawalApproved;
use App\Notifications\WithdrawalFailed;
use App\Notifications\WithdrawalRejected;
use App\Notifications\WithdrawalSucceeded;
use App\Services\Xendit\BankChannelCatalog;
use App\Services\Xendit\Exceptions\XenditRejectedException;
use App\Services\Xendit\Exceptions\XenditUnknownOutcomeException;
use App\Services\Xendit\XenditGateway;
use Illuminate\Database\QueryException;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

/**
 * The Withdrawal state machine and every Wallet money move it makes.
 *
 *   request()    -> pending (Wallet deducted)
 *   approve()    -> processing, then asks Xendit for the Payout
 *   reject()     -> rejected (refund)
 *   markFailed() -> failed/reversed (refund); used by approve and the payout webhook
 *
 * A refund happens at most once per Withdrawal (refunded_at).
 */
class WithdrawalService
{
    /** Same text on every attempt: Xendit rejects a retry whose payload differs. */
    public const PAYOUT_DESCRIPTION = 'Penarikan saldo Gain Properties';

    /** Refused because of our own setup: nothing was sent, so the user is not failed. */
    private const OUR_SETUP_ERRORS = ['GATEWAY_NOT_CONFIGURED', 'INVALID_API_KEY', 'REQUEST_FORBIDDEN_ERROR'];

    /**
     * "Same key, different payload": a Payout with this key may already exist.
     * Not a clear refusal of the money move, so never refund on it.
     */
    private const AMBIGUOUS_ERRORS = ['DUPLICATE_ERROR'];

    /** Xendit payout statuses that are final, mapped to our Withdrawal status. */
    private const FINAL_PAYOUT_STATUSES = [
        'SUCCEEDED' => Withdrawal::STATUS_SUCCEEDED,
        'FAILED' => Withdrawal::STATUS_FAILED,
        'CANCELLED' => Withdrawal::STATUS_FAILED,
        'COMPLIANCE_REJECTED' => Withdrawal::STATUS_FAILED,
        'REVERSED' => Withdrawal::STATUS_REVERSED,
    ];

    public function __construct(
        private readonly BankChannelCatalog $banks,
        private readonly XenditGateway $gateway,
    ) {}

    /**
     * Create a pending Withdrawal and deduct amount + Admin Fee from the Wallet
     * at once, so the same money cannot be withdrawn twice.
     *
     * $requestKey (optional, per form submit) makes a repeated submit return
     * the first Withdrawal instead of creating a second one.
     *
     * @throws WithdrawalRequestRejected
     */
    public function request(User $user, int $bankAccountId, int $amount, ?string $requestKey = null): Withdrawal
    {
        $settings = WithdrawalSetting::current();

        if ($requestKey !== null && ($existing = $this->findByRequestKey($user, $requestKey))) {
            return $existing;
        }

        $this->assertWithinSettings($settings, $amount);

        try {
            return DB::transaction(function () use ($user, $bankAccountId, $amount, $requestKey, $settings) {
                // Lock order: bank account, then wallet (same order everywhere avoids deadlocks).
                $account = UserBankAccount::query()
                    ->where('user_id', $user->id)
                    ->whereKey($bankAccountId)
                    ->lockForUpdate()
                    ->first();

                if (! $account) {
                    throw new WithdrawalRequestRejected('user_bank_account_id', 'Rekening tidak ditemukan.');
                }

                $this->assertWithinBankLimits($account->bank_code, $amount);

                $wallet = Wallet::query()->where('user_id', $user->id)->lockForUpdate()->first();
                $total = $settings->totalDeduction($amount);

                if (! $wallet || $wallet->status !== 'ACTIVE') {
                    throw new WithdrawalRequestRejected('amount', 'Wallet kamu tidak aktif. Hubungi admin.');
                }

                // Exact integer math in cents; balance is decimal(18,2), never compare floats.
                $balanceCents = $this->toCents($wallet->balance);

                if ($balanceCents < $total * 100) {
                    throw new WithdrawalRequestRejected('amount', 'Saldo wallet tidak mencukupi untuk penarikan dan biaya admin.');
                }

                $balanceAfter = $this->fromCents($balanceCents - $total * 100);
                $wallet->forceFill(['balance' => $balanceAfter])->save();

                $withdrawal = Withdrawal::create([
                    'user_id' => $user->id,
                    'user_bank_account_id' => $account->id,
                    // Also the Xendit idempotency key: stable, unique, < 100 chars.
                    'external_id' => 'WD-'.Str::ulid(),
                    'request_key' => $requestKey,
                    'amount' => $amount,
                    'fee' => $settings->admin_fee,
                    'status' => Withdrawal::STATUS_PENDING,
                ]);

                WalletTransaction::create([
                    'user_id' => $user->id,
                    'type' => WalletTransaction::TYPE_WITHDRAW,
                    'amount' => $total,
                    'balance_after' => $balanceAfter,
                    'reference_type' => Withdrawal::class,
                    'reference_id' => $withdrawal->id,
                ]);

                return $withdrawal;
            });
        } catch (QueryException $e) {
            // Two submits with the same key raced past the first lookup: the unique
            // index stopped the second one, and its transaction rolled back.
            if ($requestKey !== null && ($existing = $this->findByRequestKey($user, $requestKey))) {
                return $existing;
            }

            throw $e;
        }
    }

    /**
     * Admin approves a pending Withdrawal: it moves to processing BEFORE Xendit
     * is called, so a double click or a second admin can never send it twice.
     *
     * @throws WithdrawalActionRejected when it is not pending any more
     */
    public function approve(Withdrawal $withdrawal, User $admin): PayoutAttempt
    {
        $withdrawal = DB::transaction(function () use ($withdrawal, $admin) {
            $locked = Withdrawal::query()->whereKey($withdrawal->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== Withdrawal::STATUS_PENDING) {
                throw new WithdrawalActionRejected('Penarikan ini sudah diproses admin lain atau sebelumnya.');
            }

            $locked->forceFill([
                'status' => Withdrawal::STATUS_PROCESSING,
                'approved_by' => $admin->id,
                'approved_at' => now(),
            ])->save();

            return $locked;
        });

        $attempt = $this->sendPayout($withdrawal);

        // Refused by Xendit at once: the user gets the refund email, never "on its way".
        if ($attempt->outcome === PayoutAttempt::FAILED) {
            $this->notify($attempt->withdrawal, new WithdrawalFailed($attempt->withdrawal));
        } elseif ($attempt->outcome !== PayoutAttempt::NOT_SENT) {
            $this->notify($withdrawal, new WithdrawalApproved($withdrawal));
        }

        return $attempt;
    }

    /**
     * Send again a processing Withdrawal whose first attempt had an unknown
     * result. Same idempotency key and payload, so Xendit returns the original
     * Payout instead of paying twice.
     *
     * @throws WithdrawalActionRejected
     */
    public function resendPayout(Withdrawal $withdrawal): PayoutAttempt
    {
        $withdrawal = DB::transaction(function () use ($withdrawal) {
            $locked = Withdrawal::query()->whereKey($withdrawal->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== Withdrawal::STATUS_PROCESSING || $locked->xendit_id !== null) {
                throw new WithdrawalActionRejected('Hanya penarikan yang sedang diproses tanpa ID payout yang bisa dikirim ulang.');
            }

            return $locked;
        });

        return $this->sendPayout($withdrawal);
    }

    /**
     * Admin rejects a pending Withdrawal: amount + fee go back to the Wallet.
     *
     * @throws WithdrawalActionRejected
     */
    public function reject(Withdrawal $withdrawal, User $admin, string $reason): Withdrawal
    {
        $reason = trim(preg_replace('/\s+/', ' ', $reason));

        if ($reason === '') {
            throw new WithdrawalActionRejected('Alasan penolakan wajib diisi.');
        }

        $withdrawal = DB::transaction(function () use ($withdrawal, $admin, $reason) {
            $locked = Withdrawal::query()->whereKey($withdrawal->id)->lockForUpdate()->firstOrFail();

            if ($locked->status !== Withdrawal::STATUS_PENDING) {
                throw new WithdrawalActionRejected('Hanya penarikan yang menunggu approve yang bisa ditolak.');
            }

            $locked->forceFill([
                'status' => Withdrawal::STATUS_REJECTED,
                'failure_reason' => $reason,
                'approved_by' => $admin->id,
                'processed_at' => now(),
            ])->save();

            $this->refund($locked);

            return $locked;
        });

        $this->notify($withdrawal, new WithdrawalRejected($withdrawal));

        return $withdrawal;
    }

    /**
     * A processing (or, for reversed, succeeded) Withdrawal failed at Xendit:
     * mark it and refund amount + fee once. Safe to call again for the same
     * Withdrawal (webhook replay): the refund is not repeated.
     */
    public function markFailed(Withdrawal $withdrawal, string $status, ?string $failureCode, ?string $reason = null, ?string $payoutStatus = null): Withdrawal
    {
        if (! in_array($status, [Withdrawal::STATUS_FAILED, Withdrawal::STATUS_REVERSED], true)) {
            throw new \InvalidArgumentException("Not a failure status: {$status}");
        }

        return DB::transaction(function () use ($withdrawal, $status, $failureCode, $reason, $payoutStatus) {
            $locked = Withdrawal::query()->whereKey($withdrawal->id)->lockForUpdate()->firstOrFail();

            $allowedFrom = $status === Withdrawal::STATUS_REVERSED
                ? [Withdrawal::STATUS_PROCESSING, Withdrawal::STATUS_SUCCEEDED]
                : [Withdrawal::STATUS_PROCESSING];

            if (in_array($locked->status, $allowedFrom, true)) {
                $locked->forceFill([
                    'status' => $status,
                    'failure_code' => $failureCode,
                    'failure_reason' => $reason ?? PayoutFailure::message($failureCode),
                    'payout_status' => $payoutStatus ?? $locked->payout_status,
                    'processed_at' => now(),
                ])->save();
            }

            if (in_array($locked->status, [Withdrawal::STATUS_FAILED, Withdrawal::STATUS_REVERSED], true)) {
                $this->refund($locked);
            }

            return $locked;
        });
    }

    /**
     * Apply a Payout result from Xendit (webhook or a manual status check).
     * Idempotent and safe for out-of-order events:
     *   processing -> succeeded | failed (refund) | reversed (refund)
     *   succeeded  -> reversed (refund)            (a late "failed" is ignored)
     *   final      -> unchanged                    (replays, stale events)
     * Non-final statuses (ACCEPTED, REQUESTED, ...) only update payout_status.
     *
     * @param  array  $payout  Xendit payout object: id, status, failure_code, reference_id
     * @return string PayoutResult::APPLIED when the Withdrawal changed state, else IGNORED
     */
    public function applyPayoutResult(Withdrawal $withdrawal, array $payout): string
    {
        $payoutStatus = strtoupper((string) ($payout['status'] ?? ''));
        $payoutId = is_string($payout['id'] ?? null) ? $payout['id'] : null;
        $failureCode = is_string($payout['failure_code'] ?? null) ? $payout['failure_code'] : null;
        $target = self::FINAL_PAYOUT_STATUSES[$payoutStatus] ?? null;

        [$changed, $fresh] = DB::transaction(function () use ($withdrawal, $payoutStatus, $payoutId, $failureCode, $target) {
            $locked = Withdrawal::query()->whereKey($withdrawal->id)->lockForUpdate()->firstOrFail();

            if ($locked->xendit_id !== null && $payoutId !== null && $locked->xendit_id !== $payoutId) {
                Log::warning('Payout result for a different payout id ignored', [
                    'withdrawal_id' => $locked->id, 'stored' => $locked->xendit_id, 'received' => $payoutId,
                ]);

                return [false, $locked];
            }

            $locked->xendit_id ??= $payoutId;

            $allowed = match ($target) {
                Withdrawal::STATUS_SUCCEEDED, Withdrawal::STATUS_FAILED => $locked->status === Withdrawal::STATUS_PROCESSING,
                Withdrawal::STATUS_REVERSED => in_array($locked->status, [Withdrawal::STATUS_PROCESSING, Withdrawal::STATUS_SUCCEEDED], true),
                default => false,
            };

            if (! $allowed) {
                // Keep the latest non-final Xendit status for admins; never touch final ones.
                if ($target === null && $locked->status === Withdrawal::STATUS_PROCESSING && $payoutStatus !== '') {
                    $locked->payout_status = $payoutStatus;
                }
                $locked->save();

                return [false, $locked];
            }

            if ($target === Withdrawal::STATUS_SUCCEEDED) {
                $locked->forceFill([
                    'status' => Withdrawal::STATUS_SUCCEEDED,
                    'payout_status' => $payoutStatus,
                    'failure_code' => null,
                    'processed_at' => now(),
                ])->save();

                return [true, $locked];
            }

            $locked->save();

            return [true, $this->markFailed($locked, $target, $failureCode, null, $payoutStatus)];
        });

        if ($changed) {
            $this->notify($fresh, $fresh->status === Withdrawal::STATUS_SUCCEEDED
                ? new WithdrawalSucceeded($fresh)
                : new WithdrawalFailed($fresh));
        }

        return $changed ? PayoutResult::APPLIED : PayoutResult::IGNORED;
    }

    /**
     * D2: ask Xendit for the current Payout status and apply it like a webhook.
     * Uses the stored payout id, or finds the Payout by reference id when the
     * first send had an unknown result.
     *
     * @throws WithdrawalActionRejected when there is nothing to check
     * @throws \App\Services\Xendit\Exceptions\XenditException when Xendit cannot be read
     */
    public function checkPayoutStatus(Withdrawal $withdrawal): string
    {
        if (! in_array($withdrawal->status, [Withdrawal::STATUS_PROCESSING, Withdrawal::STATUS_SUCCEEDED], true)) {
            throw new WithdrawalActionRejected('Status hanya bisa dicek untuk penarikan yang diproses atau berhasil.');
        }

        if ($withdrawal->xendit_id !== null) {
            return $this->applyPayoutResult($withdrawal, $this->gateway->getPayout($withdrawal->xendit_id));
        }

        $payouts = $this->gateway->findPayoutsByReference($withdrawal->external_id);

        if ($payouts === []) {
            return PayoutResult::NOT_FOUND;
        }

        return $this->applyPayoutResult($withdrawal, $payouts[0]);
    }

    private function sendPayout(Withdrawal $withdrawal): PayoutAttempt
    {
        $account = $withdrawal->bankAccount;

        if (! $account) {
            $this->revertToPending($withdrawal);

            return new PayoutAttempt(PayoutAttempt::NOT_SENT, $withdrawal->fresh(), null, 'Data rekening tujuan tidak ditemukan.');
        }

        try {
            $payout = $this->gateway->createPayout(
                idempotencyKey: $withdrawal->external_id,
                referenceId: $withdrawal->external_id,
                channelCode: $account->bank_code,
                accountNumber: $account->account_number,
                holderName: $account->account_holder_name,
                amount: $withdrawal->amount,
                description: self::PAYOUT_DESCRIPTION,
            );
        } catch (XenditRejectedException $e) {
            if ($e->is(...self::OUR_SETUP_ERRORS)) {
                $this->revertToPending($withdrawal);
                Log::error('Payout not sent: Xendit setup problem', ['withdrawal_id' => $withdrawal->id, 'error_code' => $e->errorCode]);

                return new PayoutAttempt(PayoutAttempt::NOT_SENT, $withdrawal->fresh(), $e->errorCode,
                    'Payout tidak terkirim karena pengaturan Xendit ('.$e->errorCode.'). Penarikan kembali ke antrean.');
            }

            if ($e->is(...self::AMBIGUOUS_ERRORS)) {
                $this->recordPayoutError($withdrawal, $e->errorCode);

                return new PayoutAttempt(PayoutAttempt::UNKNOWN, $withdrawal->fresh(), $e->errorCode,
                    'Xendit melaporkan '.$e->errorCode.'. Status akan dicek ulang; saldo tidak dikembalikan dulu.');
            }

            $failed = $this->markFailed($withdrawal, Withdrawal::STATUS_FAILED, $e->errorCode, $e->errorMessage);

            return new PayoutAttempt(PayoutAttempt::FAILED, $failed, $e->errorCode,
                'Xendit menolak payout ('.$e->errorCode.'). Saldo dan biaya dikembalikan ke user.');
        } catch (XenditUnknownOutcomeException $e) {
            Log::warning('Payout outcome unknown, withdrawal stays processing', ['withdrawal_id' => $withdrawal->id, 'http_status' => $e->httpStatus]);

            return new PayoutAttempt(PayoutAttempt::UNKNOWN, $withdrawal->fresh(), null,
                'Hasil dari Xendit belum pasti (timeout/gangguan). Penarikan tetap diproses dan tidak di-refund; bisa dikirim ulang dengan aman.');
        } catch (\InvalidArgumentException $e) {
            // Our own data is invalid (e.g. a bad account number); nothing was sent.
            $this->revertToPending($withdrawal);

            return new PayoutAttempt(PayoutAttempt::NOT_SENT, $withdrawal->fresh(), null, 'Data payout tidak valid: '.$e->getMessage());
        }

        $withdrawal->forceFill([
            'xendit_id' => $payout['id'],
            'payout_status' => $payout['status'],
            'failure_code' => null,
        ])->save();

        return new PayoutAttempt(PayoutAttempt::SENT, $withdrawal, null, 'Payout dikirim ke Xendit.');
    }

    private function revertToPending(Withdrawal $withdrawal): void
    {
        Withdrawal::query()
            ->whereKey($withdrawal->id)
            ->where('status', Withdrawal::STATUS_PROCESSING)
            ->whereNull('xendit_id')
            ->update(['status' => Withdrawal::STATUS_PENDING, 'approved_by' => null, 'approved_at' => null]);
    }

    private function recordPayoutError(Withdrawal $withdrawal, string $errorCode): void
    {
        Withdrawal::query()->whereKey($withdrawal->id)->update(['failure_code' => $errorCode]);
    }

    /** Must run inside the caller's transaction, with the Withdrawal row locked. */
    private function refund(Withdrawal $withdrawal): void
    {
        if ($withdrawal->refunded_at !== null) {
            return;
        }

        $wallet = Wallet::query()->where('user_id', $withdrawal->user_id)->lockForUpdate()->first()
            ?? Wallet::create(['user_id' => $withdrawal->user_id, 'balance' => 0]);

        $total = $withdrawal->totalDeduction();
        $balanceAfter = $this->fromCents($this->toCents($wallet->balance) + $total * 100);
        $wallet->forceFill(['balance' => $balanceAfter])->save();

        WalletTransaction::create([
            'user_id' => $withdrawal->user_id,
            'type' => WalletTransaction::TYPE_WITHDRAW_REFUND,
            'amount' => $total,
            'balance_after' => $balanceAfter,
            'reference_type' => Withdrawal::class,
            'reference_id' => $withdrawal->id,
        ]);

        $withdrawal->forceFill(['refunded_at' => now()])->save();
    }

    /** Emails must never undo a money move that already committed. */
    private function notify(Withdrawal $withdrawal, Notification $notification): void
    {
        DB::afterCommit(function () use ($withdrawal, $notification) {
            try {
                $withdrawal->user?->notify($notification);
            } catch (Throwable $e) {
                Log::error('Withdrawal email failed', ['withdrawal_id' => $withdrawal->id, 'notification' => $notification::class, 'error' => $e->getMessage()]);
            }
        });
    }

    private function findByRequestKey(User $user, string $requestKey): ?Withdrawal
    {
        return Withdrawal::query()->where('user_id', $user->id)->where('request_key', $requestKey)->first();
    }

    private function assertWithinSettings(WithdrawalSetting $settings, int $amount): void
    {
        if ($amount < $settings->min_amount) {
            throw new WithdrawalRequestRejected('amount', 'Nominal minimal '.$this->rupiah($settings->min_amount).'.');
        }

        if ($settings->max_amount !== null && $amount > $settings->max_amount) {
            throw new WithdrawalRequestRejected('amount', 'Nominal maksimal '.$this->rupiah($settings->max_amount).'.');
        }
    }

    private function assertWithinBankLimits(string $bankCode, int $amount): void
    {
        if (! $this->banks->has($bankCode)) {
            throw new WithdrawalRequestRejected('user_bank_account_id', 'Bank rekening ini sedang tidak didukung. Pilih rekening lain.');
        }

        $limits = $this->banks->limitsFor($bankCode);
        $bank = $this->banks->nameFor($bankCode);

        if ($amount < $limits['min']) {
            throw new WithdrawalRequestRejected('amount', "Nominal minimal untuk {$bank} adalah {$this->rupiah($limits['min'])}.");
        }

        if ($limits['max'] !== null && $amount > $limits['max']) {
            throw new WithdrawalRequestRejected('amount', "Nominal maksimal untuk {$bank} adalah {$this->rupiah($limits['max'])}.");
        }

        if ($amount % $limits['increment'] !== 0) {
            throw new WithdrawalRequestRejected('amount', "Nominal untuk {$bank} harus kelipatan {$this->rupiah($limits['increment'])}.");
        }
    }

    /** "150000.5" / "150000.50" / 150000 -> 15000050 cents, without float rounding. */
    private function toCents(mixed $decimal): int
    {
        $value = trim((string) $decimal);

        if (preg_match('/^(-?)(\d+)(?:\.(\d{0,2})\d*)?$/', $value, $m) !== 1) {
            throw new \UnexpectedValueException("Invalid wallet balance: {$value}");
        }

        $cents = (int) $m[2] * 100 + (int) str_pad($m[3] ?? '', 2, '0');

        return $m[1] === '-' ? -$cents : $cents;
    }

    private function fromCents(int $cents): string
    {
        $sign = $cents < 0 ? '-' : '';
        $cents = abs($cents);

        return $sign.intdiv($cents, 100).'.'.str_pad((string) ($cents % 100), 2, '0', STR_PAD_LEFT);
    }

    private function rupiah(int $value): string
    {
        return 'Rp '.number_format($value, 0, ',', '.');
    }
}
