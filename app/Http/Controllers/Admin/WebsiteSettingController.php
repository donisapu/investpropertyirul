<?php

namespace App\Http\Controllers\Admin;

use App\Models\WebsiteSetting;
use App\Models\Partner;
use App\Services\WhatsApp\FollowUpLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class WebsiteSettingController extends AdminController
{
    /**
     * Show edit form (single page)
     */
    protected string $viewPath = 'website_settings';

    public function edit()
    {
        $setting = WebsiteSetting::getSettings();
        $partner = Partner::all();

        return $this->view('index', [
            'title' => 'Website Settings',
            'setting' => $setting,
            'partner' => $partner,
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
            'email' => 'nullable|string',

            'instagram_url' => 'nullable|url',
            'tiktok_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'facebook_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'youtube_video_url' => 'nullable|url',

            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',

            'name' => 'nullable|array',
            'name.*' => 'nullable|string|max:255',

            // WhatsApp follow-up for buyers who paid a booking or a deposit.
            'wa_public_button' => 'nullable|boolean',
            'wa_followup_number' => ['nullable', 'string', 'max:20', 'regex:/^\+?[0-9 \-]{8,20}$/'],
            'wa_auction_access' => 'required|in:'.FollowUpLink::ACCESS_DEPOSIT.','.FollowUpLink::ACCESS_WINNER,
            'wa_booking_message' => 'nullable|string|max:1000',
            'wa_auction_message' => 'nullable|string|max:1000',
        ], [
            'wa_followup_number.*' => 'Nomor WhatsApp follow-up diisi angka (8–15 digit), mis. 0812xxxx atau 62812xxxx.',
        ]);
        $data['wa_public_button'] = $request->boolean('wa_public_button');

        DB::transaction(function () use ($request, $setting, &$data) {

            // Upload logo baru
            if ($request->hasFile('logo')) {

                // Hapus logo lama
                if ($setting->logo) {
                    Storage::disk('public')->delete($setting->logo);
                }

                $data['logo'] = $request->file('logo')
                    ->store('website/logo', 'public');
            }

            // Jika ada upload partner baru
            if ($request->hasFile('images')) {

                // Hapus gambar partner lama
                // foreach (Partner::all() as $partner) {
                //     if ($partner->image_url) {
                //         Storage::disk('public')->delete($partner->image_url);
                //     }
                // }

                // Hapus data partner lama
                // Partner::query()->delete();

                // Simpan partner baru
                foreach ($request->file('images') as $index => $image) {

                    $path = $image->store(
                        'website/partners/images',
                        'public'
                    );

                    Partner::create([
                        'name' => $request->input("name.$index", 'Partner'),
                        'image_url' => $path,
                    ]);
                }
            }

            // Update setting
            $setting->update($data);
        });

        return redirect()
            ->back()
            ->with('success', 'Website settings updated successfully.');
    }

    public function deletePartner($id)
    {
        $partner = Partner::findOrFail($id);

        Storage::disk('public')->delete($partner->image_url);
        $partner->delete();

        return response()->json(['success' => true]);
    }
}
