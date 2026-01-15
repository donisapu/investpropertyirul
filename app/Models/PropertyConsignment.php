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
    ];

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }
}
