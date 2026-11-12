<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyAuction extends Model
{
    use HasFactory;

    public const TYPE_AUCTION = 'auction';

    public const TYPE_CESSIE = 'cessie';

    /** Stored value => label shown to people. */
    public const TYPES = [
        self::TYPE_AUCTION => 'Lelang',
        self::TYPE_CESSIE => 'Cessie',
    ];

    public const STATUSES = ['draft', 'upcoming', 'active', 'closed', 'awaiting_payment', 'completed', 'no_winner', 'defaulted', 'cancelled', 'suspended'];

    /** Statuses an admin sets in the form; the others are reached through the auction's own flow. */
    public const EDITABLE_STATUSES = ['draft', 'upcoming', 'active', 'suspended'];

    /** The auction has ended: no more deposits or bids. */
    public const ENDED_STATUSES = ['closed', 'awaiting_payment', 'completed', 'no_winner', 'defaulted', 'cancelled'];

    public const MIN_DEPOSIT_PERCENT = 5;

    /** Deposits close this long before the auction does (C4). */
    public const DEPOSIT_CUTOFF_MINUTES = 60;

    public const SNIPING_MINUTES = 5;

    protected $appends = ['type_label'];

    protected $fillable = [
        'property_id',
        'open_bid',
        'bid_increment',
        'date_start',
        'date_finish',
        'status',
        'type',
        'market_value',
        'deposit_percent',
        'payment_days',
        'terms',
        'anti_sniping',
        // Set by AuctionService only (the admin form passes validated fields).
        'winner_bid_id',
        'closed_at',
        'cancelled_at',
        'cancel_reason',
    ];

    protected $casts = [
        'date_start' => 'datetime',
        'date_finish' => 'datetime',
        'closed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'deposit_percent' => 'float',
        'payment_days' => 'integer',
        'anti_sniping' => 'boolean',
    ];

    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? (string) $this->type;
    }

    public function isCessie(): bool
    {
        return $this->type === self::TYPE_CESSIE;
    }

    public function property()
    {
        return $this->belongsTo(Properties::class, 'property_id');
    }

    public function bids()
    {
        return $this->hasMany(AuctionBid::class, 'property_auction_id');
    }

    public function deposits()
    {
        return $this->hasMany(AuctionDeposit::class, 'property_auction_id');
    }

    public function settlement()
    {
        return $this->hasOne(AuctionSettlement::class, 'property_auction_id')->latestOfMany();
    }

    public function winnerBid()
    {
        return $this->belongsTo(AuctionBid::class, 'winner_bid_id');
    }

    /** Highest bid first; the earlier of two equal bids wins. */
    public function topBid(): ?AuctionBid
    {
        return $this->bids()->orderByDesc('bid_amount')->orderBy('id')->first();
    }

    public function depositAmount(): int
    {
        return (int) round((float) $this->open_bid * (float) $this->deposit_percent / 100);
    }

    /** Deposits are taken while the auction is upcoming or running, until the cut-off (C4). */
    public function acceptsDeposits(): bool
    {
        return in_array($this->status, ['upcoming', 'active'], true)
            && $this->deposit_percent > 0
            && now()->lt($this->depositDeadline());
    }

    public function depositDeadline(): \Illuminate\Support\Carbon
    {
        return $this->date_finish->copy()->subMinutes(self::DEPOSIT_CUTOFF_MINUTES);
    }

    public function isOpenForBids(): bool
    {
        return $this->status === 'active' && now()->gte($this->date_start) && now()->lt($this->date_finish);
    }
}
