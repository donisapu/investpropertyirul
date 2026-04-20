<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $totalInvestedProperti = DB::table('investment_transactions')
            ->where('user_id', $userId)
            ->where('type', 'BUY')
            ->sum('amount') -
            DB::table('investment_transactions')
            ->where('user_id', $userId)
            ->where('type', 'SELL')
            ->sum('amount');

        $totalInvestedCrowdfund = DB::table('crowdfunding_transactions')
            ->where('user_id', $userId)
            ->sum('amount');

        $totalInvested = $totalInvestedProperti + $totalInvestedCrowdfund;
        $availableBalance = Auth::user()->balance ?? 0;
        $totalReturn = 30000;
        $totalAssetValue = $totalInvested + $availableBalance;
        $activeInvestments = DB::table('investment_portfolios as ip')
            ->join('property_investments as pinv', 'ip.investment_id', '=', 'pinv.id')
            ->join('properties as p', 'pinv.property_id', '=', 'p.id')
            ->select(
                'p.property_name',
                'ip.total_lot',
                'ip.total_invested as amount',
                'pinv.total_lot as grand_total_lot'
            )
            ->where('ip.user_id', $userId)
            ->where('ip.total_lot', '>', 0)
            ->limit(2)
            ->get();
        $recentTransactions = DB::table('investment_transactions as it')
            ->select('amount', 'type', 'transacted_at as date', DB::raw("'Investment' as label"))
            ->where('user_id', $userId)
            ->union(
                DB::table('crowdfunding_transactions as ct')
                    ->select('amount', DB::raw("'OUT' as type"), 'transacted_at as date', DB::raw("'Crowdfunding' as label"))
                    ->where('user_id', $userId)
            )
            ->orderBy('date', 'desc')
            ->limit(3)
            ->get();
        $settings = WebsiteSetting::getSettings();
        return view('user.dashboard', compact(
            'totalAssetValue',
            'totalInvested',
            'totalReturn',
            'availableBalance',
            'activeInvestments',
            'recentTransactions'
        ));
    }
}
