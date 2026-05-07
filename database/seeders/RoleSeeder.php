<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }
    }
}
