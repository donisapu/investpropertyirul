<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CompanyCashout extends Model
{
    public const STATUS_PROCESSING = 'processing';

    public const STATUS_SUCCEEDED = 'succeeded';

    public const STATUS_FAILED = 'failed';

    public const STATUS_REVERSED = 'reversed';

    public const REFERENCE_PREFIX = 'CO-';

    protected $guarded = ['id'];

    protected $casts = [
        'amount' => 'integer',
        'transaction_count' => 'integer',
        'balance_at_request' => 'integer',
        'reserve_at_request' => 'integer',
        'processed_at' => 'datetime',
        'released_at' => 'datetime',
    ];

    public function transactions(): BelongsToMany
    {
        return $this->belongsToMany(XenditTransaction::class, 'company_cashout_transaction')->withPivot('amount');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isOpen(): bool
    {
        return $this->status === self::STATUS_PROCESSING;
    }
}
