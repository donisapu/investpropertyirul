<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\StoreDeveloperRequest;
use App\Http\Requests\UpdateDeveloperRequest;
use App\Models\Developer;
use App\Traits\AdminDataTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeveloperController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'developers';

    use AdminDataTable;

    public function data()
    {
        $query = Developer::query()->select('*')->latest();

        return $this->dataTable($query, 'pages.developers.action');
    }

    public function index()
    {
        return $this->view('index', [
            'title' => 'Developers',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Developer',
            'action' => route('admin.developers.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDeveloperRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($request) {
            $data = $request->only([
                'name',
                'phone',
                'description',
                'youtube_url',
                'facebook_url',
                'instagram_url',
                'tiktok_url',
                'status',
            ]);

            // Create developer
            $developer = Developer::create($data);

            // Handle image upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store(
                    "developers/{$developer->id}",
                    'public'
                );

                $developer->update([
                    'image_path' => $path,
                ]);
            }
        });

        return redirect()->route('admin.developers')->with('success', 'Developer created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return $this->view('show', [
            'title' => 'Developer Details',
            'data' => Developer::find($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return $this->view('form', [
            'title' => 'Edit Developer',
            'data' => Developer::find($id),
            'action' => route('admin.developers.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDeveloperRequest $request, string $id)
    {
        DB::transaction(function () use ($request, $id) {
            $developer = Developer::findOrFail($id);

            // Update text fields
            $developer->update($request->only([
                'name',
                'phone',
                'description',
                'youtube_url',
                'facebook_url',
                'instagram_url',
                'tiktok_url',
                'status',
            ]));

            // Handle image replacement
            if ($request->hasFile('image')) {

                // Delete old image if exists
                if ($developer->image_path && Storage::disk('public')->exists($developer->image_path)) {
                    Storage::disk('public')->delete($developer->image_path);
                }

                // Store new image
                $path = $request->file('image')->store(
                    "developers/{$developer->id}",
                    'public'
                );

                // Save new path
                $developer->update([
                    'image_path' => $path,
                ]);
            }
        });

        return redirect()
            ->route('admin.developers')
            ->with('success', 'Developer updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::transaction(function () use ($id) {
            $developer = Developer::findOrFail($id);

            // Delete developer image directory if exists
            if ($developer->image_path) {
                Storage::disk('public')->deleteDirectory("developers/{$developer->id}");
            }

            // Delete developer record
            $developer->delete();
        });

        return redirect()->route('admin.developers')->with('success', 'Developer deleted successfully.');
    }
}
