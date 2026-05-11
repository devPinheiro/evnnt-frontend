import { getApiErrorMessage } from "@/lib/api-error";
import { logoutSession } from "@/services/auth.services";
import { useListEvents } from "@/services/events.services";
import { demoEventCards } from "@data";
import {
  DashboardContent,
  DashboardTopbar,
  EventsPageSkeleton,
  EventsSection,
} from "@organisms/dashboard";
import { useUiStore } from "@store";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@ui/button";

/** My events — list, filters, and create (separate from workspace dashboard). */
export function EventsPage() {
  const router = useRouter();
  const openCreateEvent = useUiStore((s) => s.openCreateEvent);

  const { data, isLoading, error } = useListEvents();
  const events = data?.events;

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
    subtitleParts.push("Create and manage your events");
  }

  return (
    <>
      <DashboardTopbar
        title={<>My events</>}
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
          <EventsPageSkeleton />
        ) : (
          <div className="flex flex-col gap-5 sm:gap-6">
            <p className="text-[13px] text-evvnt-n700">
              <Link
                to="/dashboard"
                className="font-medium text-evvnt-core underline-offset-2 hover:underline"
              >
                Back to dashboard
              </Link>
            </p>
            <EventsSection
              events={demoEventCards}
              totalLabel={`${events?.length ?? 5} total`}
              onNewEvent={openCreateEvent}
            />
          </div>
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
