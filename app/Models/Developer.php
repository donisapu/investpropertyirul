<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Developer extends Model
{
    use HasFactory;

    protected $table = 'developers';

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'phone',
        'youtube_url',
        'facebook_url',
        'instagram_url',
        'tiktok_url',
        'status',
    ];

    public static function getSettings(): ?self
    {
        return Cache::rememberForever('developer_settings', function () {
            return self::first();
        });
    }

    /**
     * Clear cache when data changes
     */
    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('developer_settings');
        });

        static::deleted(function () {
            Cache::forget('developer_settings');
        });
    }
}
