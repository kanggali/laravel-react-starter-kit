<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Traits\HasMenuPermission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class MenuSeeder extends Seeder
{
    use HasMenuPermission;

    public function run(): void
    {
        Cache::forget('menus');

        // 1. KATEGORI MANAGEMENT
        $mm = Menu::updateOrCreate(['url' => 'configuration'], [
            'name' => 'Configuration',
            'category' => 'MANAGEMENT',
            'icon' => 'Settings',
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($mm, ['read'], ['administrator']);

        // Sub Menu dengan penambahan icon Lucide
        $subMenus = [
            [
                'name' => 'Menu',
                'url' => '/menu',
                'icon' => 'LayoutList',
                'perms' => ['read', 'create', 'update', 'delete', 'sort']
            ],
            [
                'name' => 'Roles',
                'url' => '/roles',
                'icon' => 'ShieldCheck',
                'perms' => ['read', 'create', 'update', 'delete']
            ],
            [
                'name' => 'Permission',
                'url' => '/permissions',
                'icon' => 'Key',
                'perms' => ['read', 'create', 'update', 'delete']
            ],
            [
                'name' => 'Access Role',
                'url' => '/access-role',
                'icon' => 'UserCog',
                'perms' => ['read', 'update']
            ],
            [
                'name' => 'Access User',
                'url' => '/access-user',
                'icon' => 'UserCheck',
                'perms' => ['read', 'update']
            ],
            [
                'name' => 'Users',
                'url' => '/users',
                'icon' => 'Users',
                'perms' => null
            ],
        ];

        foreach ($subMenus as $index => $s) {
            $sm = Menu::updateOrCreate(['url' => $mm->url . $s['url']], [
                'name' => $s['name'],
                'main_menu_id' => $mm->id,
                'category' => $mm->category,
                'icon' => $s['icon'], // Menyimpan icon sub-menu ke database
                'active' => 1,
                'orders' => $index + 1
            ]);
            $this->attachMenuPermission($sm, $s['perms'], ['administrator']);
        }

        // 2. KATEGORI DATA
        $mmData = Menu::updateOrCreate(['url' => 'referencies'], [
            'name' => 'Referencies',
            'category' => 'DATA',
            'icon' => 'Database',
            'active' => 1,
            'orders' => 2
        ]);
        $this->attachMenuPermission($mmData, null, ['administrator']);

        $smData = Menu::updateOrCreate(['url' => $mmData->url . '/menu-first'], [
            'name' => 'Menu First',
            'main_menu_id' => $mmData->id,
            'category' => $mmData->category,
            'icon' => 'FileText', // Icon untuk sub-menu di kategori DATA
            'active' => 1,
            'orders' => 1
        ]);
        $this->attachMenuPermission($smData, ['read', 'create', 'update', 'delete'], ['administrator']);
    }
}
