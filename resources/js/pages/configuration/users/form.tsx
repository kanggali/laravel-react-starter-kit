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
    id: number;
    name: string;
    username: string;
    email: string;
    roles: Role[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: UserData | null;
    allRoles: Role[];
    isReadOnly: boolean;
}

export default function UserFormModal({
    isOpen,
    onClose,
    user,
    allRoles,
    isReadOnly,
}: Props) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        username: '',
        email: '',
        role_ids: [] as number[],
    });

    // Di dalam UserFormModal
    useEffect(() => {
        // Jalankan inisialisasi hanya saat modal terbuka
        if (isOpen) {
            if (user) {
                setData({
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role_ids: user.roles.map((r: any) => r.id),
                });
            } else {
                reset();
            }
        }
        // reset dan setData aman dimasukkan karena referensinya stabil di useForm
    }, [isOpen, user, reset, setData]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isReadOnly) {
            return;
        }

        if (user) {
            put(route('configuration.user.update', user.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('configuration.user.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    // Format options untuk Select2
    const roleOptions = allRoles.map((role) => ({
        id: role.id,
        text: role.name.toUpperCase(),
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isReadOnly ? 'User Detail' : user ? 'Edit User' : 'Add User'}
            maxWidth="2xl"
        >
            <form onSubmit={submit} className="space-y-6 p-1">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            disabled={isReadOnly}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                            <p className="text-destructive text-xs">
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
                            disabled={isReadOnly}
                            onChange={(e) =>
                                setData('username', e.target.value)
                            }
                            className={
                                errors.username ? 'border-destructive' : ''
                            }
                        />
                        {errors.username && (
                            <p className="text-destructive text-xs">
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
                            disabled={isReadOnly}
                            onChange={(e) => setData('email', e.target.value)}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-destructive text-xs">
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
                            disabled={isReadOnly}
                            placeholder="Select multiple roles..."
                            onChange={(values: number[]) =>
                                setData('role_ids', values)
                            }
                        />
                        {errors.role_ids && (
                            <p className="text-destructive text-xs">
                                {errors.role_ids}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                        {isReadOnly ? 'Close' : 'Cancel'}
                    </Button>
                    {!isReadOnly && (
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save User'}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
