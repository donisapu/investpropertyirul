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
        Schema::create('property_investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->decimal('asset_price', 16, 2);
            $table->decimal('property_upgrades', 16, 2)->default(0);
            $table->decimal('notary_fee', 16, 2)->default(0);
            $table->decimal('platform_fee', 16, 2)->default(0);
            $table->decimal('total_investment_value', 16, 2);
            $table->decimal('rental_yield', 5, 2);
            $table->decimal('appreciation_rate', 5, 2);
            $table->decimal('price_per_lot', 16, 2);
            $table->integer('total_lot');
            $table->integer('sold_lot')->default(0);
            $table->integer('min_lot_size');
            $table->integer('max_lot_size');
            $table->decimal('projected_roi', 16, 2);
            $table->integer('roi_period_months');
            $table->enum('status', ['Draft', 'Open', 'FullyFunded', 'Running', 'Finished', 'Cancelled']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_investments');
    }
};
