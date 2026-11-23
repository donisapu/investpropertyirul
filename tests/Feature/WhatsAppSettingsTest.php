<?php

use App\Models\Role;
use App\Models\User;
use App\Models\WebsiteSetting;

/*
 * WhatsApp settings the admin manages in Website Settings: the public button and the
 * follow-up number for buyers who paid (never sent to visitors).
 */

beforeEach(fn () => $this->withoutVite());

function waAdmin(): User
{
    $admin = User::forceCreate(['name' => 'Admin', 'email' => uniqid('adm').'@example.com', 'password' => bcrypt('x'), 'email_verified_at' => now()]);
    $admin->roles()->attach(Role::firstOrCreate(['name' => 'admin']));

    return $admin;
}

function sharedSettings($test): array
{
    $settings = [];
    $test->get('/')->assertInertia(function ($page) use (&$settings) { $settings = $page->toArray()['props']['settings']; });

    return $settings;
}

test('visitors see the public WhatsApp but never the follow-up number', function () {
    siteSettings(['wa_followup_number' => '081255556666', 'wa_public_button' => false]);

    $settings = sharedSettings($this);

    expect($settings)->toMatchArray(['whatsapp' => '6281100001111', 'wa_public_button' => false])
        ->and($settings)->not->toHaveKey('wa_followup_number')
        ->and(json_encode($settings))->not->toContain('081255556666');
});

test('an admin manages the WhatsApp follow-up settings', function () {
    siteSettings();

    $this->actingAs(waAdmin())->put(route('admin.website-settings.update'), [
        'site_name' => 'Gain Properties', 'whatsapp' => '6281100001111',
        'wa_public_button' => '0', 'wa_followup_number' => '0812 5555 6666', 'wa_auction_access' => 'winner',
        'wa_booking_message' => 'Halo {nama}', 'wa_auction_message' => null,
    ])->assertSessionHasNoErrors();

    expect(WebsiteSetting::getSettings()->only('wa_public_button', 'wa_followup_number', 'wa_auction_access', 'wa_booking_message'))
        ->toBe(['wa_public_button' => false, 'wa_followup_number' => '0812 5555 6666', 'wa_auction_access' => 'winner', 'wa_booking_message' => 'Halo {nama}']);

    $this->actingAs(waAdmin())->put(route('admin.website-settings.update'), [
        'site_name' => 'Gain Properties', 'wa_followup_number' => 'abc', 'wa_auction_access' => 'everyone',
    ])->assertSessionHasErrors(['wa_followup_number', 'wa_auction_access']);
});

test('the admin forms show the WhatsApp follow-up fields', function () {
    siteSettings();
    $admin = waAdmin();

    $this->actingAs($admin)->get(route('admin.website-settings.edit'))->assertOk()
        ->assertSee(['name="wa_public_button"', 'name="wa_followup_number"', 'name="wa_auction_access"', 'name="wa_booking_message"'], false);
    $this->actingAs($admin)->get(route('admin.consignment-properties.create'))->assertOk()
        ->assertSee(['name="followup_whatsapp"', 'name="followup_group_url"'], false);
    $this->actingAs($admin)->get(route('admin.auction-properties.create'))->assertOk()
        ->assertSee(['name="followup_whatsapp"', 'name="followup_group_url"'], false);
});
