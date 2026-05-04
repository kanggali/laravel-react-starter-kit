import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props as any;

    const user = auth.user;
    const permissions = user?.permissions ?? [];
    const roles = user?.roles ?? [];

    // Cek apakah user adalah superadmin
    const isSuperAdmin = roles.includes('superadmin');

    const can = (permission: string): boolean => {
        // Jika superadmin, abaikan semua pengecekan permission dan beri akses
        if (isSuperAdmin) {
            return true
        }

        // Pengecekan permission HANYA dilakukan jika bukan superadmin
        return permissions.includes(permission);
    };

    const hasAny = (permissionList: string[]): boolean => {
        if (isSuperAdmin) {
            return true
        }

        // Hanya cek jika bukan superadmin
        return permissionList.some(p => permissions.includes(p));
    };

    const hasAll = (permissionList: string[]): boolean => {
        if (isSuperAdmin) {
            return true
        }

        // Hanya cek jika bukan superadmin
        return permissionList.every(p => permissions.includes(p));
    };

    return { can, hasAny, hasAll, isSuperAdmin };
}
