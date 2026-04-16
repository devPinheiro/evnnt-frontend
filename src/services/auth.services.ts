import { http } from "@/lib/http";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/store/auth.store";
import endpoints from "@endpoints";
import { useMutationData, useQueryData } from "@hooks";

export type MeUser = AuthUser & {
  emailVerified?: boolean;
  pendingEmail?: string | null;
  emailVerifiedAt?: string | null;
  organisationId: string;
  createdAt?: string;
};

export const useLogin = () =>
  useMutationData<
    {
      user: AuthUser & { emailVerified?: boolean };
      tokens: { accessToken: string; refreshToken: string };
    },
    { orgId: string; email: string; password: string }
  >({
    url: endpoints.auth.login,
  });

export const useSignup = () =>
  useMutationData<
    {
      organisation: { id: string; name: string };
      user: AuthUser & { emailVerified?: boolean; pendingEmail?: string | null };
      tokens: { accessToken: string; refreshToken: string };
    },
    { orgName: string; email: string; password: string; name?: string }
  >({
    url: endpoints.auth.signup,
  });

export const useMe = (enabled: boolean) =>
  useQueryData<{ user: MeUser }>({
    url: endpoints.auth.me,
    queryKey: ["me"],
    enabled,
  });

export const useLogout = () =>
  useMutationData<object, { refreshToken: string }>({
    url: endpoints.auth.logout,
    errorMessage: "Failed to sign out",
  });

/**
 * Clear local session then revoke refresh token on the Evvnt API (`POST /api/v1/auth/logout`).
 * (Kept here because it’s “service-level” behavior, not UI.)
 */
export async function logoutSession(): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;
  useAuthStore.getState().logout();
  if (!refreshToken) return;
  try {
    // Session already cleared locally; ignore network / already-revoked errors.
    await http.post(endpoints.auth.logout, { refreshToken });
  } catch {
    // no-op
  }
}
