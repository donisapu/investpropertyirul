<?php

use App\Models\PropertyFinancial;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\DistributeProfitService;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->withoutVite();
    $this->admin = profitUser('Admin', 'admin');
    $this->propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Bukit Dago', 'property_location' => 'Bandung', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Rumah', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    // 100 lots; Citra holds 30, Dewi 20 - 5 sold = 15, 55 unsold.
    $this->investmentId = DB::table('property_investments')->insertGetId([
        'property_id' => $this->propertyId, 'asset_price' => 10000000, 'total_investment_value' => 10000000,
        'rental_yield' => 5, 'appreciation_rate' => 3, 'price_per_lot' => 100000, 'total_lot' => 100,
        'sold_lot' => 45, 'min_lot_size' => 1, 'max_lot_size' => 50, 'projected_roi' => 8,
        'roi_period_months' => 12, 'status' => 'Running', 'created_at' => now(), 'updated_at' => now(),
    ]);
    $this->citra = profitUser('Citra');
    $this->dewi = profitUser('Dewi');
    holdLots($this->citra, $this->investmentId, 'BUY', 30);
    holdLots($this->dewi, $this->investmentId, 'BUY', 20);
    holdLots($this->dewi, $this->investmentId, 'SELL', 5);
    Wallet::updateOrCreate(['user_id' => $this->citra->id], ['balance' => '1000.50']);
});

function profitUser(string $name, string $role = 'user'): User
{
    $user = User::forceCreate(['name' => $name, 'email' => uniqid(strtolower($name)).'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $user->roles()->attach(Role::firstOrCreate(['name' => $role]));

    return $user;
}

function holdLots(User $user, int $investmentId, string $type, int $lot, string $status = 'APPROVED'): void
{
    DB::table('investment_transactions')->insert([
        'user_id' => $user->id, 'investment_id' => $investmentId, 'type' => $type, 'status' => $status, 'lot' => $lot,
        'amount' => $lot * 100000, 'price_per_lot' => 100000, 'transacted_at' => now(), 'created_at' => now(), 'updated_at' => now(),
    ]);
}

// Two decimals whatever the driver returns (sqlite drops trailing zeros).
function profitWalletBalance(User $user): string
{
    return number_format((float) Wallet::where('user_id', $user->id)->value('balance'), 2, '.', '');
}

function monthReport(int $investmentId, array $overrides = []): PropertyFinancial
{
    return PropertyFinancial::create(array_merge([
        'property_investment_id' => $investmentId, 'year' => 2026, 'month' => 9,
        'income' => 1500000, 'expense' => 500000, 'net_profit' => 1000000, 'status' => 'FINAL',
    ], $overrides));
}

function distribute(PropertyFinancial $report)
{
    return test()->actingAs(test()->admin)->post(route('admin.financials.distribute', [$report->id, $report->property_investment_id]));
}

it('pays each investor their share of the lots into their wallet', function () {
    $report = monthReport($this->investmentId);

    distribute($report)
        ->assertRedirect(route('admin.financials.show', $this->investmentId))
        ->assertSessionHas('success', 'Profit Rp 450.000 dibagikan ke 2 investor.');

    expect(profitWalletBalance($this->citra))->toBe('301000.50')
        ->and(profitWalletBalance($this->dewi))->toBe('150000.00');

    $rows = WalletTransaction::where('reference_type', PropertyFinancial::class)->where('reference_id', $report->id)->orderBy('user_id')->get();
    expect($rows)->toHaveCount(2)
        ->and($rows->pluck('type')->unique()->all())->toBe(['PROFIT'])
        ->and($rows->map(fn ($r) => number_format((float) $r->balance_after, 2, '.', ''))->all())->toBe(['301000.50', '150000.00']);

    expect($report->fresh())->is_distributed->toBeTrue()->distributed_at->not->toBeNull();
});

it('pays only once, even when the button is pressed again', function () {
    $report = monthReport($this->investmentId);
    distribute($report);

    distribute($report)->assertSessionHas('error', 'Profit bulan ini sudah pernah dibagikan.');

    expect(WalletTransaction::where('reference_id', $report->id)->count())->toBe(2)
        ->and(profitWalletBalance($this->dewi))->toBe('150000.00');
});

it('refuses a report that cannot be paid out', function (array $report, string $message) {
    $report = monthReport($this->investmentId, $report);

    distribute($report)->assertSessionHas('error', $message);

    expect(WalletTransaction::count())->toBe(0)->and($report->fresh()->is_distributed)->toBeFalse();
})->with([
    'DRAFT' => [['status' => 'DRAFT'], 'Laporan harus berstatus FINAL sebelum profit dibagikan.'],
    'loss' => [['income' => 0, 'expense' => 200000, 'net_profit' => -200000], 'Net profit harus lebih dari 0 untuk dibagikan.'],
    'zero' => [['net_profit' => 0], 'Net profit harus lebih dari 0 untuk dibagikan.'],
]);

it('refuses when nobody holds lots', function () {
    DB::table('investment_transactions')->delete();
    holdLots($this->citra, $this->investmentId, 'BUY', 10, 'PENDING');

    distribute(monthReport($this->investmentId))->assertSessionHas('error', 'Belum ada investor yang memegang lot investasi ini.');
});

it('floors every share to whole rupiah', function () {
    DB::table('investment_transactions')->delete();
    DB::table('property_investments')->where('id', $this->investmentId)->update(['total_lot' => 3]);
    holdLots($this->dewi, $this->investmentId, 'BUY', 1);

    distribute(monthReport($this->investmentId, ['net_profit' => 100]));

    expect(profitWalletBalance($this->dewi))->toBe('33.00');
});

it('pays nobody when one wallet is disabled', function () {
    Wallet::updateOrCreate(['user_id' => $this->dewi->id], ['balance' => 0]);
    DB::table('wallets')->where('user_id', $this->dewi->id)->update(['status' => 'DISABLED']);
    $report = monthReport($this->investmentId);

    distribute($report)->assertSessionHas('error', "Wallet investor #{$this->dewi->id} sedang nonaktif; aktifkan dulu sebelum membagikan profit.");

    expect(WalletTransaction::count())->toBe(0)
        ->and(profitWalletBalance($this->citra))->toBe('1000.50')
        ->and($report->fresh()->is_distributed)->toBeFalse();
});

it('locks a report once its profit is paid', function () {
    $report = monthReport($this->investmentId);
    distribute($report);
    $form = ['month' => 9, 'year' => 2026, 'income' => 9000000, 'expense' => 0, 'status' => 'FINAL'];

    $this->actingAs($this->admin)->post(route('admin.financials.update', [$report->id, $this->investmentId]), $form)
        ->assertSessionHas('error', 'Laporan yang profitnya sudah dibagikan tidak bisa diubah.');
    $this->actingAs($this->admin)->get(route('admin.financials.destroy', [$report->id, $this->investmentId]))
        ->assertSessionHas('error', 'Laporan yang profitnya sudah dibagikan tidak bisa dihapus.');

    expect((int) $report->fresh()->net_profit)->toBe(1000000);
});

it('shows the payout plan before the admin confirms', function () {
    $report = monthReport($this->investmentId);
    monthReport($this->investmentId, ['month' => 8, 'status' => 'DRAFT']);

    $this->actingAs($this->admin)->get(route('admin.financials.show', $this->investmentId))
        ->assertOk()
        ->assertSee(route('admin.financials.distribute', [$report->id, $this->investmentId]))
        ->assertSee('Rp 450.000 akan masuk ke wallet', false)
        ->assertSee('Rp 550.000 dari net profit', false)
        ->assertSeeInOrder(['Citra', '30', 'Rp 300.000', 'Dewi', '15', 'Rp 150.000'])
        ->assertSee('Set FINAL dulu');

    distribute($report);

    $this->actingAs($this->admin)->get(route('admin.financials.show', $this->investmentId))
        ->assertSee('Sudah dibagikan')
        ->assertDontSee(route('admin.financials.distribute', [$report->id, $this->investmentId]));
});

it('is admin only', function () {
    $this->actingAs($this->citra)->post(route('admin.financials.distribute', [monthReport($this->investmentId)->id, $this->investmentId]))
        ->assertForbidden();

    expect(WalletTransaction::count())->toBe(0);
});

it('rejects a second report for the same month', function () {
    monthReport($this->investmentId);

    $this->actingAs($this->admin)->post(route('admin.financials.store', $this->investmentId), [
        'property_investment_id' => $this->investmentId, 'month' => 9, 'year' => 2026, 'income' => 1, 'expense' => 0, 'status' => 'FINAL',
    ])->assertSessionHasErrors('month');

    expect(PropertyFinancial::count())->toBe(1);
});

it('still distributes from the command and skips what it cannot pay', function () {
    $ok = monthReport($this->investmentId);
    monthReport($this->investmentId, ['month' => 10, 'net_profit' => -1]);

    $this->artisan('profit:distribute')
        ->expectsOutputToContain('Rp 450000 ke 2 investor')
        ->expectsOutputToContain('Dilewati: Net profit harus lebih dari 0 untuk dibagikan.')
        ->assertSuccessful();

    expect($ok->fresh()->is_distributed)->toBeTrue();
});

it('pays once when two admins press the button at the same moment', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::commit(); // the forked processes must see the rows from beforeEach
    $report = monthReport($this->investmentId);

    try {
        DB::disconnect();
        $pids = [];
        foreach ([1, 2] as $i) {
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    app(DistributeProfitService::class)->handle(PropertyFinancial::find($report->id));
                    exit(0);
                } catch (\App\Services\ProfitDistributionRejected) {
                    exit(3);
                } catch (Throwable) {
                    exit(1);
                }
            }
            $pids[] = $pid;
        }
        $codes = [];
        foreach ($pids as $pid) {
            pcntl_waitpid($pid, $status);
            $codes[] = pcntl_wexitstatus($status);
        }
        sort($codes);
        DB::reconnect();

        expect($codes)->toBe([0, 3])
            ->and(WalletTransaction::where('reference_id', $report->id)->count())->toBe(2)
            ->and(profitWalletBalance($this->dewi))->toBe('150000.00');
    } finally {
        $users = [$this->admin->id, $this->citra->id, $this->dewi->id];
        DB::table('wallet_transactions')->whereIn('user_id', $users)->delete();
        DB::table('wallets')->whereIn('user_id', $users)->delete();
        DB::table('property_financials')->where('property_investment_id', $this->investmentId)->delete();
        DB::table('investment_transactions')->where('investment_id', $this->investmentId)->delete();
        DB::table('property_investments')->where('id', $this->investmentId)->delete();
        DB::table('properties')->where('id', $this->propertyId)->delete();
        DB::table('user_roles')->whereIn('user_id', $users)->delete();
        DB::table('users')->whereIn('id', $users)->delete();
        DB::beginTransaction();
    }
})->group('concurrency');
