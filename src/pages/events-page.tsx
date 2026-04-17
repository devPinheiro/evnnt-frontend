import { getApiErrorMessage } from "@/lib/api-error";
import { logoutSession } from "@/services/auth.services";
import { useListEvents } from "@/services/events.services";
import { demoActivityRows, demoAttentionItems, demoEventCards, demoKpiItems } from "@data";
import { greetingFirstName } from "@hooks";
import {
  ActivityFeed,
  AttentionStrip,
  DashboardContent,
  DashboardPageSkeleton,
  DashboardTopbar,
  EventsSection,
  KpiStrip,
  PlanWidget,
  QuickActions,
} from "@organisms/dashboard";
import { useAuthStore, useUiStore } from "@store";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@ui/button";

/** Authenticated dashboard — events home (matches product “My events” hub). */
export function EventsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const openCreateEvent = useUiStore((s) => s.openCreateEvent);

  const { data, isLoading, error } = useListEvents();
  const events = data?.events;

  const first = greetingFirstName(user);

  const subtitleParts = [
    new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
  ];
  if (events && events.length > 0) {
    subtitleParts.push(`${events.length} event${events.length === 1 ? "" : "s"} in your workspace`);
  } else {
    subtitleParts.push("3 events active this month");
  }

  return (
    <>
      <DashboardTopbar
        title={<>Good morning, {first} 👋</>}
        subtitle={subtitleParts.join(" · ")}
        onNewEvent={openCreateEvent}
      />

      <DashboardContent>
        {error && (
          <div
            className="shrink-0 rounded-evvnt-xl border border-evvnt-danger-light bg-evvnt-danger-subtle px-4 py-3 text-sm text-evvnt-danger"
            role="alert"
          >
            {getApiErrorMessage(error)}
          </div>
        )}

        {isLoading ? (
          <DashboardPageSkeleton />
        ) : (
          <>
            <KpiStrip items={demoKpiItems} />

            <AttentionStrip title="Needs your attention" count={4} items={demoAttentionItems} />

            <EventsSection
              events={demoEventCards}
              totalLabel={`${events?.length ?? 5} total`}
              onNewEvent={openCreateEvent}
            />

            <div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr] lg:gap-5">
              <ActivityFeed rows={demoActivityRows} />
              <div className="flex flex-col gap-3 sm:gap-4">
                <QuickActions />
                <PlanWidget />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end border-evvnt-n200 border-t pt-5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="!h-auto !px-0 !py-0 text-sm font-normal text-evvnt-n500 underline-offset-4 hover:bg-transparent hover:text-evvnt-ink hover:underline"
            onClick={() => {
              void (async () => {
                await logoutSession();
                await router.navigate({ to: "/login" });
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
