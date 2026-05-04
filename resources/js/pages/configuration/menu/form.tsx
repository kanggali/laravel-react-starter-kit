import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';

interface MenuData {
    id: number | null;
    name: string;
    url: string;
    category: string;
    icon: string;
    main_menu_id: number | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editData: MenuData | null;
    parentMenus: { id: number; name: string }[];
}

export default function MenuFormModal({
    isOpen,
    onClose,
    editData,
    parentMenus,
}: Props) {
    // Inisialisasi form dengan default values
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            id: null as number | null,
            name: '',
            url: '',
            category: 'MANAGEMENT',
            icon: '',
            main_menu_id: null as number | null,
        });

    // Sinkronisasi data saat modal dibuka untuk Edit atau Add
    useEffect(() => {
        if (editData) {
            setData({
                id: editData.id,
                name: editData.name,
                url: editData.url,
                category: editData.category,
                icon: editData.icon,
                main_menu_id: editData.main_menu_id ?? null,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [editData, isOpen, setData, reset, clearErrors]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
        };

        if (data.id) {
            put(route('configuration.menu.update', data.id), options);
        } else {
            post(route('configuration.menu.store'), options);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={data.id ? 'Edit Menu' : 'Add New Menu'}
            maxWidth="md"
        >
            <form onSubmit={submit} className="space-y-4">
                {/* Pemilihan Parent Menu (Dinamis) */}
                <div className="grid gap-2">
                    <Label htmlFor="main_menu_id">Parent Menu (Optional)</Label>
                    <select
                        id="main_menu_id"
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none focus:ring-1 focus:ring-ring"
                        value={data.main_menu_id ?? ''}
                        onChange={(e) =>
                            setData(
                                'main_menu_id',
                                e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                            )
                        }
                    >
                        <option value="">-- No Parent (Main Menu) --</option>
                        {parentMenus.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-[10px] text-muted-foreground">
                        Pilih jika ingin menjadikan ini sebagai submenu.
                    </p>
                </div>

                {/* Input Nama Menu */}
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g. User Management"
                    />
                    <InputError message={errors.name} />
                </div>

                {/* Input URL Path */}
                <div className="grid gap-2">
                    <Label htmlFor="url">URL Path</Label>
                    <Input
                        id="url"
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        placeholder="configuration/users"
                    />
                    <InputError message={errors.url} />
                </div>

                {/* Baris Kategori & Icon */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) =>
                                setData('category', e.target.value)
                            }
                            placeholder="MANAGEMENT"
                        />
                        <InputError message={errors.category} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="icon">Icon Name</Label>
                        <Input
                            id="icon"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            placeholder="Settings atau Users"
                        />
                        <InputError message={errors.icon} />
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {data.id ? 'Update' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
