<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

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
        'email',
        'wa_public_button',
        'wa_followup_number',
        'wa_auction_access',
        'wa_booking_message',
        'wa_auction_message',
    ];

    // Shared with every page (Inertia): the follow-up number is only for buyers who paid.
    protected $hidden = ['wa_followup_number'];

    protected $casts = ['wa_public_button' => 'boolean'];

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
