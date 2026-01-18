<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'admin@mail.com')->first();
        $role = Role::where('name', 'admin')->first();

        if ($user && $role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
        }
    }
}
