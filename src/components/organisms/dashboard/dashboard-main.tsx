import type { ReactNode } from "react";

import { cn } from "@utils";

type DashboardMainProps = {
  children: ReactNode;
  className?: string;
};

/** Scrollable main column (white topbar + mist content area). */
export function DashboardMain({ children, className }: DashboardMainProps) {
  return (
    <main className={cn("flex min-w-0 flex-1 flex-col overflow-hidden bg-evvnt-mist", className)}>
      {children}
    </main>
  );
}
