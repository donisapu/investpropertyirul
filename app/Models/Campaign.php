<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'is_campaign' => 'boolean',
        'discount_percent' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $appends = ['type', 'target_id'];

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

    public function getTypeAttribute()
    {
        if ($this->property && $this->property->investment) {
            return 'investment';
        }

        if ($this->property && $this->property->crowdfunding) {
            return 'crowdfunding';
        }

        return null;
    }

    public function getTargetIdAttribute()
    {
        if ($this->type === 'investment') {
            return $this->property->investment->id;
        }

        if ($this->type === 'crowdfunding') {
            return $this->property->crowdfunding->id;
        }

        return null;
    }
}
