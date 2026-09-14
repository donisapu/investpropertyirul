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
        'slider_title',
        'stat_1_value',
        'stat_1_label',
        'stat_2_value',
        'stat_2_label',
        'stat_3_value',
        'stat_3_label',
    ];

    public static function getSettings(): ?self
    {
        return Cache::rememberForever('landing_pages', function () {
            return self::first();
        });
    }
}
