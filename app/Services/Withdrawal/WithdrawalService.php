<?php

namespace App\Services\Withdrawal;

use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Models\WithdrawalSetting;
use App\Services\Xendit\BankChannelCatalog;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * The Withdrawal state machine and every Wallet money move it makes.
 * This ticket (XW-05) covers request(); approve/reject/payout results follow.
 */
class WithdrawalService
{
    public function __construct(private readonly BankChannelCatalog $banks) {}

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
