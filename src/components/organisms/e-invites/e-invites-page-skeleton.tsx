import { Skeleton } from "@ui/skeleton";

export function EInvitesPageSkeleton() {
  return (
    <output aria-live="polite" aria-busy="true" className="flex flex-col gap-5 sm:gap-6">
      <section className="grid gap-3 sm:grid-cols-3">
        {["sk-kpi-1", "sk-kpi-2", "sk-kpi-3"].map((id) => (
          <article
            key={id}
            className="rounded-evvnt-xl border border-evvnt-n200 bg-white p-4 shadow-[0_1px_2px_rgb(26_9_51_/_5%)]"
          >
            <Skeleton className="h-2.5 w-24 rounded-evvnt-sm" />
            <Skeleton className="mt-2 h-8 w-20 rounded-evvnt-sm" />
            <Skeleton className="mt-2 h-2.5 w-32 rounded-evvnt-sm" />
          </article>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
          <div className="border-b border-evvnt-n100 px-4 py-3.5">
            <Skeleton className="h-4 w-28 rounded-evvnt-sm" />
            <Skeleton className="mt-2 h-2.5 w-44 rounded-evvnt-sm" />
          </div>
          <div className="space-y-3 p-4">
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-20 rounded-evvnt-sm" />
              <Skeleton className="h-10 w-full rounded-evvnt-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-14 rounded-evvnt-sm" />
              <Skeleton className="h-28 w-full rounded-evvnt-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-evvnt-md" />
              <Skeleton className="h-8 w-24 rounded-evvnt-md" />
            </div>
          </div>
        </section>

        <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
          <div className="border-b border-evvnt-n100 px-4 py-3.5">
            <Skeleton className="h-4 w-20 rounded-evvnt-sm" />
            <Skeleton className="mt-2 h-2.5 w-36 rounded-evvnt-sm" />
          </div>
          <div className="space-y-2.5 p-3.5">
            {["sk-aud-1", "sk-aud-2", "sk-aud-3"].map((id) => (
              <div
                key={id}
                className="flex items-center gap-3 rounded-evvnt-lg border border-evvnt-n200 bg-white px-3 py-2.5"
              >
                <Skeleton className="size-7 rounded-evvnt-sm" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24 rounded-evvnt-sm" />
                  <Skeleton className="h-2.5 w-28 rounded-evvnt-sm" />
                </div>
                <Skeleton className="h-3 w-10 rounded-evvnt-sm" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
        <div className="border-b border-evvnt-n100 px-4 py-3.5">
          <Skeleton className="h-4 w-24 rounded-evvnt-sm" />
        </div>
        <div className="space-y-2.5 p-3.5">
          {["sk-send-1", "sk-send-2", "sk-send-3"].map((id) => (
            <div
              key={id}
              className="rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist px-3.5 py-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-28 rounded-evvnt-sm" />
                  <Skeleton className="h-2.5 w-24 rounded-evvnt-sm" />
                </div>
                <Skeleton className="h-2.5 w-12 rounded-evvnt-sm" />
              </div>
              <Skeleton className="mt-2 h-2.5 w-44 rounded-evvnt-sm" />
            </div>
          ))}
        </div>
      </section>
    </output>
  );
}
