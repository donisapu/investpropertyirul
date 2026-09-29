<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * A row of the local Xendit Transactions mirror. Read-only data from Xendit;
 * the only thing we own is the link to our record (Payment / Withdrawal).
 */
class XenditTransaction extends Model
{
    public const MONEY_IN = 'MONEY_IN';

    public const MONEY_OUT = 'MONEY_OUT';

    protected $guarded = ['id'];

    protected $casts = [
        'payload' => 'array',
        'amount' => 'decimal:2',
        'fee' => 'decimal:2',
        'xendit_created_at' => 'datetime',
        'xendit_updated_at' => 'datetime',
    ];

    public function linkable(): MorphTo
    {
        return $this->morphTo();
    }

    /** The user behind this transaction, when it belongs to one of our records. */
    public function linkedUser(): ?User
    {
        return $this->linkable?->user;
    }

    public function isMoneyIn(): bool
    {
        return $this->cashflow === self::MONEY_IN;
    }
}
