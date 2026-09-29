<?php

namespace App\Services\Withdrawal;

use App\Models\Withdrawal;

/**
 * What happened when we asked Xendit to send a Withdrawal's money.
 */
final class PayoutAttempt
{
    /** Xendit accepted the Payout; the final result comes by webhook. */
    public const SENT = 'sent';

    /** Xendit clearly refused it; the Withdrawal failed and the Wallet was refunded. */
    public const FAILED = 'failed';

    /** Timeout / 5xx / unreadable reply: money may be on its way. Stays processing, no refund. */
    public const UNKNOWN = 'unknown';

    /** Nothing was sent because of our own setup (API key, permission); back to pending. */
    public const NOT_SENT = 'not_sent';

    public function __construct(
        public readonly string $outcome,
        public readonly Withdrawal $withdrawal,
        public readonly ?string $errorCode = null,
        public readonly ?string $message = null,
    ) {}
}
