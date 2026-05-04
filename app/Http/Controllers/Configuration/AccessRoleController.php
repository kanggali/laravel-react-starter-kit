<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\AccessRole\UpdateAccessRoleRequest;
use App\Models\Configuration\Menu;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $roles = Role::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'ILIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $roles->getCollection()->transform(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permission_ids' => $role->permissions->pluck('id')->toArray(),
            ];
        });

        return Inertia::render('configuration/access-role/index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'per_page']),
            'allMenus' => $this->getAllMenusWithPermissions(),
            'allRoles' => Role::where('name', '!=', 'superadmin')
                ->with('permissions')
                ->get()
                ->map(function ($r) {
                    return [
                        'id' => $r->id,
                        'name' => $r->name,
                        'permission_ids' => $r->permissions->pluck('id')->toArray(),
                    ];
                }),
        ]);
    }

    private function getAllMenusWithPermissions()
    {
        return Menu::with('permissions')
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'main_menu_id' => $menu->main_menu_id,
                    'permissions' => $menu->permissions->map(function ($p) {
                        return [
                            'id' => $p->id,
                            'action_name' => explode(' ', $p->name)[0] ?? $p->name,
                        ];
                    }),
                ];
            });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccessRoleRequest $request, Role $role)
    {
        $permissionIds = $request->input('permission_ids');

        $role->syncPermissions($permissionIds);

        return back()->with('success', 'Hak akses untuk role ' . $role->name . ' berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }
}
