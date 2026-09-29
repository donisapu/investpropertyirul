<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    public const TYPE_WITHDRAW = 'WITHDRAW';

    public const TYPE_WITHDRAW_REFUND = 'WITHDRAW_REFUND';

    // amount is always positive; the type says whether money left or entered the Wallet.
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'balance_after',
        'reference_type',
        'reference_id',
    ];
}
