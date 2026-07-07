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
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->id();
            $table->string('header')->nullable();
            $table->string('subheader')->nullable();
            $table->text('description')->nullable();
            $table->text('developer_project_desc')->nullable();
            $table->text('location_desc')->nullable();
            $table->text('mapping_path')->nullable();
            $table->text('hero_path')->nullable();
            $table->text('location')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_pages');
    }
};
