import { Skeleton } from "@ui/skeleton";
import { cn } from "@utils";

const eventTabPlaceholders = ["All", "Live", "Upcoming", "Ended", "Drafts"] as const;
const eventCardIds = ["sk-ev-1", "sk-ev-2", "sk-ev-3", "sk-ev-4", "sk-ev-5"] as const;
const metricCellIds = ["sk-m-1", "sk-m-2", "sk-m-3", "sk-m-4"] as const;

type EventsPageSkeletonProps = {
  className?: string;
};

/** Loading shell for the My events route — mirrors EventCard / NewEventCard layout. */
export function EventsPageSkeleton({ className }: EventsPageSkeletonProps) {
  return (
    <output
      aria-live="polite"
      aria-busy="true"
      className={cn("pointer-events-none flex min-h-0 flex-1 flex-col gap-5 sm:gap-6", className)}
    >
      <Skeleton className="h-4 w-40 rounded-evvnt-sm" />

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
                  className="h-8 shrink-0 rounded-[9px] px-3 py-1.5"
                  style={{ width: t.length * 7 + 24 }}
                />
              ))}
            </div>
            <Skeleton className="h-3.5 w-24 self-end rounded-evvnt-sm sm:self-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {eventCardIds.map((id) => (
            <div
              key={id}
              className="flex flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgb(0_0_0_/_4%),0_4px_12px_rgb(0_0_0_/_4%)]"
            >
              <Skeleton className="h-[7.25rem] w-full shrink-0 rounded-none sm:h-[7.75rem]" />
              <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
                <Skeleton className="h-4 w-[88%] rounded-evvnt-md" />
                <Skeleton className="h-5 w-24 rounded-lg" />
                <div className="mt-1 space-y-2 rounded-xl bg-evvnt-canvas-soft/80 p-2.5">
                  <Skeleton className="h-4 w-full rounded-evvnt-sm" />
                  <Skeleton className="h-4 w-[92%] rounded-evvnt-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {metricCellIds.map((mid) => (
                    <Skeleton key={`${id}-${mid}`} className="h-14 rounded-xl" />
                  ))}
                </div>
                <div className="flex justify-end border-evvnt-n100 border-t border-dashed pt-2.5">
                  <Skeleton className="h-3 w-14 rounded-evvnt-sm" />
                </div>
              </div>
            </div>
          ))}
          <div className="flex min-h-[12rem] flex-col justify-between rounded-[20px] border border-dashed border-black/[0.14] bg-evvnt-n50/50 p-5 shadow-[0_1px_2px_rgb(0_0_0_/_4%)]">
            <div className="flex justify-between">
              <Skeleton className="size-12 rounded-2xl" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 rounded-evvnt-md" />
              <Skeleton className="mt-2 h-3 w-full max-w-[14rem] rounded-evvnt-sm" />
              <Skeleton className="mt-3 h-3 w-24 rounded-evvnt-sm" />
            </div>
          </div>
        </div>
      </section>
    </output>
  );
}
