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
    onEdit?: (mode: boolean) => void;
    onDelete?: () => void;
    onDetail?: () => void;
    className?: string;
    route?: string;
}

export default function TableAction({
    onEdit,
    onDelete,
    className = "",
    route,
}: TableActionProps) {
    const { can } = usePermission();

    const canDetail =  !route || can(`read ${route}`);
    const canEdit = onEdit && (!route || can(`update ${route}`));
    const canDelete = onDelete && (!route || can(`delete ${route}`));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm">
                    Action <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {canDetail && (
                    <DropdownMenuItem onClick={()=>onEdit?.(false)} className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                )}

                {canEdit && (
                    <DropdownMenuItem onClick={()=>onEdit?.(true)} className="cursor-pointer">
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
