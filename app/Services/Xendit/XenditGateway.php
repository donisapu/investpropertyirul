<?php

namespace App\Services\Xendit;

use App\Services\Xendit\Exceptions\XenditRejectedException;
use App\Services\Xendit\Exceptions\XenditUnknownOutcomeException;
use DateTimeInterface;
use DateTimeZone;
use GuzzleHttp\Exception\TransferException;
use GuzzleHttp\Psr7\Query;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

/**
 * The only place that talks to the Xendit API for payouts, balance and
 * transactions. Built on Laravel's HTTP client (not SDK v7 models, which throw
 * on unknown payout statuses / failure codes) and returns plain arrays.
 *
 * Errors:
 *  - InvalidArgumentException       bad input, nothing was sent
 *  - XenditRejectedException        clear 4xx from Xendit, nothing was processed
 *  - XenditUnknownOutcomeException  timeout / network / 5xx / 408 / 429 / unreadable
 *                                   response: the request may have been processed
 *
 * Tests fake it at the HTTP layer with Http::fake().
 */
class XenditGateway
{
    public const CURRENCY = 'IDR';

    public const BALANCE_CASH = 'CASH';

    public const BALANCE_HOLDING = 'HOLDING';

    /** GET /transactions filters we pass through, mapped to how they are validated. */
    private const TRANSACTION_FILTERS = [
        'types' => 'list',
        'statuses' => 'list',
        'channel_categories' => 'list',
        'reference_id' => 'string',
        'product_id' => 'string',
        'account_identifier' => 'string',
        'amount' => 'number',
        'currency' => 'string',
        'created' => 'range',
        'updated' => 'range',
        'limit' => 'limit',
        'before_id' => 'string',
    ];

    private const MAX_TRANSACTIONS_PER_PAGE = 50;

    /** Statuses whose outcome is not a clear refusal even though they are 4xx. */
    private const INDETERMINATE_4XX = [408, 425, 429];

    public function __construct(
        private readonly ?string $secretKey,
        private readonly string $baseUrl,
        private readonly int $timeout,
        private readonly int $connectTimeout,
    ) {
        if ($timeout < 1 || $connectTimeout < 1) {
            throw new InvalidArgumentException('Xendit timeouts must be at least 1 second.');
        }
    }

    public static function fromConfig(array $config): self
    {
        return new self(
            secretKey: $config['secret_key'] ?? null,
            baseUrl: $config['base_url'] ?? 'https://api.xendit.co',
            timeout: (int) ($config['timeout'] ?? 20),
            connectTimeout: (int) ($config['connect_timeout'] ?? 5),
        );
    }

    /**
     * POST /v2/payouts. Returns the Payout object (status is normally ACCEPTED;
     * the final status arrives by webhook).
     *
     * On XenditUnknownOutcomeException retry with the SAME idempotency key and
     * the SAME params. Xendit replays the original payout instead of paying twice.
     */
    public function createPayout(
        string $idempotencyKey,
        string $referenceId,
        string $channelCode,
        string $accountNumber,
        string $holderName,
        int $amount,
        ?string $description = null,
    ): array {
        $idempotencyKey = $this->requireString('idempotencyKey', $idempotencyKey, 100);
        $referenceId = $this->requireString('referenceId', $referenceId, 255);
        $channelCode = $this->requireCode($channelCode);
        $accountNumber = $this->requireString('accountNumber', $accountNumber, 100);
        $holderName = $this->requireString('holderName', $holderName, 100);

        if ($amount < 1) {
            throw new InvalidArgumentException('Payout amount must be a positive integer IDR amount.');
        }

        $payload = [
            'reference_id' => $referenceId,
            'channel_code' => $channelCode,
            'channel_properties' => [
                'account_number' => $accountNumber,
                'account_holder_name' => $holderName,
            ],
            'amount' => $amount,
            'currency' => self::CURRENCY,
        ];

        $description = $description === null ? '' : trim($description);
        if ($description !== '') {
            $payload['description'] = $this->requireString('description', $description, 100);
        }

        $payout = $this->send(
            'POST',
            '/v2/payouts',
            ['json' => $payload],
            headers: ['Idempotency-key' => $idempotencyKey],
            retryConnectionErrors: false,
        );

        // Money may have moved; without an id we cannot tell which payout it is.
        return $this->requirePayoutObject('POST', '/v2/payouts', $payout);
    }

    /**
     * GET /v2/payouts/{id}. Manual status check when a webhook is missing.
     * Status / failure_code are returned as raw strings, including values the
     * SDK does not know (e.g. ACCOUNT_NAME_MISMATCH, COMPLIANCE_REJECTED).
     */
    public function getPayout(string $payoutId): array
    {
        $payoutId = $this->requireString('payoutId', $payoutId, 255);
        $path = '/v2/payouts/'.rawurlencode($payoutId);

        return $this->requirePayoutObject('GET', $path, $this->send('GET', $path));
    }

    /**
     * GET /v2/payouts?reference_id=... Payouts created with this reference id,
     * newest first. Used to reconcile when we never stored the payout id.
     *
     * @return list<array>
     */
    public function findPayoutsByReference(string $referenceId): array
    {
        $referenceId = $this->requireString('referenceId', $referenceId, 255);

        $body = $this->send('GET', '/v2/payouts', ['query' => Query::build(['reference_id' => $referenceId, 'limit' => 10])]);

        if (! isset($body['data']) || ! is_array($body['data'])) {
            throw $this->unknownOutcome('GET', '/v2/payouts', 200, 'Xendit payouts response has no "data" list.');
        }

        return array_values(array_filter($body['data'], fn ($p) => is_array($p) && is_string($p['id'] ?? null) && is_string($p['status'] ?? null)));
    }

    /**
     * GET /balance. Returns the balance of the given account type in IDR.
     */
    public function getBalance(string $accountType = self::BALANCE_CASH): int|float
    {
        $accountType = strtoupper(trim($accountType));

        if (! in_array($accountType, [self::BALANCE_CASH, self::BALANCE_HOLDING], true)) {
            throw new InvalidArgumentException('Balance account type must be CASH or HOLDING.');
        }

        $body = $this->send('GET', '/balance', ['query' => Query::build([
            'account_type' => $accountType,
            'currency' => self::CURRENCY,
        ])]);

        $balance = $body['balance'] ?? null;

        if (! is_int($balance) && ! is_float($balance)) {
            throw $this->unknownOutcome('GET', '/balance', 200, 'Xendit balance response has no numeric "balance".');
        }

        return $balance;
    }

    /**
     * GET /transactions, one page. $cursor is the `after_id` of the next page
     * (take it from the returned `next_cursor`).
     *
     * Filters: types[], statuses[], channel_categories[], reference_id, product_id,
     * account_identifier, amount, currency, created/updated (['gte' => .., 'lte' => ..],
     * DateTimeInterface or ISO-8601 string), limit (1-50, default 50), before_id.
     *
     * @return array{data: list<array>, has_more: bool, next_cursor: ?string}
     */
    public function listTransactions(?string $cursor = null, array $filters = []): array
    {
        $query = $this->buildTransactionQuery($filters);

        if ($cursor !== null) {
            $query['after_id'] = $this->requireString('cursor', $cursor, 255);
        }

        $body = $this->send('GET', '/transactions', ['query' => Query::build($query)]);

        if (! isset($body['data']) || ! is_array($body['data']) || ! array_is_list($body['data'])) {
            throw $this->unknownOutcome('GET', '/transactions', 200, 'Xendit transactions response has no "data" list.');
        }

        $data = array_values(array_filter($body['data'], 'is_array'));
        $hasMore = ($body['has_more'] ?? false) === true;
        $last = end($data);

        return [
            'data' => $data,
            'has_more' => $hasMore,
            'next_cursor' => $hasMore && is_array($last) && is_string($last['id'] ?? null) ? $last['id'] : null,
        ];
    }

    /**
     * GET /payouts_channels for IDR. Each item: channel_code, channel_category,
     * currency, channel_name, amount_limits{minimum, maximum, minimum_increment}.
     *
     * @return list<array>
     */
    public function listPayoutChannels(?string $channelCategory = 'BANK'): array
    {
        $query = ['currency' => self::CURRENCY];

        if ($channelCategory !== null) {
            $query['channel_category'] = $this->requireCode($channelCategory, 'channelCategory');
        }

        $body = $this->send('GET', '/payouts_channels', ['query' => Query::build($query)]);

        if (! array_is_list($body)) {
            throw $this->unknownOutcome('GET', '/payouts_channels', 200, 'Xendit payout channels response is not a list.');
        }

        return array_values(array_filter(
            $body,
            fn ($channel) => is_array($channel) && is_string($channel['channel_code'] ?? null),
        ));
    }

    /**
     * Sends the request and returns the decoded JSON body of a 2xx response.
     */
    private function send(
        string $method,
        string $path,
        array $options = [],
        array $headers = [],
        bool $retryConnectionErrors = true,
    ): array {
        $request = $this->http($method, $path)->withHeaders($headers);

        // Only reads are retried here. A write is retried by the caller with the
        // same idempotency key, so it can record the attempt first.
        if ($retryConnectionErrors) {
            $request->retry(2, 250, fn ($e) => $e instanceof ConnectionException, throw: false);
        }

        try {
            $response = $request->send($method, $path, $options);
        } catch (ConnectionException|TransferException $e) {
            throw $this->unknownOutcome($method, $path, null, 'Xendit request failed without a response: '.$e->getMessage(), $e);
        }

        if ($response->successful()) {
            $body = $response->json();

            if (! is_array($body)) {
                throw $this->unknownOutcome($method, $path, $response->status(), 'Xendit returned a 2xx response that is not a JSON object/array.');
            }

            return $body;
        }

        $status = $response->status();

        if ($response->clientError() && ! in_array($status, self::INDETERMINATE_4XX, true)) {
            throw $this->rejected($method, $path, $response);
        }

        throw $this->unknownOutcome($method, $path, $status, sprintf('Xendit responded %d; outcome unknown.', $status));
    }

    private function http(string $method, string $path): PendingRequest
    {
        $secretKey = trim((string) $this->secretKey);

        if ($secretKey === '') {
            throw new XenditRejectedException($method, $path, null, 'GATEWAY_NOT_CONFIGURED', 'XENDIT_SECRET_KEY is not set; no request was sent.');
        }

        return Http::baseUrl(rtrim($this->baseUrl, '/'))
            ->withBasicAuth($secretKey, '')
            ->acceptJson()
            ->asJson()
            ->timeout($this->timeout)
            ->connectTimeout($this->connectTimeout)
            ->withOptions(['allow_redirects' => false]);
    }

    private function rejected(string $method, string $path, Response $response): XenditRejectedException
    {
        $body = $response->json();
        $body = is_array($body) ? $body : [];

        $errorCode = is_string($body['error_code'] ?? null) && $body['error_code'] !== ''
            ? $body['error_code']
            : 'HTTP_'.$response->status();

        $message = is_string($body['message'] ?? null) && $body['message'] !== ''
            ? $body['message']
            : 'Request rejected by Xendit.';

        return new XenditRejectedException($method, $path, $response->status(), $errorCode, $message, $body);
    }

    private function unknownOutcome(
        string $method,
        string $path,
        ?int $status,
        string $message,
        ?\Throwable $previous = null,
    ): XenditUnknownOutcomeException {
        // No request/response body here: it can hold account numbers and names.
        Log::warning('Xendit request outcome unknown', [
            'method' => $method,
            'path' => $path,
            'http_status' => $status,
            'reason' => $message,
        ]);

        return new XenditUnknownOutcomeException($message, $method, $path, $status, $previous);
    }

    private function requirePayoutObject(string $method, string $path, array $payout): array
    {
        if (! is_string($payout['id'] ?? null) || $payout['id'] === '' || ! is_string($payout['status'] ?? null)) {
            throw $this->unknownOutcome($method, $path, 200, 'Xendit payout response has no "id"/"status".');
        }

        return $payout;
    }

    private function buildTransactionQuery(array $filters): array
    {
        $unknown = array_diff(array_keys($filters), array_keys(self::TRANSACTION_FILTERS));

        if ($unknown !== []) {
            throw new InvalidArgumentException('Unknown Xendit transaction filter(s): '.implode(', ', $unknown));
        }

        $query = ['limit' => self::MAX_TRANSACTIONS_PER_PAGE];

        foreach ($filters as $name => $value) {
            if ($value === null) {
                continue;
            }

            switch (self::TRANSACTION_FILTERS[$name]) {
                case 'list':
                    $values = array_map(fn ($v) => $this->requireCode((string) $v, $name), array_values((array) $value));
                    if ($values !== []) {
                        $query[$name] = $values; // repeated key: types=A&types=B
                    }
                    break;

                case 'string':
                    $query[$name] = $this->requireString($name, (string) $value, 255);
                    break;

                case 'number':
                    if (! is_int($value) && ! is_float($value)) {
                        throw new InvalidArgumentException("Transaction filter \"{$name}\" must be a number.");
                    }
                    $query[$name] = $value;
                    break;

                case 'limit':
                    if (! is_int($value) || $value < 1 || $value > self::MAX_TRANSACTIONS_PER_PAGE) {
                        throw new InvalidArgumentException('Transaction filter "limit" must be an integer from 1 to 50.');
                    }
                    $query['limit'] = $value;
                    break;

                case 'range':
                    if (! is_array($value) || array_diff(array_keys($value), ['gte', 'lte']) !== []) {
                        throw new InvalidArgumentException("Transaction filter \"{$name}\" must be ['gte' => .., 'lte' => ..].");
                    }
                    foreach ($value as $bound => $time) {
                        if ($time !== null) {
                            $query["{$name}[{$bound}]"] = $this->formatTimestamp($name, $time);
                        }
                    }
                    break;
            }
        }

        return $query;
    }

    private function formatTimestamp(string $name, mixed $time): string
    {
        if ($time instanceof DateTimeInterface) {
            return \DateTimeImmutable::createFromInterface($time)
                ->setTimezone(new DateTimeZone('UTC'))
                ->format('Y-m-d\TH:i:s.v\Z');
        }

        if (is_string($time) && trim($time) !== '') {
            return trim($time);
        }

        throw new InvalidArgumentException("Transaction filter \"{$name}\" bounds must be DateTimeInterface or ISO-8601 strings.");
    }

    private function requireString(string $name, string $value, int $maxLength): string
    {
        $value = trim($value);

        if ($value === '' || mb_strlen($value) > $maxLength) {
            throw new InvalidArgumentException("\"{$name}\" must be 1-{$maxLength} characters.");
        }

        return $value;
    }

    private function requireCode(string $value, string $name = 'channelCode'): string
    {
        $value = strtoupper(trim($value));

        if (preg_match('/^[A-Z0-9_]{1,64}$/', $value) !== 1) {
            throw new InvalidArgumentException("\"{$name}\" must contain only A-Z, 0-9 and _.");
        }

        return $value;
    }
}
