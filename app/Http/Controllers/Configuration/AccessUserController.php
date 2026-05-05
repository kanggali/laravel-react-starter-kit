<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\AccessRole\UpdateAccessRoleRequest;
use App\Models\Configuration\Menu;
use App\Models\User;
use App\Services\AccessUserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessUserController extends Controller
{
    public function __construct(
        protected AccessUserService $accessUserService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('configuration/access-user/index', [
            'users'    => $this->accessUserService->getPaginatedUsers($request),
            'filters'  => $request->only(['search', 'per_page']),
            'allMenus' => $this->accessUserService->getAllMenusWithPermissions(),
            'allUsers' => $this->accessUserService->getUserOptions(),
        ]);
    }


    private function getAllMenusWithPermissions()
    {
        return Menu::with(['permissions' => function ($query) {
            $query->select('permissions.id', 'permissions.name');
        }])
            ->orderBy('id')
            ->get()
            ->map(function ($menu) {
                return [
                    'id' => $menu->id,
                    'name' => $menu->name,
                    'permissions' => $menu->permissions->map(function ($permission) {
                        $name = $permission->name;

                        $parts = explode(' ', $name);
                        $action = $parts[0];

                        return [
                            'id' => $permission->id,
                            'name' => $name,
                            'action_name' => strtoupper($action),
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
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccessRoleRequest $request, User $user)
    {
        $this->accessUserService->syncUserPermissions(
            $user,
            $request->input('permission_ids')
        );

        return back()->with('success', 'User permissions updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
