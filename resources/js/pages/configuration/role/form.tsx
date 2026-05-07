import React from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { useCrudForm } from '@/hooks/use-crud-form';
import { useRoleStore } from '@/stores/useRoleStore';
import { ModalMode } from '@/types/enums';
import type { RoleData } from '@/types/role';

export default function RoleFormModal() {
    const { mode, editData, closeModal } = useRoleStore();

    // Inisialisasi form menggunakan custom hook
    const { data, setData, post, put, processing, errors, isOpen, isReadOnly } =
        useCrudForm<RoleData>({
            mode,
            editData,
            initialValues: {
                name: '',
                guard_name: 'web',
            },
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isReadOnly) {
            return;
        }

        const options = {
            onSuccess: () => closeModal(),
        };

        if (mode === ModalMode.EDIT && editData?.id) {
            put(route('configuration.roles.update', editData.id), options);
        } else {
            post(route('configuration.roles.store'), options);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={
                mode === ModalMode.CREATE
                    ? 'Add New Role'
                    : mode === ModalMode.EDIT
                      ? 'Edit Role'
                      : 'Detail Role'
            }
            maxWidth="md"
        >
            <form onSubmit={submit} className="space-y-4">
                <fieldset disabled={isReadOnly} className="space-y-4">
                    {/* Input Nama Role */}
                    <div className="grid gap-2">
                        <Label htmlFor="role_name">Role Name</Label>
                        <Input
                            id="role_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Administrator"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Input Guard Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="guard_name">Guard Name</Label>
                        <Input
                            id="guard_name"
                            value={data.guard_name}
                            onChange={(e) =>
                                setData('guard_name', e.target.value)
                            }
                            placeholder="web"
                        />
                        <InputError message={errors.guard_name} />
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
