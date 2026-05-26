<?php

namespace App\Http\Controllers;

use App\Models\PropertyCrowdfunding;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicCrowdfundingController extends Controller
{
    /**
     * Show the crowdfunding properties page.
     */
    public function index(Request $request)
    {
        $properties = PropertyCrowdfunding::with(['property.images'])
            ->where('status', '!=', 'draft') // Show only active/open/success
            ->paginate(9);

        /** @var \Illuminate\Pagination\LengthAwarePaginator $properties */
        $properties->through(function ($crowdfunding) {
            // Calculate progress based on collected amount vs funding goal
            $progress = 0;
            if ($crowdfunding->funding_goal > 0) {
                $progress = ($crowdfunding->collected_amount / $crowdfunding->funding_goal) * 100;
            }

            return [
                'id' => $crowdfunding->property_id,
                'crowdfunding_id' => $crowdfunding->id,
                'name' => $crowdfunding->property->property_name,
                'loc' => $crowdfunding->property->property_location,
                'roi' => $crowdfunding->estimated_roi . '%',
                'tenor' => $crowdfunding->tenor . ' Months',
                'goal' => $crowdfunding->funding_goal,
                'collected' => $crowdfunding->collected_amount,
                'min_contribution' => $crowdfunding->min_contribution,
                'progress' => $progress,
                'status' => ucfirst($crowdfunding->status),
                'specs' => [
                    'bedroom' => $crowdfunding->property->bedroom,
                    'bathroom' => $crowdfunding->property->bathroom,
                    'area' => $crowdfunding->property->building_area . 'sqm',
                ],
                'image' => $crowdfunding->property->images->first() ? Storage::url($crowdfunding->property->images->first()->image_url) : null,
            ];
        });

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Crowdfunding/Index', compact('properties', 'settings'));
    }

    public function project()
    {
        $properties = PropertyCrowdfunding::with(['property.images'])
            ->where('status', '!=', 'draft')
            ->paginate(9);

        /** @var \Illuminate\Pagination\LengthAwarePaginator $properties */
        $properties->through(function ($crowdfunding) {
            $progress = 0;
            if ($crowdfunding->funding_goal > 0) {
                $progress = ($crowdfunding->collected_amount / $crowdfunding->funding_goal) * 100;
            }

            return [
                'id' => $crowdfunding->property_id,
                'crowdfunding_id' => $crowdfunding->id,
                'name' => $crowdfunding->property->property_name,
                'loc' => $crowdfunding->property->property_location,
                'roi' => $crowdfunding->estimated_roi . '%',
                'tenor' => $crowdfunding->tenor . ' Months',
                'goal' => $crowdfunding->funding_goal,
                'collected' => $crowdfunding->collected_amount,
                'min_contribution' => $crowdfunding->min_contribution,
                'progress' => $progress,
                'status' => ucfirst($crowdfunding->status),
                'specs' => [
                    'bedroom' => $crowdfunding->property->bedroom,
                    'bathroom' => $crowdfunding->property->bathroom,
                    'area' => $crowdfunding->property->building_area . 'sqm',
                ],
                'image' => $crowdfunding->property->images->first() ? Storage::url($crowdfunding->property->images->first()->image_url) : null,
            ];
        });

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Crowdfunding/Project', compact('properties', 'settings'));
    }

    /**
     * Show the crowdfunding property detail page.
     */
    public function show($id)
    {
        $crowdfunding = PropertyCrowdfunding::with(['property.images', 'property.documents'])
            ->where('id', $id)
            ->where('status', '!=', 'draft')
            ->firstOrFail();

        // Calculate progress based on collected amount vs funding goal
        $progress = 0;
        if ($crowdfunding->funding_goal > 0) {
            $progress = ($crowdfunding->collected_amount / $crowdfunding->funding_goal) * 100;
        }

        $property = [
            'id' => $crowdfunding->id,
            'crowdfunding_id' => $crowdfunding->id,
            'name' => $crowdfunding->property->property_name,
            'description' => $crowdfunding->property->detail,
            'loc' => $crowdfunding->property->property_location,
            'address' => $crowdfunding->property->property_address,
            'roi' => $crowdfunding->estimated_roi . '%',
            'tenor' => $crowdfunding->tenor . ' Months',
            'goal' => $crowdfunding->funding_goal,
            'collected' => $crowdfunding->collected_amount,
            'min_contribution' => $crowdfunding->min_contribution,
            'progress' => $progress,
            'status' => ucfirst($crowdfunding->status),
            'specs' => [
                'bedroom' => $crowdfunding->property->bedroom,
                'bathroom' => $crowdfunding->property->bathroom,
                'area' => $crowdfunding->property->building_area . 'sqm',
                'floors' => $crowdfunding->property->floors,
            ],
            'images' => $crowdfunding->property->images->map(function ($image) {
                return Storage::url($image->image_url);
            }),
            'documents' => $crowdfunding->property->documents->map(function ($doc) {
                return [
                    'name' => $doc->document_name,
                    'url' => Storage::url($doc->document_url),
                ];
            }),
            'map_url' => $crowdfunding->property->map_url,
        ];

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Crowdfunding/Show', compact('property', 'settings'));
    }

    public function purchase($id)
    {
        $crowdfunding = PropertyCrowdfunding::with(['property.images', 'property.documents'])
            ->where('id', $id)
            ->where('status', '!=', 'draft')
            ->firstOrFail();

        // Calculate progress based on collected amount vs funding goal
        $progress = 0;
        if ($crowdfunding->funding_goal > 0) {
            $progress = round(($crowdfunding->collected_amount / $crowdfunding->funding_goal) * 100);
        }

        $property = [
            'id' => $crowdfunding->property_id,
            'crowdfunding_id' => $crowdfunding->id,
            'name' => $crowdfunding->property->property_name,
            'description' => $crowdfunding->property->property_description,
            'loc' => $crowdfunding->property->property_location,
            'address' => $crowdfunding->property->property_address,
            'roi' => $crowdfunding->estimated_roi . '%',
            'tenor' => $crowdfunding->tenor . ' Months',
            'goal' => $crowdfunding->funding_goal,
            'collected' => $crowdfunding->collected_amount,
            'min_contribution' => $crowdfunding->min_contribution,
            'progress' => $progress,
            'status' => ucfirst($crowdfunding->status),
            'specs' => [
                'bedroom' => $crowdfunding->property->bedroom,
                'bathroom' => $crowdfunding->property->bathroom,
                'area' => $crowdfunding->property->building_area . 'sqm',
                'floors' => $crowdfunding->property->floors,
            ],
            'images' => $crowdfunding->property->images->map(function ($image) {
                return Storage::url($image->image_url);
            }),
            'main_image' => $crowdfunding->property->images->first() ? Storage::url($crowdfunding->property->images->first()->image_url) : null,
            'documents' => $crowdfunding->property->documents->map(function ($doc) {
                return [
                    'name' => $doc->document_name,
                    'url' => Storage::url($doc->document_url),
                ];
            }),
            'map_location' => $crowdfunding->property->map_location,
        ];

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Crowdfunding/Purchase', compact('property', 'settings'));
    }
}
