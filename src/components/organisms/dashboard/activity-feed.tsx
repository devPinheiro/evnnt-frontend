import { Filter, Search } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import { Button } from "@ui/button";
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
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.eventLine.toLowerCase().includes(q) || r.timeLine.toLowerCase().includes(q),
    );
  }, [rows, query]);

  return (
    <div
      className={cn(
        "flex max-h-[min(320px,48vh)] flex-col overflow-hidden rounded-[14px] border border-evvnt-n200/90 bg-white shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)] sm:max-h-[340px]",
        className,
      )}
    >
      <Tabs defaultValue="All" className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-2.5 border-b border-evvnt-n100 bg-evvnt-n50/50 px-4 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[13px] font-bold tracking-tight text-evvnt-ink">Recent activity</h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="size-9 shrink-0 rounded-[10px] p-0 text-evvnt-core hover:bg-evvnt-tint"
              aria-label="Filter activity (coming soon)"
            >
              <Filter className="size-[15px]" strokeWidth={1.35} />
            </Button>
          </div>
          <label className="flex items-center gap-2 rounded-[10px] border border-evvnt-n200 bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgb(26_9_51_/_4%)] focus-within:border-evvnt-muted focus-within:ring-2 focus-within:ring-evvnt-muted/30">
            <Search className="size-[13px] shrink-0 text-evvnt-n400" strokeWidth={1.2} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search activity…"
              className="min-w-0 flex-1 border-0 bg-transparent text-[12px] text-evvnt-n700 outline-none placeholder:text-evvnt-n400"
            />
          </label>
          <TabsList className="h-auto w-full justify-start gap-0.5 overflow-x-auto rounded-[10px] border border-evvnt-n200/70 bg-white/80 p-0.5 [scrollbar-width:none] sm:justify-start [&::-webkit-scrollbar]:hidden">
            {subTabs.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={cn(
                  "h-auto shrink-0 rounded-[8px] border border-transparent px-2.5 py-1 text-[11px] font-semibold shadow-none",
                  "data-[state=active]:border-evvnt-n300 data-[state=active]:bg-evvnt-ink data-[state=active]:text-white data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-evvnt-n500 data-[state=inactive]:hover:bg-evvnt-n50",
                )}
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12px] text-evvnt-n500">
              No matching activity.
            </div>
          ) : (
            filtered.map((row) => (
              <div
                key={row.id}
                className="flex gap-2.5 border-b border-evvnt-n100 px-4 py-2.5 last:border-b-0"
              >
                <div
                  className={cn(
                    "mt-px flex size-8 shrink-0 items-center justify-center rounded-[9px]",
                    row.iconWrapClass,
                  )}
                >
                  {row.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] leading-snug text-evvnt-n700">{row.title}</div>
                  <div className="mt-0.5 text-[11px] font-semibold text-evvnt-core">
                    {row.eventLine}
                  </div>
                  <div className="mt-0.5 text-[10px] text-evvnt-n400">{row.timeLine}</div>
                </div>
                {row.amount != null && (
                  <div
                    className={cn(
                      "mt-0.5 shrink-0 text-[12px] font-bold whitespace-nowrap text-evvnt-core",
                      row.amountClassName,
                    )}
                  >
                    {row.amount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
