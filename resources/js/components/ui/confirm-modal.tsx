import React from 'react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: React.ReactNode;
    confirmText?: string;
    loading?: boolean;
    variant?: 'destructive' | 'default';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi Hapus',
    description,
    confirmText = 'Hapus',
    loading = false,
    variant = 'destructive'
}: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="100"
        >
            <div className="flex flex-col items-center">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variant === 'destructive' ? 'bg-destructive/10' : 'bg-yellow-500/10'}`}>
                    <AlertTriangle className={`h-6 w-6 ${variant === 'destructive' ? 'text-destructive' : 'text-yellow-500'}`} />
                </div>
                <h2 className="text-lg font-semibold text-center mb-2">{title}</h2>
                <div className="text-sm text-muted-foreground text-center mb-6">
                    {description || 'Apakah Anda yakin ingin menghapus data ini?'}
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button variant="outline" onClick={onClose} disabled={loading} className="sm:w-24">
                    Batal
                </Button>
                <Button variant={variant} onClick={onConfirm} disabled={loading} className="sm:w-32">
                    {loading ? 'Memproses...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
}
