<?php

use App\Models\CrowdfundingFinancial;
use App\Models\CrowdfundingReturn;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\CrowdfundingDistributionService;
use App\Services\ProfitDistributionRejected;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->withoutVite();
    $this->admin = payoutUser('Admin', 'admin');
    $this->propertyId = DB::table('properties')->insertGetId([
        'property_name' => 'Rumah Flip', 'property_location' => 'Bandung', 'bedroom' => 2, 'bathroom' => 1,
        'property_type' => 'Rumah', 'land_area' => 150, 'building_area' => 100, 'map_url' => 'https://maps.example',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    // Funded 300jt: Citra put in 200jt, Dewi 100jt.
    $this->crowdfundingId = DB::table('property_crowdfundings')->insertGetId([
        'property_id' => $this->propertyId, 'funding_goal' => 300000000, 'min_contribution' => 1000000,
        'estimated_roi' => 12, 'collected_amount' => 300000000, 'tenor' => 12, 'status' => 'Funded',
        'created_at' => now(), 'updated_at' => now(),
    ]);
    $this->citra = payoutUser('Citra');
    $this->dewi = payoutUser('Dewi');
    contribute($this->citra, $this->crowdfundingId, 200000000);
    contribute($this->dewi, $this->crowdfundingId, 100000000);
    Wallet::updateOrCreate(['user_id' => $this->citra->id], ['balance' => '1000.50']);
});

function payoutUser(string $name, string $role = 'user'): User
{
    $user = User::forceCreate(['name' => $name, 'email' => uniqid(strtolower($name)).'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $user->roles()->attach(Role::firstOrCreate(['name' => $role]));

    return $user;
}

function contribute(User $user, int $crowdfundingId, int $amount): void
{
    DB::table('crowdfunding_portfolios')->insert([
        'user_id' => $user->id, 'crowdfunding_id' => $crowdfundingId, 'total_amount' => $amount,
        'created_at' => now(), 'updated_at' => now(),
    ]);
}

// Two decimals whatever the driver returns (sqlite drops trailing zeros).
function payoutWalletBalance(User $user): string
{
    return number_format((float) Wallet::where('user_id', $user->id)->value('balance'), 2, '.', '');
}

function flipReport(int $crowdfundingId, array $overrides = []): CrowdfundingFinancial
{
    return CrowdfundingFinancial::create(array_merge([
        'crowdfunding_id' => $crowdfundingId, 'income' => 40000000, 'expense' => 10000000,
        'net_profit' => 30000000, 'status' => 'FINAL',
    ], $overrides));
}

function payOut(CrowdfundingFinancial $report)
{
    return test()->actingAs(test()->admin)->post(route('admin.cw_financials.distribute', [$report->id, $report->crowdfunding_id]));
}

it('returns principal plus the profit share to each investor', function () {
    $report = flipReport($this->crowdfundingId);

    payOut($report)
        ->assertRedirect(route('admin.cw_financials.show', $this->crowdfundingId))
        ->assertSessionHas('success', 'Rp 330.000.000 (modal + profit) dibagikan ke 2 investor.');

    expect(payoutWalletBalance($this->citra))->toBe('220001000.50')
        ->and(payoutWalletBalance($this->dewi))->toBe('110000000.00');

    $returns = CrowdfundingReturn::where('crowdfunding_financial_id', $report->id)->orderBy('user_id')->get();
    expect($returns->map(fn ($r) => [(int) $r->principal_returned, (int) $r->profit_received, (float) $r->ownership_percentage])->all())
        ->toBe([[200000000, 20000000, 66.67], [100000000, 10000000, 33.33]]);

    expect(WalletTransaction::where('reference_type', CrowdfundingFinancial::class)->where('type', 'PROFIT')->count())->toBe(2)
        ->and(DB::table('crowdfunding_portfolios')->where('crowdfunding_id', $this->crowdfundingId)->count())->toBe(0)
        ->and($report->fresh())->is_distributed->toBeTrue()->distributed_at->not->toBeNull();
});

it('pays nothing just by saving a report as FINAL', function () {
    $this->actingAs($this->admin)->post(route('admin.cw_financials.store', $this->crowdfundingId), [
        'income' => 40000000, 'expense' => 10000000, 'status' => 'FINAL',
    ])->assertRedirect();
    $report = CrowdfundingFinancial::sole();
    $report->update(['status' => 'DRAFT']);
    $this->actingAs($this->admin)->post(route('admin.cw_financials.update', [$report->id, $this->crowdfundingId]), [
        'income' => 40000000, 'expense' => 10000000, 'status' => 'FINAL',
    ]);

    expect(WalletTransaction::count())->toBe(0)
        ->and($report->fresh())->status->toBe('FINAL')->is_distributed->toBeFalse()
        ->and((int) $report->fresh()->net_profit)->toBe(30000000);
});

it('pays nobody when one wallet is disabled, and pays once it is active again', function () {
    Wallet::updateOrCreate(['user_id' => $this->dewi->id], ['balance' => 0]);
    DB::table('wallets')->where('user_id', $this->dewi->id)->update(['status' => 'DISABLED']);
    $report = flipReport($this->crowdfundingId);

    payOut($report)->assertSessionHas('error', "Wallet investor #{$this->dewi->id} sedang nonaktif; aktifkan dulu sebelum membagikan hasil.");

    expect(WalletTransaction::count())->toBe(0)
        ->and(CrowdfundingReturn::count())->toBe(0)
        ->and(payoutWalletBalance($this->citra))->toBe('1000.50')
        ->and(DB::table('crowdfunding_portfolios')->count())->toBe(2)
        ->and($report->fresh()->is_distributed)->toBeFalse();

    DB::table('wallets')->where('user_id', $this->dewi->id)->update(['status' => 'ACTIVE']);

    payOut($report)->assertSessionHas('success');
    expect(payoutWalletBalance($this->dewi))->toBe('110000000.00');
});

it('pays only once, even when the button is pressed again', function () {
    $report = flipReport($this->crowdfundingId);
    payOut($report);

    payOut($report)->assertSessionHas('error', 'Hasil crowdfunding ini sudah pernah dibagikan.');

    expect(WalletTransaction::count())->toBe(2)->and(payoutWalletBalance($this->dewi))->toBe('110000000.00');
});

it('does not pay a second report once the investors are paid out', function () {
    payOut(flipReport($this->crowdfundingId));

    payOut(flipReport($this->crowdfundingId))
        ->assertSessionHas('error', 'Belum ada investor di crowdfunding ini, atau hasilnya sudah dibagikan lewat laporan lain.');

    expect(WalletTransaction::count())->toBe(2);
});

it('refuses what cannot be paid out yet', function (array $report, array $crowdfunding, string $message) {
    DB::table('property_crowdfundings')->where('id', $this->crowdfundingId)->update($crowdfunding + ['updated_at' => now()]);
    $report = flipReport($this->crowdfundingId, $report);

    payOut($report)->assertSessionHas('error', $message);

    expect(WalletTransaction::count())->toBe(0)->and($report->fresh()->is_distributed)->toBeFalse();
})->with([
    'DRAFT report' => [['status' => 'DRAFT'], [], 'Laporan harus berstatus FINAL sebelum hasil dibagikan.'],
    'still Open' => [[], ['status' => 'Open'], 'Crowdfunding harus berstatus Funded sebelum hasil dibagikan.'],
]);

it('shares a loss by principal and floors every share', function () {
    payOut(flipReport($this->crowdfundingId, ['income' => 0, 'expense' => 30000001, 'net_profit' => -30000001]));

    // -30000001 * 2/3 = -20000000.67 -> -20000001; * 1/3 = -10000000.33 -> -10000001
    expect(payoutWalletBalance($this->citra))->toBe('180000999.50')
        ->and(payoutWalletBalance($this->dewi))->toBe('89999999.00');
});

it('locks a report once it is paid out', function () {
    $report = flipReport($this->crowdfundingId);
    payOut($report);

    $this->actingAs($this->admin)->post(route('admin.cw_financials.update', [$report->id, $this->crowdfundingId]), [
        'income' => 1, 'expense' => 0, 'status' => 'FINAL',
    ])->assertSessionHas('error', 'Laporan yang hasilnya sudah dibagikan tidak bisa diubah.');
    $this->actingAs($this->admin)->get(route('admin.cw_financials.destroy', [$report->id, $this->crowdfundingId]))
        ->assertSessionHas('error', 'Laporan yang hasilnya sudah dibagikan tidak bisa dihapus.');

    expect(CrowdfundingReturn::count())->toBe(2)->and((int) $report->fresh()->net_profit)->toBe(30000000);
});

it('shows the payout plan before the admin confirms', function () {
    $report = flipReport($this->crowdfundingId);

    $this->actingAs($this->admin)->get(route('admin.cw_financials.show', $this->crowdfundingId))
        ->assertOk()
        ->assertSee(route('admin.cw_financials.distribute', [$report->id, $this->crowdfundingId]))
        ->assertSee('Rp 330.000.000 akan masuk ke wallet', false)
        ->assertSeeInOrder(['Citra', '66,67%', 'Rp 200.000.000', 'Rp 20.000.000', 'Rp 220.000.000', 'Dewi', 'Rp 110.000.000']);

    payOut($report);

    $this->actingAs($this->admin)->get(route('admin.cw_financials.show', $this->crowdfundingId))
        ->assertSee('Sudah dibagikan')
        ->assertDontSee(route('admin.cw_financials.distribute', [$report->id, $this->crowdfundingId]));
});

it('is admin only', function () {
    $this->actingAs($this->citra)->post(route('admin.cw_financials.distribute', [flipReport($this->crowdfundingId)->id, $this->crowdfundingId]))
        ->assertForbidden();

    expect(WalletTransaction::count())->toBe(0);
});

it('pays once when two admins press the button at the same moment', function () {
    if (DB::connection()->getDriverName() !== 'pgsql' || ! function_exists('pcntl_fork')) {
        $this->markTestSkipped('Needs Postgres (row locks) and pcntl.');
    }

    DB::commit(); // the forked processes must see the rows from beforeEach
    $report = flipReport($this->crowdfundingId);

    try {
        DB::disconnect();
        $pids = [];
        foreach ([1, 2] as $i) {
            $pid = pcntl_fork();
            if ($pid === 0) {
                DB::reconnect();
                try {
                    app(CrowdfundingDistributionService::class)->handle(CrowdfundingFinancial::find($report->id));
                    exit(0);
                } catch (ProfitDistributionRejected) {
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
            ->and(payoutWalletBalance($this->dewi))->toBe('110000000.00');
    } finally {
        $users = [$this->admin->id, $this->citra->id, $this->dewi->id];
        DB::table('crowdfunding_returns')->whereIn('user_id', $users)->delete();
        DB::table('wallet_transactions')->whereIn('user_id', $users)->delete();
        DB::table('wallets')->whereIn('user_id', $users)->delete();
        DB::table('crowdfunding_financials')->where('crowdfunding_id', $this->crowdfundingId)->delete();
        DB::table('crowdfunding_portfolios')->where('crowdfunding_id', $this->crowdfundingId)->delete();
        DB::table('property_crowdfundings')->where('id', $this->crowdfundingId)->delete();
        DB::table('properties')->where('id', $this->propertyId)->delete();
        DB::table('user_roles')->whereIn('user_id', $users)->delete();
        DB::table('users')->whereIn('id', $users)->delete();
        DB::beginTransaction();
    }
})->group('concurrency');
