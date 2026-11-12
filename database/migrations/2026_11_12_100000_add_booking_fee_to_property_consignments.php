<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('property_consignments', function (Blueprint $table) {
            // Set per property by the admin (client, 2026-11-05). Null = no online booking.
            $table->decimal('booking_fee_percent', 5, 2)->nullable()->after('market_value');
            // Shown in the booking confirmation; what happens to the fee if the buyer cancels.
            $table->text('booking_terms')->nullable()->after('booking_fee_percent');
        });
    }

    public function down(): void
    {
        Schema::table('property_consignments', function (Blueprint $table) {
            $table->dropColumn(['booking_fee_percent', 'booking_terms']);
        });
    }
};
