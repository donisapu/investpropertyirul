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

    public const STATUSES = ['draft', 'upcoming', 'active', 'closed', 'suspended'];

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
}
