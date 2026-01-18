<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WebsiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('website_settings')->updateOrInsert(
            [
                'id' => 1, // enforce single row
            ],
            [
                'logo' => null,
                'site_name' => 'My Website',
                'description' => 'Official website description',
                'address' => 'Jl. Contoh Alamat No. 123, Jakarta',
                'location' => 'https://maps.google.com',
                'whatsapp' => '628123456789',
                'instagram_url' => 'https://instagram.com/mywebsite',
                'tiktok_url' => 'https://tiktok.com/@mywebsite',
                'linkedin_url' => 'https://linkedin.com/company/mywebsite',
                'facebook_url' => 'https://facebook.com/mywebsite',
                'youtube_url' => 'https://youtube.com/@mywebsite',
                'youtube_video_url' => 'https://www.youtube.com/watch?v=XXXXXXXX',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}
