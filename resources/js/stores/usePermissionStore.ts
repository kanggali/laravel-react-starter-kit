import type { PermissionData } from '@/types/auth';
import { createFormStore } from './createFormStore';

export const usePermissionStore = createFormStore<PermissionData>();
