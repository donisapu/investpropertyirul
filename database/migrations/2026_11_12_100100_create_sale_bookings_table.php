<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_consignment_id')->constrained()->cascadeOnDelete();
            // Copied from the listing: the house the buyer agreed to, and a plain belongsTo
            // for screens that eager-load payable.property (a through-join makes `id` ambiguous).
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Fixed when the booking is made: later price / % changes do not touch it.
            $table->decimal('price', 16, 2);
            $table->decimal('fee_percent', 5, 2);
            $table->decimal('amount', 16, 2);
            // pending | paid | completed | expired | cancelled | conflict
            $table->string('status', 20)->default('pending')->index();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            // refunded (to the Wallet) | forfeited, set when a paid booking is cancelled.
            $table->string('fee_outcome', 20)->nullable();
            $table->text('cancel_reason')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_bookings');
    }
};
