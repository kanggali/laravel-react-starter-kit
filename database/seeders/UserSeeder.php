<?php

namespace Database\Seeders;

use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Factory::create();
        $roles = [
            'lecturer',
            'assessment',
            'administrator',
            'superadmin',
            'prodi',
            'pjblok',
            'fakultas',
            'bdi',
            'keuangan',
            'rektorat',
            'baum',
            'student',
            'guest',
            'admin_rpl',
            'admin_penmaru',
            'komkordik',
            'bimawa',
            'bim',
            'oic'
        ];

        foreach ($roles as $roleName) {
            $user = User::create([
                'name' => $faker->name,
                'username' => $roleName,
                'email' => $roleName . '@gmail.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);

            $user->assignRole($roleName);
        }
    }
}
