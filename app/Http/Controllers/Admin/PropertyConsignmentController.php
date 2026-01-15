<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\PropertyImage;
use App\Traits\AdminDataTable;
use App\Models\PropertyDocument;
use Illuminate\Support\Facades\DB;
use App\Models\PropertyConsignment;

class PropertyConsignmentController extends AdminController
{
    protected string $viewPath = 'property_consignment';
    use AdminDataTable;

    public function data()
    {
        $query = PropertyConsignment::with('property')->select('id', 'property_id', 'listing_type', 'status');

        return $this->dataTable($query, 'pages.property_consignment.action');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->view('index', [
            'title' => 'Consignment Property'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Consignment Property',
            'action' => route('admin.consignment-properties.store'),
            'btn'   => 'add'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $consignment = PropertyConsignment::create($request->only([
                'property_id',
                'property_value',
                'ownership',
                'listing_type',
                'lease_term',
                'status',
            ]));
        });
        return redirect()->route('admin.consignment-properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyConsignment::with('property')->where('id', $id)->first();
        return $this->view('show', [
            'title' => 'consignment Property',
            'data'  => $data,
            'img'   => PropertyImage::where('property_id', $data->property_id)->get(),
            'doc'   => PropertyDocument::where('property_id', $data->property_id)->get()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return $this->view('form', [
            'title' => 'Edit consignment Property',
            'data'  => PropertyConsignment::with('property')->find($id),
            'action' => route('admin.consignment-properties.update', $id),
            'btn'   => 'edit'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $property = PropertyConsignment::findOrFail($id);

            $property->update($request->only([
                'property_id',
                'property_value',
                'ownership',
                'listing_type',
                'lease_term',
                'status',
            ]));
        });
        return redirect()->route('admin.consignment-properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $property = PropertyConsignment::findOrFail($id);
        $property->delete();

        return redirect()->route('admin.consignment-properties');
    }
}
