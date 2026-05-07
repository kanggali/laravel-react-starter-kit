import type { RoleData } from '@/types/role';
import { createFormStore } from './createFormStore';

export const useRoleStore = createFormStore<RoleData>();
