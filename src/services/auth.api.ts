import { http } from "@/lib/http";
import { useAuthStore } from "@/store/auth.store";
import type { AuthUser } from "@/store/auth.store";
import { type ApiSuccess, unwrap } from "@types";

export type MeUser = AuthUser & {
  emailVerified?: boolean;
  pendingEmail?: string | null;
  emailVerifiedAt?: string | null;
  organisationId: string;
  createdAt?: string;
};

export async function login(input: { orgId: string; email: string; password: string }) {
  const { data } = await http.post<
    ApiSuccess<{
      user: AuthUser & { emailVerified?: boolean };
      tokens: { accessToken: string; refreshToken: string };
    }>
  >("/api/v1/auth/login", input);
  return unwrap(data);
}

export async function signup(input: {
  orgName: string;
  email: string;
  password: string;
  name?: string;
}) {
  const { data } = await http.post<
    ApiSuccess<{
      organisation: { id: string; name: string };
      user: AuthUser & { emailVerified?: boolean; pendingEmail?: string | null };
      tokens: { accessToken: string; refreshToken: string };
    }>
  >("/api/v1/auth/signup", input);
  return unwrap(data);
}

export async function fetchMe() {
  const { data } = await http.get<ApiSuccess<{ user: MeUser }>>("/api/v1/auth/me");
  return unwrap(data);
}

/** Rotate JWT pair — Evvnt `POST /api/v1/auth/refresh`. */
export async function refreshSession(refreshToken: string) {
  const { data } = await http.post<
    ApiSuccess<{ tokens: { accessToken: string; refreshToken: string } }>
  >("/api/v1/auth/refresh", { refreshToken });
  return unwrap(data);
}

/**
 * Clear local session then revoke refresh token on the Evvnt API (`POST /api/v1/auth/logout`).
 */
export async function logoutSession(): Promise<void> {
  const refreshToken = useAuthStore.getState().refreshToken;
  useAuthStore.getState().logout();
  if (!refreshToken) return;
  try {
    await http.post("/api/v1/auth/logout", { refreshToken });
  } catch {
    // Session already cleared locally; ignore network / already-revoked errors.
  }
}
