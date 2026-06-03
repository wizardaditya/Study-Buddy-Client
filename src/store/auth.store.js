import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      needsOnboarding: false,

      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken, isAuthenticated: true }),

      setToken: (token) => set({ token }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      logout: () =>
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, needsOnboarding: false }),
    }),
    { name: "study-buddy-auth" }
  )
);
