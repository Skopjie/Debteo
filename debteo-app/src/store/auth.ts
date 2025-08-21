import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
  hydrate: () => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setUser: (u) => set({ user: u }),
  setToken: (t) => set({ token: t }),

  hydrate: () => set({ hydrated: true }),

  logout: () => set({ user: null, token: null }),
}));
