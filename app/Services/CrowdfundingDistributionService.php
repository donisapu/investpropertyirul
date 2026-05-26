<?php

namespace App\Services;

use App\Models\CrowdfundingFinancial;
use App\Models\CrowdfundingPortfolio;
use App\Models\CrowdfundingReturn;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Exception;

class CrowdfundingDistributionService
{

    public function distributeFlippingReturn(int $financialId)
    {
        DB::transaction(function () use ($financialId) {

            $financial = CrowdfundingFinancial::with('crowdfunding')->findOrFail($financialId);

            if ($financial->is_distributed || $financial->status !== 'FINAL') {
                throw new Exception("Data finansial belum FINAL atau sudah pernah didistribusikan.");
            }

            $crowdfunding = $financial->crowdfunding;
            $totalCollected = $crowdfunding->collected_amount;
            $netProfit = $financial->net_profit;

            if ($totalCollected <= 0) {
                throw new Exception("Total modal terkumpul tidak valid.");
            }

            $portfolios = CrowdfundingPortfolio::where('crowdfunding_id', $crowdfunding->id)->get();

            foreach ($portfolios as $portfolio) {
                $userId = $portfolio->user_id;
                $principal = $portfolio->total_amount;

                $ownershipPercentage = ($principal / $totalCollected) * 100;
                $profitReceived = ($netProfit * $ownershipPercentage) / 100;
                $totalPayout = $principal + $profitReceived;

                $wallet = Wallet::where('user_id', $userId)->lockForUpdate()->firstOrCreate(
                    ['user_id' => $userId],
                    ['balance' => 0, 'status' => 'ACTIVE']
                );

                if ($wallet->status !== 'ACTIVE') {
                    throw new Exception("Wallet untuk user ID {$userId} sedang tidak aktif.");
                }

                $oldBalance = $wallet->balance;
                $wallet->balance += $totalPayout;
                $wallet->save();

                $walletTx = WalletTransaction::create([
                    'user_id' => $userId,
                    'type' => 'PROFIT',
                    'amount' => $totalPayout,
                    'balance_after' => $wallet->balance,
                    'reference_type' => CrowdfundingFinancial::class,
                    'reference_id' => $financial->id,
                ]);

                CrowdfundingReturn::create([
                    'crowdfunding_financial_id' => $financial->id,
                    'user_id' => $userId,
                    'principal_returned' => $principal,
                    'profit_received' => $profitReceived,
                    'ownership_percentage' => $ownershipPercentage,
                    'distributed_at' => now(),
                ]);

                $portfolio->delete();
            }

            $financial->is_distributed = true;
            $financial->save();

            $crowdfunding->status = 'Funded';
            $crowdfunding->save();
        });
    }
}
