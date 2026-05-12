import type { ReactNode } from "react";

import { cn } from "@utils";

export type KpiAccent = "purple" | "vivid" | "success" | "warn" | "soft" | "deep";

export type KpiItem = {
  id: string;
  label: string;
  value: string;
  delta: ReactNode;
  /** Optional footnote (kept subtle — most cards omit for a cleaner KPI row). */
  target?: string;
  accent?: boolean;
  /** Used for focus / theming hooks; not rendered as a heavy bar in the soft UI variant. */
  bar: KpiAccent;
  /** Optional icon inside the muted circular well. */
  icon?: ReactNode;
};

type KpiStripProps = {
  items: KpiItem[];
  className?: string;
};

export function KpiStrip({ items, className }: KpiStripProps) {
  return (
    <div className={cn("grid shrink-0 grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4", className)}>
      {items.map((k) => (
        <article
          key={k.id}
          className={cn(
            "relative flex gap-3.5 rounded-[14px] border border-evvnt-n200/90 bg-white px-4 py-3.5 shadow-[0_4px_20px_-10px_rgb(26_9_51_/_12%)] transition-shadow duration-200 hover:shadow-[0_12px_32px_-14px_rgb(26_9_51_/_16%)]",
          )}
        >
          {k.icon ? (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-evvnt-n100 [&_svg]:text-evvnt-n500">
              {k.icon}
            </div>
          ) : (
            <div
              className={cn(
                "mt-0.5 size-2.5 shrink-0 rounded-full",
                k.bar === "purple" && "bg-evvnt-core",
                k.bar === "vivid" && "bg-evvnt-vivid",
                k.bar === "success" && "bg-evvnt-success",
                k.bar === "warn" && "bg-evvnt-warn",
                k.bar === "soft" && "bg-evvnt-soft",
                k.bar === "deep" && "bg-evvnt-deep",
              )}
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium tracking-wide text-evvnt-n500">{k.label}</div>
            <div
              className={cn(
                "mt-1 text-[22px] leading-none font-bold tabular-nums tracking-tight sm:text-2xl",
                k.accent !== false ? "text-evvnt-core" : "text-evvnt-ink",
              )}
            >
              {k.value}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-0.5 text-[11px] leading-snug text-evvnt-n500">
              {k.delta}
            </div>
            {k.target && (
              <div className="mt-2 border-evvnt-n100 border-t border-dashed pt-2 text-[10px] text-evvnt-n400">
                {k.target}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
