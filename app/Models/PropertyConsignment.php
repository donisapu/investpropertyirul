<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyConsignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'property_value',
        'ownership',
        'listing_type',
        'lease_term',
        'status',
        'market_value',
        'booking_fee_percent',
        'booking_terms',
    ];

    protected $casts = [
        'booking_fee_percent' => 'float',
    ];

    public function bookings()
    {
        return $this->hasMany(SaleBooking::class);
    }

    public function acceptsBooking(): bool
    {
        return $this->status === 'active' && $this->booking_fee_percent > 0;
    }

    /** Whole rupiah, rounded: price × booking fee %. */
    public function bookingFee(): int
    {
        return (int) round((float) $this->property_value * (float) $this->booking_fee_percent / 100);
    }

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }
}
