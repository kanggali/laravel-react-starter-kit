<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\AccessRole\UpdateAccessRoleRequest;
use App\Models\Configuration\Menu;
use App\Models\Role;
use App\Services\AccessRoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessRoleController extends Controller
{

    public function __construct(
        protected AccessRoleService $accessRoleService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('configuration/access-role/index', [
            'roles'    => $this->accessRoleService->getPaginatedRoles($request),
            'filters'  => $request->only(['search', 'per_page']),
            'allMenus' => $this->accessRoleService->getAllMenusWithPermissions(),
            'allRoles' => $this->accessRoleService->getRoleOptions(),
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
        $this->accessRoleService->updateRolePermissions(
            $role,
            $request->input('permission_ids')
        );

        return back()->with('success', "Hak akses untuk role {$role->name} berhasil diperbarui.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }
}
