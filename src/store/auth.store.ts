import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  orgId: string | null;
  user: AuthUser | null;
  setSession: (input: {
    accessToken: string;
    refreshToken: string;
    orgId: string;
    user: AuthUser;
  }) => void;
  /** After `POST /api/v1/auth/refresh` — keeps org + user, rotates JWT pair only. */
  replaceTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
};

const initial = {
  accessToken: null,
  refreshToken: null,
  orgId: null,
  user: null,
} satisfies Omit<AuthState, "setSession" | "replaceTokens" | "logout">;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initial,
      setSession: ({ accessToken, refreshToken, orgId, user }) =>
        set({ accessToken, refreshToken, orgId, user }),
      replaceTokens: ({ accessToken, refreshToken }) =>
        set((s) => ({ ...s, accessToken, refreshToken })),
      logout: () => set(initial),
    }),
    {
      name: "evvnt-auth",
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        orgId: s.orgId,
        user: s.user,
      }),
    },
  ),
);
