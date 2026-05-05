import type { route as routeFn } from 'ziggy-js';
import type { Auth } from '@/types/auth';

declare global {
    var route: typeof routeFn;

    interface Window {
        $: JQueryStatic;
        jQuery: JQueryStatic;
    }
}

declare module 'select2' {
    interface Select2Options {
        [key: string]: any;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
