<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class WebsiteSetting extends Model
{
    use HasFactory;
    protected $table = 'website_settings';

    protected $fillable = [
        'logo',
        'site_name',
        'description',
        'address',
        'location',
        'whatsapp',
        'instagram_url',
        'tiktok_url',
        'linkedin_url',
        'facebook_url',
        'youtube_url',
        'youtube_video_url',
    ];

    /* ------------------------------------
     |  Accessors
     | ------------------------------------
     */

    // Full logo URL
    public function getLogoUrlAttribute()
    {
        return $this->logo
            ? Storage::url($this->logo)
            : null;
    }

    // Clean WhatsApp link
    public function getWhatsappLinkAttribute()
    {
        return $this->whatsapp
            ? 'https://wa.me/' . preg_replace('/\D/', '', $this->whatsapp)
            : null;
    }

    /* ------------------------------------
     |  Helpers
     | ------------------------------------
     */

    /* =====================================================
     |  CACHE HANDLING
     | =====================================================
     */

    /**
     * Get cached website settings (single row)
     */
    public static function getSettings(): ?self
    {
        return Cache::rememberForever('website_settings', function () {
            return self::first();
        });
    }

    /**
     * Clear cache when data changes
     */
    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('website_settings');
        });

        static::deleted(function () {
            Cache::forget('website_settings');
        });
    }
}
