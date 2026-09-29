<?php

use App\Models\Role;
use App\Models\User;

function personWithRole(string $role, array $attributes = []): User
{
    $user = User::forceCreate(array_merge([
        'name' => ucfirst($role), 'email' => uniqid($role).'@example.com', 'password' => bcrypt('secret-123'),
        'phone' => '081234567890', 'email_verified_at' => now(),
    ], $attributes));
    $user->roles()->attach(Role::firstOrCreate(['name' => $role]));

    return $user;
}

it('sends a logged-in admin from guest pages to the admin dashboard, not a 500', function (string $uri) {
    $this->actingAs(personWithRole('admin'))->get($uri)->assertRedirect(route('admin.dashboard'));
})->with(['/login', '/register', '/forgot-password', '/reset-password/some-token']);

it('sends a logged-in user from guest pages to the user dashboard', function (string $uri) {
    $this->actingAs(personWithRole('user'))->get($uri)->assertRedirect(route('user.dashboard'));
})->with(['/login', '/register', '/forgot-password']);

it('sends a user with an incomplete profile to complete it first', function () {
    $this->actingAs(personWithRole('user', ['phone' => null]))->get('/login')->assertRedirect(route('user.complete.profile'));
});

it('still shows the guest pages to guests', function (string $uri) {
    $this->withoutVite()->get($uri)->assertOk();
})->with(['/login', '/register', '/forgot-password']);

it('redirects an already verified user from the verify-email prompt to their home', function (string $role, string $home) {
    $this->actingAs(personWithRole($role))->get('/verify-email')->assertRedirect(route($home));
})->with([['admin', 'admin.dashboard'], ['user', 'user.dashboard']]);

it('does not resend a verification email to a verified user and sends them home', function () {
    $this->actingAs(personWithRole('user'))->post('/email/verification-notification')->assertRedirect(route('user.dashboard'));
});

it('sends a user home after confirming the password, or back to the page they wanted', function () {
    $admin = personWithRole('admin');

    $this->actingAs($admin)->post('/confirm-password', ['password' => 'secret-123'])
        ->assertRedirect(route('admin.dashboard'))
        ->assertSessionHas('auth.password_confirmed_at');

    $this->actingAs($admin)->withSession(['url.intended' => route('admin.withdrawal-settings.edit')])
        ->post('/confirm-password', ['password' => 'secret-123'])
        ->assertRedirect(route('admin.withdrawal-settings.edit'));
});

it('rejects a wrong password on confirm', function () {
    $this->actingAs(personWithRole('user'))->post('/confirm-password', ['password' => 'wrong'])->assertSessionHasErrors('password');
});
