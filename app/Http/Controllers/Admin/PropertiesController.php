<?php

namespace App\Http\Controllers\Admin;

use App\Models\Properties;
use App\Models\PropertyDocument;
use App\Models\PropertyImage;
use App\Traits\AdminDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PropertiesController extends AdminController
{
    /**
     * Display a listing of the resource.
     */
    protected string $viewPath = 'property';

    use AdminDataTable;

    public function data()
    {
        $query = Properties::query()->select('id', 'property_name', 'property_location');

        return $this->dataTable($query, 'pages.property.action');
    }

    public function index()
    {
        return $this->view('index', [
            'title' => 'Property',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->view('form', [
            'title' => 'Add Property',
            'action' => route('admin.properties.store'),
            'btn' => 'add',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'images.*' => 'image|max:2048',
            'documents.*' => 'file|max:5120',
            'document_names.*' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($request) {
            $property = Properties::create($request->only([
                'property_name',
                'property_location',
                'bedroom',
                'bathroom',
                'property_type',
                'land_area',
                'building_area',
                'listing_url',
                'detail',
                'financial',
                'market',
                'timeline',
                'map_url',
            ]));

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store(
                        "properties/{$property->id}/images",
                        'public'
                    );

                    PropertyImage::create([
                        'property_id' => $property->id,
                        'image_url' => $path,
                    ]);
                }
            }

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $index => $doc) {
                    $path = $doc->store(
                        "properties/{$property->id}/documents",
                        'public'
                    );

                    PropertyDocument::create([
                        'property_id' => $property->id,
                        'document_name' => $request->document_names[$index] ?? 'Document',
                        'document_url' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('admin.properties');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return $this->view('show', [
            'title' => 'Property Details',
            'data' => Properties::find($id),
            'images' => PropertyImage::where('property_id', $id)->get(),
            'docs' => PropertyDocument::where('property_id', $id)->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return $this->view('form', [
            'title' => 'Edit Property',
            'data' => Properties::find($id),
            'images' => PropertyImage::where('property_id', $id)->get(),
            'docs' => PropertyDocument::where('property_id', $id)->get(),
            'action' => route('admin.properties.update', $id),
            'btn' => 'edit',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'images.*' => 'image|max:2048',
            'documents.*' => 'file|max:5120',
            'document_names.*' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($request, $id) {
            $property = Properties::findOrFail($id);

            $property->update($request->only([
                'property_name',
                'property_location',
                'bedroom',
                'bathroom',
                'property_type',
                'land_area',
                'building_area',
                'listing_url',
                'detail',
                'financial',
                'market',
                'timeline',
                'map_url',
            ]));

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store(
                        "properties/{$property->id}/images",
                        'public'
                    );

                    PropertyImage::create([
                        'property_id' => $property->id,
                        'image_url' => $path,
                    ]);
                }
            }

            if ($request->hasFile('documents')) {
                foreach ($request->file('documents') as $index => $doc) {
                    $path = $doc->store(
                        "properties/{$property->id}/documents",
                        'public'
                    );

                    PropertyDocument::create([
                        'property_id' => $property->id,
                        'document_name' => $request->document_names[$index] ?? 'Document',
                        'document_url' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('admin.properties');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $property = Properties::findOrFail($id);
        $images = PropertyImage::where('property_id', $id)->get();
        foreach ($images as $image) {
            Storage::disk('public')->delete($image->image_url);
            $image->delete();
        }
        $documents = PropertyDocument::where('property_id', $id)->get();
        foreach ($documents as $document) {
            Storage::disk('public')->delete($document->document_url);
            $document->delete();
        }
        $property->delete();

        return redirect()->route('admin.properties');
    }

    public function deleteImage($id)
    {
        $image = PropertyImage::findOrFail($id);

        Storage::disk('public')->delete($image->image_url);
        $image->delete();

        return response()->json(['success' => true]);
    }

    public function deleteDocument($id)
    {
        $document = PropertyDocument::findOrFail($id);

        Storage::disk('public')->delete($document->document_url);
        $document->delete();

        return response()->json(['success' => true]);
    }

    public function search(Request $request)
    {
        $q = $request->q;

        return Properties::query()
            ->where('property_name', 'ilike', "%{$q}%")
            ->orWhere('property_location', 'ilike', "%{$q}%")
            ->limit(20)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'text' => "{$p->property_name} - {$p->property_location}",
            ]);
    }
}
