import { isDashboardPublicMode } from "@/lib/dashboard-public";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { EvvntAppLayout } from "@templates/evvnt-app-layout";
import type { ReactNode } from "react";

export const Route = createFileRoute("/(authenticated)/_appLayout")({
  beforeLoad: ({ context }) => {
    if (isDashboardPublicMode()) return;
    if (!context.auth.isLoggedIn) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout(): ReactNode {
  return (
    <EvvntAppLayout>
      <Outlet />
    </EvvntAppLayout>
  );
}
