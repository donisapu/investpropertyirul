<?php

namespace App\Http\Controllers\Admin;

use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class WebsiteSettingController extends AdminController
{
    /**
     * Show edit form (single page)
     */
    protected string $viewPath = 'website_settings';

    public function edit()
    {
        $setting = WebsiteSetting::getSettings();

        return $this->view('index', [
            'title' => 'Website Settings',
            'setting' => $setting,
        ]);
    }

    /**
     * Update website settings
     */
    public function update(Request $request)
    {
        $setting = WebsiteSetting::firstOrFail();

        $data = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'site_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'location' => 'nullable|string',
            'whatsapp' => 'nullable|string|max:20',

            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'facebook_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'youtube_video_url' => 'nullable|url',
        ]);

        /* -------------------------------
         |  Logo Upload
         | -------------------------------
         */
        if ($request->hasFile('logo')) {
            if ($setting->logo) {
                Storage::disk('public')->delete($setting->logo);
            }

            $data['logo'] = $request->file('logo')->store('website/logo', 'public');
        }

        $setting->update($data);

        return redirect()
            ->back()
            ->with('success', 'Website settings updated successfully.');
    }
}
