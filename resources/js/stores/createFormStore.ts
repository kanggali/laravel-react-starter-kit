import { create } from 'zustand';
import { ModalMode } from '@/types/enums';

interface FormState<T> {
    mode: ModalMode;
    editData: T | null;
    searchQuery: string;
    openAdd: () => void;
    openEdit: (data: T) => void;
    openDetail: (data: T) => void;
    setSearchQuery: (query: string) => void; // Kontrak
    closeModal: () => void;
}

export const createFormStore = <T>() =>
    create<FormState<T>>((set) => ({
        mode: ModalMode.CLOSED,
        editData: null,
        searchQuery: '',

        openAdd: () => set({
            mode: ModalMode.CREATE,
            editData: null,
            searchQuery: ''
        }),

        openEdit: (data) => set({
            mode: ModalMode.EDIT,
            editData: data,
            searchQuery: ''
        }),

        openDetail: (data) => set({
            mode: ModalMode.DETAIL,
            editData: data,
            searchQuery: ''
        }),

        // IMPLEMENTASI YANG KURANG:
        setSearchQuery: (query) => set({ searchQuery: query }),

        closeModal: () => set({
            mode: ModalMode.CLOSED,
            editData: null,
            searchQuery: ''
        }),
    }));
