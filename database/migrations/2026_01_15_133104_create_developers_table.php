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
        Schema::create('developers', function (Blueprint $table) {
            $table->id();
            // Main content
            $table->string('name');
            $table->text('description')->nullable();

            // Media
            $table->string('image_path')->nullable(); // cover / banner image

            // Contact
            $table->string('phone')->nullable();
            $table->string('youtube_url')->nullable();

            // Social media
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();

            // Draft / publish status
            $table->enum('status', ['draft', 'published'])->default('draft');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('developers');
    }
};
