<?php

use App\Models\Role;
use App\Models\User;
use App\Models\UserBankAccount;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Models\Withdrawal;
use App\Notifications\WithdrawalApproved;
use App\Notifications\WithdrawalFailed;
use App\Notifications\WithdrawalRejected;
use App\Services\Withdrawal\AccountNameMatch;
use App\Services\Withdrawal\WithdrawalService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    Notification::fake();
    $this->admin = adminUser();
});

function adminUser(): User
{
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('adm').'@example.com', 'password' => bcrypt('x'), 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));

    return $admin;
}

/** A pending Withdrawal whose amount + fee was already taken from a 1.000.000 Wallet. */
function pendingWithdrawal(array $overrides = [], string $holder = 'Siti Rahma', string $userName = 'Siti Rahma'): Withdrawal
{
    $user = User::forceCreate(['name' => $userName, 'email' => uniqid('u').'@example.com', 'password' => bcrypt('x'), 'email_verified_at' => now()]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));
    Wallet::updateOrCreate(['user_id' => $user->id], ['balance' => '895000.00']);
    $account = UserBankAccount::forceCreate([
        'user_id' => $user->id, 'bank_code' => 'ID_BNI', 'account_number' => '0231445578', 'account_holder_name' => $holder,
    ]);

    return Withdrawal::forceCreate(array_merge([
        'user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-'.uniqid(),
        'amount' => 100000, 'fee' => 5000, 'status' => 'pending',
    ], $overrides));
}

function walletBalance(Withdrawal $w): int
{
    return (int) floor((float) Wallet::where('user_id', $w->user_id)->value('balance'));
}

function fakePayoutResponse($response): void
{
    Http::fake(['api.xendit.co/v2/payouts' => $response]);
}

function approve(Withdrawal $w)
{
    return test()->actingAs(test()->admin)->post(route('admin.user-withdrawals.approve', $w), ['tab' => 'pending']);
}

it('approves: moves to processing, sends one payout with the external_id as idempotency key, emails the user', function () {
    $w = pendingWithdrawal();
    fakePayoutResponse(Http::response(['id' => 'disb-123', 'status' => 'ACCEPTED', 'reference_id' => $w->external_id]));

    approve($w)
        ->assertRedirect(route('admin.user-withdrawals', ['tab' => 'pending', 'id' => $w->id]))
        ->assertSessionHas('success');

    $w->refresh();
    expect($w->status)->toBe('processing')
        ->and($w->xendit_id)->toBe('disb-123')
        ->and($w->payout_status)->toBe('ACCEPTED')
        ->and($w->approved_by)->toBe($this->admin->id)
        ->and($w->approved_at)->not->toBeNull()
        ->and($w->refunded_at)->toBeNull()
        ->and(walletBalance($w))->toBe(895000);

    Http::assertSentCount(1);
    Http::assertSent(fn (Request $r) => $r->header('Idempotency-key')[0] === $w->external_id
        && $r['reference_id'] === $w->external_id
        && $r['channel_code'] === 'ID_BNI'
        && $r['amount'] === 100000
        && $r['channel_properties']['account_number'] === '0231445578'
        && $r['channel_properties']['account_holder_name'] === 'Siti Rahma'
        && $r['description'] === WithdrawalService::PAYOUT_DESCRIPTION);

    Notification::assertSentTo($w->user, WithdrawalApproved::class);
});

it('fails and refunds amount + fee on a clear 4xx from Xendit', function () {
    $w = pendingWithdrawal();
    fakePayoutResponse(Http::response(['error_code' => 'CHANNEL_CODE_NOT_SUPPORTED', 'message' => 'nope'], 400));

    approve($w)->assertSessionHas('error');

    $w->refresh();
    $refund = WalletTransaction::where('type', 'WITHDRAW_REFUND')->sole();

    expect($w->status)->toBe('failed')
        ->and($w->failure_code)->toBe('CHANNEL_CODE_NOT_SUPPORTED')
        ->and($w->refunded_at)->not->toBeNull()
        ->and(walletBalance($w))->toBe(1000000)
        ->and((int) $refund->amount)->toBe(105000)
        ->and($refund->reference_id)->toBe($w->id);

    // The user hears about the refund, not "approved and on its way".
    Notification::assertSentToTimes($w->user, WithdrawalFailed::class, 1);
    Notification::assertNotSentTo($w->user, WithdrawalApproved::class);
});

it('stays processing without refund when the result is unknown', function (Closure $response) {
    $w = pendingWithdrawal();
    Http::fake(['api.xendit.co/v2/payouts' => $response]);

    approve($w)->assertSessionHas('warning');

    $w->refresh();
    expect($w->status)->toBe('processing')
        ->and($w->xendit_id)->toBeNull()
        ->and($w->refunded_at)->toBeNull()
        ->and(walletBalance($w))->toBe(895000)
        ->and(WalletTransaction::where('type', 'WITHDRAW_REFUND')->count())->toBe(0);
})->with([
    'timeout' => [fn () => throw new ConnectionException('cURL error 28: timed out')],
    '500' => [fn () => Http::response(['error_code' => 'SERVER_ERROR'], 500)],
    '503' => [fn () => Http::response('', 503)],
    'duplicate key, different payload' => [fn () => Http::response(['error_code' => 'DUPLICATE_ERROR', 'message' => 'dup'], 400)],
]);

it('can resend after an unknown result with the same idempotency key and payload', function () {
    $w = pendingWithdrawal();
    $bodies = [];
    $calls = 0;
    Http::fake(function (Request $r) use (&$bodies, &$calls) {
        $bodies[] = [$r->header('Idempotency-key')[0], $r->body()];
        if (++$calls === 1) {
            throw new ConnectionException('timed out');
        }

        return Http::response(['id' => 'disb-9', 'status' => 'ACCEPTED']);
    });

    approve($w)->assertSessionHas('warning');
    $this->actingAs($this->admin)->post(route('admin.user-withdrawals.resend', $w))->assertSessionHas('success');

    expect($w->fresh()->xendit_id)->toBe('disb-9')
        ->and($bodies)->toHaveCount(2)
        ->and($bodies[0])->toBe($bodies[1]);

    // Once the payout id is known, resend is refused.
    $this->actingAs($this->admin)->post(route('admin.user-withdrawals.resend', $w))->assertSessionHas('error');
    expect($calls)->toBe(2);
});

it('puts the withdrawal back in the queue when our Xendit setup is wrong', function (int $status, string $code) {
    $w = pendingWithdrawal();
    fakePayoutResponse(Http::response(['error_code' => $code], $status));

    approve($w)->assertSessionHas('error');

    $w->refresh();
    expect($w->status)->toBe('pending')
        ->and($w->approved_by)->toBeNull()
        ->and($w->refunded_at)->toBeNull()
        ->and(walletBalance($w))->toBe(895000);
    Notification::assertNothingSent();
})->with([[401, 'INVALID_API_KEY'], [403, 'REQUEST_FORBIDDEN_ERROR']]);

it('sends only one payout when approve is clicked twice', function () {
    $w = pendingWithdrawal();
    fakePayoutResponse(Http::response(['id' => 'disb-1', 'status' => 'ACCEPTED']));

    approve($w)->assertSessionHas('success');
    approve($w)->assertSessionHas('error');

    Http::assertSentCount(1);
    Notification::assertSentToTimes($w->user, WithdrawalApproved::class, 1);
});

it('rejects with a reason: refunds amount + fee once and emails the reason', function () {
    $w = pendingWithdrawal();
    Http::fake();

    $this->actingAs($this->admin)
        ->post(route('admin.user-withdrawals.reject', $w), ['failure_reason' => '  Nama rekening   tidak sama dengan nama akun. '])
        ->assertSessionHas('success');

    $w->refresh();
    expect($w->status)->toBe('rejected')
        ->and($w->failure_reason)->toBe('Nama rekening tidak sama dengan nama akun.')
        ->and($w->processed_at)->not->toBeNull()
        ->and(walletBalance($w))->toBe(1000000)
        ->and(WalletTransaction::where(['type' => 'WITHDRAW_REFUND', 'reference_id' => $w->id])->count())->toBe(1);

    Http::assertNothingSent();
    Notification::assertSentTo($w->user, WithdrawalRejected::class, function (WithdrawalRejected $n, array $channels, $notifiable) {
        return str_contains(implode("\n", $n->toMail($notifiable)->introLines), 'Nama rekening tidak sama dengan nama akun.');
    });

    // A second reject (double click) changes nothing.
    $this->actingAs($this->admin)->post(route('admin.user-withdrawals.reject', $w), ['failure_reason' => 'Lagi lagi'])->assertSessionHas('error');
    expect(walletBalance($w))->toBe(1000000)
        ->and(WalletTransaction::where('type', 'WITHDRAW_REFUND')->count())->toBe(1);
});

it('requires a reason to reject', function (string $reason) {
    $w = pendingWithdrawal();

    $this->actingAs($this->admin)->post(route('admin.user-withdrawals.reject', $w), ['failure_reason' => $reason])
        ->assertSessionHasErrors('failure_reason');

    expect($w->fresh()->status)->toBe('pending');
})->with(['', '   ', 'no']);

it('only rejects pending withdrawals', function (string $status) {
    $w = pendingWithdrawal(['status' => $status]);

    $this->actingAs($this->admin)->post(route('admin.user-withdrawals.reject', $w), ['failure_reason' => 'Tidak boleh'])
        ->assertSessionHas('error');

    expect($w->fresh()->status)->toBe($status)
        ->and(WalletTransaction::count())->toBe(0);
})->with(['processing', 'succeeded', 'failed', 'rejected']);

it('never refunds twice when a failure is applied again', function () {
    $w = pendingWithdrawal(['status' => 'processing', 'xendit_id' => 'disb-7']);
    $service = app(WithdrawalService::class);

    $service->markFailed($w, 'failed', 'ACCOUNT_NAME_MISMATCH');
    $service->markFailed($w, 'failed', 'ACCOUNT_NAME_MISMATCH');

    expect(walletBalance($w))->toBe(1000000)
        ->and(WalletTransaction::where('type', 'WITHDRAW_REFUND')->count())->toBe(1)
        ->and($w->fresh()->failure_code)->toBe('ACCOUNT_NAME_MISMATCH');
});

it('does not let a non-admin approve or reject', function () {
    $w = pendingWithdrawal();
    $user = $w->user;
    Http::fake();

    $this->actingAs($user)->post(route('admin.user-withdrawals.approve', $w))->assertForbidden();
    $this->actingAs($user)->post(route('admin.user-withdrawals.reject', $w), ['failure_reason' => 'Coba coba'])->assertForbidden();

    Http::assertNothingSent();
    expect($w->fresh()->status)->toBe('pending');
});

it('lists the queue by status tab, search and date, with the detail pane', function () {
    fakeBankChannels();
    $siti = pendingWithdrawal([], 'Siti Rahma', 'Siti Rahma');
    $rudi = pendingWithdrawal([], 'CV Maju Jaya', 'Rudi Hartono');
    $done = pendingWithdrawal(['status' => 'succeeded', 'xendit_id' => 'disb-done', 'payout_status' => 'SUCCEEDED']);
    $old = pendingWithdrawal();
    $old->forceFill(['created_at' => now()->subDays(40)])->save();

    $this->actingAs($this->admin)->get(route('admin.user-withdrawals'))
        ->assertOk()
        ->assertSee('Siti Rahma')->assertSee('Rudi Hartono')
        ->assertDontSee('disb-done');

    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['tab' => 'pending', 'q' => 'rudi hart']))
        ->assertOk()->assertSee('Rudi Hartono')->assertSee('Nama berbeda')->assertSee('CV Maju Jaya')
        ->assertDontSee($siti->external_id);

    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['tab' => 'pending', 'from' => now()->subDays(2)->toDateString()]))
        ->assertOk()->assertDontSee($old->external_id);

    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['tab' => 'done', 'id' => $done->id]))
        ->assertOk()->assertSee('disb-done')->assertSee('SUCCEEDED')->assertDontSee('Approve &amp; kirim', false);

    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['id' => $siti->id]))
        ->assertOk()->assertSee('Nama cocok')->assertSee('Approve &amp; kirim Rp 100.000', false);
});

it('rejects bad filter input', function () {
    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['tab' => 'nope', 'from' => '2026-13-40']))
        ->assertSessionHasErrors(['tab', 'from']);
});

it('matches names ignoring case, spacing and punctuation only', function () {
    expect(AccountNameMatch::matches('Siti Rahma', ' SITI  rahma. '))->toBeTrue()
        ->and(AccountNameMatch::matches('Rudi Hartono', 'CV Maju Jaya'))->toBeFalse()
        ->and(AccountNameMatch::matches('', ''))->toBeFalse();
});

it('confirms approve in a dialog that shows where the money goes, never with window.confirm', function () {
    fakeBankChannels();
    $same = pendingWithdrawal([], 'Siti Rahma', 'Siti Rahma');

    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['id' => $same->id]))
        ->assertOk()
        ->assertSee('data-confirm-dialog="#wd-approve-dialog"', false)
        ->assertSee('id="wd-approve-dialog"', false)
        ->assertSee('0231 4455 78')
        ->assertDontSee('class="form-check-input" data-confirm-ack', false)
        ->assertDontSee('window.confirm', false);

    // Name differs: the admin must tick the check before the send button unlocks.
    $other = pendingWithdrawal([], 'CV Maju Jaya', 'Rudi Hartono');
    $this->actingAs($this->admin)->get(route('admin.user-withdrawals', ['id' => $other->id]))
        ->assertOk()
        ->assertSee('class="form-check-input" data-confirm-ack', false)
        ->assertSee('Saya sudah memastikan rekening a.n CV Maju Jaya milik Rudi Hartono.');
});
