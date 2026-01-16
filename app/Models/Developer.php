<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
