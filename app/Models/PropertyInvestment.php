<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyInvestment extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'asset_price',
        'property_upgrades',
        'notary_fee',
        'platform_fee',
        'total_investment_value',
        'rental_yield',
        'appreciation_rate',
        'projected_roi',
        'price_per_lot',
        'total_lot',
        'sold_lot',
        'min_lot_size',
        'max_lot_size',
        'roi_period_months',
        'status',
    ];

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }

    public function payments()
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    // Lots held by invoices that can still be paid.
    public function reservedLots(): int
    {
        return (int) $this->payments()->reserving()->sum('lot');
    }

    public function availableLots(): int
    {
        return max(0, $this->total_lot - $this->sold_lot - $this->reservedLots());
    }
}
