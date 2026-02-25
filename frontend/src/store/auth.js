import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

function applyAuth(set, auth) {
  set({ access: auth.access, refresh: auth.refresh, user: auth.user });
}

function parseJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isJwtExpired(token, skewSeconds = 30) {
  const payload = parseJwtPayload(token);
  const exp = payload?.exp;
  if (!exp) return false; // if unknown, don't force refresh
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + skewSeconds;
}

export const useAuth = create()(
  persist(
    (set, get) => ({
      access: null,
      refresh: null,
      user: null,
      isBootstrapping: true,

      ensureAccess: async () => {
        const access = get().access;
        if (access && !isJwtExpired(access)) return access;

        const refresh = get().refresh;
        if (!refresh) {
          set({ access: null, refresh: null, user: null });
          throw new Error("Session expired. Please login again.");
        }

        try {
          const data = await api.refresh(refresh);
          if (!data?.access) throw new Error("Failed to refresh session");
          set({ access: data.access });
          return data.access;
        } catch {
          set({ access: null, refresh: null, user: null });
          throw new Error("Session expired. Please login again.");
        }
      },

      bootstrap: async () => {
        const token = get().access;
        if (!token) {
          set({ isBootstrapping: false });
          return;
        }
        try {
          const access = await get().ensureAccess();
          const user = await api.me(access);
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
