import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    url: string; // Diubah dari href menjadi url
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[]; // Menggunakan tipe NavItem secara rekursif agar sub-menu mendukung icon dan url
};
