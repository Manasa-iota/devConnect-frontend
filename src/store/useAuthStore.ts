import { create } from "zustand";
import { api } from "../lib/apiClient";
import type { User } from "../types/api";

type AuthState = {
  user: User | null;
  ready: boolean;
  error: string | null;
};

type AuthActions = {
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (input: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  ready: false,
  error: null,
  refresh: async () => {
    try {
      const data = await api<{ success: true; user: User }>("/auth/me");
      set({ user: data.user, error: null });
    } catch {
      set({ user: null, error: null });
    } finally {
      set({ ready: true });
    }
  },
  
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    const res = await api<{ success: true; user: User }>("/auth/login", { method: "POST", body: { email, password } });
    set({ user: res.user, error: null });
  },
  logout: async () => {
    await api<{ success: true }>("/auth/logout", { method: "POST" });
    set({ user: null });
  },
  signup: async (input) => {
    await api<{ success: true; user: User }>("/auth/signup", { method: "POST", body: input });
  },
}));
