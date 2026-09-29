<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('a').'@example.com', 'password' => 'x', 'email_verified_at' => now()]);
    $this->admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));
    fakeBankChannels();
});

/** The sidebar <ul> of a rendered admin page. */
function sidebarOf(string $html): string
{
    preg_match('#<ul class="menu-inner py-1">(.*?)</aside>#s', $html, $m);

    return $m[1] ?? '';
}

it('lists the admin menu in the mockup order', function () {
    $menu = sidebarOf($this->actingAs($this->admin)->get(route('admin.withdrawal-settings.edit'))->assertOk()->getContent());

    $labels = ['Dashboard', 'Xendit Dashboard', 'Property', 'Properties', 'Transactions', 'Withdrawals', 'Xendit Transactions', 'Company Cash-out',
        'Products', 'Investment', 'Crowdfunding', 'Property For Sale', 'Auctions', 'Settings', 'Website Setting', 'Developer', 'Campaign'];

    $positions = array_map(fn ($label) => mb_strpos($menu, '>'.$label.'<'), $labels);

    expect($positions)->not->toContain(false);
    expect($positions)->toBe(collect($positions)->sort()->values()->all());
});

it('puts the Xendit pages under Transactions, not at the top', function () {
    $menu = sidebarOf($this->actingAs($this->admin)->get(route('admin.withdrawal-settings.edit'))->getContent());
    $transactions = mb_strpos($menu, '>Transactions<');

    expect(mb_strpos($menu, '>Xendit Transactions<'))->toBeGreaterThan($transactions)
        ->and(mb_strpos($menu, '>Company Cash-out<'))->toBeGreaterThan($transactions)
        ->and(mb_strpos($menu, '>Products<'))->toBeGreaterThan(mb_strpos($menu, '>Company Cash-out<'));
});

it('opens the parent menu of the active page and marks the child', function () {
    $menu = sidebarOf($this->actingAs($this->admin)->get(route('admin.withdrawal-settings.edit'))->getContent());

    expect($menu)->toMatch('#<li class="menu-item active open">\s*<a href="javascript:void\(0\);" class="menu-link menu-toggle">\s*<i class="menu-icon tf-icons bx bx-home-circle"></i>\s*<div>Website Setting</div>#')
        ->and($menu)->toMatch('#<li class="menu-item active">\s*<a href="'.preg_quote(route('admin.withdrawal-settings.edit'), '#').'" class="menu-link"\s+aria-current="page"\s*>#')
        ->and(substr_count($menu, 'aria-current="page"'))->toBe(1);
});

it('keeps Company Cash-out active on its history page', function () {
    Http::fake(fn () => Http::response('', 503));

    $menu = sidebarOf($this->actingAs($this->admin)->get(route('admin.company-cashouts.index'))->assertOk()->getContent());

    expect($menu)->toMatch('#<li class="menu-item active">\s*<a href="'.preg_quote(route('admin.company-cashouts.create'), '#').'" class="menu-link"\s+aria-current="page"\s*>#');
});
