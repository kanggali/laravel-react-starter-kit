import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

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
import { usePermissionStore } from '@/stores/usePermissionStore';
import type { PermissionData } from '@/types/permission';
import PermissionFormModal from './form';

interface PaginationProps {
    data: PermissionData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function PermissionIndex({
    permissions,
    filters,
}: {
    permissions: PaginationProps;
    filters: any;
}) {
    const confirm = useConfirm<PermissionData>();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');
    const [isDeleting, setIsDeleting] = useState(false);
    const { can } = usePermission();

    const { openAdd, openEdit, openDetail } = usePermissionStore();

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.permissions.index'),
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
        router.delete(
            route('configuration.permissions.destroy', confirm.data?.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    confirm.close();
                    setIsDeleting(false);
                },
                onError: () => setIsDeleting(false),
            },
        );
    };

    return (
        <>
            <Head title="Permission Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Permission Management
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola permission sistem.
                        </p>
                    </div>
                    {can('create configuration/permissions') && (
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Permission
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3">
                        <div className="relative w-full flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search permission..."
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
                        Showing {permissions.from}-{permissions.to} of{' '}
                        {permissions.total}
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Permission Name</TableHead>
                                <TableHead>Guard</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions.data.length > 0 ? (
                                permissions.data.map((permission, idx) => (
                                    <TableRow key={permission.id}>
                                        <TableCell>
                                            {permissions.from + idx}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {permission.name}
                                        </TableCell>
                                        <TableCell>
                                            {permission.guard_name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TableAction
                                                onEdit={(isEditMode) =>
                                                    isEditMode
                                                        ? openEdit(permission)
                                                        : openDetail(permission)
                                                }
                                                onDelete={() =>
                                                    confirm.open(permission)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
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
                            {permissions.links.map((link, i) => (
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

            <PermissionFormModal />

            <ConfirmModal
                isOpen={confirm.isOpen}
                onClose={confirm.close}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Hapus Permission"
                description={
                    <span>
                        Apakah anda yakin ingin menghapus{' '}
                        <strong>{confirm.data?.name}</strong>? Tindakan ini
                        tidak dapat dibatalkan.
                    </span>
                }
            />
        </>
    );
}
