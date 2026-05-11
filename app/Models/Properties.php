<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Properties extends Model
{
    use HasFactory;

    protected $table = 'properties';

    protected $fillable = [
        'property_name',
        'property_location',
        'bedroom',
        'bathroom',
        'property_type',
        'land_area',
        'building_area',
        'listing_url',
        'detail',
        'market',
        'timeline',
        'map_url',
    ];

    public function images()
    {
        return $this->hasMany(PropertyImage::class, 'property_id');
    }

    public function documents()
    {
        return $this->hasMany(PropertyDocument::class, 'property_id');
    }

    public function investment()
    {
        return $this->hasOne(PropertyInvestment::class, 'property_id');
    }
}
