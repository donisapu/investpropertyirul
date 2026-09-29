<?php

namespace App\Services\Cashout;

use App\Models\CompanyCashout;

final class CashoutAttempt
{
    public const SENT = 'sent';

    public const FAILED = 'failed';

    public const UNKNOWN = 'unknown';

    public function __construct(
        public readonly string $outcome,
        public readonly CompanyCashout $cashout,
        public readonly string $message,
    ) {}
}
