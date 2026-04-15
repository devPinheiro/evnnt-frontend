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

const barClass: Record<KpiAccent, string> = {
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
    <div className={cn("grid shrink-0 grid-cols-6 gap-2", className)}>
      {items.map((k) => (
        <article
          key={k.id}
          className={cn(
            "relative overflow-hidden rounded-evvnt-xl border border-evvnt-n200 bg-white px-3.5 py-3",
            "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[3px] after:rounded-b-evvnt-xl after:content-['']",
            barClass[k.bar],
          )}
        >
          <div className="mb-1.5 text-[10px] font-medium text-evvnt-n400">{k.label}</div>
          <div
            className={cn(
              "text-xl leading-none font-bold",
              k.accent !== false ? "text-evvnt-core" : "text-evvnt-ink",
            )}
          >
            {k.value}
          </div>
          <div className="mt-1 flex items-center gap-0.5 text-[10px]">{k.delta}</div>
          {k.target && <div className="mt-0.5 text-[9px] text-evvnt-n300">{k.target}</div>}
        </article>
      ))}
    </div>
  );
}
