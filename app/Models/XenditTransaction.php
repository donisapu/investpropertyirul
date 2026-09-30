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

    public function cashout(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(CompanyCashout::class, 'company_cashout_id');
    }

    /** Settled money in that is not locked by a Cash-out yet. */
    public function scopeCashoutEligible(\Illuminate\Database\Eloquent\Builder $q): void
    {
        $q->where('cashflow', self::MONEY_IN)
            ->where('status', 'SUCCESS')
            ->whereIn('settlement_status', ['SETTLED', 'EARLY_SETTLED'])
            ->whereNull('company_cashout_id');
    }

    public function isCashoutEligible(): bool
    {
        return $this->cashflow === self::MONEY_IN && $this->status === 'SUCCESS'
            && in_array($this->settlement_status, ['SETTLED', 'EARLY_SETTLED'], true)
            && $this->company_cashout_id === null;
    }

    /** What this row adds to a Cash-out: the money that really reached the balance. */
    public function netAmount(): int
    {
        return max(0, (int) floor((float) $this->amount - (float) $this->fee));
    }

    public function linkable(): MorphTo
    {
        return $this->morphTo();
    }

    /** The user behind this transaction, when it belongs to one of our records. */
    public function linkedUser(): ?User
    {
        // A Company Cash-out belongs to the admin who made it.
        return $this->linkable instanceof CompanyCashout ? $this->linkable->creator : $this->linkable?->user;
    }

    public function isMoneyIn(): bool
    {
        return $this->cashflow === self::MONEY_IN;
    }
}
