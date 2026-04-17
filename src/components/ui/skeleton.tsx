import { cn } from "@utils";
import type { HTMLAttributes } from "react";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-evvnt-md bg-evvnt-n200", className)} {...props} />
  );
}
