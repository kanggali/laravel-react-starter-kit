<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserService
{
    /**
     * Mengambil data user dengan filter dan pagination.
     */
    public function getAllUsersWithFilters(Request $request): LengthAwarePaginator
    {
        return User::query()
            ->with('roles')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'ILIKE', "%{$search}%")
                    ->orWhere('email', 'ILIKE', "%{$search}%")
                    ->orWhere('username', 'ILIKE', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Mengambil semua roles untuk kebutuhan dropdown.
     */
    public function getAvailableRoles(): Collection
    {
        return Role::all(['id', 'name']);
    }
}
