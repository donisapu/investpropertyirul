<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyFinancial;
use App\Models\PropertyInvestment;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyFinancialsController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'property_financial';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyFinancial::with('property')->select('id', 'property_id', 'total_lot', 'status');

        return $this->dataTable($query, 'pages.property_investment.action');
    }

    public function index()
    {
        return $this->view('index', [
            'title' => 'Property Financials',
            'data'  => PropertyInvestment::with('property')->get()
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

            PropertyFinancial::create([
                'property_investment_id' => $request->property_investment_id,
                'year' => $request->year,
                'month' => $request->month,
                'income' => $income,
                'expense' => $expense,
                'net_profit' => $income - $expense,
                'status' => $request->status ?? null,
            ]);
        });

        return redirect()->route('admin.financials.show', $id);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyInvestment::with('property')->where('id', $id)->first();
        return $this->view('show', [
            'title' => $data->property->property_name . " Financials",
            'data'  => PropertyFinancial::where('property_investment_id', $id)->get(),
            'id'    => $id
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PropertyFinancial $propertyFinancial)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id, $back)
    {
        $data = PropertyFinancial::find($id);
        $data->month = $request->month;
        $data->year = $request->year;
        $data->income = $request->income;
        $data->expense = $request->expense;
        $data->status = $request->status;
        $data->net_profit = $request->income - $request->expense;
        $data->save();
        return redirect()->route('admin.financials.show', $back);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id, $back)
    {
        PropertyFinancial::where('id', $id)->delete();
        return redirect()->route('admin.financials.show', $back);
    }
}
