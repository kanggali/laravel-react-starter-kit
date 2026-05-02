import { Link, usePage } from '@inertiajs/react';
import * as LucideIcons from 'lucide-react';
import { LayoutDashboard, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

import type { NavItem, SharedData } from '@/types';

const cleanTitle = (name: string): string => {
    const parts = name.split('/');
    const lastPart = parts[parts.length - 1];

    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const sidebarData = auth.sidebar || [];

    const groupedNavItems: Record<string, NavItem[]> = {
        no_category: [
            {
                title: 'Dashboard',
                url: dashboard().toString(),
                icon: LayoutDashboard,
            },
        ],
    };

    sidebarData.forEach((menu: any) => {
        const categoryKey = menu.category || 'no_category';

        // Icon untuk Menu Utama
        const DynamicIcon =
            (LucideIcons[
                menu.icon as keyof typeof LucideIcons
            ] as LucideIcon) || LayoutGrid;

        const item: NavItem = {
            title: cleanTitle(menu.name),
            url: `/${menu.url}`,
            icon: DynamicIcon,
            items:
                menu.sub_menus && menu.sub_menus.length > 0
                    ? menu.sub_menus.map((sub: any) => {
                          // Icon untuk Sub Menu secara dinamis
                          const SubIcon = sub.icon
                              ? (LucideIcons[
                                    sub.icon as keyof typeof LucideIcons
                                ] as LucideIcon)
                              : undefined;

                          return {
                              title: cleanTitle(sub.name),
                              href: `/${sub.url}`,
                              icon: SubIcon,
                          };
                      })
                    : undefined,
        };

        if (!groupedNavItems[categoryKey]) {
            groupedNavItems[categoryKey] = [];
        }

        groupedNavItems[categoryKey].push(item);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {Object.entries(groupedNavItems).map(([category, items]) => (
                    <SidebarGroup key={category}>
                        {category !== 'no_category' && (
                            <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase">
                                {category}
                            </SidebarGroupLabel>
                        )}
                        <SidebarGroupContent>
                            <NavMain items={items}/>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
