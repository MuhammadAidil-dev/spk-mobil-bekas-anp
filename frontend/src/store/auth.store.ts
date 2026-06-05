import { create } from 'zustand';
import type { AdminUser } from '@/types/auth.type';

interface AuthState {
  user: AdminUser | null;
  setUser: (user: AdminUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
