<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * A buyer's booking fee on a property for sale. While it is pending (and not past
 * expires_at) or paid, it holds the property: nobody else can book it.
 */
class SaleBooking extends Model
{
    public const PENDING = 'pending';
    public const PAID = 'paid';
    public const COMPLETED = 'completed';
    public const EXPIRED = 'expired';
    public const CANCELLED = 'cancelled';
    // Paid after someone else already held the property: an admin must refund it (B8).
    public const CONFLICT = 'conflict';

    public const FEE_REFUNDED = 'refunded';
    public const FEE_FORFEITED = 'forfeited';

    protected $guarded = ['id'];

    protected $casts = [
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function consignment(): BelongsTo
    {
        return $this->belongsTo(PropertyConsignment::class, 'property_consignment_id');
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payment(): MorphOne
    {
        return $this->morphOne(Payment::class, 'payable')->latestOfMany();
    }

    /** Bookings that keep the property from being booked by someone else. */
    public function scopeHolding(Builder $query): Builder
    {
        return $query->where(fn ($q) => $q
            ->where('status', self::PAID)
            ->orWhere(fn ($p) => $p->where('status', self::PENDING)->where('expires_at', '>', now())));
    }

    public function isHolding(): bool
    {
        return $this->status === self::PAID
            || ($this->status === self::PENDING && $this->expires_at?->isFuture());
    }
}
