import type { AccessRoleData } from '@/types/auth';
import { createFormStore } from './createFormStore';

export const useAccessRoleStore = createFormStore<AccessRoleData>();
