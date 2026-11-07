<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campaign;
use Inertia\Inertia;

class PublicCampaignController extends Controller
{
    public function show(Campaign $campaign)
    {
        abort_unless($campaign->isVisible(), 404);

        $campaign->load('property');

        return Inertia::render('Campaign/Show', [
            'campaign' => $campaign
        ]);
    }
}
