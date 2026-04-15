import { fetchMe } from "@/services/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useRef } from "react";

/**
 * After a persisted session loads, sync profile + `orgId` from Evvnt `GET /api/v1/auth/me`
 * so the client matches the backend (and invalid tokens clear via the HTTP 401 handler).
 */
export function SessionBootstrap() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const ranForToken = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      ranForToken.current = null;
      return;
    }
    if (ranForToken.current === accessToken) return;
    ranForToken.current = accessToken;

    let cancelled = false;
    void fetchMe()
      .then((res) => {
        if (cancelled) return;
        const u = res.user;
        useAuthStore.setState({
          orgId: u.organisationId,
          user: { id: u.id, email: u.email, name: u.name },
        });
      })
      .catch(() => {
        /* 401 → http interceptor clears session */
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return null;
}
