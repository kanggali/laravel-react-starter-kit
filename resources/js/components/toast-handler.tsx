import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ToastHandler() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        // Opsional: tambahkan pesan peringatan jika ada di backend
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    return null;
}
