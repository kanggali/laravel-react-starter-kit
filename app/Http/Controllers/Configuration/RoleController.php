<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Role\StoreRoleRequest;
use App\Http\Requests\Configuration\Role\UpdateRoleRequest;
use App\Models\Role;
use App\Services\RoleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{

    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('configuration/role/index', [
            'roles' => $this->roleService->getPaginatedRoles($request),
            'filters' => $request->only(['search', 'per_page']),
        ]);
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
    public function store(StoreRoleRequest $request)
    {
        Role::create($request->validated());

        return back()->with('success', 'Role created successfully.');
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
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update($request->validated());

        return back()->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        try {
            $this->roleService->deleteRole($role);
            return back()->with('success', 'Role updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }
}
