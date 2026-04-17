import { Skeleton } from "@ui/skeleton";
import { cn } from "@utils";

import type { KpiAccent } from "./kpi-strip";
import { kpiBarClass } from "./kpi-strip";

/** Matches live dashboard KPI order (demo data). */
const KPI_SKELETON_BARS: KpiAccent[] = ["purple", "vivid", "success", "warn", "soft", "deep"];

const subTabPlaceholders = ["All", "Tickets", "Gifts", "Finance"] as const;
const eventTabPlaceholders = ["All", "Live", "Upcoming", "Ended", "Drafts"] as const;

const attentionRowIds = ["sk-att-1", "sk-att-2", "sk-att-3", "sk-att-4"] as const;
const eventCardIds = ["sk-ev-1", "sk-ev-2", "sk-ev-3", "sk-ev-4", "sk-ev-5"] as const;
const metricCellIds = ["sk-m-1", "sk-m-2", "sk-m-3", "sk-m-4"] as const;
const activityRowIds = [
  "sk-act-1",
  "sk-act-2",
  "sk-act-3",
  "sk-act-4",
  "sk-act-5",
  "sk-act-6",
] as const;
const quickActionIds = ["sk-qa-1", "sk-qa-2", "sk-qa-3", "sk-qa-4"] as const;

type DashboardPageSkeletonProps = {
  className?: string;
};

/**
 * Full-dashboard skeleton: same sections, spacing, and chrome as the loaded events hub
 * (KPI strip, attention, events grid, activity + quick actions + plan).
 */
export function DashboardPageSkeleton({ className }: DashboardPageSkeletonProps) {
  return (
    <output
      aria-live="polite"
      aria-busy="true"
      className={cn("pointer-events-none flex min-h-0 flex-1 flex-col gap-5 sm:gap-6", className)}
    >
      {/* KPI strip — matches KpiStrip grid + cards */}
      <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {KPI_SKELETON_BARS.map((bar) => (
          <div
            key={bar}
            className={cn(
              "relative overflow-hidden rounded-evvnt-xl border border-evvnt-n200 bg-white px-3.5 py-3.5 shadow-[0_1px_2px_rgb(26_9_51_/_5%)]",
              "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[3px] after:rounded-b-evvnt-xl after:content-['']",
              kpiBarClass[bar],
            )}
          >
            <Skeleton className="mb-2 h-2.5 w-[55%] rounded-evvnt-sm" />
            <Skeleton className="h-6 w-[45%] rounded-evvnt-md" />
            <Skeleton className="mt-1.5 h-2 w-[70%] rounded-evvnt-sm" />
            <div className="mt-1 border-evvnt-n100 border-t border-dashed pt-1.5">
              <Skeleton className="h-2 w-[72%] rounded-evvnt-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Attention — matches AttentionStrip */}
      <section className="flex flex-col gap-3">
        <div className="flex shrink-0 items-center justify-between">
          <div>
            <Skeleton className="h-5 w-48 rounded-evvnt-md" />
            <Skeleton className="mt-1.5 h-3 w-36 rounded-evvnt-sm" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {attentionRowIds.map((id) => (
            <div
              key={id}
              className="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-evvnt-xl border border-evvnt-n200 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgb(26_9_51_/_4%)] sm:gap-2.5"
            >
              <Skeleton className="size-2 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-[min(100%,18rem)] rounded-evvnt-sm" />
                <Skeleton className="h-3 w-full max-w-md rounded-evvnt-sm" />
              </div>
              <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-14 shrink-0 rounded-evvnt-sm" />
            </div>
          ))}
        </div>
      </section>

      {/* My events — matches EventsSection */}
      <section className="min-w-0">
        <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <Skeleton className="h-5 w-28 rounded-evvnt-md" />
            <Skeleton className="mt-1.5 h-3 w-24 rounded-evvnt-sm" />
          </div>
          <div className="flex min-w-0 flex-col gap-2.5 sm:items-end">
            <div className="-mx-1 flex gap-1.5 pb-1 sm:mx-0 sm:flex-wrap">
              {eventTabPlaceholders.map((t) => (
                <Skeleton
                  key={t}
                  className="h-8 shrink-0 rounded-full px-3 py-1.5"
                  style={{ width: t.length * 7 + 24 }}
                />
              ))}
            </div>
            <Skeleton className="h-3.5 w-24 self-end rounded-evvnt-sm sm:self-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 xl:grid-cols-3">
          {eventCardIds.map((id) => (
            <div
              key={id}
              className="flex flex-col overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white shadow-[0_1px_3px_rgb(26_9_51_/_6%)]"
            >
              <Skeleton className="h-20 w-full shrink-0 rounded-none rounded-t-evvnt-card" />
              <div className="flex flex-1 flex-col gap-1.5 px-3.5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-2.5 w-14 rounded-evvnt-sm" />
                  <Skeleton className="h-2.5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-[90%] rounded-evvnt-sm" />
                <Skeleton className="h-3 w-[75%] rounded-evvnt-sm" />
              </div>
              <div className="mt-1 flex gap-0 border-t border-evvnt-n100">
                {metricCellIds.map((mid) => (
                  <div
                    key={`${id}-${mid}`}
                    className="flex min-w-0 flex-1 flex-col items-center justify-center border-r border-evvnt-n100 py-2 last:border-r-0"
                  >
                    <Skeleton className="h-4 w-10 rounded-evvnt-sm" />
                    <Skeleton className="mt-1.5 h-2 w-12 rounded-evvnt-sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* NewEventCard slot — min-h matches NewEventCard */}
          <div className="flex min-h-[10.5rem] flex-col items-center justify-center gap-3 rounded-evvnt-card border-2 border-dashed border-evvnt-muted/80 bg-gradient-to-b from-evvnt-mist to-white px-5 py-6">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-36 rounded-evvnt-md" />
            <Skeleton className="h-3 w-full max-w-[14rem] rounded-evvnt-sm" />
            <Skeleton className="h-3 w-[85%] max-w-[14rem] rounded-evvnt-sm" />
          </div>
        </div>
      </section>

      {/* Activity + sidebar — matches events-page grid */}
      <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
        {/* ActivityFeed shell */}
        <div className="flex max-h-[min(280px,45vh)] flex-col overflow-hidden rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)] sm:max-h-[300px]">
          <div className="flex shrink-0 flex-col gap-2 border-b border-evvnt-n100 bg-evvnt-n50/40 px-4 py-3.5 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <Skeleton className="h-4 w-28 rounded-evvnt-md" />
            <div className="flex w-full justify-start gap-0.5 overflow-x-auto sm:w-auto sm:justify-end">
              {subTabPlaceholders.map((t) => (
                <Skeleton
                  key={t}
                  className="h-7 shrink-0 rounded-evvnt-sm px-2.5 py-1"
                  style={{ width: t.length * 6 + 20 }}
                />
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            {activityRowIds.map((id) => (
              <div
                key={id}
                className="flex gap-2.5 border-b border-evvnt-n100 px-4 py-2.5 last:border-b-0"
              >
                <Skeleton className="mt-px size-7 shrink-0 rounded-evvnt-sm" />
                <div className="min-w-0 flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-full rounded-evvnt-sm" />
                  <Skeleton className="h-3 w-[66%] rounded-evvnt-sm" />
                  <Skeleton className="h-2.5 w-24 rounded-evvnt-sm" />
                </div>
                <Skeleton className="mt-0.5 h-3.5 w-14 shrink-0 rounded-evvnt-sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {/* QuickActions shell */}
          <div className="flex flex-col overflow-hidden rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
            <div className="border-b border-evvnt-n100 bg-evvnt-n50/40 px-4 py-3.5 pb-3">
              <Skeleton className="h-4 w-28 rounded-evvnt-md" />
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 sm:gap-2.5">
              {quickActionIds.map((id) => (
                <div
                  key={id}
                  className="flex flex-col gap-1.5 rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist p-3"
                >
                  <Skeleton className="size-7 rounded-evvnt-sm" />
                  <Skeleton className="h-3.5 w-[85%] rounded-evvnt-sm" />
                  <Skeleton className="h-2 w-full rounded-evvnt-sm" />
                  <Skeleton className="h-2 w-[80%] rounded-evvnt-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* PlanWidget shell — same frame + gradient */}
          <div
            className="relative shrink-0 overflow-hidden rounded-evvnt-2xl p-4 shadow-[0_4px_20px_-6px_rgb(45_15_107_/_35%)]"
            style={{ backgroundImage: "var(--background-image-evvnt-plan)" }}
          >
            <div
              aria-hidden
              className="absolute -right-5 -bottom-5 size-[120px] rounded-full bg-white/6"
            />
            <div aria-hidden className="absolute -top-8 right-10 size-20 rounded-full bg-white/4" />

            <div className="relative space-y-2.5">
              <Skeleton className="h-2.5 w-16 bg-white/25" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24 bg-white/30" />
                <Skeleton className="h-5 w-20 rounded-full bg-white/20" />
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <div className="rounded-evvnt-sm bg-white/10 p-2">
                  <Skeleton className="h-5 w-16 bg-white/30" />
                  <Skeleton className="mt-1.5 h-2 w-20 bg-white/20" />
                </div>
                <div className="rounded-evvnt-sm bg-white/10 p-2">
                  <Skeleton className="h-5 w-12 bg-white/30" />
                  <Skeleton className="mt-1.5 h-2 w-24 bg-white/20" />
                </div>
              </div>
              <Skeleton className="h-1 w-full rounded-sm bg-white/15" />
              <div className="flex justify-between gap-4">
                <Skeleton className="h-2.5 flex-1 bg-white/20" />
                <Skeleton className="h-2.5 w-8 bg-white/20" />
              </div>
              <Skeleton className="mt-0.5 h-9 w-full rounded-evvnt-sm bg-white/15" />
            </div>
          </div>
        </div>
      </div>
    </output>
  );
}
