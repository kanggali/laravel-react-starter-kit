import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import { useAccessRoleStore } from '@/stores/useAccessRoleStore';
import type { AccessRoleData } from '@/types/auth';
import AccessRoleFormModal from './form';

interface PaginationProps {
    data: AccessRoleData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function AccessRoleIndex({
    roles,
    filters,
    allMenus,
    allRoles,
}: {
    roles: PaginationProps;
    filters: any;
    allMenus: any[];
    allRoles: AccessRoleData[];
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');

    const { openEdit, openDetail } = useAccessRoleStore();

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) {
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.access-role.index'),
                {
                    search: searchTerm,
                    per_page: perPage,
                    page: 1,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, perPage, filters.search, filters.per_page]);

    return (
        <>
            <Head title="Access Role" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Access Role
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manajemen hak akses role terhadap menu dan aksi
                            sistem.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3">
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
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{roles.from ?? 0}</strong> to{' '}
                        <strong>{roles.to ?? 0}</strong> of {roles.total}
                    </div>
                </div>

                <div className="overflow-hidden rounded-md border bg-card">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Guard Name</TableHead>
                                <TableHead className="w-24 text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length > 0 ? (
                                roles.data.map((role, index) => (
                                    <TableRow key={role.id}>
                                        <TableCell>
                                            {roles.from + index}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {role.name}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {role.guard_name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <TableAction
                                                onEdit={(isEditMode) =>
                                                    isEditMode
                                                        ? openEdit(role)
                                                        : openDetail(role)
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

            <AccessRoleFormModal allMenus={allMenus} allRoles={allRoles} />
        </>
    );
}
