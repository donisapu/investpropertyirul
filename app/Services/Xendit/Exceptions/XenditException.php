<?php

namespace App\Services\Xendit\Exceptions;

use RuntimeException;

/**
 * Base for every error raised by the Xendit Gateway. Callers must handle the
 * two concrete kinds differently:
 *
 *  - XenditRejectedException: Xendit clearly refused the request (4xx). Nothing
 *    happened on Xendit's side; it is safe to mark the action failed.
 *  - XenditUnknownOutcomeException: timeout, network error, 5xx, rate limit or an
 *    unreadable response. The request MAY have been processed. Never refund or
 *    mark failed on this; retry with the same idempotency key or reconcile later.
 */
abstract class XenditException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly string $method,
        public readonly string $path,
        public readonly ?int $httpStatus = null,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $httpStatus ?? 0, $previous);
    }
}
