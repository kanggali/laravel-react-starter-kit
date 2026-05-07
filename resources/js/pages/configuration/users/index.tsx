import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import TableAction from '@/components/ui/table-action';
import { useConfirm } from '@/hooks/use-confirm';
import { usePermission } from '@/hooks/use-permission';
import { useUserStore } from '@/stores/useUserStore';
import type { UserManagementData } from '@/types/auth';
import type { RoleData } from '@/types/role';
import UserFormModal from './form';

interface PaginationProps {
    data: UserManagementData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function UserIndex({
    users,
    allRoles,
    filters,
}: {
    users: PaginationProps;
    allRoles: RoleData[];
    filters: any;
}) {
    const confirm = useConfirm<UserManagementData>();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');
    const [isDeleting, setIsDeleting] = useState(false);
    const { can } = usePermission();

    const { openAdd, openEdit, openDetail } = useUserStore();

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.users.index'),
                { search: searchTerm, per_page: perPage, page: 1 },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, perPage, filters.search, filters.per_page]);

    const handleConfirmDelete = () => {
        if (!confirm.data?.id) {
            return;
        }

        setIsDeleting(true);
        router.delete(route('configuration.users.destroy', confirm.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                confirm.close();
                setIsDeleting(false);
            },
            onError: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            User Management
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola data pengguna dan akses peran mereka.
                        </p>
                    </div>
                    {can('create configuration/users') && (
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add User
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3">
                        <div className="relative w-full flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(e.target.value)}
                            className="h-9 w-20 rounded-md border border-input bg-background text-xs outline-none"
                        >
                            {['10', '20', '50', '100'].map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Showing {users.from}-{users.to} of {users.total}
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length > 0 ? (
                                users.data.map((user, idx) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            {users.from + idx}
                                        </TableCell>
                                        <TableCell className="font-medium uppercase">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            {user.roles.map((role, i) => (
                                                <Badge
                                                    key={role.id}
                                                    className={`rounded-lg border-none bg-cyan-500 text-white hover:bg-primary ${
                                                        i <
                                                        user.roles.length - 1
                                                            ? 'mr-1'
                                                            : ''
                                                    }`}
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TableAction
                                                onEdit={(isEditMode) =>
                                                    isEditMode
                                                        ? openEdit(user)
                                                        : openDetail(user)
                                                }
                                                onDelete={() =>
                                                    confirm.open(user)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            {users.links.map((link, i) => (
                                <PaginationItem key={i}>
                                    <Button
                                        variant={
                                            link.active ? 'outline' : 'ghost'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url && router.visit(link.url)
                                        }
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                </PaginationItem>
                            ))}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>

            <UserFormModal allRoles={allRoles} />

            <ConfirmModal
                isOpen={confirm.isOpen}
                onClose={confirm.close}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Hapus User"
                description={
                    <span>
                        Apakah anda yakin akan menghapus data pengguna{' '}
                        <strong>"{confirm.data?.name}"</strong>. Lanjutkan?
                    </span>
                }
            />
        </>
    );
}
