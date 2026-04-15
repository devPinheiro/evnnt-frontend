import { getApiErrorMessage } from "@/lib/api-error";
import { logoutSession } from "@/services/auth.api";
import { listEvents } from "@/services/events.api";
import { demoActivityRows, demoAttentionItems, demoEventCards, demoKpiItems } from "@data";
import { greetingFirstName } from "@hooks";
import {
  ActivityFeed,
  AttentionStrip,
  DashboardContent,
  DashboardTopbar,
  EventsSection,
  KpiStrip,
  PlanWidget,
  QuickActions,
} from "@organisms/dashboard";
import { useAuthStore } from "@store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@ui/button";

export const Route = createFileRoute("/(authenticated)/_appLayout/events/")({
  component: EventsPage,
});

function EventsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: listEvents,
  });

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
      <DashboardTopbar title={<>Good morning, {first} 👋</>} subtitle={subtitleParts.join(" · ")} />

      <DashboardContent>
        {isLoading && <p className="text-sm text-evvnt-n500">Loading your events…</p>}
        {error && <p className="text-sm text-evvnt-danger">{getApiErrorMessage(error)}</p>}

        <KpiStrip items={demoKpiItems} />

        <AttentionStrip title="Needs your attention" count={4} items={demoAttentionItems} />

        <EventsSection events={demoEventCards} totalLabel={`${events?.length ?? 5} total`} />

        <div className="grid shrink-0 grid-cols-[1.2fr_1fr] gap-3">
          <ActivityFeed rows={demoActivityRows} />
          <div className="flex flex-col gap-2.5">
            <QuickActions />
            <PlanWidget />
          </div>
        </div>

        <div className="flex justify-end border-t border-evvnt-n200 pt-4">
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
