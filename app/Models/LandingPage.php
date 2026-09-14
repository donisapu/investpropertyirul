<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class LandingPage extends Model
{
    use HasFactory;
    protected $fillable = [
        'header',
        'subheader',
        'description',
        'developer_project_desc',
        'location_desc',
        'mapping_path',
        'hero_path',
        'location',
        'slider_title'
    ];

    public static function getSettings(): ?self
    {
        return Cache::rememberForever('landing_pages', function () {
            return self::first();
        });
    }
}
