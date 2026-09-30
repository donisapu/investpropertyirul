<?php

use App\Services\Xendit\Exceptions\XenditRejectedException;
use App\Services\Xendit\Exceptions\XenditUnknownOutcomeException;
use App\Services\Xendit\XenditGateway;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    Http::preventStrayRequests();

    config([
        'xendit.secret_key' => 'xnd_development_test_key',
        'xendit.base_url' => 'https://api.xendit.co',
        'xendit.timeout' => 17,
        'xendit.connect_timeout' => 4,
    ]);
});

function gateway(): XenditGateway
{
    return app(XenditGateway::class);
}

function acceptedPayout(array $overrides = []): array
{
    return array_merge([
        'id' => 'disb-1a2b3c',
        'reference_id' => 'WD-100',
        'amount' => 150000,
        'channel_code' => 'ID_BCA',
        'currency' => 'IDR',
        'status' => 'ACCEPTED',
    ], $overrides);
}

function createTestPayout(): array
{
    return gateway()->createPayout(
        idempotencyKey: 'WD-100',
        referenceId: 'WD-100',
        channelCode: 'ID_BCA',
        accountNumber: '1234567890',
        holderName: 'Budi Santoso',
        amount: 150000,
        description: 'Withdrawal WD-100',
    );
}

it('creates a payout through Http::fake with auth, idempotency key, integer IDR amount and timeouts', function () {
    $options = null;

    Http::fake([
        'api.xendit.co/v2/payouts' => function (Request $request, array $requestOptions) use (&$options) {
            $options = $requestOptions;

            return Http::response(acceptedPayout());
        },
    ]);

    $payout = createTestPayout();

    expect($payout)->toBe(acceptedPayout());

    Http::assertSentCount(1);
    Http::assertSent(function (Request $request) {
        return $request->method() === 'POST'
            && $request->url() === 'https://api.xendit.co/v2/payouts'
            && $request->header('Authorization')[0] === 'Basic '.base64_encode('xnd_development_test_key:')
            && $request->header('Idempotency-key')[0] === 'WD-100'
            && $request->body() === json_encode([
                'reference_id' => 'WD-100',
                'channel_code' => 'ID_BCA',
                'channel_properties' => [
                    'account_number' => '1234567890',
                    'account_holder_name' => 'Budi Santoso',
                ],
                'amount' => 150000,
                'currency' => 'IDR',
                'description' => 'Withdrawal WD-100',
            ]);
    });

    expect($options['timeout'])->toBe(17)
        ->and($options['connect_timeout'])->toBe(4)
        ->and($options['allow_redirects'])->toBeFalse();
});

it('omits a blank description', function () {
    Http::fake(['api.xendit.co/v2/payouts' => Http::response(acceptedPayout())]);

    gateway()->createPayout('WD-1', 'WD-1', 'id_bca', '123', 'Budi', 10000, '   ');

    Http::assertSent(fn (Request $request) => ! array_key_exists('description', $request->data())
        && $request->data()['channel_code'] === 'ID_BCA');
});

it('raises a rejected error with the Xendit error_code on a clear 4xx', function (int $status, string $errorCode) {
    Http::fake(['api.xendit.co/v2/payouts' => Http::response([
        'error_code' => $errorCode,
        'message' => 'Nope',
    ], $status)]);

    try {
        createTestPayout();
        $this->fail('Expected XenditRejectedException');
    } catch (XenditRejectedException $e) {
        expect($e->httpStatus)->toBe($status)
            ->and($e->errorCode)->toBe($errorCode)
            ->and($e->errorMessage)->toBe('Nope')
            ->and($e->is($errorCode))->toBeTrue()
            ->and($e->body)->toBe(['error_code' => $errorCode, 'message' => 'Nope']);
    }
})->with([
    'duplicate' => [400, 'DUPLICATE_ERROR'],
    'channel not supported' => [400, 'CHANNEL_CODE_NOT_SUPPORTED'],
    'invalid key' => [401, 'INVALID_API_KEY'],
    'forbidden' => [403, 'REQUEST_FORBIDDEN_ERROR'],
    'not found' => [404, 'DATA_NOT_FOUND'],
]);

it('falls back to HTTP_<status> when a 4xx body has no error_code', function () {
    Http::fake(['api.xendit.co/v2/payouts' => Http::response('<html>Bad Request</html>', 400)]);

    expect(fn () => createTestPayout())->toThrow(
        fn (XenditRejectedException $e) => expect($e->errorCode)->toBe('HTTP_400')
    );
});

it('treats 5xx, 408 and 429 as unknown outcome, never as rejected', function (int $status) {
    Http::fake(['api.xendit.co/v2/payouts' => Http::response(['error_code' => 'SERVER_ERROR'], $status)]);

    expect(fn () => createTestPayout())->toThrow(
        fn (XenditUnknownOutcomeException $e) => expect($e->httpStatus)->toBe($status)
    );
})->with([500, 502, 503, 504, 408, 429]);

it('treats a timeout as unknown outcome and does not retry the payout itself', function () {
    $calls = 0;
    Http::fake(function () use (&$calls) {
        $calls++;

        throw new ConnectionException('cURL error 28: Operation timed out');
    });

    expect(fn () => createTestPayout())->toThrow(
        fn (XenditUnknownOutcomeException $e) => expect($e->httpStatus)->toBeNull()
            ->and($e->getPrevious())->toBeInstanceOf(ConnectionException::class)
    );

    // A second attempt belongs to the caller, with the same idempotency key.
    expect($calls)->toBe(1);
});

it('treats a 2xx payout response without id/status as unknown outcome', function (mixed $body) {
    Http::fake(['api.xendit.co/v2/payouts' => Http::response($body)]);

    expect(fn () => createTestPayout())->toThrow(XenditUnknownOutcomeException::class);
})->with([
    'no id' => [['status' => 'ACCEPTED']],
    'empty body' => [''],
    'not json' => ['OK'],
]);

it('rejects invalid payout input before sending anything', function (array $args) {
    Http::fake();

    $defaults = [
        'idempotencyKey' => 'WD-1',
        'referenceId' => 'WD-1',
        'channelCode' => 'ID_BCA',
        'accountNumber' => '123',
        'holderName' => 'Budi',
        'amount' => 10000,
        'description' => null,
    ];

    expect(fn () => gateway()->createPayout(...array_merge($defaults, $args)))
        ->toThrow(InvalidArgumentException::class);

    Http::assertNothingSent();
})->with([
    'zero amount' => [['amount' => 0]],
    'negative amount' => [['amount' => -5]],
    'blank holder name' => [['holderName' => '  ']],
    'blank account number' => [['accountNumber' => '']],
    'blank idempotency key' => [['idempotencyKey' => '']],
    'idempotency key too long' => [['idempotencyKey' => str_repeat('a', 101)]],
    'bad channel code' => [['channelCode' => 'ID BCA; DROP']],
    'description too long' => [['description' => str_repeat('a', 101)]],
]);

it('refuses to call Xendit when the secret key is missing', function () {
    config(['xendit.secret_key' => '']);
    Http::fake();

    expect(fn () => gateway()->getBalance())->toThrow(
        fn (XenditRejectedException $e) => expect($e->errorCode)->toBe('GATEWAY_NOT_CONFIGURED')
            ->and($e->httpStatus)->toBeNull()
    );

    Http::assertNothingSent();
});

it('gets a payout and keeps statuses and failure codes the SDK does not know', function () {
    Http::fake(['api.xendit.co/v2/payouts/disb-1a2b3c' => Http::response(acceptedPayout([
        'status' => 'FAILED',
        'failure_code' => 'ACCOUNT_NAME_MISMATCH',
    ]))]);

    $payout = gateway()->getPayout('disb-1a2b3c');

    expect($payout['status'])->toBe('FAILED')
        ->and($payout['failure_code'])->toBe('ACCOUNT_NAME_MISMATCH');

    Http::assertSent(fn (Request $request) => $request->method() === 'GET');
});

it('url-encodes the payout id', function () {
    Http::fake(['*' => Http::response(acceptedPayout())]);

    gateway()->getPayout('disb/../balance');

    Http::assertSent(fn (Request $request) => $request->url() === 'https://api.xendit.co/v2/payouts/disb%2F..%2Fbalance');
});

it('retries a read once on a connection error', function () {
    $calls = 0;
    Http::fake(function () use (&$calls) {
        if (++$calls === 1) {
            throw new ConnectionException('Connection refused');
        }

        return Http::response(['balance' => 1000]);
    });

    expect(gateway()->getBalance())->toBe(1000)
        ->and($calls)->toBe(2);
});

it('retries a read on a connection error, then gives up with unknown outcome', function () {
    $calls = 0;
    Http::fake(function () use (&$calls) {
        $calls++;

        throw new ConnectionException('Connection refused');
    });

    expect(fn () => gateway()->getBalance())->toThrow(XenditUnknownOutcomeException::class)
        ->and($calls)->toBe(2);
});

it('reads CASH and HOLDING balances', function () {
    Http::fake([
        'api.xendit.co/balance?account_type=CASH*' => Http::response(['balance' => 2500000]),
        'api.xendit.co/balance?account_type=HOLDING*' => Http::response(['balance' => 1250.5]),
    ]);

    expect(gateway()->getBalance(XenditGateway::BALANCE_CASH))->toBe(2500000)
        ->and(gateway()->getBalance('holding'))->toBe(1250.5);

    Http::assertSent(fn (Request $request) => $request->url() === 'https://api.xendit.co/balance?account_type=CASH&currency=IDR');
});

it('rejects an unsupported balance type and a non-numeric balance', function () {
    Http::fake(['*' => Http::response(['balance' => 'lots'])]);

    expect(fn () => gateway()->getBalance('TAX'))->toThrow(InvalidArgumentException::class)
        ->and(fn () => gateway()->getBalance())->toThrow(XenditUnknownOutcomeException::class);
});

it('lists transactions with Xendit query encoding and returns the next cursor', function () {
    Http::fake(['api.xendit.co/transactions*' => Http::response([
        'has_more' => true,
        'data' => [
            ['id' => 'txn_1', 'type' => 'PAYMENT', 'status' => 'SUCCESS'],
            ['id' => 'txn_2', 'type' => 'DISBURSEMENT', 'status' => 'SOME_NEW_STATUS'],
        ],
        'links' => [],
    ])]);

    $page = gateway()->listTransactions('txn_0', [
        'types' => ['PAYMENT', 'DISBURSEMENT'],
        'statuses' => ['SUCCESS'],
        'created' => ['gte' => new DateTimeImmutable('2026-09-01 07:00:00', new DateTimeZone('Asia/Jakarta'))],
        'limit' => 20,
    ]);

    expect($page['has_more'])->toBeTrue()
        ->and($page['next_cursor'])->toBe('txn_2')
        ->and($page['data'])->toHaveCount(2)
        ->and($page['data'][1]['status'])->toBe('SOME_NEW_STATUS');

    Http::assertSent(fn (Request $request) => $request->url() === 'https://api.xendit.co/transactions?'
        .'limit=20&types=PAYMENT&types=DISBURSEMENT&statuses=SUCCESS'
        .'&created%5Bgte%5D=2026-09-01T00%3A00%3A00.000Z&after_id=txn_0');
});

it('returns no cursor on the last transactions page', function () {
    Http::fake(['*' => Http::response(['has_more' => false, 'data' => [['id' => 'txn_9']]])]);

    expect(gateway()->listTransactions())->toBe([
        'data' => [['id' => 'txn_9']],
        'has_more' => false,
        'next_cursor' => null,
    ]);

    Http::assertSent(fn (Request $request) => $request->url() === 'https://api.xendit.co/transactions?limit=50');
});

it('rejects unknown or invalid transaction filters', function (array $filters) {
    Http::fake();

    expect(fn () => gateway()->listTransactions(null, $filters))->toThrow(InvalidArgumentException::class);

    Http::assertNothingSent();
})->with([
    'typo' => [['type' => ['PAYMENT']]],
    'limit too high' => [['limit' => 51]],
    'bad range key' => [['created' => ['from' => '2026-01-01']]],
]);

it('lists IDR bank payout channels', function () {
    $channels = [
        ['channel_code' => 'ID_BCA', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Central Asia (BCA)',
            'amount_limits' => ['minimum' => 1, 'maximum' => 999999999, 'minimum_increment' => 1]],
        ['channel_code' => 'ID_BSI', 'channel_category' => 'BANK', 'currency' => 'IDR', 'channel_name' => 'Bank Syariah Indonesia',
            'amount_limits' => ['minimum' => 10000, 'maximum' => 1999999999999, 'minimum_increment' => 1]],
    ];

    Http::fake(['api.xendit.co/payouts_channels*' => Http::response($channels)]);

    expect(gateway()->listPayoutChannels())->toBe($channels);

    Http::assertSent(fn (Request $request) => $request->url() === 'https://api.xendit.co/payouts_channels?currency=IDR&channel_category=BANK');
});
