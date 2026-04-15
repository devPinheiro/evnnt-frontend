import type { ReactNode } from "react";

import { cn } from "@utils";

type DashboardShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Full-viewport shell: dark sidebar + main column (matches EHR app-shell pattern). */
export function DashboardShell({ sidebar, children, className }: DashboardShellProps) {
  return (
    <div className={cn("flex h-screen overflow-hidden", className)}>
      {sidebar}
      {children}
    </div>
  );
}
