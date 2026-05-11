<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $investments = DB::table('investment_transactions as it')
            ->select(
                'it.id',
                'it.amount',
                'it.type as trans_type',
                'it.transacted_at as date',
                'p.property_name as title',
                DB::raw("'Investment' as category")
            )
            ->join('property_investments as pi', 'it.investment_id', '=', 'pi.id')
            ->join('properties as p', 'pi.property_id', '=', 'p.id')
            ->where('it.status','APPROVED')
            ->where('it.user_id', $userId);
        $crowdfundings = DB::table('crowdfunding_transactions as ct')
            ->select(
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
        $transactions = $crowdfundings->union($investments)
            ->orderBy('date', 'desc')
            ->get();
        $totalIn = $transactions->where('trans_type', 'SELL')->where('status','APPROVED')->sum('amount');
        $totalOut = $transactions->where('trans_type', 'BUY')->sum('amount')
            + $transactions->where('category', 'Crowdfunding')->sum('amount');

        $netCashflow = $totalIn - $totalOut;

        return view('user.transaction', compact('transactions', 'totalIn', 'totalOut', 'netCashflow'));
    }
}
