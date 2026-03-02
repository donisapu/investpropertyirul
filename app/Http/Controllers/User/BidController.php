<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;

class BidController extends Controller
{
    public function index()
    {
        $rawBids = [
            [
                'id' => 1,
                'name' => 'Luxury Villa Seminyak',
                'loc' => 'Badung, Bali',
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
                'current_price' => 1250000000,
                'user_bid' => 1250000000,
                'ends_at' => '02d 14h 05m',
            ],
            [
                'id' => 2,
                'name' => 'Commercial Hub Sudirman',
                'loc' => 'Jakarta Pusat',
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80',
                'current_price' => 4200000000,
                'user_bid' => 4000000000,
                'ends_at' => '00d 05h 30m',
            ]
        ];

        $bids = collect($rawBids)->map(function ($item) {
            $item = (object) $item;
            $item->is_outbid = $item->user_bid < $item->current_price;
            return $item;
        });

        $stats = [
            'total_active' => $bids->count(),
            'winning' => $bids->where('is_outbid', false)->count(),
            'outbid' => $bids->where('is_outbid', true)->count(),
        ];
        $settings = WebsiteSetting::getSettings();
        return view('user.bid', ['title' => 'My Bids'], compact('settings', 'bids', 'stats'));
    }
}
