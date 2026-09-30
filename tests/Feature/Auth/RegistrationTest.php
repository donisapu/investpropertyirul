<?php

use App\Models\User;
use App\Models\Role;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    // RegisteredUserController hard-codes role_id 2 ("user" in RoleSeeder). Pin the ids:
    // on pgsql the sequence is not reset between tests.
    Role::forceCreate(['id' => 1, 'name' => 'admin']);
    Role::forceCreate(['id' => 2, 'name' => 'user']);

    $response = $this->post('/register', [
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.notice'));

    expect(User::where('email', 'test@example.com')->first()->hasRole('user'))->toBeTrue();
});
