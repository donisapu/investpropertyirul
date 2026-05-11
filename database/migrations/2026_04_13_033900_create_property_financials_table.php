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
        Schema::create('property_financials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_investment_id')->constrained()->cascadeOnDelete();
            $table->integer('year');
            $table->integer('month');
            $table->decimal('income', 14, 2)->default(0);
            $table->decimal('expense', 14, 2)->default(0);
            $table->decimal('net_profit', 14, 2)->default(0);
            $table->enum('status', ['DRAFT', 'FINAL'])->default('FINAL');
            $table->unique(['property_investment_id', 'year', 'month']);
            $table->decimal('occupancy_rate', 5, 2)->nullable();
            $table->boolean('is_distributed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_financials');
    }
};
