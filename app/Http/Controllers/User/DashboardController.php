<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;

class DashboardController extends Controller
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
        $settings = WebsiteSetting::getSettings();
        return view('user.dashboard', ['title' => 'Dashboard'], compact('settings','properties'));
    }
}
