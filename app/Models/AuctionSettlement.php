<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/** The winner's remaining payment (pelunasan): winning bid minus the deposit (C14, C16). */
class AuctionSettlement extends Model
{
    public const PENDING = 'pending';
    public const PAID = 'paid';
    public const DEFAULTED = 'defaulted';

    protected $guarded = ['id'];

    protected $casts = [
        'due_at' => 'datetime',
        'paid_at' => 'datetime',
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

    public function deposit(): BelongsTo
    {
        return $this->belongsTo(AuctionDeposit::class, 'auction_deposit_id');
    }

    public function payment(): MorphOne
    {
        return $this->morphOne(Payment::class, 'payable')->latestOfMany();
    }

    public function paidManuallyBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'paid_manually_by');
    }
}
