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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('property_name');
            $table->string('property_location');
            $table->integer('bedroom');
            $table->integer('bathroom');
            $table->enum('property_type',['Villa','House']);
            $table->integer('land_area');
            $table->integer('building_area');
            $table->text('listing_url');
            $table->text('detail')->nullable();
            $table->text('financial')->nullable();
            $table->text('market')->nullable();
            $table->text('timeline')->nullable();
            $table->text('map_url');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
