<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pages and payments find an investment by its property id, so a property may
 * have only one. Fails if duplicates still exist: remove them by hand first.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('property_investments', function (Blueprint $table) {
            $table->unique('property_id');
        });
    }

    public function down(): void
    {
        Schema::table('property_investments', function (Blueprint $table) {
            $table->dropUnique(['property_id']);
        });
    }
};
