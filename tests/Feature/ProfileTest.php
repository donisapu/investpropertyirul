<?php

use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

// The Breeze /profile page and "delete account" were dropped; the investor
// edits name and phone on /user/settings (User\AccountController).

beforeEach(function () {
    $this->withoutVite();
    $this->user = User::factory()->create(['phone' => '0812']);
    $this->user->roles()->attach(Role::firstOrCreate(['name' => 'user']));
});

test('settings page is displayed', function () {
    $this->actingAs($this->user)
        ->get('/user/settings')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('Account/Setting'));
});

test('profile information can be updated', function () {
    $this->actingAs($this->user)
        ->from('/user/settings')
        ->put('/user/settings/profile', [
            'name' => 'Test User',
            'phone' => '081234567890',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect('/user/settings');

    $this->user->refresh();

    expect($this->user->name)->toBe('Test User')
        ->and($this->user->phone)->toBe('081234567890');
});

test('the email address and its verification can not be changed from the profile form', function () {
    $email = $this->user->email;

    $this->actingAs($this->user)
        ->from('/user/settings')
        ->put('/user/settings/profile', [
            'name' => 'Test User',
            'email' => 'other@example.com',
        ])
        ->assertSessionHasNoErrors();

    $this->user->refresh();

    expect($this->user->email)->toBe($email)
        ->and($this->user->email_verified_at)->not->toBeNull();
});

test('name is required', function () {
    $this->actingAs($this->user)
        ->from('/user/settings')
        ->put('/user/settings/profile', ['name' => ''])
        ->assertSessionHasErrors('name')
        ->assertRedirect('/user/settings');
});
