import type { ReactNode } from "react";

import { cn } from "@utils";

type DashboardContentProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardContent({ children, className }: DashboardContentProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:gap-6 sm:px-6 sm:py-6",
        "mx-auto w-full max-w-[min(100%,1400px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
