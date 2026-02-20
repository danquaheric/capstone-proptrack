import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

function applyAuth(set, auth) {
  set({ access: auth.access, refresh: auth.refresh, user: auth.user });
}

export const useAuth = create()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,
      isBootstrapping: true,

      bootstrap: async () => {
        const token = get().access;
        if (!token) {
          set({ isBootstrapping: false });
          return;
        }
        try {
          const user = await api.me(token);
          set({ user, isBootstrapping: false });
        } catch {
          set({ access: null, refresh: null, user: null, isBootstrapping: false });
        }
      },

      register: async (payload) => {
        const auth = await api.register(payload);
        applyAuth(set, auth);
      },

      login: async (payload) => {
        const auth = await api.login(payload);
        applyAuth(set, auth);
      },

      logout: () => set({ access: null, refresh: null, user: null }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "proptrack-auth",
      partialize: (s) => ({ access: s.access, refresh: s.refresh, user: s.user }),
    }
  )
);
