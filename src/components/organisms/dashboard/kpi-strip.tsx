import type { ReactNode } from "react";

import { cn } from "@utils";

export type KpiAccent = "purple" | "vivid" | "success" | "warn" | "soft" | "deep";

export type KpiItem = {
  id: string;
  label: string;
  value: string;
  delta: ReactNode;
  target?: string;
  accent?: boolean;
  bar: KpiAccent;
};

export const kpiBarClass: Record<KpiAccent, string> = {
  purple: "after:bg-evvnt-core",
  vivid: "after:bg-evvnt-vivid",
  success: "after:bg-evvnt-success",
  warn: "after:bg-evvnt-warn",
  soft: "after:bg-evvnt-soft",
  deep: "after:bg-evvnt-deep",
};

type KpiStripProps = {
  items: KpiItem[];
  className?: string;
};

export function KpiStrip({ items, className }: KpiStripProps) {
  return (
    <div
      className={cn("grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6", className)}
    >
      {items.map((k) => (
        <article
          key={k.id}
          className={cn(
            "relative overflow-hidden rounded-evvnt-xl border border-evvnt-n200 bg-white px-3.5 py-3.5 shadow-[0_1px_2px_rgb(26_9_51_/_5%)] transition-shadow duration-200 hover:shadow-[0_4px_12px_-4px_rgb(26_9_51_/_12%)]",
            "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[3px] after:rounded-b-evvnt-xl after:content-['']",
            kpiBarClass[k.bar],
          )}
        >
          <div className="mb-2 text-[10px] font-semibold tracking-wide text-evvnt-n400 uppercase">
            {k.label}
          </div>
          <div
            className={cn(
              "text-xl leading-none font-bold tabular-nums tracking-tight",
              k.accent !== false ? "text-evvnt-core" : "text-evvnt-ink",
            )}
          >
            {k.value}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-0.5 text-[10px] leading-snug">
            {k.delta}
          </div>
          {k.target && (
            <div className="mt-1 border-evvnt-n100 border-t border-dashed pt-1.5 text-[9px] text-evvnt-n400">
              {k.target}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
