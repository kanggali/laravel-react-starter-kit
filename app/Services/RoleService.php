<?php

namespace App\Services;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RoleService
{
    public function getPaginatedRoles(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        return Role::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('guard_name', 'ILIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function deleteRole(Role $role)
    {
        $protectedRoles = ['super-admin', 'admin'];

        if (in_array(strtolower($role->name), $protectedRoles)) {
            throw ValidationException::withMessages([
                'message' => "Role '{$role->name}' adalah role sistem dan tidak dapat dihapus."
            ]);
        }

        return $role->delete();
    }
}
