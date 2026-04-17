/**
 * When enabled, `/events` is reachable without login (local dev only).
 * Set `VITE_DASHBOARD_PUBLIC=true` in `src/.env`. Disabled in production builds (`import.meta.env.PROD`).
 */
export function isDashboardPublicMode(): boolean {
  if (import.meta.env.PROD) return false;
  return import.meta.env.VITE_DASHBOARD_PUBLIC === "true";
}

/** Routes that skip “send user to /login” on 401 while public-dashboard mode is on. */
export function isDashboardPublicBypassPath(pathname: string): boolean {
  if (!isDashboardPublicMode()) return false;
  return pathname === "/events" || pathname.startsWith("/events/");
}
