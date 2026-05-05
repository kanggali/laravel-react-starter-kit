<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\Menu;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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

        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                }),
                'permission_ids' => $user->permissions->pluck('id')->toArray(),
            ];
        });

        return Inertia::render('configuration/access-user/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'per_page']),
            'allMenus' => $this->getAllMenusWithPermissions(),
            'allUsers' => User::select('id', 'name')->get(),
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
    public function update(Request $request, User $user)
    {
        $user->syncPermissions($request->permission_ids);

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
