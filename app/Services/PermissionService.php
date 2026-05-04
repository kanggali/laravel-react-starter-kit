<?php

namespace App\Services;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionService
{
    public function getPaginatedPermissions(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        return Permission::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('guard_name', 'ILIKE', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }
}
