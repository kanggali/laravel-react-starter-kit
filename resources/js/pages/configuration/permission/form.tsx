import React, { useCallback } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import { useCrudForm } from '@/hooks/use-crud-form';
import { usePermissionStore } from '@/stores/usePermissionStore';
import { ModalMode } from '@/types/enums';
import type { PermissionData } from '@/types/permission';

export default function PermissionFormModal() {
    const { mode, editData, closeModal } = usePermissionStore();

    const transformPermissionData = useCallback(
        (permission: PermissionData) => ({
            id: permission.id,
            name: permission.name,
            guard_name: permission.guard_name,
        }),
        [],
    );

    const { data, setData, post, put, processing, errors, isOpen, isReadOnly } =
        useCrudForm<PermissionData>({
            mode,
            editData,
            initialValues: {
                id: null as number | null,
                name: '',
                guard_name: 'web',
            },
            transformData: transformPermissionData,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isReadOnly) {
            return;
        }

        const options = {
            onSuccess: () => closeModal(),
        };

        if (data.id) {
            put(route('configuration.permissions.update', data.id), options);
        } else {
            post(route('configuration.permissions.store'), options);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={
                mode === ModalMode.CREATE
                    ? 'Add New Permission'
                    : mode === ModalMode.EDIT
                      ? 'Edit Permission'
                      : 'Detail Permission'
            }
            maxWidth="md"
        >
            <form onSubmit={submit} className="space-y-4">
                <fieldset disabled={isReadOnly} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Permission Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. create configuration/users"
                            autoFocus
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="guard_name">Guard Name</Label>
                        <Input
                            id="guard_name"
                            value={data.guard_name}
                            onChange={(e) =>
                                setData('guard_name', e.target.value)
                            }
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
\                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
