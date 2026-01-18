<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\StoreCampaignRequest;
use App\Http\Requests\UpdateCampaignRequest;
use App\Models\Campaign;
use App\Models\Properties;
use App\Traits\AdminDataTable;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CampaignController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'campaigns';

    use AdminDataTable;

    public function data()
    {
        $query = Campaign::query()->select('*')->latest();

        return $this->dataTable($query, 'pages.campaigns.action');
    }

    public function index()
    {
        return $this->view('index', [
            'title' => 'Campaigns',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $properties = Properties::query()->select('*')->latest();

        return $this->view('form', [
            'title' => 'Add Campaign',
            'action' => route('admin.campaigns.store'),
            'btn' => 'add',
            'properties' => $properties->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCampaignRequest $request)
    {
        $data = $request->validated();
        DB::transaction(function () use ($request) {
            $data = $request->only([
                'property_id',
                'title',
                'description',
                'discount_percent',
                'start_date',
                'end_date',
                'status',
            ]);

            // Resolve final status
            if ($request['action'] === 'draft') {
                $data['status'] = 'draft';
            } else {
                // publish
                $data['status'] = $data['status']; // active | inactive
            }

            // Create campaign
            $campaign = Campaign::create($data);

            // Handle image upload
            if ($request->hasFile('banner')) {
                $path = $request->file('banner')->store(
                    "campaigns/{$campaign->id}",
                    'public'
                );

                $campaign->update([
                    'banner_path' => $path,
                ]);
            }
        });

        return redirect()->route('admin.campaigns')->with('success', 'Campaign created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $result = Campaign::with('property')->findOrFail($id);

        $response = [
            'id' => $result->id,
            'title' => $result->title,
            'description' => $result->description,
            'banner_path' => $result->banner_path,
            'property_name' => $result->property?->property_name,
            'discount_percent' => rtrim(rtrim($result->discount_percent, '0'), '.').'%',
            'start_date' => $result->start_date
                ? Carbon::parse($result->start_date)->format('d F Y')
                : null,
            'end_date' => $result->end_date
                ? Carbon::parse($result->end_date)->format('d F Y')
                : null,
            'status' => $result->status,
        ];

        return $this->view('show', [
            'title' => 'Campaign Details',
            'data' => $response,
        ], compact('result'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $properties = Properties::query()->select('*')->latest();

        return $this->view('form', [
            'title' => 'Edit Campaign',
            'properties' => $properties->get(),
            'data' => Campaign::find($id),
            'action' => route('admin.campaigns.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCampaignRequest $request, string $id)
    {
        DB::transaction(function () use ($request, $id) {
            $campaign = Campaign::findOrFail($id);

            // Update text fields
            $campaign->update($request->only([
                'property_id',
                'title',
                'description',
                'discount_percent',
                'start_date',
                'end_date',
                'status',
            ]));

            // Resolve final status
            if ($request['action'] === 'draft') {
                $campaign['status'] = 'draft';
            } else {
                // publish
                $campaign['status'] = $campaign['status']; // active | inactive
            }

            // Handle image replacement
            if ($request->hasFile('banner')) {

                // Delete old image if exists
                if ($campaign->banner_path && Storage::disk('public')->exists($campaign->banner_path)) {
                    Storage::disk('public')->delete($campaign->banner_path);
                }

                // Store new image
                $path = $request->file('banner')->store(
                    "campaigns/{$campaign->id}",
                    'public'
                );

                // Save new path
                $campaign->update([
                    'banner_path' => $path,
                ]);
            }
        });

        return redirect()
            ->route('admin.campaigns')
            ->with('success', 'Campaign updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::transaction(function () use ($id) {
            $campaign = Campaign::findOrFail($id);

            // Delete campaign image directory if exists
            if ($campaign->banner_path) {
                Storage::disk('public')->deleteDirectory("campaigns/{$campaign->id}");
            }

            // Delete campaign record
            $campaign->delete();
        });

        return redirect()->route('admin.campaigns')->with('success', 'Campaign deleted successfully.');
    }

    public function publish($id)
    {
        Campaign::where('id', $id)->update(['status' => 'active']);

        return back()->with('success', 'Campaign published successfully.');
    }

    public function activate($id)
    {
        Campaign::where('id', $id)->update(['status' => 'active']);

        return back()->with('success', 'Campaign activated.');
    }

    public function deactivate($id)
    {
        Campaign::where('id', $id)->update(['status' => 'inactive']);

        return back()->with('success', 'Campaign deactivated.');
    }
}
