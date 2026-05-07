import { useForm } from '@inertiajs/react';
import React, { useCallback, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import Select2 from '@/components/ui/select2';
import { useCrudForm } from '@/hooks/use-crud-form';
import { useUserStore } from '@/stores/useUserStore';
import type { UserManagementData } from '@/types/auth';
import { ModalMode } from '@/types/enums';
import type { RoleData } from '@/types/role';

interface Props {
    allRoles: RoleData[];
}

interface FormData {
    id: number | null;
    name: string;
    username: string;
    email: string;
    role_ids: number[];
    password?: string;
    password_confirmation?: string;
}

export default function UserFormModal({ allRoles }: Props) {
    const { mode, editData, closeModal } = useUserStore();

    const transformUserData = useCallback(
        (user: UserManagementData) => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role_ids: Array.isArray(user.roles)
                ? user.roles.map((r: RoleData) => r.id)
                : [],
            password: '',
            password_confirmation: '',
        }),
        [],
    );

    const { data, setData, post, put, processing, errors, isOpen, isReadOnly } =
        useCrudForm<UserManagementData>({
            mode,
            editData,
            initialValues: {
                id: null as number | null,
                name: '',
                username: '',
                email: '',
                role_ids: [] as number[],
                password: '',
                password_confirmation: '',
            },
            transformData: transformUserData,
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
            put(route('configuration.users.update', data.id), options);
        } else {
            post(route('configuration.users.store'), options);
        }
    };

    const roleOptions = allRoles.map((role) => ({
        id: role.id,
        text: role.name.toUpperCase(),
    }));

    const isCreateMode = mode === ModalMode.CREATE;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={
                mode === ModalMode.CREATE
                    ? 'Add New User'
                    : mode === ModalMode.EDIT
                      ? 'Edit User'
                      : 'Detail User'
            }
            maxWidth="2xl"
        >
            <form onSubmit={submit} className="space-y-4">
                <fieldset disabled={isReadOnly} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                            />
                            <InputError message={errors.username} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Roles</Label>
                            <Select2
                                multiple={true}
                                options={roleOptions}
                                value={data.role_ids}
                                placeholder="Select multiple roles..."
                                onChange={(values: number[]) =>
                                    setData('role_ids', values)
                                }
                            />
                            <InputError message={errors.role_ids} />
                        </div>
                    </div>

                    {isCreateMode && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Enter confirm password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )}
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
