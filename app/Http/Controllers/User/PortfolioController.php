<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;

class PortfolioController extends Controller
{
    public function index()
    {
        $properties = [
            (object)[
                'id' => 1,
                'name' => 'Nusa Dua Deluxe',
                'loc' => 'Badung, Bali',
                'image' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400',
                'sold' => false
            ],
            (object)[
                'id' => 2,
                'name' => 'Uluwatu Cliff View',
                'loc' => 'Pecatu, Bali',
                'image' => null,
                'sold' => true
            ],
        ];
        $crowdfundings = [
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
        return view('user.portfolio', ['title' => 'My Portfolio'], compact('settings', 'properties','crowdfundings'));
    }
}
