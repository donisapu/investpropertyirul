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
            $table->integer('property_id');
            $table->decimal('property_value',16,2);
            $table->decimal('price_perlot',16,2);
            $table->integer('total_lot');
            $table->integer('min_lot_size');
            $table->integer('max_lot_size');
            $table->decimal('estimated_roi',16,2);
            $table->integer('roi_period');
            $table->enum('status',['Draft','Open','Closed','Running','Finished']);
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
