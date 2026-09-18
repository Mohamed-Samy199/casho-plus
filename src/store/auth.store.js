import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { _id, name, phoneNumbers, primaryPhone, email, role, isActive, lastLoginAt }
      token: null,

      setAuth: ({ user, token }) => set({ user, token }),

      updateUser: (user) => set({ user }),

      logout: () => set({ user: null, token: null }),

      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.role === "admin";
      },
    }),
    {
      name: "casho-plus-auth", // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);