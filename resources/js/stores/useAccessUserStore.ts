import type { AccessUserData } from '@/types/auth';
import { createFormStore } from './createFormStore';

export const useAccessUserStore = createFormStore<AccessUserData>();
