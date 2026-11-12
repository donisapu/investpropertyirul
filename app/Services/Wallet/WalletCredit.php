<?php

namespace App\Services\Wallet;

use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Money that enters a user's Wallet (refunds, returned deposits). Locks the Wallet row,
 * so call it inside the caller's transaction when the credit must be atomic with it.
 */
class WalletCredit
{
    /** @return string the balance after the credit (decimal string) */
    public function credit(int $userId, int $amount, string $type, Model $reference): string
    {
        return DB::transaction(function () use ($userId, $amount, $type, $reference) {
            $wallet = Wallet::query()->where('user_id', $userId)->lockForUpdate()->first()
                ?? Wallet::create(['user_id' => $userId, 'balance' => 0]);

            // Whole rupiah added to a decimal(18,2) balance: bcadd keeps the cents exact.
            $balanceAfter = bcadd((string) $wallet->balance, (string) $amount, 2);
            $wallet->forceFill(['balance' => $balanceAfter])->save();

            WalletTransaction::create([
                'user_id' => $userId,
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $balanceAfter,
                'reference_type' => $reference::class,
                'reference_id' => $reference->getKey(),
            ]);

            return $balanceAfter;
        });
    }
}
