<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Permission\StorePermissionRequest;
use App\Http\Requests\Configuration\Permission\UpdatePermissionRequest;
use App\Models\Permission;
use App\Services\PermissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('configuration/permission/index', [
            'permissions' => $this->permissionService->getPaginatedPermissions($request),
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
    public function store(StorePermissionRequest $request)
    {
        Permission::create($request->all());

        return back()->with('success', 'Permission berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $permission->update($request->all());

        return back()->with('success', 'Permission berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();
        return back()->with('success', 'Permission berhasil dihapus.');
    }
}
