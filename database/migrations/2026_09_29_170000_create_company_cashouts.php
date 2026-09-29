<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The only destination a Company Cash-out may use (Q7).
        Schema::table('withdrawal_settings', function (Blueprint $table) {
            $table->string('company_bank_code', 64)->nullable();
            $table->string('company_account_number', 32)->nullable();
            $table->string('company_account_holder', 100)->nullable();
        });

        // Audit of every Company Cash-out: who, when, how much, where, and what happened.
        Schema::create('company_cashouts', function (Blueprint $table) {
            $table->id();
            $table->string('external_id', 64)->unique();   // CO-<ulid>, also the Xendit idempotency key
            $table->unsignedBigInteger('amount');           // whole IDR
            $table->unsignedInteger('transaction_count');
            $table->string('bank_code', 64);                // destination snapshot
            $table->string('account_number', 32);
            $table->string('account_holder', 100);
            $table->string('status', 16)->default('processing')->index(); // processing | succeeded | failed | reversed
            $table->string('xendit_id')->nullable();
            $table->string('payout_status', 64)->nullable();
            $table->string('failure_code', 64)->nullable();
            $table->string('failure_reason')->nullable();
            $table->unsignedBigInteger('balance_at_request')->nullable(); // CASH read right before sending
            $table->unsignedBigInteger('reserve_at_request')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('released_at')->nullable();   // rows freed again after a failure
            $table->timestamps();
        });

        // Which transactions each Cash-out used; kept after a release for the audit trail.
        Schema::create('company_cashout_transaction', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_cashout_id')->constrained('company_cashouts')->cascadeOnDelete();
            $table->foreignId('xendit_transaction_id')->constrained('xendit_transactions')->cascadeOnDelete();
            $table->unsignedBigInteger('amount');           // net amount counted from this row
            $table->unique(['company_cashout_id', 'xendit_transaction_id'], 'cashout_txn_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_cashout_transaction');
        Schema::dropIfExists('company_cashouts');
        Schema::table('withdrawal_settings', function (Blueprint $table) {
            $table->dropColumn(['company_bank_code', 'company_account_number', 'company_account_holder']);
        });
    }
};
