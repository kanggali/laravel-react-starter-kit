<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Configuration\Menu;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AccessRoleService
{
    
    /**
     * Mendapatkan data Roles dengan pagination dan transformasi data.
     */
    public function getPaginatedRoles(Request $request): LengthAwarePaginator
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $roles = Role::query()
            ->with('permissions')
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'ILIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        // Transformasi collection di dalam paginator
        $roles->getCollection()->transform(fn($role) => $this->formatRoleData($role));

        return $roles;
    }

    /**
     * Mendapatkan semua daftar menu beserta permission-nya.
     */
    public function getAllMenusWithPermissions(): Collection
    {
        return Menu::with('permissions')
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($menu) {
                return [
                    'id'           => $menu->id,
                    'name'         => $menu->name,
                    'main_menu_id' => $menu->main_menu_id,
                    'permissions'  => $menu->permissions->map(function ($p) {
                        return [
                            'id'          => $p->id,
                            'action_name' => explode(' ', $p->name)[0] ?? $p->name,
                        ];
                    }),
                ];
            });
    }

    /**
     * Mendapatkan daftar role (kecuali superadmin) untuk pilihan.
     */
    public function getRoleOptions(): Collection
    {
        return Role::where('name', '!=', 'superadmin')
            ->with('permissions')
            ->get()
            ->map(fn($r) => $this->formatRoleData($r));
    }

    /**
     * Update permissions untuk role tertentu.
     */
    public function updateRolePermissions(Role $role, array $permissionIds): void
    {
        $role->syncPermissions($permissionIds);
    }

    /**
     * Helper untuk standarisasi output data Role.
     */
    private function formatRoleData(Role $role): array
    {
        return [
            'id'             => $role->id,
            'name'           => $role->name,
            'guard_name'     => $role->guard_name ?? 'web',
            'permission_ids' => $role->permissions->pluck('id')->toArray(),
        ];
    }
}
