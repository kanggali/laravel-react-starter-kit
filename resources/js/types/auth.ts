import { RoleData } from "./role";

export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export interface MenuData {
    id: number | null;
    name: string;
    url: string;
    category: string;
    icon: string;
    main_menu_id: number | null;
    active: boolean | number;
    orders: number;
    sub_menus?: MenuData[];
}

export interface AccessRoleData {
    id: number;
    name: string;
    guard_name: string;
    permission_ids: number[];
}

export interface AccessUserData {
    id: number;
    name: string;
    email: string;
    roles: RoleData[];
    permission_ids: number[];
}

export interface UserManagementData {
    id: number | null;
    name: string;
    username: string;
    email: string;
    roles: RoleData[];
}

export type Auth = {
    user: User;
    sidebar: MenuData[];
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type SharedData = {
    auth: Auth;
    [key: string]: unknown;
};
