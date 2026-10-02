<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CrowdfundingFinancial;
use App\Models\PropertyFinancial;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $investments = DB::table('investment_transactions as it')
            ->select(
                DB::raw("'it-' || it.id as uid"),
                'it.id',
                'it.amount',
                'it.type as trans_type',
                'it.transacted_at as date',
                'p.property_name as title',
                DB::raw("'Investment' as category")
            )
            ->join('property_investments as pi', 'it.investment_id', '=', 'pi.id')
            ->join('properties as p', 'pi.property_id', '=', 'p.id')
            ->where('it.status', 'APPROVED')
            ->where('it.user_id', $userId);
        $crowdfundings = DB::table('crowdfunding_transactions as ct')
            ->select(
                DB::raw("'ct-' || ct.id as uid"),
                'ct.id',
                'ct.amount',
                DB::raw("'OUT' as trans_type"),
                'ct.transacted_at as date',
                'p.property_name as title',
                DB::raw("'Crowdfunding' as category")
            )
            ->join('property_crowdfundings as pc', 'ct.crowdfunding_id', '=', 'pc.id')
            ->join('properties as p', 'pc.property_id', '=', 'p.id')
            ->where('ct.user_id', $userId);
        // Profit paid into the wallet. A crowdfunding payout also returns the principal.
        $profits = DB::table('wallet_transactions as wt')
            ->select(
                DB::raw("'wt-' || wt.id as uid"),
                'wt.id',
                'wt.amount',
                DB::raw("'PROFIT' as trans_type"),
                'wt.created_at as date',
                DB::raw('coalesce(pp.property_name, cp.property_name) as title'),
                DB::raw("case when cf.id is not null then 'Profit Crowdfunding' else 'Profit Investment' end as category"),
            )
            ->leftJoin('property_financials as pf', function ($join) {
                $join->on('pf.id', '=', 'wt.reference_id')->where('wt.reference_type', PropertyFinancial::class);
            })
            ->leftJoin('property_investments as pi', 'pi.id', '=', 'pf.property_investment_id')
            ->leftJoin('properties as pp', 'pp.id', '=', 'pi.property_id')
            ->leftJoin('crowdfunding_financials as cf', function ($join) {
                $join->on('cf.id', '=', 'wt.reference_id')->where('wt.reference_type', CrowdfundingFinancial::class);
            })
            ->leftJoin('property_crowdfundings as pc', 'pc.id', '=', 'cf.crowdfunding_id')
            ->leftJoin('properties as cp', 'cp.id', '=', 'pc.property_id')
            ->where('wt.type', 'PROFIT')
            ->where('wt.user_id', $userId);
        $transactions = $crowdfundings->union($investments)->union($profits)
            ->orderBy('date', 'desc')
            ->get();
        $totalIn = $transactions
            ->whereIn('trans_type', ['SELL', 'PROFIT'])
            ->sum('amount');
        $totalOut = $transactions->where('trans_type', 'BUY')->sum('amount')
            + $transactions->where('category', 'Crowdfunding')->sum('amount');

        $netCashflow = $totalIn - $totalOut;

        return Inertia::render('User/Transaction', [
            'transactions' => $transactions,
            'totalIn' => $totalIn,
            'totalOut' => $totalOut,
            'netCashflow' => $netCashflow,
        ]);
    }
}
