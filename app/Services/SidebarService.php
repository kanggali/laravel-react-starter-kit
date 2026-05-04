<?php

namespace App\Services;

use App\Models\Configuration\Menu;
use Illuminate\Support\Facades\Auth;

class SidebarService
{
    public function getMyMenu()
    {
        $user = Auth::user();
        // Cek apakah user adalah superadmin
        $isSuperAdmin = $user->hasRole('superadmin');

        return Menu::query()
            ->active()
            ->with(['subMenus' => fn($q) => $q->active()->orderBy('orders')])
            ->whereNull('main_menu_id')
            ->orderBy('orders')
            ->get()
            // Filter Menu Utama
            ->filter(function ($menu) use ($user, $isSuperAdmin) {
                // Jika superadmin, langsung lolos (true), jika tidak, cek permission
                return $isSuperAdmin || $user->can("read {$menu->url}");
            })
            ->map(function ($menu) use ($user, $isSuperAdmin) {
                if ($menu->subMenus->isNotEmpty()) {
                    $filtered = $menu->subMenus
                        ->filter(function ($sm) use ($user, $isSuperAdmin) {
                            // Berlaku juga untuk Sub Menu
                            return $isSuperAdmin || $user->can("read {$sm->url}");
                        })
                        ->values();
                    $menu->setRelation('subMenus', $filtered);
                }
                return $menu;
            })
            ->values();
    }
}
