<?php

namespace App\Services\Xendit\Exceptions;

/**
 * The result of the request is unknown: timeout, connection failure, 5xx,
 * 408/429, or a 2xx body we could not read. The request may or may not have
 * been processed by Xendit, so callers must not treat it as failed.
 */
class XenditUnknownOutcomeException extends XenditException {}
