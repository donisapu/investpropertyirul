<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\CrowdfundingPortfolio;
use App\Models\InvestmentPortfolio;
use App\Models\WebsiteSetting;

class PortfolioController extends Controller
{
    public function index()
    {
        $investments = InvestmentPortfolio::with('ip.property.images')
            ->where('user_id', auth()->id())
            ->get();
        $crowdfundings = CrowdfundingPortfolio::with('cp.property.images')
            ->where('user_id', auth()->id())
            ->get();
        $crowdfundingss = [
            (object)[
                'id' => 1,
                'name' => 'Villa Ubud Creative Hub',
                'loc' => 'Ubud, Bali',
                'category' => 'Hospitality',
                'amount' => 2500000,
                'progress' => 72,
                'roi' => 14.5,
                'status' => 'Funding'
            ],
            (object)[
                'id' => 2,
                'name' => 'Co-Living Space Bandung',
                'loc' => 'Bandung, Indonesia',
                'category' => 'Residential',
                'amount' => 1500000,
                'progress' => 100,
                'roi' => 12.2,
                'status' => 'Completed'
            ],
        ];
        $settings = WebsiteSetting::getSettings();
        return view('user.portfolio', ['title' => 'My Portfolio'], compact('settings', 'crowdfundings', 'investments'));
    }
}
