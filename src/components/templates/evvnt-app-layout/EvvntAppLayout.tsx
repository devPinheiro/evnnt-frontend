import { DashboardLayoutProvider } from "@organisms/dashboard/dashboard-layout-context";
import { DashboardMain } from "@organisms/dashboard/dashboard-main";
import { DashboardShell } from "@organisms/dashboard/dashboard-shell";
import { DashboardSidebar } from "@organisms/dashboard/dashboard-sidebar";
import { UiOverlays } from "@organisms/dashboard/ui-overlays";
import type { ReactNode } from "react";

/**
 * Authenticated app shell — mirrors EHR `templates/AppLayout` + `SidebarProvider` pattern:
 * persistent chrome (sidebar + main column), page content via `children` / `<Outlet />`.
 */
export default function EvvntAppLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayoutProvider>
      <DashboardShell sidebar={<DashboardSidebar />}>
        <DashboardMain>{children}</DashboardMain>
        <UiOverlays />
      </DashboardShell>
    </DashboardLayoutProvider>
  );
}
