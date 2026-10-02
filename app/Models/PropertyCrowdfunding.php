<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyCrowdfunding extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'funding_goal',
        'collected_amount',
        'min_contribution',
        'estimated_roi',
        'tenor',
        'status',
        'start_date',
        'end_date'
    ];

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    // Rupiah held by invoices that can still be paid.
    public function reservedAmount(): int
    {
        return (int) $this->payments()->reserving()->sum('amount');
    }

    public function availableAmount(): int
    {
        return max(0, (int) floor($this->funding_goal - $this->collected_amount) - $this->reservedAmount());
    }
}
