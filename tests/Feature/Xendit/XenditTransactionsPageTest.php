<?php

use App\Models\Role;
use App\Models\User;
use App\Models\XenditTransaction;
use App\Services\Xendit\TransactionMirror;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $this->admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
});

function seedTransactions(): void
{
    $m = app(TransactionMirror::class);
    $m->upsert(['id' => 'txn_in_1', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'SETTLED', 'amount' => 25000000,
        'reference_id' => 'INV-AAA', 'channel_code' => 'BCA', 'channel_category' => 'VIRTUAL_ACCOUNT', 'fee' => ['xendit_fee' => 4000, 'value_added_tax' => 440], 'created' => '2026-09-29T07:00:00Z', 'updated' => '2026-09-29T07:00:00Z']);
    $m->upsert(['id' => 'txn_in_2', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'settlement_status' => 'PENDING', 'amount' => 7500000,
        'reference_id' => 'INV-BBB', 'channel_code' => 'QRIS', 'channel_category' => 'QR_CODE', 'created' => '2026-09-20T07:00:00Z', 'updated' => '2026-09-20T07:00:00Z']);
    $m->upsert(['id' => 'txn_out_1', 'type' => 'DISBURSEMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_OUT', 'amount' => 5000000,
        'reference_id' => 'WD-CCC', 'channel_code' => 'ID_BNI', 'channel_category' => 'BANK', 'created' => '2026-09-28T07:00:00Z', 'updated' => '2026-09-28T07:00:00Z']);
}

it('lists the mirror with money in / out tabs, filters and the fee', function () {
    seedTransactions();

    $this->actingAs($this->admin)->get(route('admin.xendit-transactions'))
        ->assertOk()
        ->assertSee('INV-AAA')->assertSee('INV-BBB')->assertSee('WD-CCC')
        ->assertSee('fee Rp 4.440')->assertSee('Settled')->assertSee('Holding');

    $this->actingAs($this->admin)->get(route('admin.xendit-transactions', ['tab' => 'out']))
        ->assertOk()->assertSee('WD-CCC')->assertDontSee('INV-AAA');

    $this->actingAs($this->admin)->get(route('admin.xendit-transactions', ['from' => '2026-09-25', 'to' => '2026-09-30', 'type' => 'PAYMENT']))
        ->assertOk()->assertSee('INV-AAA')->assertDontSee('INV-BBB')->assertDontSee('WD-CCC');

    $this->actingAs($this->admin)->get(route('admin.xendit-transactions', ['settlement' => 'PENDING']))
        ->assertOk()->assertSee('INV-BBB')->assertDontSee('INV-AAA');

    $this->actingAs($this->admin)->get(route('admin.xendit-transactions', ['q' => 'txn_out']))
        ->assertOk()->assertSee('WD-CCC')->assertDontSee('INV-AAA');
});

it('finds transactions by the linked user name', function () {
    $user = User::forceCreate(['name' => 'Rina Kartika', 'email' => uniqid('r').'@example.com', 'password' => 'x']);
    $account = \App\Models\UserBankAccount::forceCreate(['user_id' => $user->id, 'bank_code' => 'ID_BCA', 'account_number' => '1', 'account_holder_name' => 'Rina']);
    \App\Models\Withdrawal::forceCreate(['user_id' => $user->id, 'user_bank_account_id' => $account->id, 'external_id' => 'WD-RINA', 'amount' => 1, 'fee' => 0, 'status' => 'succeeded']);
    seedTransactions();
    app(TransactionMirror::class)->upsert(['id' => 'txn_r1', 'type' => 'DISBURSEMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_OUT', 'amount' => 1, 'reference_id' => 'WD-RINA', 'created' => '2026-09-29T00:00:00Z', 'updated' => '2026-09-29T00:00:00Z']);

    $this->actingAs($this->admin)->get(route('admin.xendit-transactions', ['q' => 'rina']))
        ->assertOk()->assertSee('Rina Kartika')->assertSee('WD-RINA')->assertDontSee('INV-AAA');
});

it('exports the filtered list as a real xlsx', function () {
    seedTransactions();

    $response = $this->actingAs($this->admin)->get(route('admin.xendit-transactions.export', ['tab' => 'in']));

    $response->assertOk()->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    $file = $response->baseResponse->getFile()->getPathname();
    $zip = new ZipArchive;
    expect($zip->open($file))->toBeTrue();
    $sheet = $zip->getFromName('xl/worksheets/sheet1.xml');
    $zip->close();

    expect($sheet)->toContain('INV-AAA')->toContain('INV-BBB')->not->toContain('WD-CCC')
        ->and($sheet)->toContain('<v>25000000</v>')->toContain('<v>4440</v>')
        ->and(simplexml_load_string($sheet))->not->toBeFalse();
});

it('writes formula-looking text as plain text in the export', function () {
    app(TransactionMirror::class)->upsert(['id' => 'txn_evil', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'amount' => 1,
        'reference_id' => '=HYPERLINK("http://evil")', 'created' => '2026-09-29T00:00:00Z', 'updated' => '2026-09-29T00:00:00Z']);

    $response = $this->actingAs($this->admin)->get(route('admin.xendit-transactions.export'));
    $zip = new ZipArchive;
    $zip->open($response->baseResponse->getFile()->getPathname());
    $sheet = $zip->getFromName('xl/worksheets/sheet1.xml');

    expect($sheet)->toContain('t="inlineStr"')->toContain('=HYPERLINK(&quot;http://evil&quot;)')->not->toContain('<f>');
});

it('runs a sync from the Sync now button', function () {
    Http::fake(['api.xendit.co/transactions*' => Http::response(['has_more' => false, 'data' => [
        ['id' => 'txn_now', 'type' => 'PAYMENT', 'status' => 'SUCCESS', 'cashflow' => 'MONEY_IN', 'amount' => 1000, 'created' => '2026-09-29T00:00:00Z', 'updated' => '2026-09-29T00:00:00Z'],
    ]])]);

    $this->actingAs($this->admin)->post(route('admin.xendit-transactions.sync'))->assertSessionHas('success', 'Tersinkron: 1 baru, 0 berubah.');

    expect(XenditTransaction::where('xendit_id', 'txn_now')->exists())->toBeTrue();
    $this->actingAs($this->admin)->get(route('admin.xendit-transactions'))->assertSee('Tersinkron');
});

it('keeps the page usable when Xendit is down during Sync now', function () {
    Http::fake(fn () => Http::response('', 503));

    $this->actingAs($this->admin)->post(route('admin.xendit-transactions.sync'))->assertSessionHas('warning');
});

it('is admin only', function () {
    $user = User::forceCreate(['name' => 'U', 'email' => uniqid('u').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $user->roles()->attach(Role::firstOrCreate(['name' => 'user']));

    $this->actingAs($user)->get(route('admin.xendit-transactions'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.xendit-transactions.export'))->assertForbidden();
});

it('runs from the scheduler command', function () {
    Http::fake(['api.xendit.co/transactions*' => Http::response(['has_more' => false, 'data' => []])]);

    $this->artisan('xendit:sync-transactions')->assertSuccessful()->expectsOutputToContain('Synced 1 page(s)');
});
