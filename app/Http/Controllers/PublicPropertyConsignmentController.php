<?php

namespace App\Http\Controllers;

use App\Models\PropertyConsignment;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicPropertyConsignmentController extends Controller
{
    /**
     * Show the consignment properties page.
     */
    public function index(Request $request)
    {
        $query = PropertyConsignment::with(['property.images']);

        // Search by name or location
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('property', function ($q) use ($search) {
                $q->where('property_name', 'like', "%{$search}%")
                  ->orWhere('property_location', 'like', "%{$search}%");
            });
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->whereHas('property', function ($q) use ($request) {
                $q->where('property_location', 'like', "%{$request->location}%");
            });
        }

        // Filter by property type
        if ($request->filled('type')) {
            $query->whereHas('property', function ($q) use ($request) {
                $q->where('property_type', $request->type);
            });
        }

        // Filter by bedroom
        if ($request->filled('bedroom')) {
            $query->whereHas('property', function ($q) use ($request) {
                $q->where('bedroom', '>=', $request->bedroom);
            });
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('property_value', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('property_value', '<=', $request->max_price);
        }

        $properties = $query->paginate(9);

        /** @var \Illuminate\Pagination\LengthAwarePaginator $properties */
        $properties->through(function ($consignment) {
            return [
                'id' => $consignment->property_id,
                'consignment_id' => $consignment->id,
                'name' => $consignment->property->property_name,
                'loc' => $consignment->property->property_location,
                'price' => $consignment->property_value,
                'ownership' => $consignment->ownership,
                'type' => $consignment->property->property_type,
                'status' => $consignment->status,
                'specs' => [
                    'bedroom' => $consignment->property->bedroom,
                    'bathroom' => $consignment->property->bathroom,
                    'area' => $consignment->property->building_area . 'sqm',
                    'land_area' => $consignment->property->land_area . 'sqm',
                ],
                'image' => $consignment->property->images->first() ? Storage::url($consignment->property->images->first()->image_url) : null,
            ];
        });

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('PropertyForSale/Index', compact('properties', 'settings'));
    }

    /**
     * Show the consignment property detail page.
     */
    public function show($id)
    {
        $consignment = PropertyConsignment::with(['property.images', 'property.documents'])->where('id', $id)->firstOrFail();

        $property = [
            'id' => $consignment->property->id,
            'consignment_id' => $consignment->id,
            'name' => $consignment->property->property_name,
            'loc' => $consignment->property->property_location,
            'detail' => $consignment->property->detail,
            'specs' => [
                'bedroom' => $consignment->property->bedroom,
                'bathroom' => $consignment->property->bathroom,
                'area' => $consignment->property->building_area . 'sqm',
                'land_area' => $consignment->property->land_area . 'sqm',
                'type' => $consignment->property->property_type,
            ],
            'financials' => [
                'price' => $consignment->property_value,
                'ownership' => $consignment->ownership,
                'lease_term' => $consignment->lease_term,
            ],
            'images' => $consignment->property->images->map(function ($img) {
                return Storage::url($img->image_url);
            }),
            'main_image' => $consignment->property->images->first() ? Storage::url($consignment->property->images->first()->image_url) : null,
            'documents' => $consignment->property->documents->map(function ($doc) {
                return [
                    'name' => $doc->document_name,
                    'url' => Storage::url($doc->document_url),
                ];
            }),
            'map_url' => $consignment->property->map_url,
        ];

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('PropertyForSale/Show', compact('property', 'settings'));
    }
}
