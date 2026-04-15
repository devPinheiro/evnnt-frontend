import type { ReactNode } from "react";

import { cn } from "@utils";

type DashboardContentProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5", className)}>
      {children}
    </div>
  );
}
