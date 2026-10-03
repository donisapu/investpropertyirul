<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * PF-04: a crowdfunding contribution bought with a campaign discount is paid at the discounted
 * price but counts at its full value (client, 2026-10-03). Null means it counts as paid.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->decimal('credited_amount', 18, 2)->nullable()->after('amount');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('credited_amount');
        });
    }
};
