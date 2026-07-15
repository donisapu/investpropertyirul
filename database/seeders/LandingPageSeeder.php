<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LandingPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('landing_pages')->updateOrInsert(
            [
                'id' => 1,
            ],
            [
                'header' => 'Developer Terpercaya',
                'subheader' => 'Platform Developer & Investasi Properti',
                'description' => 'Kolaborasi bersama tim profesional untuk mengembangkan, memasarkan, dan mengelola proyek properti dengan transparan dan terstruktur.',
                'developer_project_desc' => 'Konsep pengembangan properti kami berfokus pada inovasi berkelanjutan, menjangkau segmen perumahan dan villa. Kami memastikan setiap proyek terbukti mengikuti tren pasar terkini dan menawarkan fleksibilitas desain untuk selaras dengan kebutuhan spesifik klien. Nikmati keuntungan dari lokasi proyek yang strategis dengan jaminan harga properti yang kompetitif dan terjangkau. Untuk mengakomodasi berbagai kebutuhan investasi, kami secara konsisten menyediakan opsi kepemilikan Freehold dan Leasehold pada seluruh portofolio proyek kami.',
                'location_desc' => 'Kuta Selatan – Bali, adalah lokasi dengan potensi luar biasa dalam pariwisata, menjadikannya pilihan strategis untuk hunian atau investasi properti. Dikelilingi oleh spot wisata terkenal dan ramai oleh wisatawan, daerah ini menawarkan perkembangan pesat yang mendukung pertumbuhan nilai properti Anda. Tidak hanya sebagai tempat tinggal di kawasan elite, properti di Bali Selatan memberikan peluang besar untuk investasi yang terus meningkat seiring waktu.',
                'mapping_path' => null,
                'hero_path' => null,
                'slider_title' => 'Our Villa Designs Development',
                'location' => '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126353.94599449118!2d114.63551093471943!3d-8.24683908172975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd16469acb922a5%3A0xfb8b53390946302d!2sMount%20Merbuk!5e0!3m2!1sen!2sid!4v1783411435855!5m2!1sen!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',

                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}
