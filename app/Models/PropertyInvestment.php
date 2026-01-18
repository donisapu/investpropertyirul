<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyInvestment extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'property_value',
        'price_perlot',
        'total_lot',
        'min_lot_size',
        'max_lot_size',
        'estimated_roi',
        'roi_period',
        'status',
    ];

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }
}
