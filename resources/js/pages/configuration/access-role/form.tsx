import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

interface Permission {
    id: number;
    action_name: string;
}

interface MenuWithPermissions {
    id: number;
    name: string;
    main_menu_id: number | null;
    permissions: Permission[];
}

interface RoleData {
    id: number;
    name: string;
    guard_name: string;
    permission_ids: number[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    role: RoleData | null;
    allMenus: MenuWithPermissions[];
    allRoles: RoleData[];
}

export default function AccessRoleFormModal({
    isOpen,
    onClose,
    role,
    allMenus,
    allRoles,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, put, processing, reset } = useForm({
        permission_ids: [] as number[],
    });

    useEffect(() => {
        if (role && isOpen) {
            setData('permission_ids', role.permission_ids || []);
        } else {
            reset();
        }
    }, [role, isOpen, reset, setData]);

    const handleCopyFromRole = (selectedRoleId: string) => {
        if (!selectedRoleId) {
            return;
        }

        console.log('Daftar Role tersedia:', allRoles);

        const selectedRole = allRoles.find(
            (r) => r.id === parseInt(selectedRoleId),
        );

        if (selectedRole) {
            console.log(
                'Copying permissions dari:',
                selectedRole.name,
                selectedRole.permission_ids,
            );

            setData('permission_ids', [...(selectedRole.permission_ids || [])]);
        } else {
            console.error('Role tidak ditemukan atau data izin kosong.');
        }
    };

    const filteredMenus = allMenus.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleTogglePermission = (id: number) => {
        const current = [...data.permission_ids];
        const index = current.indexOf(id);

        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }

        setData('permission_ids', current);
    };

    const handleToggleRow = (menuPermissions: Permission[]) => {
        const rowIds = menuPermissions.map((p) => p.id);
        const currentIds = [...data.permission_ids];
        const allSelected = rowIds.every((id) => currentIds.includes(id));

        let nextIds;

        if (allSelected) {
            nextIds = currentIds.filter((id) => !rowIds.includes(id));
        } else {
            const toAdd = rowIds.filter((id) => !currentIds.includes(id));
            nextIds = [...currentIds, ...toAdd];
        }

        setData('permission_ids', nextIds);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (role) {
            put(route('configuration.access-role.update', role.id), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Role"
            maxWidth="2xl"
        >
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-[#283593]">
                        Role: {role?.name}
                    </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Copy from role</Label>
                        <select
                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
                            onChange={(e) => handleCopyFromRole(e.target.value)}
                            value="" // Reset select ke "Choose Role" setelah dipilih
                        >
                            <option value="" disabled>
                                Choose Role to Copy
                            </option>
                            {allRoles
                                .filter((r) => r.id !== role?.id)
                                .map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Search Menu</Label>
                        <Input
                            placeholder="Search.."
                            className="h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-112.5] rounded-md border p-4">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-background">
                            <tr className="border-b border-muted-foreground/20 text-left">
                                <th className="pb-2 font-semibold text-muted-foreground">
                                    Menu
                                </th>
                                <th className="pb-2 font-semibold text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted-foreground/10">
                            {filteredMenus.map((menu) => {
                                // Hitung status checkbox baris ini secara real-time
                                const rowPermIds = menu.permissions.map(
                                    (p) => p.id,
                                );
                                const isRowChecked =
                                    rowPermIds.length > 0 &&
                                    rowPermIds.every((id) =>
                                        data.permission_ids.includes(id),
                                    );

                                return (
                                    <tr
                                        key={menu.id}
                                        className={
                                            !menu.main_menu_id
                                                ? 'bg-muted/30'
                                                : 'hover:bg-muted/10'
                                        }
                                    >
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-3">
                                                {/* Checkbox hanya muncul jika ada permissions di baris tersebut */}
                                                {menu.permissions.length >
                                                    0 && (
                                                    <Checkbox
                                                        checked={isRowChecked}
                                                        onCheckedChange={() =>
                                                            handleToggleRow(
                                                                menu.permissions,
                                                            )
                                                        }
                                                    />
                                                )}
                                                <span
                                                    className={
                                                        !menu.main_menu_id
                                                            ? 'font-bold'
                                                            : 'pl-2'
                                                    }
                                                >
                                                    {menu.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex flex-wrap gap-x-6 gap-y-3">
                                                {menu.permissions.map(
                                                    (perm) => (
                                                        <div
                                                            key={perm.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Switch
                                                                checked={data.permission_ids.includes(
                                                                    perm.id,
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handleTogglePermission(
                                                                        perm.id,
                                                                    )
                                                                }
                                                            />
                                                            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                                                {
                                                                    perm.action_name
                                                                }
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </ScrollArea>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Permissions'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
