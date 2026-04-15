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
    <section>
      <div className="mb-2.5 flex shrink-0 items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-evvnt-ink">My events</span>
          {totalLabel && <span className="ml-1.5 text-[11px] text-evvnt-n400">· {totalLabel}</span>}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "cursor-pointer rounded-evvnt-sm border border-transparent px-3 py-1 text-xs font-medium transition-colors",
                  tab === t
                    ? "border-evvnt-muted bg-evvnt-tint text-evvnt-core"
                    : "text-evvnt-n500 hover:bg-evvnt-n50",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <button type="button" className="cursor-pointer text-xs font-medium text-evvnt-vivid">
            Manage all →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {events.map((ev, i) => (
          <EventCard key={`${ev.title}-${i}`} {...ev} />
        ))}
        <NewEventCard onClick={onNewEvent} />
      </div>
    </section>
  );
}
