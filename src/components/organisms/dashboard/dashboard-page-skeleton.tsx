import { Skeleton } from "@ui/skeleton";
import { cn } from "@utils";

const kpiSkeletonIds = ["sk-kpi-1", "sk-kpi-2", "sk-kpi-3", "sk-kpi-4"] as const;
const subTabPlaceholders = ["All", "Tickets", "Gifts", "Finance"] as const;
const attentionRowIds = ["sk-att-1", "sk-att-2", "sk-att-3", "sk-att-4"] as const;
const activityRowIds = [
  "sk-act-1",
  "sk-act-2",
  "sk-act-3",
  "sk-act-4",
  "sk-act-5",
  "sk-act-6",
] as const;
const quickActionIds = ["sk-qa-1", "sk-qa-2", "sk-qa-3"] as const;

type DashboardPageSkeletonProps = {
  className?: string;
};

/**
 * Dashboard home skeleton: KPI → chart + attention rail → activity + right rail.
 */
export function DashboardPageSkeleton({ className }: DashboardPageSkeletonProps) {
  return (
    <output
      aria-live="polite"
      aria-busy="true"
      className={cn("pointer-events-none flex min-h-0 flex-1 flex-col gap-7 sm:gap-8", className)}
    >
      {/* KPI strip — 4-up soft cards */}
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:gap-3.5 lg:grid-cols-4">
        {kpiSkeletonIds.map((id) => (
          <div
            key={id}
            className="flex gap-3.5 rounded-[14px] border border-evvnt-n200/90 bg-white px-4 py-3.5 shadow-[0_4px_18px_-10px_rgb(26_9_51_/_8%)]"
          >
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-2.5 w-[55%] rounded-evvnt-sm" />
              <Skeleton className="h-7 w-[45%] rounded-evvnt-md" />
              <Skeleton className="h-2.5 w-[70%] rounded-evvnt-sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + attention rail */}
      <div className="grid min-w-0 shrink-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,31%)] lg:gap-6">
        <div className="min-w-0 overflow-hidden rounded-[14px] border border-evvnt-n200/90 bg-white p-4 shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40 rounded-evvnt-sm" />
              <Skeleton className="h-8 w-48 rounded-evvnt-md" />
              <Skeleton className="h-3 w-64 max-w-full rounded-evvnt-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-52 rounded-[10px]" />
              <Skeleton className="h-9 w-32 rounded-[10px]" />
            </div>
          </div>
          <Skeleton className="mt-4 h-[200px] w-full rounded-[12px]" />
          <div className="mt-3 flex justify-between border-evvnt-n100 border-t pt-3">
            <Skeleton className="h-3 w-40 rounded-evvnt-sm" />
            <Skeleton className="h-3 w-48 rounded-evvnt-sm" />
          </div>
        </div>

        <div className="min-w-0 rounded-[14px] border border-evvnt-n200/90 bg-white p-4 shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)]">
          <div className="mb-3 space-y-1.5">
            <Skeleton className="h-4 w-40 rounded-evvnt-md" />
            <Skeleton className="h-2.5 w-28 rounded-evvnt-sm" />
          </div>
          <div className="flex flex-col gap-2">
            {attentionRowIds.map((id) => (
              <div
                key={id}
                className="flex flex-col gap-2 rounded-[13px] border border-evvnt-n200/90 bg-white px-3.5 py-3 shadow-[0_4px_18px_-10px_rgb(26_9_51_/_8%)]"
              >
                <div className="flex gap-2">
                  <Skeleton className="mt-1.5 size-2 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-full rounded-evvnt-sm" />
                    <Skeleton className="h-2.5 w-[90%] rounded-evvnt-sm" />
                  </div>
                </div>
                <div className="flex justify-between border-evvnt-n100 border-t border-dashed pt-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-3 w-14 rounded-evvnt-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-5 border-evvnt-n200/70 border-t pt-6 sm:gap-6 sm:pt-7 lg:grid-cols-[minmax(0,1.22fr)_minmax(280px,400px)] lg:items-start">
        <div className="flex max-h-[min(320px,48vh)] flex-col overflow-hidden rounded-[14px] border border-evvnt-n200/90 bg-white shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)] sm:max-h-[340px]">
          <div className="flex shrink-0 flex-col gap-2 border-b border-evvnt-n100 bg-evvnt-n50/50 px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-28 rounded-evvnt-md" />
              <Skeleton className="size-9 rounded-[10px]" />
            </div>
            <Skeleton className="h-9 w-full rounded-[10px]" />
            <div className="flex gap-1">
              {subTabPlaceholders.map((t) => (
                <Skeleton
                  key={t}
                  className="h-7 shrink-0 rounded-[8px] px-2.5 py-1"
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
                <Skeleton className="mt-px size-8 shrink-0 rounded-[9px]" />
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
          <div className="flex flex-col overflow-hidden rounded-[14px] border border-evvnt-n200/90 bg-white shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)]">
            <div className="border-b border-evvnt-n100 bg-evvnt-n50/50 px-4 py-3.5 pb-3">
              <Skeleton className="h-4 w-28 rounded-evvnt-md" />
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 sm:gap-2.5">
              {quickActionIds.map((id) => (
                <div
                  key={id}
                  className="flex flex-col gap-1.5 rounded-[12px] border border-evvnt-n200/90 bg-evvnt-canvas-soft p-3"
                >
                  <Skeleton className="size-7 rounded-evvnt-sm" />
                  <Skeleton className="h-3.5 w-[85%] rounded-evvnt-sm" />
                  <Skeleton className="h-2 w-full rounded-evvnt-sm" />
                  <Skeleton className="h-2 w-[80%] rounded-evvnt-sm" />
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative shrink-0 overflow-hidden rounded-[14px] border border-white/10 p-4 shadow-[0_8px_32px_-10px_rgb(45_15_107_/_38%)]"
            style={{ backgroundImage: "var(--background-image-evvnt-plan)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-5 -bottom-5 size-[120px] rounded-full bg-white/6"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-8 right-10 size-20 rounded-full bg-white/4"
            />

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
