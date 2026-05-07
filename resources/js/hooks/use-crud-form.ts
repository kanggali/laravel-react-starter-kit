import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { ModalMode } from '@/types/enums';

interface UseCrudFormProps<T> {
    mode: ModalMode;
    editData: T | null;
    initialValues: any;
    transformData?: (data: T) => any;
}

export function useCrudForm<T>({ mode, editData, initialValues, transformData }: UseCrudFormProps<T>) {
    const form = useForm(initialValues);
    const { setData, reset, clearErrors } = form;

    const isOpen = mode !== ModalMode.CLOSED;
    const isReadOnly = mode === ModalMode.DETAIL;

    useEffect(() => {
        if (isOpen) {
            if (editData && mode !== ModalMode.CREATE) {
                const dataToSet = transformData ? transformData(editData) : editData;
                setData(dataToSet);
            } else {
                reset();
            }

            clearErrors();
        }
    }, [isOpen, editData, mode, setData, reset, clearErrors, transformData]);

    return { ...form, isOpen, isReadOnly };
}
