<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingPage;
use App\Models\Landmark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class LandingSettingController extends AdminController
{
    protected string $viewPath = 'website_settings';

    public function edit()
    {
        $setting = LandingPage::getSettings();
        $landmark = Landmark::all();

        return $this->view('landing', [
            'title' => 'Landing Page Settings',
            'setting' => $setting,
            'landmark' => $landmark,
        ]);
    }

    public function update(Request $request)
    {
        // 1. Ambil data setting terlebih dahulu
        $setting = LandingPage::firstOrFail();

        // 2. Validasi (Pastikan field 'developer_project_desc' sudah matching)
        $data = $request->validate([
            'hero_path' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'mapping_path' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'header' => 'required|string|max:255',
            'subheader' => 'required|string|max:255',
            'description' => 'nullable|string',
            'developer_project_desc' => 'nullable|string',
            'location_desc' => 'nullable|string',
            'location'  => 'nullable|string',

            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'name' => 'nullable|array',
            'name.*' => 'nullable|string|max:255',
            'distance' => 'nullable|array',
            'distance.*' => 'nullable|string|max:255',
        ]);

        // 3. Jalankan Transaksi Database
        DB::transaction(function () use ($request, $setting, &$data) {

            // Upload Hero Image baru
            if ($request->hasFile('hero_path')) {
                if ($setting->hero_path) {
                    Storage::disk('public')->delete($setting->hero_path);
                }
                $data['hero_path'] = $request->file('hero_path')->store('website/hero', 'public');
            }

            // Upload Mapping Image baru
            if ($request->hasFile('mapping_path')) {
                if ($setting->mapping_path) {
                    Storage::disk('public')->delete($setting->mapping_path);
                }
                $data['mapping_path'] = $request->file('mapping_path')->store('website/mapping', 'public');
            }

            // Simpan Landmark baru jika ada upload images[]
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('website/landmarks/images', 'public');

                    Landmark::create([
                        'name' => $request->input("name.$index", 'Landmark'),
                        'distance' => $request->input("distance.$index", '0 Km'),
                        'image_path' => $path,
                    ]);
                }
            }

            // UPDATE LANGSUNG MENGGUNAKAN INSTANCE DI DALAM TRANSACTION
            $setting->update($data);
        });

        // 4. Pengaman Tambahan (Force Save jika update() di dalam closure macet)
        // Ini memastikan instance object di luar closure juga sinkron dan tersimpan.
        $setting->fill($data)->save();
        Cache::forget('landing_pages');
        return redirect()
            ->back()
            ->with('success', 'Landing Page settings updated successfully.');
    }

    public function deleteLandmark($id)
    {
        $landmark = Landmark::findOrFail($id);

        Storage::disk('public')->delete($landmark->image_path);
        $landmark->delete();

        return response()->json(['success' => true]);
    }
}
