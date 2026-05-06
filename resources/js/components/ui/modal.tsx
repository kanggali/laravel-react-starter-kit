import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: React.ReactNode;
    children: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "100";
}

const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "4xl": "sm:max-w-4xl",
    "100": "sm:max-w-[400px]",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = "md",
}: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className={cn(
                    "overflow-hidden",
                    maxWidthClass[maxWidth]
                )}
                aria-describedby={description ? undefined : Array.isArray(description) ? undefined : undefined}
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target?.closest('.select2-container') || target?.closest('.select2-search__field')) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    {title ? (
                        <DialogTitle className={cn(!description && "text-center")}>
                            {title}
                        </DialogTitle>
                    ) : (
                        <VisuallyHidden.Root>
                            <DialogTitle>Modal Dialog</DialogTitle>
                        </VisuallyHidden.Root>
                    )}

                    {description ? (
                        <DialogDescription className="text-center">
                            {description}
                        </DialogDescription>
                    ) : (
                        <VisuallyHidden.Root>
                            <DialogDescription>
                                Description for the modal dialog.
                            </DialogDescription>
                        </VisuallyHidden.Root>
                    )}
                </DialogHeader>

                <div className="w-full">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
