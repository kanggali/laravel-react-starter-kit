import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';

interface RoleData {
    id: number | null;
    name: string;
    guard_name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editData: RoleData | null;
    isReadOnly: boolean;
}

export default function MenuFormModal({
    isOpen,
    onClose,
    editData,
    isReadOnly,
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            id: null as number | null,
            name: '',
            guard_name: 'web',
        });

    useEffect(() => {
        if (editData) {
            setData({
                id: editData.id,
                name: editData.name,
                guard_name: editData.guard_name,
            });
        } else {
            reset();
        }

        clearErrors();
    }, [editData, isOpen, reset, clearErrors, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
        };

        if (data.id) {
            put(route('configuration.roles.update', data.id), options);
        } else {
            post(route('configuration.roles.store'), options);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                !isReadOnly
                    ? `Detail Role`
                    : data?.id
                      ? 'Edit Role'
                      : 'Add New Role'
            }
            maxWidth="md"
        >
            <form onSubmit={submit} className="space-y-4">
                <fieldset disabled={!isReadOnly} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Role Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Administrator"
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
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {isReadOnly && (
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : data.id
                                  ? 'Update Role'
                                  : 'Save Role'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
