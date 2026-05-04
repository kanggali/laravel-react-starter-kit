import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
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
            <DialogContent className={cn(
                "overflow-hidden",
                maxWidthClass[maxWidth]
            )}>
                {(title || description) && (
                    <DialogHeader>
                        {title && <DialogTitle className={cn(!description && "text-center")}>{title}</DialogTitle>}
                        {description && <DialogDescription className="text-center">{description}</DialogDescription>}
                    </DialogHeader>
                )}
                <div className="w-full">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
