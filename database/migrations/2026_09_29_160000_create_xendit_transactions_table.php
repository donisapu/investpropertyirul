<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Local mirror of Xendit GET /transactions (money in + out), upserted by Xendit id.
        Schema::create('xendit_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('xendit_id', 191)->unique();         // txn_...
            $table->string('type', 64)->nullable()->index();    // PAYMENT, DISBURSEMENT, ...
            $table->string('status', 32)->nullable()->index();  // PENDING, SUCCESS, FAILED, VOIDED, REVERSED
            $table->string('settlement_status', 32)->nullable()->index(); // PENDING, SETTLED, EARLY_SETTLED
            $table->string('cashflow', 16)->nullable()->index(); // MONEY_IN, MONEY_OUT
            $table->string('channel_category', 64)->nullable();
            $table->string('channel_code', 64)->nullable();
            $table->string('account_identifier')->nullable();
            $table->string('reference_id')->nullable()->index();
            $table->string('product_id')->nullable()->index();  // invoice id / disb-...
            $table->decimal('amount', 18, 2)->default(0);
            $table->decimal('fee', 18, 2)->default(0);           // xendit_fee + value_added_tax
            $table->string('currency', 8)->default('IDR');
            $table->timestamp('xendit_created_at')->nullable()->index();
            $table->timestamp('xendit_updated_at')->nullable()->index();
            $table->json('payload');
            $table->nullableMorphs('linkable');                  // Payment | Withdrawal
            $table->unsignedBigInteger('company_cashout_id')->nullable()->index(); // XW-10
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('xendit_transactions');
    }
};
