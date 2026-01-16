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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            // Relation
            $table->foreignId('property_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Campaign info
            $table->string('title');
            $table->text('description')->nullable();

            // Media
            $table->string('banner_path')->nullable();

            // Discount
            $table->decimal('discount_percent', 5, 2); // e.g. 99.99%

            // Period
            $table->date('start_date');
            $table->date('end_date');

            // Status
            $table->enum('status', ['draft', 'active', 'inactive'])
                  ->default('draft');
                  
            $table->timestamps();
            // Indexes
            $table->index(['property_id', 'status']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
