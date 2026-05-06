import { Form, Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react'; // Tambahkan ini
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
    auth: {
        user: any;
    };
    twoFactorEnabled: boolean;
    twoFactorConfirmed: boolean;
    qrCodeSvg: string | null;
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth, twoFactorEnabled, twoFactorConfirmed, qrCodeSvg } = usePage()
        .props as unknown as ProfileProps;

    // State untuk menampung kode 6 digit dari aplikasi authenticator
    const [confirmationCode, setConfirmationCode] = useState('');

    const enable2FA = () => {
        router.post(
            '/user/two-factor-authentication',
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const disable2FA = () => {
        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
        });
    };

    // Fungsi untuk mengirim kode verifikasi agar 2FA menjadi Active/Confirmed
    const confirm2FA = () => {
        router.post(
            '/user/confirmed-two-factor-authentication',
            {
                code: confirmationCode,
            },
            {
                preserveScroll: true,
                onSuccess: () => setConfirmationCode(''),
            },
        );
    };

    return (
        <>
            <Head title="Profile settings" />
            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.username}
                                    name="username"
                                    required
                                    autoComplete="username"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.username}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.email}
                                    name="email"
                                    required
                                    autoComplete="email"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                            </div>
                        </>
                    )}
                </Form>

                <hr className="my-10 dark:border-neutral-800" />

                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Two-Factor Authentication"
                        description="Add additional security to your account using two-factor authentication."
                    />

                    {!twoFactorEnabled ? (
                        <Button onClick={enable2FA}>
                            Enable Two-Factor Authentication
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            {qrCodeSvg && !twoFactorConfirmed && (
                                <div className="space-y-4 rounded-md border bg-white/5 p-4">
                                    <p className="text-sm font-medium">
                                        1. Scan QR code di bawah ini:
                                    </p>
                                    <div
                                        className="inline-block rounded-md border bg-white p-2"
                                        dangerouslySetInnerHTML={{
                                            __html: qrCodeSvg,
                                        }}
                                    />

                                    <div className="max-w-sm space-y-2">
                                        <Label htmlFor="code">
                                            2. Masukkan 6 digit kode verifikasi:
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="code"
                                                value={confirmationCode}
                                                onChange={(e) =>
                                                    setConfirmationCode(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="000000"
                                                maxLength={6}
                                            />
                                            <Button onClick={confirm2FA}>
                                                Verifikasi
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <p className="text-sm text-muted-foreground">
                                    {twoFactorConfirmed
                                        ? '✅ Two-factor authentication is active.'
                                        : '⚠️ Selesaikan aktivasi dengan memverifikasi kode OTP.'}
                                </p>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={disable2FA}
                                >
                                    Disable
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <hr className="my-10 dark:border-neutral-800" />
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
