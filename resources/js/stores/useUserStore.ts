import type { UserManagementData } from '@/types/auth';
import { createFormStore } from './createFormStore';

// T harus berupa tipe SATUAN (UserManagementData)
export const useUserStore = createFormStore<UserManagementData>();
