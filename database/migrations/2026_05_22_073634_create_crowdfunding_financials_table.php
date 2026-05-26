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
        Schema::create('crowdfunding_financials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crowdfunding_id')->constrained('property_crowdfundings')->cascadeOnDelete();

            $table->decimal('income', 14, 2)->default(0);
            $table->decimal('expense', 14, 2)->default(0);
            $table->decimal('net_profit', 14, 2)->default(0);

            $table->enum('status', ['DRAFT', 'FINAL'])->default('FINAL');
            $table->boolean('is_distributed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crowdfunding_financials');
    }
};
