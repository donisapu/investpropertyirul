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
}
