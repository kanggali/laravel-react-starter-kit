export interface Permission {
    id: number;
    action_name: string;
}

export interface MenuWithPermissions {
    id: number;
    name: string;
    main_menu_id: number | null;
    permissions: Permission[];
}

export interface AccessRoleData {
    id: number;
    name: string;
    guard_name: string;
    permission_ids: number[];
}

