<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyAuction extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'open_bid',
        'bid_increment',
        'date_start',
        'date_finish',
        'status',
    ];

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }
}
