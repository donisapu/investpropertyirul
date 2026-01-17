<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            // Branding
            $table->string('logo')->nullable();           // path logo
            $table->string('site_name');                  // Nama web
            $table->text('description')->nullable();      // Deskripsi

            // Contact & Location
            $table->text('address')->nullable();          // Alamat
            $table->string('location')->nullable();       // Lokasi (map link / short text)
            $table->string('whatsapp')->nullable();       // WA number

            // Social Media Links
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('youtube_url')->nullable();

            // Video
            $table->string('youtube_video_url')->nullable(); // Video (YouTube link)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_settings');
    }
};
