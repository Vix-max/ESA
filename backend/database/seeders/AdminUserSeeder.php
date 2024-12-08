<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        DB::table('admin_users')->insert([
            'username' => 'admin',
            'password' => Hash::make('password123'),
            'full_name' => 'Admin User',
            'role' => 'Admin',
        ]);
    }
}
