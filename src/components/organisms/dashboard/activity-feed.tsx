import { type ReactNode, useState } from "react";

import { cn } from "@utils";

export type ActivityRow = {
  id: string;
  iconWrapClass: string;
  icon: ReactNode;
  title: ReactNode;
  eventLine: string;
  timeLine: string;
  amount?: ReactNode;
  amountClassName?: string;
};

const subTabs = ["All", "Tickets", "Gifts", "Finance"] as const;

type ActivityFeedProps = {
  rows: ActivityRow[];
  className?: string;
};

export function ActivityFeed({ rows, className }: ActivityFeedProps) {
  const [sub, setSub] = useState<(typeof subTabs)[number]>("All");

  return (
    <div
      className={cn(
        "flex max-h-[260px] flex-col overflow-hidden rounded-evvnt-2xl border border-evvnt-n200 bg-white",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-evvnt-n100 px-4 py-3.5 pb-3">
        <div className="text-[13px] font-semibold text-evvnt-ink">Activity feed</div>
        <div className="flex gap-0.5">
          {subTabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSub(t)}
              className={cn(
                "cursor-pointer rounded-evvnt-sm border border-transparent px-2.5 py-1 text-[11px] font-medium transition-colors",
                sub === t
                  ? "border-evvnt-muted bg-evvnt-tint text-evvnt-core"
                  : "text-evvnt-n500 hover:bg-evvnt-n50",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex gap-2.5 border-b border-[#fafafa] px-4 py-2.5 last:border-b-0"
          >
            <div
              className={cn(
                "mt-px flex size-7 shrink-0 items-center justify-center rounded-evvnt-sm",
                row.iconWrapClass,
              )}
            >
              {row.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs leading-snug text-evvnt-n700">{row.title}</div>
              <div className="mt-0.5 text-[11px] font-medium text-evvnt-core">{row.eventLine}</div>
              <div className="mt-0.5 text-[10px] text-evvnt-n400">{row.timeLine}</div>
            </div>
            {row.amount != null && (
              <div
                className={cn(
                  "mt-0.5 shrink-0 text-xs font-bold whitespace-nowrap text-evvnt-core",
                  row.amountClassName,
                )}
              >
                {row.amount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
