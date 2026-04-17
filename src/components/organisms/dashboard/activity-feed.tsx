import type { ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
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
  return (
    <div
      className={cn(
        "flex max-h-[min(280px,45vh)] flex-col overflow-hidden rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)] sm:max-h-[300px]",
        className,
      )}
    >
      <Tabs defaultValue="All" className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-2 border-b border-evvnt-n100 bg-evvnt-n50/40 px-4 py-3.5 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div className="text-[13px] font-semibold tracking-tight text-evvnt-ink">
            Activity feed
          </div>
          <TabsList className="h-auto w-full justify-start gap-0.5 overflow-x-auto bg-transparent p-0 [scrollbar-width:none] sm:w-auto sm:justify-end [&::-webkit-scrollbar]:hidden">
            {subTabs.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={cn(
                  "h-auto shrink-0 rounded-evvnt-sm border border-transparent px-2.5 py-1 text-[11px] font-medium shadow-none",
                  "data-[state=active]:border-evvnt-muted data-[state=active]:bg-evvnt-tint data-[state=active]:text-evvnt-core data-[state=active]:shadow-none",
                  "data-[state=inactive]:text-evvnt-n500 data-[state=inactive]:hover:bg-evvnt-n50",
                )}
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex gap-2.5 border-b border-evvnt-n100 px-4 py-2.5 last:border-b-0"
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
                <div className="mt-0.5 text-[11px] font-medium text-evvnt-core">
                  {row.eventLine}
                </div>
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
      </Tabs>
    </div>
  );
}
