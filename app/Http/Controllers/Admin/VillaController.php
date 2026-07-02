<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use App\Models\Partner;

class VillaController extends Controller
{
    public function show(string $slug)
    {
        $settings = WebsiteSetting::getSettings();
        $partners = Partner::all();
        return view('villas.show', [
            'slug' => $slug,
            'setting' => $settings,
            'partner' => $partners
        ]);
    }
}
