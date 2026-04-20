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
        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('type', [
                'TOPUP',
                'WITHDRAW',
                'INVEST_BUY',
                'INVEST_SELL',
                'PROFIT'
            ]);

            $table->decimal('amount', 18, 2);
            $table->decimal('balance_after', 18, 2)->nullable();

            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
    }
};
