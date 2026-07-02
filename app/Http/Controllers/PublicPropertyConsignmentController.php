<?php

namespace App\Http\Controllers;

use App\Models\PropertyConsignment;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\PropertyAuction;
use Inertia\Inertia;

class PublicPropertyConsignmentController extends Controller
{
    /**
     * Show the consignment properties page.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $location = $request->input('location');
        $type = $request->input('type');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $category = $request->input('listing_category');

        $propertyFilter = function ($q) use ($search, $location, $type) {
            if ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('property_name', 'like', "%{$search}%")
                        ->orWhere('property_location', 'like', "%{$search}%");
                });
            }
            if ($location) {
                $q->where('property_location', 'like', "%{$location}%");
            }
            if ($type) {
                $q->where('property_type', $type);
            }
        };

        $consignments = collect();
        $auctions = collect();

        if (empty($category) || $category === 'sale') {
            $consignmentQuery = PropertyConsignment::with(['property.images'])->where('status', 'active');
            $consignmentQuery->whereHas('property', $propertyFilter);

            if ($minPrice) $consignmentQuery->where('property_value', '>=', $minPrice);
            if ($maxPrice) $consignmentQuery->where('property_value', '<=', $maxPrice);

            $consignments = $consignmentQuery->get()->map(function ($item) {
                return [
                    'id' => $item->property_id,
                    'listing_id' => $item->id,
                    'listing_category' => 'sale',
                    'name' => $item->property->property_name,
                    'loc' => $item->property->property_location,
                    'price' => $item->property_value,
                    'ownership' => $item->ownership,
                    'type' => $item->property->property_type,
                    'status' => $item->status,
                    'specs' => [
                        'bedroom' => $item->property->bedroom,
                        'bathroom' => $item->property->bathroom,
                        'area' => $item->property->building_area . 'sqm',
                    ],
                    'image' => $item->property->images->first() ? Storage::url($item->property->images->first()->image_url) : null,
                ];
            });
        }

        if (empty($category) || $category === 'auction') {
            $auctionQuery = PropertyAuction::with(['property.images'])->whereIn('status', ['upcoming', 'active']);
            $auctionQuery->whereHas('property', $propertyFilter);

            if ($minPrice) $auctionQuery->where('open_bid', '>=', $minPrice);
            if ($maxPrice) $auctionQuery->where('open_bid', '<=', $maxPrice);

            $auctions = $auctionQuery->get()->map(function ($item) {
                return [
                    'id' => $item->property_id,
                    'listing_id' => $item->id,
                    'listing_category' => 'auction',
                    'name' => $item->property->property_name,
                    'loc' => $item->property->property_location,
                    'price' => $item->open_bid,
                    'ownership' => 'Auction / Lelang',
                    'type' => $item->property->property_type,
                    'status' => $item->status,
                    'specs' => [
                        'bedroom' => $item->property->bedroom,
                        'bathroom' => $item->property->bathroom,
                        'area' => $item->property->building_area . 'sqm',
                    ],
                    'image' => $item->property->images->first() ? Storage::url($item->property->images->first()->image_url) : null,
                ];
            });
        }

        $mergedProperties = $consignments->merge($auctions);

        if (!$search && !$location && !$type && !$minPrice && !$maxPrice && !$category) {
            $mergedProperties = $mergedProperties->shuffle();
        }

        $page = $request->input('page', 1);
        $perPage = 9;
        $paginatedData = new \Illuminate\Pagination\LengthAwarePaginator(
            $mergedProperties->forPage($page, $perPage),
            $mergedProperties->count(),
            $perPage,
            $page,
            ['path' => url()->current(), 'query' => $request->query()]
        );

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('PropertyForSale/Index', [
            'properties' => $paginatedData,
            'settings' => $settings
        ]);
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
                'market_price' => $consignment->market_value,
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
