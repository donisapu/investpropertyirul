<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use App\Models\PropertyInvestment;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PropertyInvestmentController extends AdminController
{
    protected string $viewPath = 'property_investment';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyInvestment::with('property')
            ->select([
                'id',
                'property_id',
                'total_lot',
                'sold_lot',
                'status',
            ]);

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
        $validated = $request->validate([
            'property_id'       => 'required|exists:properties,id',
            'asset_price'       => 'required|numeric',
            'property_upgrades' => 'required|numeric',
            'notary_fee'        => 'required|numeric',
            'platform_fee'      => 'required|numeric',
            'rental_yield'      => 'required|numeric',
            'appreciation_rate' => 'required|numeric',
            'price_per_lot'     => 'required|numeric',
            'total_lot'         => 'required|integer',
            'min_lot_size'      => 'required|integer',
            'max_lot_size'      => 'required|integer',
            'roi_period_months' => 'required|integer',
            'status'            => 'required|string',
        ]);

        $total_investment = $request->asset_price + $request->property_upgrades + $request->notary_fee + $request->platform_fee;
        $projected_roi    = $request->rental_yield + $request->appreciation_rate;

        DB::transaction(function () use ($validated, $total_investment, $projected_roi) {
            PropertyInvestment::create(array_merge($validated, [
                'total_investment_value' => $total_investment,
                'projected_roi'          => $projected_roi,
                'sold_lot'               => 0,
            ]));
        });

        return redirect()->route('admin.investment-properties')
            ->with('success', 'Data investasi berhasil disimpan!');
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
        $investment = PropertyInvestment::findOrFail($id);

        Log::info('UPDATE HIT', [
            'investment_id' => $investment->id,
            'exists' => $investment->exists,
            'input' => $request->all(),
        ]);

        $validated = $request->validate([
            'property_id'       => 'required|exists:properties,id',
            'asset_price'       => 'required|numeric',
            'property_upgrades' => 'required|numeric',
            'notary_fee'        => 'required|numeric',
            'platform_fee'      => 'required|numeric',
            'rental_yield'      => 'required|numeric',
            'appreciation_rate' => 'required|numeric',
            'price_per_lot'     => 'required|numeric',
            'total_lot'         => 'required|integer',
            'min_lot_size'      => 'required|integer',
            'max_lot_size'      => 'required|integer',
            'roi_period_months' => 'required|integer',
            'status'            => 'required|string',
        ]);

        Log::info('VALIDATED', $validated);

        $total_investment = $request->asset_price + $request->property_upgrades + $request->notary_fee + $request->platform_fee;
        $projected_roi    = $request->rental_yield + $request->appreciation_rate;

        DB::transaction(function () use ($investment, $validated, $total_investment, $projected_roi) {
            $investment->update(array_merge($validated, [
                'total_investment_value' => $total_investment,
                'projected_roi'          => $projected_roi,
            ]));
        });

        Log::info('AFTER UPDATE', $investment->fresh()->toArray());

        return redirect()->route('admin.investment-properties')
            ->with('success', 'Data investasi berhasil diperbarui!');
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

    public function transaction()
    {
        return $this->view('transaction', [
            'title' => 'Investment Property',
        ]);
    }
}
