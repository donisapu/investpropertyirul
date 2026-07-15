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
        Schema::create('developer_projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('type');
            $table->text('description');
            $table->text('description_1');
            $table->text('description_2');
            $table->text('description_3');
            $table->string('highlight_path');
            $table->string('highlight_1_path');
            $table->text('youtube_url');
            $table->text('location');
            $table->text('maps_url');
            $table->enum('status', ['Segera Hadir', 'Dalam Proses', 'Selesai', 'Terjual']);
            $table->string('banner_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('developer_projects');
    }
};
