<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Super Admin',
            'email' => 'admin@mail.com',
            'password' => Hash::make('Admin@123'),
            'phone' => null,
            'profile_picture' => null,
            'status' => 'active',
        ]);
    }
}
