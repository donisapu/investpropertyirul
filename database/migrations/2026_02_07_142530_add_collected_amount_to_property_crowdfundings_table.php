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
        Schema::table('property_crowdfundings', function (Blueprint $table) {
            $table->decimal('collected_amount', 16, 2)->default(0)->after('funding_goal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_crowdfundings', function (Blueprint $table) {
            $table->dropColumn('collected_amount');
        });
    }
};
