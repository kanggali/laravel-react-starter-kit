import type { MenuData } from '@/types/auth';
import { createFormStore } from './createFormStore';

export const useMenuStore = createFormStore<MenuData>();
