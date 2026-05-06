import { useForm } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
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

interface Role {
    id: number;
    name: string;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    permission_ids: number[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserData | null;
    allMenus: MenuWithPermissions[];
    allUsers: UserData[];
    isReadOnly: boolean;
}

const sortPermissions = (permissions: Permission[]) => {
    const priority = ['read', 'create', 'update', 'delete'];

    return [...permissions].sort((a, b) => {
        const indexA = priority.indexOf(a.action_name.toLowerCase());
        const indexB = priority.indexOf(b.action_name.toLowerCase());

        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }

        if (indexA !== -1) {
            return -1;
        }

        if (indexB !== -1) {
            return 1;
        }

        return a.action_name.localeCompare(b.action_name);
    });
};

export default function AccessUserFormModal({
    isOpen,
    onClose,
    user,
    allMenus,
    allUsers,
    isReadOnly,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, put, processing, reset } = useForm({
        permission_ids: [] as number[],
    });

    useEffect(() => {
        if (user && isOpen) {
            setData('permission_ids', user.permission_ids || []);
        } else if (!isOpen) {
            reset();
        }
    }, [user, isOpen, setData, reset]);

    const handleCopyFromUser = (selectedUserId: string) => {
        const selectedUser = allUsers.find(
            (u) => u.id === parseInt(selectedUserId),
        );

        if (selectedUser) {
            setData('permission_ids', [...(selectedUser.permission_ids || [])]);
        }
    };

    const filteredMenus = useMemo(() => {
        return allMenus.filter((m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [allMenus, searchQuery]);

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

        if (user && isReadOnly) {
            put(route('configuration.access-user.update', user.id), {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isReadOnly ? 'Detail Access User' : 'Edit Access User'}
            maxWidth="4xl"
        >
            <form onSubmit={submit} className="flex max-h-[85vh] flex-col">
                <div className="flex-1 overflow-y-auto px-1">
                    <fieldset disabled={isReadOnly} className="space-y-6">
                        <div className="space-y-6 pb-4">
                            {/* Header Nama User sesuai Gambar 2 */}
                            <h2 className="mt-2 text-xl font-bold text-[#2e59d9] uppercase">
                                User: {user?.name}
                            </h2>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {!isReadOnly && (
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                            Copy from user
                                        </Label>
                                        <select
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm outline-none"
                                            onChange={(e) =>
                                                handleCopyFromUser(
                                                    e.target.value,
                                                )
                                            }
                                            value=""
                                        >
                                            <option value="" disabled>
                                                Choose User to Copy
                                            </option>
                                            {allUsers
                                                .filter(
                                                    (u) => u.id !== user?.id,
                                                )
                                                .map((u) => (
                                                    <option
                                                        key={u.id}
                                                        value={u.id}
                                                    >
                                                        {u.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}
                                <div
                                    className={`space-y-2 ${isReadOnly ? 'md:col-span-2' : ''}`}
                                >
                                    <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Search Menu
                                    </Label>
                                    <div className="relative">
                                        <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search menu..."
                                            className="h-10 pl-9"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-left">
                                            <th className="w-1/3 p-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                                Menu
                                            </th>
                                            <th className="p-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted-foreground/10">
                                        {filteredMenus.map((menu) => {
                                            const isRowChecked =
                                                menu.permissions.length > 0 &&
                                                menu.permissions.every((p) =>
                                                    data.permission_ids.includes(
                                                        p.id,
                                                    ),
                                                );

                                            return (
                                                <tr
                                                    key={menu.id}
                                                    className={
                                                        !menu.main_menu_id
                                                            ? 'bg-muted/20'
                                                            : 'hover:bg-muted/5'
                                                    }
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            {menu.permissions
                                                                .length > 0 && (
                                                                <Checkbox
                                                                    checked={
                                                                        isRowChecked
                                                                    }
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
                                                                        : 'pl-4 text-muted-foreground'
                                                                }
                                                            >
                                                                {menu.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                                                            {sortPermissions(
                                                                menu.permissions,
                                                            ).map((perm) => (
                                                                <div
                                                                    key={
                                                                        perm.id
                                                                    }
                                                                    className="flex min-w-20 items-center gap-2"
                                                                >
                                                                    <Switch
                                                                        id={`perm-${perm.id}`}
                                                                        checked={data.permission_ids.includes(
                                                                            perm.id,
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            handleTogglePermission(
                                                                                perm.id,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Label
                                                                        htmlFor={`perm-${perm.id}`}
                                                                        className="cursor-pointer text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase"
                                                                    >
                                                                        {
                                                                            perm.action_name
                                                                        }
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="mt-4 flex justify-end gap-3 border-t pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {isReadOnly ? 'Close' : 'Cancel'}
                    </Button>
                    {!isReadOnly && (
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
