import { useState } from "react";

import { Button } from "@ui/button";
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
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
          <h2 className="text-[17px] font-bold tracking-tight text-evvnt-ink">My events</h2>
          {totalLabel && <p className="mt-0.5 text-[11px] text-evvnt-n500">{totalLabel}</p>}
        </div>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as (typeof tabs)[number])}
          className="flex min-w-0 flex-col gap-2.5 sm:items-end"
        >
          <TabsList className="h-auto w-full justify-start gap-0.5 overflow-x-auto rounded-[11px] border border-evvnt-n200/70 bg-evvnt-n50/90 p-0.5 [scrollbar-width:none] sm:w-auto sm:justify-end [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={cn(
                  "h-auto shrink-0 rounded-[9px] border border-transparent px-3 py-1.5 text-xs font-semibold shadow-none",
                  "data-[state=active]:border-evvnt-n300 data-[state=active]:bg-white data-[state=active]:text-evvnt-core data-[state=active]:shadow-sm",
                  "data-[state=inactive]:text-evvnt-n500 data-[state=inactive]:hover:bg-white/70",
                )}
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="!h-auto w-fit self-end !bg-transparent !px-0 !py-0 text-xs font-medium text-evvnt-vivid hover:text-evvnt-core sm:self-auto"
          >
            Manage all →
          </Button>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {events.length === 0 && (
          <div className="flex min-h-[11rem] flex-col justify-center rounded-[20px] border border-black/[0.08] bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0_/_4%),0_4px_12px_rgb(0_0_0_/_4%)] sm:col-span-2 xl:col-span-2">
            <div className="text-sm font-semibold text-evvnt-ink">No events yet</div>
            <div className="mt-1 text-[11px] leading-relaxed text-evvnt-n500">
              Create your first event to start managing guests, tickets, gifting, and vendors.
            </div>
            <div className="mt-3">
              <Button type="button" variant="primary" size="sm" onClick={onNewEvent}>
                Create event
              </Button>
            </div>
          </div>
        )}
        {events.map((ev, i) => (
          <EventCard key={`${ev.title}-${i}`} {...ev} />
        ))}
        <NewEventCard onClick={onNewEvent} />
      </div>
    </section>
  );
}
