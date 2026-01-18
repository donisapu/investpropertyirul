<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyCrowdfunding;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyCrowdfundingController extends AdminController
{
    protected string $viewPath = 'property_crowdfunding';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyCrowdfunding::with('property')->select('id', 'property_id', 'funding_goal', 'status');

        return $this->dataTable($query, 'pages.property_crowdfunding.action');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->view('index', [
            'title' => 'Crowdfunding Property',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Crowdfunding Property',
            'action' => route('admin.crowdfunding-properties.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $crowdfunding = PropertyCrowdfunding::create($request->only([
                'property_id',
                'funding_goal',
                'min_contribution',
                'estimated_roi',
                'tenor',
                'status',
            ]));
        });

        return redirect()->route('admin.crowdfunding-properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyCrowdfunding::with('property')->where('id', $id)->first();

        return $this->view('show', [
            'title' => 'crowdfunding Property',
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
            'title' => 'Edit crowdfunding Property',
            'data' => PropertyCrowdfunding::with('property')->find($id),
            'action' => route('admin.crowdfunding-properties.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $property = PropertyCrowdfunding::findOrFail($id);

            $property->update($request->only([
                'property_id',
                'funding_goal',
                'min_contribution',
                'estimated_roi',
                'tenor',
                'status',
            ]));
        });

        return redirect()->route('admin.crowdfunding-properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $property = PropertyCrowdfunding::findOrFail($id);
        $property->delete();

        return redirect()->route('admin.crowdfunding-properties');
    }
}
