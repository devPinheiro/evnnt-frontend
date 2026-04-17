import type { ReactNode } from "react";
import { useEffect } from "react";

import { cn } from "@utils";

import { useDashboardLayout } from "./dashboard-layout-context";

type DashboardShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Full-viewport shell: sidebar (drawer &lt; lg, persistent ≥ lg) + main column. */
export function DashboardShell({ sidebar, children, className }: DashboardShellProps) {
  const { sidebarOpen, closeSidebar } = useDashboardLayout();

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSidebar]);

  return (
    <div className={cn("relative flex h-[100dvh] overflow-hidden", className)}>
      <button
        type="button"
        aria-label="Close navigation menu"
        className={cn(
          "fixed inset-0 z-40 bg-evvnt-ink/50 transition-opacity lg:hidden",
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeSidebar}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-evvnt-sidebar shrink-0 transform transition-transform duration-200 ease-out lg:relative lg:z-auto lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0 shadow-[4px_0_24px_rgba(26,9,51,0.18)]"
            : "-translate-x-full lg:shadow-none",
        )}
      >
        {sidebar}
      </div>

      {children}
    </div>
  );
}
