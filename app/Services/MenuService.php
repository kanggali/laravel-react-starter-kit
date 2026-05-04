<?php

namespace App\Services;

use App\Models\Configuration\Menu;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class MenuService
{
    /**
     * Mengambil menu dengan pencarian dinamis.
     */
    public function getPaginatedMenus(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', config('custom.per_page'));

        return Menu::query()
            ->whereNull('main_menu_id')
            ->with(['subMenus' => function ($q) use ($search) {
                $q->orderBy('orders', 'asc');
                $q->when($search, function ($subQ) use ($search) {
                    $subQ->where('name', 'ILIKE', "%{$search}%");
                });
            }])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'ILIKE', "%{$search}%")
                        ->orWhere('category', 'ILIKE', "%{$search}%")
                        ->orWhereHas('subMenus', function ($subQ) use ($search) {
                            $subQ->where('name', 'ILIKE', "%{$search}%");
                        });
                });
            })
            ->orderBy('orders', 'asc')
            ->paginate($perPage) // Gunakan variabel perPage
            ->withQueryString();
    }

    public function deleteMenu(int $id)
    {
        $menu = Menu::findOrFail($id);

        if ($menu->subMenus()->exists()) {
            $menu->subMenus()->delete();
        }

        return $menu->delete();
    }
}
