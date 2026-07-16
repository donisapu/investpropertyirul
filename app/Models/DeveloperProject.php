<?php

namespace App\Models;

use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeveloperProject extends Model
{
    use HasSlug;
    use HasFactory;
    protected $fillable = ['title', 'description', 'description_1', 'description_2', 'description_3', 'youtube_url', 'highlight_path', 'highlight_1_path', 'location', 'status', 'maps_url', 'slug', 'banner_image', 'type'];
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->usingSeparator('-')
            ->slugsShouldBeNoLongerThan(100);
    }
}
