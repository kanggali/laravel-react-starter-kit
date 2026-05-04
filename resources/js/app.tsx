import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as ziggyRoute } from 'ziggy-js';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');

        return resolvePageComponent(`./pages/${name}.tsx`, pages) as any;
    },

    layout: (name: string) => {
        if (name === 'welcome') {
            return null;
        }

        if (name.startsWith('auth/')) {
            return AuthLayout;
        }

        if (name.startsWith('settings/')) {
            return [AppLayout, SettingsLayout];
        }

        return AppLayout;
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        // Definisikan rute global window sebelum render utama
        // @ts-expect-error - mendaftarkan fungsi global window
        window.route = (
            name: any,
            params: any,
            absolute: any,
            config = (props.initialPage.props as any).ziggy,
        ) => ziggyRoute(name, params, absolute, config);

        // Render aplikasi dengan pembungkus provider di dalam satu pohon root
        root.render(
            <TooltipProvider delayDuration={0}>
                <App {...props} />
                <Toaster richColors position="top-right" />
            </TooltipProvider>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
