<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * When an admin paid the crowdfunding out, shown on the Crowdfunding Financials page.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('crowdfunding_financials', function (Blueprint $table) {
            $table->timestamp('distributed_at')->nullable()->after('is_distributed');
        });
    }

    public function down(): void
    {
        Schema::table('crowdfunding_financials', function (Blueprint $table) {
            $table->dropColumn('distributed_at');
        });
    }
};
