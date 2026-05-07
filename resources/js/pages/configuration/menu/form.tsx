import React, { useCallback } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { ModalMode } from '@/types/enums';
import { useMenuStore } from '@/stores/useMenuStore';
import { useCrudForm } from '@/hooks/use-crud-form';
import type { MenuData } from '@/types/auth';

interface Props {
    parentMenus: { id: number | null; name: string }[];
}

export default function MenuFormModal({ parentMenus }: Props) {
    const { mode, editData, closeModal } = useMenuStore();

    const transformMenuData = useCallback(
        (menu: MenuData) => ({
            id: menu.id,
            name: menu.name,
            url: menu.url,
            category: menu.category,
            icon: menu.icon,
            main_menu_id: menu.main_menu_id ?? null,
            active: menu.active,
            orders: menu.orders ?? 0,
        }),
        [],
    );

    const { data, setData, post, put, processing, errors, isOpen, isReadOnly } =
        useCrudForm<MenuData>({
            mode,
            editData,
            initialValues: {
                id: null as number | null,
                name: '',
                url: '',
                category: 'MANAGEMENT',
                icon: '',
                main_menu_id: null as number | null,
                active: true as boolean | number,
                orders: 0,
            },
            transformData: transformMenuData,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isReadOnly) return;

        const options = {
            onSuccess: () => closeModal(),
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
            onClose={closeModal}
            title={
                mode === ModalMode.CREATE
                    ? 'Add New Menu'
                    : mode === ModalMode.EDIT
                      ? 'Edit Menu'
                      : 'Detail Menu'
            }
            maxWidth="md"
        >
            <form onSubmit={submit} className="space-y-4">
                <fieldset disabled={isReadOnly} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Parent Menu</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring disabled:opacity-80"
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
                            <option value="">-- No Parent --</option>
                            {parentMenus
                                .filter((p) => p.id !== data.id)
                                .map((p) => (
                                    <option
                                        key={p.id ?? `parent-${p.name}`}
                                        value={p.id ?? ''}
                                    >
                                        {p.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="url">URL Path</Label>
                        <Input
                            id="url"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                        />
                        <InputError message={errors.url} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Input
                                value={data.category}
                                onChange={(e) =>
                                    setData('category', e.target.value)
                                }
                            />
                            <InputError message={errors.category} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Icon Name</Label>
                            <Input
                                value={data.icon}
                                onChange={(e) =>
                                    setData('icon', e.target.value)
                                }
                            />
                            <InputError message={errors.icon} />
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end gap-3 border-t pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={closeModal}
                    >
                        {isReadOnly ? 'Close' : 'Cancel'}
                    </Button>
                    {!isReadOnly && (
                        <Button type="submit" disabled={processing}>
                            {mode === ModalMode.CREATE ? 'Save' : 'Update'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
