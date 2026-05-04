import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner'; // Atau library pilihan Anda

export function useToastNotification() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);
}
