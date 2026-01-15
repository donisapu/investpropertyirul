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
        Schema::create('property_crowdfundings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->decimal('funding_goal', 16, 2);
            $table->decimal('min_contribution', 16, 2);
            $table->decimal('estimated_roi', 16, 2);
            $table->integer('tenor');
            $table->enum('status', ['draft', 'open', 'success', 'inactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_crowdfundings');
    }
};
