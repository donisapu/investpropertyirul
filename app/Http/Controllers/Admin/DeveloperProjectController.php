<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeveloperProject;
use App\Models\DeveloperProjectImage;
use Illuminate\Http\Request;
use App\Traits\AdminDataTable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeveloperProjectController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'developers';

    use AdminDataTable;

    public function data()
    {
        $query = DeveloperProject::query();

        return $this->dataTable($query, 'pages.developers.project_action');
    }


    public function index()
    {
        return $this->view('project', [
            'title' => 'Developer Projects',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('project_form', [
            'title' => 'Add Project',
            'action' => route('admin.projects.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'banner_image'   => 'nullable|image|max:5120',
            'images.*' => 'image|max:10240',
        ]);

        try {
            DB::transaction(function () use ($request) {

                $data = $request->only(['title', 'description', 'location', 'status', 'maps_url']);

                if ($request->hasFile('banner_image')) {
                    $data['banner_image'] = $request->file('banner_image')->store('projects/banners', 'public');
                }

                $project = DeveloperProject::create($data);

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $image->store("projects/{$project->id}/images", 'public');

                        DeveloperProjectImage::create([
                            'project_id' => $project->id,
                            'image_path' => $path,
                        ]);
                    }
                }
            });

            return redirect()
                ->route('admin.projects')
                ->with('success', 'Project berhasil ditambahkan.');
        } catch (\Exception $e) {
            Log::error("Gagal simpan project: " . $e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return $this->view('show', [
            'title' => 'Project Details',
            'data' => DeveloperProject::find($id),
            'images' => DeveloperProjectImage::where('project_id', $id)->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return $this->view('project_form', [
            'title' => 'Edit Project',
            'data' => DeveloperProject::find($id),
            'images' => DeveloperProjectImage::where('project_id', $id)->get(),
            'action' => route('admin.projects.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'banner_image' => 'nullable|image|max:5120',
            'images.*'     => 'image|max:10240',
        ]);

        try {
            DB::transaction(function () use ($request, $id) {
                $project = DeveloperProject::findOrFail($id);
                $data = $request->only(['title', 'description', 'location', 'status', 'maps_url']);

                if ($request->hasFile('banner_image')) {
                    if ($project->banner_image) {
                        Storage::disk('public')->delete($project->banner_image);
                    }
                    $data['banner_image'] = $request->file('banner_image')->store('projects/banners', 'public');
                }

                $project->update($data);

                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $path = $image->store("projects/{$project->id}/images", 'public');

                        DeveloperProjectImage::create([
                            'project_id' => $project->id,
                            'image_path' => $path,
                        ]);
                    }
                }
            });

            return redirect()
                ->route('admin.projects')
                ->with('success', 'Project berhasil diupdate.');
        } catch (\Exception $e) {
            Log::error("Gagal update project: " . $e->getMessage());
            return back()->withInput()->with('error', 'Gagal update: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $project = DeveloperProject::findOrFail($id);
        $images = DeveloperProjectImage::where('project_id', $id)->get();
        foreach ($images as $image) {
            Storage::disk('public')->delete($image->image_path);
            $image->delete();
        }
        $project->delete();

        return redirect()->route('admin.projects');
    }

    public function deleteImage($id)
    {
        $image = DeveloperProjectImage::findOrFail($id);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['success' => true]);
    }
}
