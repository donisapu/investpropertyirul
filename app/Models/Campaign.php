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

    /**
     * The campaign that discounts $product today, or null. A campaign targets one product of its
     * property (see getTypeAttribute), so it never discounts the property's other product.
     */
    public static function discountFor($campaignId, PropertyInvestment|PropertyCrowdfunding $product): ?self
    {
        if (! $campaignId) {
            return null;
        }

        $campaign = static::active()->whereKey($campaignId)->where('property_id', $product->property_id)->first();
        $type = $product instanceof PropertyInvestment ? 'investment' : 'crowdfunding';

        return $campaign && $campaign->type === $type && $campaign->target_id === $product->id ? $campaign : null;
    }

    // Whole rupiah: Xendit invoices are in IDR without decimals.
    public function discountedPrice($price): int
    {
        return (int) round($price * (1 - $this->discount_percent / 100));
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
