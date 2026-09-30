<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Models\XenditWebhookEvent;
use App\Notifications\WithdrawalFailed;
use App\Notifications\WithdrawalSucceeded;
use App\Services\Withdrawal\WithdrawalService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Notification::fake();
    config(['xendit.callback_token' => 'cb-token']);
});

/** A processing Withdrawal: 105.000 already left a Wallet that now holds 895.000. */
function processingWithdrawal(array $overrides = []): Withdrawal
{
    $user = User::forceCreate(['name' => 'Siti', 'email' => uniqid('wh').'@example.com', 'password' => 'x', 'phone' => '0812', 'email_verified_at' => now()]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));
    Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => '895000.00']);
    $account = UserBankAccount::forceCreate(['user_id' => $user->id, 'bank_code' => 'ID_BNI', 'account_number' => '0231445578', 'account_holder_name' => 'Siti']);

    $w = Withdrawal::forceCreate(array_merge([
        'user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-'.uniqid(),
        'amount' => 100000, 'fee' => 5000, 'status' => 'processing', 'xendit_id' => 'disb-'.uniqid(), 'payout_status' => 'ACCEPTED',
        'approved_at' => now(),
    ], $overrides));
    WalletTransaction::create(['user_id' => $user->id, 'type' => 'WITHDRAW', 'amount' => 105000, 'reference_type' => Withdrawal::class, 'reference_id' => $w->id]);

    return $w;
}

function payoutWebhook(Withdrawal $w, string $status, array $extra = [], ?string $webhookId = null, string $token = 'cb-token', bool $envelope = true)
{
    $payout = array_merge([
        'id' => $w->xendit_id, 'reference_id' => $w->external_id, 'status' => $status,
        'amount' => $w->amount, 'currency' => 'IDR', 'channel_code' => 'ID_BNI',
    ], $extra);
    $body = $envelope ? ['event' => 'payout.'.strtolower($status), 'business_id' => 'biz', 'created' => now()->toIso8601String(), 'data' => $payout] : $payout;

    return test()->postJson(route('xendit.webhook.payout'), $body, array_filter([
        'x-callback-token' => $token,
        'webhook-id' => $webhookId ?? uniqid('wh-'),
    ]));
}

function balanceNow(Withdrawal $w): int
{
    return (int) floor((float) Wallet::where('user_id', $w->user_id)->value('balance'));
}

function refundsOf(Withdrawal $w): int
{
    return WalletTransaction::where(['type' => 'WITHDRAW_REFUND', 'reference_id' => $w->id])->count();
}

it('marks the withdrawal succeeded on payout.succeeded and emails the user', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'SUCCEEDED')->assertOk()->assertJson(['result' => 'applied']);

    $w->refresh();
    expect($w->status)->toBe('succeeded')
        ->and($w->payout_status)->toBe('SUCCEEDED')
        ->and($w->processed_at)->not->toBeNull()
        ->and(balanceNow($w))->toBe(895000)
        ->and(refundsOf($w))->toBe(0);
    Notification::assertSentTo($w->user, WithdrawalSucceeded::class);
});

it('fails and refunds amount + fee on payout.failed, CANCELLED or COMPLIANCE_REJECTED', function (string $status) {
    $w = processingWithdrawal();

    payoutWebhook($w, $status, ['failure_code' => 'INVALID_DESTINATION'])->assertOk();

    $w->refresh();
    expect($w->status)->toBe('failed')
        ->and($w->failure_code)->toBe('INVALID_DESTINATION')
        ->and($w->payout_status)->toBe($status)
        ->and($w->refunded_at)->not->toBeNull()
        ->and(balanceNow($w))->toBe(1000000)
        ->and(refundsOf($w))->toBe(1);
    Notification::assertSentTo($w->user, WithdrawalFailed::class);
})->with(['FAILED', 'CANCELLED', 'COMPLIANCE_REJECTED']);

it('reverses and refunds a succeeded withdrawal on payout.reversed', function () {
    $w = processingWithdrawal();
    payoutWebhook($w, 'SUCCEEDED')->assertOk();

    payoutWebhook($w, 'REVERSED')->assertOk()->assertJson(['result' => 'applied']);

    $w->refresh();
    expect($w->status)->toBe('reversed')
        ->and(balanceNow($w))->toBe(1000000)
        ->and(refundsOf($w))->toBe(1);
    Notification::assertSentTo($w->user, WithdrawalFailed::class);
});

it('treats a replay of the same webhook-id as a no-op', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'FAILED', ['failure_code' => 'TRANSFER_ERROR'], 'wh-same')->assertOk()->assertJson(['result' => 'applied']);
    payoutWebhook($w, 'FAILED', ['failure_code' => 'TRANSFER_ERROR'], 'wh-same')->assertOk()->assertJson(['message' => 'Duplicate: already processed']);

    expect(refundsOf($w))->toBe(1)
        ->and(balanceNow($w))->toBe(1000000)
        ->and(XenditWebhookEvent::count())->toBe(1);
    Notification::assertSentToTimes($w->user, WithdrawalFailed::class, 1);
});

it('never refunds twice even when the same failure arrives with a new webhook-id', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'FAILED')->assertOk();
    payoutWebhook($w, 'FAILED')->assertOk()->assertJson(['result' => 'ignored']);
    payoutWebhook($w, 'REVERSED')->assertOk()->assertJson(['result' => 'ignored']);

    expect(refundsOf($w))->toBe(1)->and(balanceNow($w))->toBe(1000000);
});

it('ignores a late failed after succeeded (out of order)', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'SUCCEEDED')->assertOk();
    payoutWebhook($w, 'FAILED', ['failure_code' => 'TRANSFER_ERROR'])->assertOk()->assertJson(['result' => 'ignored']);

    expect($w->fresh()->status)->toBe('succeeded')->and(refundsOf($w))->toBe(0);
});

it('ignores a late succeeded after failed (out of order)', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'FAILED')->assertOk();
    payoutWebhook($w, 'SUCCEEDED')->assertOk()->assertJson(['result' => 'ignored']);

    expect($w->fresh()->status)->toBe('failed')->and(refundsOf($w))->toBe(1);
});

it('keeps non-final statuses as information only', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'REQUESTED')->assertOk()->assertJson(['result' => 'ignored']);

    expect($w->fresh()->status)->toBe('processing')->and($w->fresh()->payout_status)->toBe('REQUESTED');
});

it('accepts the payout without the data envelope and fills a missing payout id', function () {
    $w = processingWithdrawal(['xendit_id' => null]);

    test()->postJson(route('xendit.webhook.payout'), [
        'id' => 'disb-late', 'reference_id' => $w->external_id, 'status' => 'SUCCEEDED',
    ], ['x-callback-token' => 'cb-token', 'webhook-id' => 'wh-bare'])->assertOk();

    expect($w->fresh()->status)->toBe('succeeded')->and($w->fresh()->xendit_id)->toBe('disb-late');
});

it('ignores a result for a different payout id than the stored one', function () {
    $w = processingWithdrawal(['xendit_id' => 'disb-original']);

    payoutWebhook($w, 'FAILED', ['id' => 'disb-other'])->assertOk()->assertJson(['result' => 'ignored']);

    expect($w->fresh()->status)->toBe('processing')->and(refundsOf($w))->toBe(0);
});

it('rejects a wrong, missing or unconfigured token with 401 and stores nothing', function (?string $token, string $configured) {
    config(['xendit.callback_token' => $configured]);
    $w = processingWithdrawal();

    payoutWebhook($w, 'FAILED', [], null, (string) $token)->assertUnauthorized();

    expect($w->fresh()->status)->toBe('processing')
        ->and(XenditWebhookEvent::count())->toBe(0);
})->with([
    'wrong' => ['nope', 'cb-token'],
    'missing' => ['', 'cb-token'],
    'not configured' => ['', ''],
]);

it('acknowledges an unknown reference and records it', function () {
    $this->postJson(route('xendit.webhook.payout'), ['event' => 'payout.succeeded', 'data' => ['id' => 'disb-x', 'reference_id' => 'CO-123', 'status' => 'SUCCEEDED']], [
        'x-callback-token' => 'cb-token', 'webhook-id' => 'wh-unknown',
    ])->assertOk()->assertJson(['result' => 'unknown_reference']);

    expect(XenditWebhookEvent::sole()->result)->toBe('unknown_reference');
});

it('answers 500 when processing fails so Xendit retries, then processes the retry', function () {
    $w = processingWithdrawal();
    $this->mock(WithdrawalService::class)->shouldReceive('applyPayoutResult')->once()->andThrow(new RuntimeException('db hiccup'));

    payoutWebhook($w, 'SUCCEEDED', [], 'wh-retry')->assertStatus(500);
    expect(XenditWebhookEvent::sole()->processed_at)->toBeNull();

    $this->app->forgetInstance(WithdrawalService::class);
    $this->instance(WithdrawalService::class, $this->app->build(WithdrawalService::class));

    payoutWebhook($w, 'SUCCEEDED', [], 'wh-retry')->assertOk()->assertJson(['result' => 'applied']);
    expect(XenditWebhookEvent::sole()->attempts)->toBe(2)
        ->and($w->fresh()->status)->toBe('succeeded');
});

it('does not need a session or CSRF token', function () {
    $w = processingWithdrawal();

    payoutWebhook($w, 'SUCCEEDED')->assertOk()->assertCookieMissing(config('session.cookie'));
});

it('D2: checks the status at Xendit by payout id and applies it', function () {
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    $w = processingWithdrawal(['xendit_id' => 'disb-d2']);
    Http::fake(['api.xendit.co/v2/payouts/disb-d2' => Http::response([
        'id' => 'disb-d2', 'reference_id' => $w->external_id, 'status' => 'FAILED', 'failure_code' => 'ACCOUNT_NAME_MISMATCH',
    ])]);

    $this->actingAs($admin)->post(route('admin.user-withdrawals.check-status', $w))->assertSessionHas('success');
    $this->actingAs($admin)->post(route('admin.user-withdrawals.check-status', $w))->assertSessionHas('error');

    expect($w->fresh()->status)->toBe('failed')
        ->and($w->fresh()->failure_code)->toBe('ACCOUNT_NAME_MISMATCH')
        ->and(refundsOf($w))->toBe(1);
    Http::assertSentCount(1);
});

it('D2: finds the payout by reference when no payout id was stored', function () {
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    $w = processingWithdrawal(['xendit_id' => null]);
    Http::fake(['api.xendit.co/v2/payouts?*' => Http::response(['data' => [
        ['id' => 'disb-found', 'reference_id' => $w->external_id, 'status' => 'SUCCEEDED'],
    ], 'has_more' => false])]);

    $this->actingAs($admin)->post(route('admin.user-withdrawals.check-status', $w))->assertSessionHas('success');

    expect($w->fresh()->status)->toBe('succeeded')->and($w->fresh()->xendit_id)->toBe('disb-found');
    Http::assertSent(fn (Request $r) => str_contains($r->url(), 'reference_id='.$w->external_id));
});

it('D2: reports when Xendit has no payout yet, and keeps the withdrawal as is', function () {
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    $w = processingWithdrawal(['xendit_id' => null]);
    Http::fake(['api.xendit.co/v2/payouts?*' => Http::response(['data' => [], 'has_more' => false])]);

    $this->actingAs($admin)->post(route('admin.user-withdrawals.check-status', $w))->assertSessionHas('warning');

    expect($w->fresh()->status)->toBe('processing')->and(refundsOf($w))->toBe(0);
});

it('D2: a Xendit outage changes nothing', function () {
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    $w = processingWithdrawal();
    Http::fake(fn () => Http::response('', 503));

    $this->actingAs($admin)->post(route('admin.user-withdrawals.check-status', $w))->assertSessionHas('warning');

    expect($w->fresh()->status)->toBe('processing');
});

it('shows each withdrawal status and reason on the user Wallet page', function () {
    fakeBankChannels();
    $w = processingWithdrawal();
    payoutWebhook($w, 'FAILED', ['failure_code' => 'ACCOUNT_NAME_MISMATCH'])->assertOk();

    $this->withoutVite()->actingAs($w->user)->get(route('user.wallet'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('history.0.kind', 'refund')
            ->where('history.0.subtitle', 'Nama rekening tidak cocok dengan data bank')
            ->where('history.0.fix_account', true)
            ->where('history.1.kind', 'withdraw')
            ->where('history.1.status', ['label' => 'Gagal · saldo kembali', 'tone' => 'danger']));
});
