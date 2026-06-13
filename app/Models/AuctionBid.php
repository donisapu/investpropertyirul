<?php

namespace App\Models;

use App\Models\PropertyAuction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuctionBid extends Model
{
    use HasFactory;
    protected $fillable = [
        'property_auction_id',
        'user_id',
        'bid_amount'
    ];

    public function auction(): BelongsTo
    {
        return $this->belongsTo(PropertyAuction::class, 'property_auction_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
