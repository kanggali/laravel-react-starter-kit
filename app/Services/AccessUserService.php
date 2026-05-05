<?php

namespace App\Services;

use App\Models\User;
use App\Models\Configuration\Menu;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class AccessUserService
{
    /**
     * Mendapatkan data users dengan roles dan permissions ter-paginate.
     */
    public function getPaginatedUsers(Request $request): LengthAwarePaginator
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $users = User::query()
            ->with(['roles', 'permissions'])
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('email', 'ILIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $users->getCollection()->transform(fn($user) => $this->formatUserData($user));

        return $users;
    }

    /**
     * Mendapatkan daftar menu dan memproses action_name untuk UI.
     */
    public function getAllMenusWithPermissions(): Collection
    {
        return Menu::with(['permissions' => fn($q) => $q->select('permissions.id', 'permissions.name')])
            ->orderBy('id')
            ->get()
            ->map(function ($menu) {
                return [
                    'id'   => $menu->id,
                    'name' => $menu->name,
                    'permissions' => $menu->permissions->map(function ($permission) {
                        $action = explode(' ', $permission->name)[0];
                        return [
                            'id'          => $permission->id,
                            'name'        => $permission->name,
                            'action_name' => strtoupper($action),
                        ];
                    }),
                ];
            });
    }

    /**
     * Mendapatkan daftar ringkas user untuk kebutuhan dropdown/pilihan.
     */
    public function getUserOptions(): Collection
    {
        return User::select('id', 'name')->get();
    }

    /**
     * Sinkronisasi direct permissions ke user.
     */
    public function syncUserPermissions(User $user, array $permissionIds): void
    {
        $user->syncPermissions($permissionIds);
    }

    /**
     * Helper transformasi data User.
     */
    private function formatUserData(User $user): array
    {
        return [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->map(fn($role) => [
                'id'   => $role->id,
                'name' => $role->name,
            ]),
            'permission_ids' => $user->permissions->pluck('id')->toArray(),
        ];
    }
}
