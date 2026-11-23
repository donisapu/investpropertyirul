<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * WhatsApp follow-up after a booking or deposit is paid, managed by the admin:
 * site-wide defaults in website_settings, an optional number or group link per listing.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('website_settings', function (Blueprint $table) {
            // Show the "Tanya via WhatsApp" button to everyone (before paying).
            $table->boolean('wa_public_button')->default(true);
            // Number for buyers who paid; empty = the public number. Never sent to the browser.
            $table->string('wa_followup_number', 20)->nullable();
            // Auctions: 'deposit' (anyone whose deposit is paid) or 'winner' (only the winner).
            $table->string('wa_auction_access', 10)->default('deposit');
            $table->text('wa_booking_message')->nullable();
            $table->text('wa_auction_message')->nullable();
        });

        foreach (['property_consignments', 'property_auctions'] as $name) {
            Schema::table($name, function (Blueprint $table) {
                $table->string('followup_whatsapp', 20)->nullable();
                $table->string('followup_group_url', 255)->nullable();
            });
        }
    }

    public function down(): void
    {
        foreach (['property_consignments', 'property_auctions'] as $name) {
            Schema::table($name, function (Blueprint $table) {
                $table->dropColumn(['followup_whatsapp', 'followup_group_url']);
            });
        }

        Schema::table('website_settings', function (Blueprint $table) {
            $table->dropColumn(['wa_public_button', 'wa_followup_number', 'wa_auction_access', 'wa_booking_message', 'wa_auction_message']);
        });
    }
};
