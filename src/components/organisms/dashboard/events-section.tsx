import { useState } from "react";

import { cn } from "@utils";

import type { EventCardProps } from "./event-card";
import { EventCard } from "./event-card";
import { NewEventCard } from "./new-event-card";

const tabs = ["All", "Live", "Upcoming", "Ended", "Drafts"] as const;

type EventsSectionProps = {
  events: EventCardProps[];
  totalLabel?: string;
  onNewEvent?: () => void;
};

export function EventsSection({ events, totalLabel, onNewEvent }: EventsSectionProps) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  return (
    <section className="min-w-0">
      <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-evvnt-ink">My events</h2>
          {totalLabel && <p className="mt-0.5 text-[11px] text-evvnt-n500">{totalLabel}</p>}
        </div>
        <div className="flex min-w-0 flex-col gap-2.5 sm:items-end">
          <div className="-mx-1 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  tab === t
                    ? "border-evvnt-muted bg-evvnt-tint text-evvnt-core shadow-sm"
                    : "border-transparent text-evvnt-n500 hover:bg-evvnt-n50",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer self-end text-xs font-medium text-evvnt-vivid transition-colors hover:text-evvnt-core sm:self-auto"
          >
            Manage all →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 xl:grid-cols-3">
        {events.map((ev, i) => (
          <EventCard key={`${ev.title}-${i}`} {...ev} />
        ))}
        <NewEventCard onClick={onNewEvent} />
      </div>
    </section>
  );
}
