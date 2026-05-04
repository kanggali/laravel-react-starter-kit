import React from 'react';
import { Edit, Trash2, ChevronDown, Eye } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { usePermission } from '@/hooks/use-permission';

interface TableActionProps {
    onEdit?: () => void;
    onDelete?: () => void;
    onDetail?: () => void;
    className?: string;
    permissionEdit?: string;
    permissionDelete?: string;
}

export default function TableAction({
    onEdit,
    onDelete,
    onDetail,
    className = "",
    permissionEdit,
    permissionDelete
}: TableActionProps) {
    const { can } = usePermission();

    const canEdit = onEdit && (!permissionEdit || can(permissionEdit));
    const canDelete = onDelete && (!permissionDelete || can(permissionDelete));

    if (!onDetail && !canEdit && !canDelete) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm">
                    Action <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {onDetail && (
                    <DropdownMenuItem onClick={onDetail} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                )}

                {canEdit && (
                    <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                )}

                {canDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-destructive cursor-pointer focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" /> Delete
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
