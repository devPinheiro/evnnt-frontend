import { isDashboardPublicMode } from "@/lib/dashboard-public";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (isDashboardPublicMode()) {
      throw redirect({ to: "/events", replace: true });
    }
    if (context.auth.isLoggedIn) {
      throw redirect({ to: "/events", replace: true });
    }
    throw redirect({ to: "/login", replace: true });
  },
});
