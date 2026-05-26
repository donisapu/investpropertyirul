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
        Schema::create('crowdfunding_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crowdfunding_financial_id')->constrained('crowdfunding_financials')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('principal_returned', 16, 2)->default(0);
            $table->decimal('profit_received', 16, 2)->default(0);
            $table->decimal('ownership_percentage', 5, 2);
            $table->timestamp('distributed_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crowdfunding_returns');
    }
};
