<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * A participant's deposit on one auction (USE-CASES §C). Paid = held: the participant may bid.
 * When the auction ends it goes back to the Wallet, is applied to the winner's settlement,
 * or is forfeited when the winner does not pay.
 */
class AuctionDeposit extends Model
{
    public const PENDING = 'pending';
    public const PAID = 'paid';
    public const REFUNDED = 'refunded';
    public const APPLIED = 'applied';
    public const FORFEITED = 'forfeited';
    public const EXPIRED = 'expired';

    protected $guarded = ['id'];

    protected $casts = [
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function auction(): BelongsTo
    {
        return $this->belongsTo(PropertyAuction::class, 'property_auction_id');
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

    /** Pending and still payable. */
    public function isOpen(): bool
    {
        return $this->status === self::PENDING && $this->expires_at?->isFuture();
    }
}
