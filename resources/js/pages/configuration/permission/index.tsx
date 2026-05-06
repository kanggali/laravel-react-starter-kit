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
import PermissionFormModal from './form';

interface PermissionData {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    permissions_count?: number;
}

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');
    const [isDeleting, setIsDeleting] = useState(false);
    const { can } = usePermission();
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (
                searchTerm !== (filters.search || '') ||
                perPage !== (filters.per_page || '10')
            ) {
                router.get(
                    route('configuration.permissions.index'),
                    { search: searchTerm, per_page: perPage, page: 1 },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, perPage, filters.search, filters.per_page]);

    const handleAdd = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    const handleEdit = (permission: any, mode: boolean = true) => {
        setEditData(permission);
        setIsReadOnly(mode);
        setIsModalOpen(true);
    };

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
                            Kelola permission navigasi sistem.
                        </p>
                    </div>
                    {can('create configuration/permissions') && (
                        <Button onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Permission
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3">
                        <div className="relative flex-1">
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

                                <TableHead>Permission</TableHead>
                                <TableHead className="w-12">Guard</TableHead>
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
                                                route="configuration/permissions"
                                                onEdit={(mode) =>
                                                    handleEdit(permission, mode)
                                                }
                                                onDelete={() =>
                                                    confirm.open(permission)
                                                }
                                            ></TableAction>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center"
                                    >
                                        No permissions found.
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

            <PermissionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                editData={editData}
                isReadOnly={isReadOnly}
            />

            <ConfirmModal
                isOpen={confirm.isOpen}
                onClose={confirm.close}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Hapus Permission"
                description={
                    <span>
                        Apakah anda yakin akan menghapus data{' '}
                        <strong>"{confirm.data?.name}"</strong>. Lanjutkan?
                    </span>
                }
            />
        </>
    );
}
