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
        // create_property_auctions_table now creates "type" itself; only add it on
        // databases migrated before that change, so a fresh migrate does not fail.
        if (Schema::hasColumn('property_auctions', 'type')) {
            return;
        }

        Schema::table('property_auctions', function (Blueprint $table) {
            $table->enum('type', ['auction', 'cessie'])->default('auction')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_auctions', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
