<?php

namespace App\Services\Xendit\Exceptions;

/**
 * Xendit answered with a clear 4xx: the request was refused and not processed
 * (e.g. DUPLICATE_ERROR, CHANNEL_CODE_NOT_SUPPORTED, INVALID_API_KEY).
 *
 * Also raised with a null HTTP status when the gateway is not configured, since
 * no request was sent at all.
 */
class XenditRejectedException extends XenditException
{
    public function __construct(
        string $method,
        string $path,
        ?int $httpStatus,
        public readonly string $errorCode,
        public readonly string $errorMessage,
        /** Decoded error body from Xendit (error_code, message, errors[]). */
        public readonly array $body = [],
    ) {
        parent::__construct(
            sprintf('Xendit rejected %s %s (%s %s): %s', $method, $path, $httpStatus ?? 'not sent', $errorCode, $errorMessage),
            $method,
            $path,
            $httpStatus,
        );
    }

    public function is(string ...$errorCodes): bool
    {
        return in_array($this->errorCode, $errorCodes, true);
    }
}
