import { DashboardMain } from "@organisms/dashboard/dashboard-main";
import { DashboardShell } from "@organisms/dashboard/dashboard-shell";
import { DashboardSidebar } from "@organisms/dashboard/dashboard-sidebar";
import type { ReactNode } from "react";

/**
 * Authenticated app shell — mirrors EHR `templates/AppLayout` + `SidebarProvider` pattern:
 * persistent chrome (sidebar + main column), page content via `children` / `<Outlet />`.
 */
export default function EvvntAppLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell sidebar={<DashboardSidebar />}>
      <DashboardMain>{children}</DashboardMain>
    </DashboardShell>
  );
}
