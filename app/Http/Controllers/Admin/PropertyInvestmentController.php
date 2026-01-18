<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use App\Models\PropertyInvestment;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyInvestmentController extends AdminController
{
    protected string $viewPath = 'property_investment';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyInvestment::with('property')->select('id', 'property_id', 'total_lot', 'status');

        return $this->dataTable($query, 'pages.property_investment.action');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->view('index', [
            'title' => 'Investment Property',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Investment Property',
            'action' => route('admin.investment-properties.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $investment = PropertyInvestment::create($request->only([
                'property_id',
                'property_value',
                'price_perlot',
                'total_lot',
                'min_lot_size',
                'max_lot_size',
                'estimated_roi',
                'roi_period',
                'status',
            ]));
        });

        return redirect()->route('admin.investment-properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyInvestment::with('property')->where('id', $id)->first();

        return $this->view('show', [
            'title' => 'Investment Property',
            'data' => $data,
            'img' => PropertyImage::where('property_id', $data->property_id)->get(),
            'doc' => PropertyDocument::where('property_id', $data->property_id)->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return $this->view('form', [
            'title' => 'Edit Investment Property',
            'data' => PropertyInvestment::with('property')->find($id),
            'action' => route('admin.investment-properties.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $property = PropertyInvestment::findOrFail($id);

            $property->update($request->only([
                'property_id',
                'property_value',
                'price_perlot',
                'total_lot',
                'min_lot_size',
                'max_lot_size',
                'estimated_roi',
                'roi_period',
                'status',
            ]));
        });

        return redirect()->route('admin.investment-properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $property = PropertyInvestment::findOrFail($id);
        $property->delete();

        return redirect()->route('admin.investment-properties');
    }
}
