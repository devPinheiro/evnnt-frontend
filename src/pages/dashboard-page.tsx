import { logoutSession } from "@/services/auth.services";
import {
  demoActivityRows,
  demoAttentionItems,
  demoKpiItems,
  demoWorkspaceOverviewByRange,
} from "@data";
import { greetingFirstName } from "@hooks";
import {
  ActivityFeed,
  AttentionStrip,
  DashboardContent,
  DashboardTopbar,
  KpiStrip,
  OverviewChartCard,
  PlanWidget,
  QuickActions,
} from "@organisms/dashboard";
import { useAuthStore, useUiStore } from "@store";
import { Link, useRouter } from "@tanstack/react-router";
import { Button, buttonVariants } from "@ui/button";
import { cn } from "@utils";

/** Authenticated home — workspace metrics, trends, activity (not the events list). */
export function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const openCreateEvent = useUiStore((s) => s.openCreateEvent);

  const first = greetingFirstName(user);

  const subtitleParts = [
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
    "Workspace overview",
  ];

  return (
    <>
      <DashboardTopbar
        title={<>Good morning, {first} 👋</>}
        subtitle={subtitleParts.join(" · ")}
        onNewEvent={openCreateEvent}
      />

      <DashboardContent>
        <div className="flex flex-col gap-7 sm:gap-8">
          <section aria-labelledby="dash-kpi-heading" className="shrink-0">
            <h2 id="dash-kpi-heading" className="sr-only">
              Key metrics
            </h2>
            <KpiStrip items={demoKpiItems} />
          </section>

          <section
            aria-labelledby="dash-insights-heading"
            className="grid min-w-0 shrink-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,31%)] lg:items-stretch lg:gap-6"
          >
            <h2 id="dash-insights-heading" className="sr-only">
              Trends and alerts
            </h2>
            <div className="min-w-0">
              <OverviewChartCard data={demoWorkspaceOverviewByRange} defaultRange="7d" />
            </div>
            <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start lg:max-h-[min(640px,calc(100dvh-9rem))] lg:overflow-y-auto">
              <div className="rounded-[14px] border border-evvnt-n200/90 bg-white p-4 shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)]">
                <AttentionStrip
                  title="Needs your attention"
                  count={4}
                  items={demoAttentionItems}
                  layout="rail"
                />
              </div>
            </aside>
          </section>

          <section
            aria-labelledby="dash-ops-heading"
            className="grid shrink-0 grid-cols-1 gap-5 border-evvnt-n200/70 border-t pt-6 sm:gap-6 sm:pt-7 lg:grid-cols-[minmax(0,1.22fr)_minmax(280px,400px)] lg:items-start"
          >
            <h2 id="dash-ops-heading" className="sr-only">
              Activity and shortcuts
            </h2>
            <ActivityFeed rows={demoActivityRows} />
            <div className="flex min-w-0 flex-col gap-4">
              <QuickActions />
              <PlanWidget />
            </div>
          </section>

          <section className="flex shrink-0 flex-col gap-3 rounded-[14px] border border-evvnt-n200/80 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-[13px] text-evvnt-n700">
              Manage invitations, tickets, and drafts on{" "}
              <Link
                to="/events"
                className="font-semibold text-evvnt-core underline-offset-2 hover:underline"
              >
                My events
              </Link>
              .
            </p>
            <Link
              to="/events"
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "shrink-0 self-start no-underline sm:self-auto",
              )}
            >
              Open My events
            </Link>
          </section>
        </div>

        <div className="flex justify-end border-evvnt-n200 border-t pt-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="!h-auto !px-0 !py-0 text-sm font-normal text-evvnt-n500 underline-offset-4 hover:bg-transparent hover:text-evvnt-ink hover:underline"
            onClick={() => {
              void (async () => {
                await logoutSession();
                await router.navigate({ to: "/" });
              })();
            }}
          >
            Sign out
          </Button>
        </div>
      </DashboardContent>
    </>
  );
}
