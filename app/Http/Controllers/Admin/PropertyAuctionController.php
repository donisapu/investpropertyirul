<?php

namespace App\Http\Controllers\Admin;

use App\Models\PropertyAuction;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PropertyAuctionController extends AdminController
{
    protected string $viewPath = 'property_auction';

    use AdminDataTable;

    public function data()
    {
        $query = PropertyAuction::with('property')->select('id', 'property_id', 'open_bid', 'date_start', 'date_finish', 'status');

        return $this->dataTable($query, 'pages.property_auction.action');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->view('index', [
            'title' => 'Auction Property',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Auction Property',
            'action' => route('admin.auction-properties.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $auction = PropertyAuction::create($request->only([
                'property_id',
                'open_bid',
                'bid_increment',
                'date_start',
                'date_finish',
                'status',
            ]));
        });

        return redirect()->route('admin.auction-properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $data = PropertyAuction::with('property')->where('id', $id)->first();

        return $this->view('show', [
            'title' => 'Auction Property',
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
            'title' => 'Edit Auction Property',
            'data' => PropertyAuction::with('property')->find($id),
            'action' => route('admin.auction-properties.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        DB::transaction(function () use ($request, $id) {
            $property = PropertyAuction::findOrFail($id);

            $property->update($request->only([
                'property_id',
                'open_bid',
                'bid_increment',
                'date_start',
                'date_finish',
                'status',
            ]));
        });

        return redirect()->route('admin.auction-properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $property = PropertyAuction::findOrFail($id);
        $property->delete();

        return redirect()->route('admin.auction-properties');
    }
}
