<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_PROCESSING = 'processing';

    public const STATUS_SUCCEEDED = 'succeeded';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_REVERSED = 'reversed';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PROCESSING,
        self::STATUS_SUCCEEDED,
        self::STATUS_FAILED,
        self::STATUS_REJECTED,
        self::STATUS_REVERSED,
    ];

    /** Not final yet: money is on its way or waiting for admin. */
    public const OPEN_STATUSES = [self::STATUS_PENDING, self::STATUS_PROCESSING];

    protected $fillable = [
        'user_id',
        'user_bank_account_id',
        'external_id',
        'request_key',
        'amount',
        'fee',
        'status',
        'approved_by',
        'approved_at',
        'processed_at',
        'refunded_at',
        'xendit_id',
        'payout_status',
        'failure_code',
        'failure_reason',
    ];

    protected $casts = [
        'amount' => 'integer',
        'fee' => 'integer',
        'approved_at' => 'datetime',
        'processed_at' => 'datetime',
        'refunded_at' => 'datetime',
    ];

    protected $hidden = ['request_key'];

    public function bankAccount()
    {
        // Keep showing the account on old withdrawals after the user deletes it.
        return $this->belongsTo(UserBankAccount::class, 'user_bank_account_id')->withTrashed();
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /** Amount + Admin Fee: what left the Wallet, and what a refund gives back. */
    public function totalDeduction(): int
    {
        return $this->amount + $this->fee;
    }

    public function isOpen(): bool
    {
        return in_array($this->status, self::OPEN_STATUSES, true);
    }
}
