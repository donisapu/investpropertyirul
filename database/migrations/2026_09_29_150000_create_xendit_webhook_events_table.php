<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Every Xendit webhook we accepted, for dedupe (webhook-id) and audit.
        Schema::create('xendit_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('webhook_id', 191)->unique();
            $table->string('event', 64)->nullable();
            $table->string('reference_id')->nullable()->index();
            $table->string('payout_id')->nullable();
            $table->string('status', 64)->nullable();
            $table->json('payload');
            $table->string('result', 32)->nullable(); // applied | ignored | unknown_reference | error
            $table->text('error')->nullable();
            $table->unsignedInteger('attempts')->default(0);
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('xendit_webhook_events');
    }
};
