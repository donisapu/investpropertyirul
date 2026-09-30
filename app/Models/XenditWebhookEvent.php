<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class XenditWebhookEvent extends Model
{
    public const RESULT_APPLIED = 'applied';

    public const RESULT_IGNORED = 'ignored';

    public const RESULT_UNKNOWN_REFERENCE = 'unknown_reference';

    public const RESULT_ERROR = 'error';

    protected $fillable = ['webhook_id', 'event', 'reference_id', 'payout_id', 'status', 'payload', 'result', 'error', 'attempts', 'processed_at'];

    protected $casts = [
        'payload' => 'array',
        'processed_at' => 'datetime',
    ];
}
