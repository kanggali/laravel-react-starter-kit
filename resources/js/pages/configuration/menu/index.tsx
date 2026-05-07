import { Head, router } from '@inertiajs/react';
import { HelpCircle, Plus, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
import { useMenuStore } from '@/stores/useMenuStore'; // Gunakan Store
import type { MenuData } from '@/types/auth';
import MenuFormModal from './form';

interface PaginationProps {
    data: MenuData[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
    from: number;
    to: number;
}

export default function MenuIndex({
    menus,
    filters,
}: {
    menus: PaginationProps;
    filters: any;
}) {
    const confirm = useConfirm<MenuData>();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || '10');
    const [isDeleting, setIsDeleting] = useState(false);
    const { can } = usePermission();

    const { openAdd, openEdit, openDetail } = useMenuStore();

    const parentMenus = menus.data.map((m) => ({
        id: m.id ?? null,
        name: m.name,
    }));

    useEffect(() => {
        const isSearchChanged = searchTerm !== (filters.search || '');
        const isPerPageChanged = perPage !== (filters.per_page || '10');

        if (!isSearchChanged && !isPerPageChanged) return;

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('configuration.menu.index'),
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
        if (!confirm.data?.id) return;

        setIsDeleting(true);
        router.delete(route('configuration.menu.destroy', confirm.data?.id), {
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
            <Head title="Menu Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Menu Management
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Kelola hierarki menu navigasi sistem.
                        </p>
                    </div>
                    {can('create configuration/menu') && (
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Menu
                        </Button>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="flex w-full max-w-sm items-center gap-3">
                        <div className="relative w-full flex-1">
                            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search menu..."
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
                                <TableHead className="w-12">Icon</TableHead>
                                <TableHead>Menu Name</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {menus.data.length > 0 ? (
                                menus.data.map((menu) => (
                                    <React.Fragment key={menu.id}>
                                        <TableRow className="bg-muted/30 font-medium">
                                            <TableCell>
                                                <IconRenderer
                                                    iconName={menu.icon}
                                                />
                                            </TableCell>
                                            <TableCell>{menu.name}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                /{menu.url}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <TableAction
                                                    onEdit={(isEditMode) =>
                                                        isEditMode
                                                            ? openEdit(menu)
                                                            : openDetail(menu)
                                                    }
                                                    onDelete={() =>
                                                        confirm.open(menu)
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                        {menu.sub_menus?.map((sub) => (
                                            <TableRow
                                                key={sub.id}
                                                className="hover:bg-muted/10"
                                            >
                                                <TableCell className="text-center opacity-40">
                                                    <IconRenderer
                                                        iconName={sub.icon}
                                                    />
                                                </TableCell>
                                                <TableCell className="pl-10 text-sm">
                                                    {sub.name}
                                                </TableCell>
                                                <TableCell className="text-xs opacity-60">
                                                    /{sub.url}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <TableAction
                                                        onEdit={(isEditMode) =>
                                                            isEditMode
                                                                ? openEdit(sub)
                                                                : openDetail(
                                                                      sub,
                                                                  )
                                                        }
                                                        onDelete={() =>
                                                            confirm.open(sub)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
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
                            {menus.links.map((link, i) => (
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


            {/* Modal sekarang hanya butuh parentMenus, sisanya ambil dari Store */}
            <MenuFormModal parentMenus={parentMenus} />

            <ConfirmModal
                isOpen={confirm.isOpen}
                onClose={confirm.close}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
                title="Hapus Menu"
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

function IconRenderer({ iconName }: { iconName: string }) {
    const icons = LucideIcons as unknown as Record<string, React.ElementType>;
    const Icon = icons[iconName];

    return Icon ? (
        <Icon className="size-4" />
    ) : (
        <HelpCircle className="size-4 opacity-20" />
    );
}
