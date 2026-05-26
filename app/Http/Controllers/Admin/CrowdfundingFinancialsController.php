<?php

namespace App\Http\Controllers\Admin;

use App\Models\CrowdfundingFinancial;
use App\Models\PropertyCrowdfunding;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrowdfundingFinancialsController extends AdminController
{

    protected string $viewPath = 'crowdfunding_financial';

    use AdminDataTable;
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return $this->view('index', [
            'title' => 'Crowdfunding Financials',
            'data'  => PropertyCrowdfunding::with('property')->get()
        ]);
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
    public function store(Request $request, $id)
    {
        DB::transaction(function () use ($request) {

            $income = $request->income ?? 0;
            $expense = $request->expense ?? 0;

            CrowdfundingFinancial::create([
                'crowdfunding_id' => $request->crowdfunding_id,
                'year' => $request->year,
                'month' => $request->month,
                'income' => $income,
                'expense' => $expense,
                'net_profit' => $income - $expense,
                'status' => $request->status ?? null,
            ]);
        });

        return redirect()->route('admin.cw_financials.show', $id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyCrowdfunding::with('property')->where('id', $id)->first();
        return $this->view('show', [
            'title' => $data->property->property_name . " Financials",
            'data'  => CrowdfundingFinancial::where('crowdfunding_id', $id)->get(),
            'id'    => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CrowdfundingFinancial $crowdfundingFinancial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id, $back)
    {
        $data = CrowdfundingFinancial::find($id);
        $data->income = $request->income;
        $data->expense = $request->expense;
        $data->status = $request->status;
        $data->net_profit = $request->income - $request->expense;
        $data->save();
        return redirect()->route('admin.cw_financials.show', $back);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id, $back)
    {
        CrowdfundingFinancial::where('id', $id)->delete();
        return redirect()->route('admin.cw_financials.show', $back);
    }


}
