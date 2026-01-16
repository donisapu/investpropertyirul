<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Models\Properties;

class Campaign extends Model
{
    use HasFactory;
    protected $table = 'campaigns';

    protected $fillable = [
        'property_id',
        'is_campaign',
        'title',
        'description',
        'banner_path',
        'discount_percent',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'is_campaign'      => 'boolean',
        'discount_percent' => 'decimal:2',
        'start_date'       => 'date',
        'end_date'         => 'date',
    ];

    /* ======================
     |  Relationships
     |======================*/
    public function property()
    {
        return $this->belongsTo(Properties::class);
    }

    /* ======================
     |  Scopes (Optional)
     |======================*/
    public function scopeActive(Builder $query): Builder
    {
        return $query
            ->where('status', 'active')
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now());
    }
}
