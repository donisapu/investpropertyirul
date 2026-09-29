<?php

namespace App\Services\Wallet;

use App\Models\Wallet;
use App\Models\Withdrawal;

/**
 * Reserve = the part of the Xendit balance that belongs to users and must
 * stay there: every Wallet balance + every Withdrawal that is not final yet
 * (pending / processing, amount + fee). Max Company Cash-out = CASH - Reserve.
 *
 * Shared by the Xendit Dashboard (XW-09) and the Company Cash-out (XW-10).
 * Whole Rupiah; wallet cents are rounded up so the Reserve is never understated.
 */
class WalletReserve
{
    /** @return array{wallets: int, open_withdrawals: int, open_withdrawal_count: int, total: int} */
    public function breakdown(): array
    {
        $wallets = (int) ceil((float) Wallet::query()->where('balance', '>', 0)->sum('balance'));

        $open = Withdrawal::query()
            ->whereIn('status', Withdrawal::OPEN_STATUSES)
            ->selectRaw('count(*) as n, coalesce(sum(amount + fee), 0) as total')
            ->first();

        $openTotal = (int) ceil((float) $open->total);

        return [
            'wallets' => $wallets,
            'open_withdrawals' => $openTotal,
            'open_withdrawal_count' => (int) $open->n,
            'total' => $wallets + $openTotal,
        ];
    }

    public function total(): int
    {
        return $this->breakdown()['total'];
    }

    /** Never negative: a CASH balance below the Reserve means nothing can be cashed out. */
    public function maxCashout(int|float $cashBalance): int
    {
        return max(0, (int) floor($cashBalance) - $this->total());
    }
}
