import { cn } from "@utils";
import type { HTMLAttributes } from "react";

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number;
  max?: number;
};

/**
 * Determinate progress bar — accessible; Evvnt track/fill colors.
 * For indeterminate loading, prefer `Skeleton` or set `value` with CSS animation on the fill.
 */
export function Progress({ className, value, max = 100, ...props }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: decorative track; value exposed via aria-valuenow on native progress semantics
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-2 w-full overflow-hidden rounded-sm bg-evvnt-n200", className)}
      {...props}
    >
      <div
        className="h-full rounded-sm bg-evvnt-core transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
