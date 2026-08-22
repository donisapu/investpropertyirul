<?php

namespace App\Http\Controllers;

use App\Models\PropertyCrowdfunding;
use App\Models\Campaign;
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
        $mappedProperties = $properties->through(function ($crowdfunding) {
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
        $topCrowdfunding = collect($mappedProperties->items())
            ->where('status', 'Open')
            ->sortByDesc('collected')
            ->first();

        return Inertia::render('Crowdfunding/Index', [
            'properties' => $mappedProperties,
            'topCrowdfundingId' => $topCrowdfunding ? $topCrowdfunding['crowdfunding_id'] : null,
            'settings' => $settings,
        ]);
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

        $progress = 0;
        if ($crowdfunding->funding_goal > 0) {
            $progress = ($crowdfunding->collected_amount / $crowdfunding->funding_goal) * 100;
        }

        if ($progress >= 100 && $crowdfunding->status !== 'Funded') {
            $crowdfunding->update(['status' => 'Funded']);
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
            'progress' => min($progress, 100), // Batasi max 100% untuk tampilan UI
            'status' => ucfirst($crowdfunding->status),
            'is_funded' => $progress >= 100 || strtolower($crowdfunding->status) === 'Funded',
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

    public function purchase(Request $request, $id)
    {
        $crowdfunding = PropertyCrowdfunding::with(['property.images', 'property.documents'])
            ->where('id', $id)
            ->where('status', '!=', 'draft')
            ->firstOrFail();

        // 1. Cek validasi campaign aktif jika campaign_id dikirim via query
        $discountPercent = 0;
        $campaignData = null;

        if ($request->has('campaign_id')) {
            $campaign = Campaign::where('id', $request->query('campaign_id'))
                ->where('property_id', $crowdfunding->property_id)
                ->where('status', 'active')
                ->first();

            if ($campaign) {
                $discountPercent = (float) $campaign->discount_percent;
                $campaignData = [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'discount_percent' => $discountPercent,
                ];
            }
        }

        // 2. Hitung diskon untuk nilai minimal kontribusi
        $originalMinContribution = (float) $crowdfunding->min_contribution;
        $discountedMinContribution = $originalMinContribution;

        if ($discountPercent > 0) {
            $discountedMinContribution = $originalMinContribution - ($originalMinContribution * ($discountPercent / 100));
        }

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
            'min_contribution' => $originalMinContribution,
            'discounted_min_contribution' => $discountedMinContribution,
            'discount_percent' => $discountPercent,
            'progress' => $progress,
            'status' => ucfirst($crowdfunding->status),
            'campaign' => $campaignData, // Passing data campaign ke frontend
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
