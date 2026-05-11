<?php

namespace App\Http\Controllers\Admin;

use App\Models\InvestmentPortfolio;
use App\Traits\AdminDataTable;
use App\Models\InvestmentTransaction;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

class SellRequestController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'sell_request';

    use AdminDataTable;

    public function data()
    {
        $query = InvestmentTransaction::with('ip.property', 'user')->where('type', 'SELL')->where('status', 'PENDING')->select([
            'id',
            'user_id',
            'investment_id',
            'lot',
            'status'
        ]);;

        return $this->dataTable($query, 'pages.sell_request.action');
    }

    public function index()
    {
        return $this->view('index', [
            'title' => 'Sell Request',
            'data'  => InvestmentTransaction::with('ip', 'user')->where('type', 'SELL')->where('status', 'PENDING')->get()
        ]);
    }

    public function accept($id)
    {
        $transaction = InvestmentTransaction::find($id);
        $transaction->status = "APPROVED";
        $transaction->save();

        $wallet = Wallet::where('user_id', $transaction->user_id)->first();
        $wallet->balance = $wallet->balance + $transaction->amount;
        $wallet->save();

        $walletTr = WalletTransaction::create([
            'user_id' => $transaction->user_id,
            'type'    => 'INVEST_SELL',
            'amount'  => $transaction->amount,
            'balance_after' => $wallet->balance,
            'reference_type' => InvestmentTransaction::class,
            'reference_id' => $transaction->id,
        ]);
        $walletTr->save();

        $portfolio = InvestmentPortfolio::where('user_id', $transaction->user_id)->where('investment_id', $transaction->investment_id)->first();
        $portfolio->total_lot = $portfolio->total_lot - $transaction->lot;
        $portfolio->total_invested = $portfolio->total_invested - $transaction->amount;
        $portfolio->save();
        return redirect()->route('admin.sell-request');
    }

    public function decline($id)
    {
        $transaction = InvestmentTransaction::find($id);
        $transaction->status = "REJECTED";
        $transaction->save();
        return redirect()->route('admin.sell-request');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(InvestmentTransaction $investmentTransaction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InvestmentTransaction $investmentTransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InvestmentTransaction $investmentTransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InvestmentTransaction $investmentTransaction)
    {
        //
    }
}
