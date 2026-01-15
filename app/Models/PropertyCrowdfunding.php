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
        'min_contribution',
        'estimated_roi',
        'tenor',
        'status',
    ];

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }
}
