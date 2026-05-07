import { Head, router } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
import { useRoleStore } from '@/stores/useRoleStore';
import type { RoleData } from '@/types/role';
import RoleFormModal from './form';

interface PaginationProps {
    data: RoleData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function RoleIndex({
    roles,
    filters,
}: {
    roles: PaginationProps;
    filters: any;
}) {
    const confirm = useConfirm<RoleData>();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');
    const [isDeleting, setIsDeleting] = useState(false);
    const { can } = usePermission();

    const { openAdd, openEdit, openDetail } = useRoleStore();

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.roles.index'),
                { search: searchTerm, per_page: perPage, page: 1 },
                { preserveState: true, replace: true, preserveScroll: true },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, perPage, filters.search, filters.per_page]);

    const handleConfirmDelete = () => {
        if (!confirm.data?.id) {
            return;
        }

        setIsDeleting(true);
        router.delete(route('configuration.role.destroy', confirm.data?.id), {
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
            <Head title="Role Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Role Management
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola role akses sistem.
                        </p>
                    </div>
                    {can('create configuration/roles') && (
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Role
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3 max-sm:flex-col">
                        <div className="relative w-full flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search role..."
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
                </div>

                <div className="overflow-hidden rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Guard</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length > 0 ? (
                                roles.data.map((role, idx) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            {roles.from + idx}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {role.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {role.guard_name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TableAction
                                                onEdit={(isEdit) =>
                                                    isEdit
                                                        ? openEdit(role)
                                                        : openDetail(role)
                                                }
                                                onDelete={() =>
                                                    confirm.open(role)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center"
                                    >
                                        No roles found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            {roles.links.map((link, i) => (
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

            <RoleFormModal />

            <ConfirmModal
                isOpen={confirm.isOpen}
                onClose={confirm.close}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Hapus Role"
            />
        </>
    );
}
