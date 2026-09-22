<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\WebsiteSetting;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // =========================
        // PROPERTY INVESTMENT
        // =========================

        $totalBuy = DB::table('investment_transactions')
            ->where('user_id', $userId)
            ->where('type', 'BUY')
            ->where('status', 'APPROVED')
            ->sum('amount');

        $totalSell = DB::table('investment_transactions')
            ->where('user_id', $userId)
            ->where('type', 'SELL')
            ->where('status', 'APPROVED')
            ->sum('amount');

        $totalInvestedProperti = $totalBuy - $totalSell;


        // =========================
        // CROWDFUNDING
        // =========================

        $totalInvestedCrowdfund = DB::table('crowdfunding_transactions')
            ->where('user_id', $userId)
            ->sum('amount');


        // =========================
        // TOTAL INVESTED
        // =========================

        $totalInvested = $totalInvestedProperti + $totalInvestedCrowdfund;


        // =========================
        // WALLET
        // =========================

        $wallet = Wallet::where('user_id', $userId)->first();

        $availableBalance = $wallet?->balance ?? 0;


        // =========================
        // ASSET VALUE
        // =========================

        $totalReturn = 0;

        $totalAssetValue = $totalInvested + $availableBalance;


        // =========================
        // ACTIVE INVESTMENTS
        // =========================

        $activeInvestments = DB::table('investment_portfolios as ip')
            ->join(
                'property_investments as pinv',
                'ip.investment_id',
                '=',
                'pinv.id'
            )
            ->join(
                'properties as p',
                'pinv.property_id',
                '=',
                'p.id'
            )
            ->select(
                'p.property_name',
                'ip.total_lot',
                'ip.total_invested as amount',
                'pinv.total_lot as grand_total_lot'
            )
            ->where('ip.user_id', $userId)
            ->where('ip.total_lot', '>', 0)
            ->orderByDesc('ip.updated_at')
            ->limit(2)
            ->get();


        // =========================
        // RECENT TRANSACTIONS
        // =========================

        $investmentTransactions = DB::table('investment_transactions')
            ->select(
                'id',
                'amount',
                'type',
                'transacted_at as date',
                DB::raw("'Investment' as label")
            )
            ->where('user_id', $userId);

        $crowdfundingTransactions = DB::table('crowdfunding_transactions')
            ->select(
                'id',
                'amount',
                DB::raw("'OUT' as type"),
                'transacted_at as date',
                DB::raw("'Crowdfunding' as label")
            )
            ->where('user_id', $userId);

        $recentTransactions = $investmentTransactions
            ->unionAll($crowdfundingTransactions);

        $recentTransactions = DB::query()
            ->fromSub($recentTransactions, 'transactions')
            ->orderByDesc('date')
            ->limit(3)
            ->get();


        return Inertia::render('User/Dashboard', [
            'totalAssetValue' => $totalAssetValue,
            'totalInvested' => $totalInvested,
            'totalReturn' => $totalReturn,
            'availableBalance' => $availableBalance,
            'activeInvestments' => $activeInvestments,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
