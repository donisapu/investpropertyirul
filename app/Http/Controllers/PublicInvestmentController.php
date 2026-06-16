<?php

namespace App\Http\Controllers;

use App\Models\InvestmentPortfolio;
use App\Models\PropertyInvestment;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicInvestmentController extends Controller
{
    /**
     * Show the investment properties page.
     */
    public function index(Request $request)
    {
        $properties = PropertyInvestment::with(['property.images'])->paginate(9);

        /** @var \Illuminate\Pagination\LengthAwarePaginator $properties */
        $properties->through(function ($investment) {
            $image = $investment->property->images->first();
            return [
                'id' => $investment->property_id,
                'investment_id' => $investment->id,
                'name' => $investment->property->property_name,
                'loc' => $investment->property->property_location,
                'roi' => $investment->rental_yield + $investment->appreciation_rate . '%',
                'roi_period' => $investment->roi_period_months, // Placeholder
                'progress' => $investment->total_lot > 0 ? ($investment->sold_lot / $investment->total_lot) * 100 : 0,
                'tokens' => number_format($investment->total_lot - $investment->sold_lot),
                'sold' => $investment->status === 'sold' || ($investment->total_lot - $investment->sold_lot) <= 0,
                'specs' => [
                    'bedroom' => $investment->property->bedroom,
                    'bathroom' => $investment->property->bathroom,
                    'area' => $investment->property->building_area . 'sqm',
                ],

                'image' => $investment->property->images->first() ? Storage::url($investment->property->images->first()->image_url) : null,
                // 'image' => $image ? asset($image->image_url) : null,
            ];
        });

        $settings = WebsiteSetting::getSettings();

        return Inertia::render('Investments/Index', compact('properties', 'settings'));
    }

    /**
     * Show the investment property detail page.
     */
    public function show($id)
    {
        $investment = PropertyInvestment::with(['property.images'])->where('property_id', $id)->firstOrFail();

        $property = [
            'id' => $investment->property->id,
            'name' => $investment->property->property_name,
            'loc' => $investment->property->property_location,
            'detail' => $investment->property->detail,
            'market' => $investment->property->market,
            'timeline' => $investment->property->timeline,
            'listing_url' => $investment->property->listing_url,
            'specs' => [
                'bedroom' => $investment->property->bedroom,
                'bathroom' => $investment->property->bathroom,
                'area' => $investment->property->building_area . 'sqm',
                'type' => $investment->property->property_type,
            ],
            'financials' => [
                'price' => $investment->property_value,
                'price_per_token' => $investment->price_perlot,
                'total_tokens' => $investment->total_lot,
                'tokens_left' => $investment->total_lot - $investment->sold_lot,
                'progress' => $investment->total_lot > 0 ? ($investment->sold_lot / $investment->total_lot) * 100 : 0,
                'irr' => $investment->rental_yield + $investment->appreciation_rate . '%',
                'ery' => $investment->estimated_roi . '%',
                'roi_period' => $investment->roi_period_months,
                'min_investment' => $investment->price_perlot,
                'asset_price' => $investment->asset_price,
                'investment_value' => $investment->total_investment_value,
                'property_upgrades' => $investment->property_upgrades,
                'notary_fee' => $investment->notary_fee,
                'platform_fee' => $investment->platform_fee,
                'rental_yield' => $investment->rental_yield . '%',
                'appreciation_rate' => $investment->appreciation_rate . '%'
            ],
            'images' => $investment->property->images->map(function ($img) {
                return Storage::url($img->image_url);
            }),
            // 'images' => $investment->property->images->map(function ($img) {
            //     return asset($img->image_url);
            // }),
            'main_image' => $investment->property->images->first() ? Storage::url($investment->property->images->first()->image_url) : null,
            // 'main_image' => $investment->property->images->first()
            //     ? asset($investment->property->images->first()->image_url)
            //     : null,
            'sold' => $investment->status === 'sold' || ($investment->total_lot - $investment->sold_lot) <= 0,
            'map_url' => $investment->property->map_url,
            'documents' => $investment->property->documents->map(function ($doc) {
                return [
                    'name' => $doc->document_name,
                    'url' => Storage::url($doc->document_url),
                ];
            }),
        ];

        return Inertia::render('Investments/Show', compact('property'));
    }

    public function purchase($id)
    {
        $investment = PropertyInvestment::with(['property.images'])->where('property_id', $id)->firstOrFail();

        $property = [
            'id' => $investment->property->id,
            'name' => $investment->property->property_name,
            'loc' => $investment->property->property_location,
            'detail' => $investment->property->detail,
            'financial' => $investment->property->financial,
            'market' => $investment->property->market,
            'timeline' => $investment->property->timeline,
            'specs' => [
                'bedroom' => $investment->property->bedroom,
                'bathroom' => $investment->property->bathroom,
                'area' => $investment->property->building_area . 'sqm',
                'type' => $investment->property->property_type,
            ],
            'financials' => [
                'price' => $investment->property_value,
                'price_per_lot' => $investment->price_per_lot,
                'min_lot' => $investment->min_lot_size,
                'total_tokens' => $investment->total_lot,
                'tokens_left' => $investment->total_lot - $investment->sold_lot,
                'progress' => $investment->total_lot > 0 ? round(($investment->sold_lot / $investment->total_lot) * 100) : 0,
                'irr' => $investment->estimated_roi . '%',
                'ery' => $investment->estimated_roi . '%',
                'roi_period' => $investment->roi_period,
                'min_investment' => $investment->price_perlot,
            ],
            'images' => $investment->property->images->map(function ($img) {
                return Storage::url($img->image_url);
            }),
            // 'images' => $investment->property->images->map(function ($img) {
            //     return asset($img->image_url);
            // }),
            'main_image' => $investment->property->images->first() ? Storage::url($investment->property->images->first()->image_url) : null,
            // 'main_image' => $investment->property->images->first()
            //     ? asset($investment->property->images->first()->image_url)
            //     : null,
            'sold' => $investment->status === 'sold' || ($investment->total_lot - $investment->sold_lot) <= 0,
            'map_url' => $investment->property->map_url,
        ];

        return Inertia::render('Investments/Purchase', compact('property'));
    }

    public function sell($id)
    {
        $investment = PropertyInvestment::with(['property.images'])->where('property_id', $id)->firstOrFail();
        $portfolio = InvestmentPortfolio::where('user_id', Auth::id())
            ->where('investment_id', $investment->id)
            ->firstOrFail();
        $property = [
            'id' => $investment->property->id,
            'name' => $investment->property->property_name,
            'loc' => $investment->property->property_location,
            'detail' => $investment->property->detail,
            'financial' => $investment->property->financial,
            'market' => $investment->property->market,
            'timeline' => $investment->property->timeline,
            'specs' => [
                'bedroom' => $investment->property->bedroom,
                'bathroom' => $investment->property->bathroom,
                'area' => $investment->property->building_area . 'sqm',
                'type' => $investment->property->property_type,
            ],
            'financials' => [
                'price' => $investment->property_value,
                'price_per_lot' => $investment->price_per_lot,
                'min_lot' => $investment->min_lot_size,
                'total_tokens' => $investment->total_lot,
                'tokens_left' => $investment->total_lot - $investment->sold_lot,
                'progress' => $investment->total_lot > 0 ? round(($investment->sold_lot / $investment->total_lot) * 100) : 0,
                'irr' => $investment->estimated_roi . '%',
                'ery' => $investment->estimated_roi . '%',
                'roi_period' => $investment->roi_period,
                'min_investment' => $investment->price_perlot,
            ],
            'images' => $investment->property->images->map(function ($img) {
                return Storage::url($img->image_url);
            }),
            // 'images' => $investment->property->images->map(function ($img) {
            //     return asset($img->image_url);
            // }),
            'main_image' => $investment->property->images->first() ? Storage::url($investment->property->images->first()->image_url) : null,
            // 'main_image' => $investment->property->images->first()
            //     ? asset($investment->property->images->first()->image_url)
            //     : null,
            'sold' => $investment->status === 'sold' || ($investment->total_lot - $investment->sold_lot) <= 0,
            'map_url' => $investment->property->map_url,
            'portfolio' => [
                'lot_held' => $portfolio->total_lot,
            ],
        ];

        return Inertia::render('Investments/Sell', compact('property'));
    }
}
