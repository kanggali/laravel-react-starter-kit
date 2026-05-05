import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Modal from '@/components/ui/modal';
import Select2 from '@/components/ui/select2';

interface Role {
    id: number;
    name: string;
}

interface UserData {
    id: number | number;
    name: string;
    username: string;
    email: string;
    roles: Role[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editUser: UserData | null;
    allRoles: Role[];
    isReadOnly: boolean;
}

export default function UserFormModal({
    isOpen,
    onClose,
    editUser,
    allRoles,
    isReadOnly,
}: Props) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: null as number | null,
        name: '',
        username: '',
        email: '',
        role_ids: [] as number[],
        password: '',
        password_confirmation: '',
    });

    // Di dalam UserFormModal
    useEffect(() => {
        // Jalankan inisialisasi hanya saat modal terbuka
        if (isOpen) {
            if (editUser) {
                setData({
                    id: editUser.id,
                    name: editUser.name,
                    username: editUser.username,
                    email: editUser.email,
                    role_ids: editUser.roles.map((r: any) => r.id),
                    password: '',
                    password_confirmation: '',
                });
            } else {
                reset();
            }
        }
    }, [isOpen, editUser, reset, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                !isReadOnly
                    ? `Detail User`
                    : data?.id
                      ? 'Edit User'
                      : 'Add New User'
            }
            maxWidth="2xl"
        >
            <form onSubmit={submit} className="space-y-6 p-1">
                <fieldset disabled={!isReadOnly} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={
                                    errors.name ? 'border-destructive' : ''
                                }
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                className={
                                    errors.username ? 'border-destructive' : ''
                                }
                            />
                            {errors.username && (
                                <p className="text-xs text-destructive">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className={
                                    errors.email ? 'border-destructive' : ''
                                }
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Multi-Select Roles (Select2) */}
                        <div className="space-y-2">
                            <Label>Roles</Label>
                            <Select2
                                multiple={true}
                                options={roleOptions}
                                value={data.role_ids}
                                disabled={!isReadOnly}
                                placeholder="Select multiple roles..."
                                onChange={(values: number[]) =>
                                    setData('role_ids', values)
                                }
                            />
                            {errors.role_ids && (
                                <p className="text-xs text-destructive">
                                    {errors.role_ids}
                                </p>
                            )}
                        </div>
                    </div>
                    {!editUser && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className={
                                        errors.password
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
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

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    {isReadOnly && (
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save User'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
