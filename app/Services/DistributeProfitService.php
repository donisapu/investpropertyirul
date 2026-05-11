<?php

namespace App\Services;

use App\Models\PropertyFinancial;
use App\Models\InvestmentTransaction;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;

class DistributeProfitService
{
    public function handle(PropertyFinancial $financial)
    {
        $financial->load('investment');
        $investment = $financial->investment;

        if (!$investment) {
            $investment = \App\Models\PropertyInvestment::find($financial->property_investment_id);
        }

        if (!$investment) {
            throw new \Exception("Gagal dapet data investment buat Financial ID: {$financial->id}");
        }

        DB::transaction(function () use ($financial, $investment) {
            $netProfit = $financial->net_profit;
            $totalLot = $investment->total_lot;

            $investors = InvestmentTransaction::selectRaw("
        user_id,
        SUM(CASE WHEN type = 'BUY' THEN lot WHEN type = 'SELL' THEN -lot END) as total_lot_owned
    ")
                ->where('investment_id', $investment->id)
                ->where('status', 'APPROVED')
                ->groupBy('user_id')
                ->havingRaw("SUM(CASE WHEN type = 'BUY' THEN lot WHEN type = 'SELL' THEN -lot END) > 0")
                ->get();

            foreach ($investors as $inv) {
                $share = ($inv->total_lot_owned / $totalLot) * $netProfit;
                $share = floor($share * 100) / 100;

                if ($share <= 0) continue;

                $wallet = Wallet::firstOrCreate(
                    ['user_id' => $inv->user_id],
                    ['balance' => 0]
                );

                $wallet->increment('balance', $share);

                WalletTransaction::create([
                    'user_id' => $inv->user_id,
                    'type' => 'PROFIT',
                    'amount' => $share,
                    'balance_after' => $wallet->fresh()->balance,
                    'reference_type' => PropertyFinancial::class,
                    'reference_id' => $financial->id,
                ]);
            }

            $financial->update(['is_distributed' => true]);
        });
    }
}
