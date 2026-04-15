import { Bell, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@utils";

type DashboardTopbarProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  searchPlaceholder?: string;
  onNewEvent?: () => void;
  className?: string;
};

export function DashboardTopbar({
  title,
  subtitle,
  searchPlaceholder = "Search events, guests, vendors…",
  onNewEvent,
  className,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b border-evvnt-n200 bg-white px-6",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-[15px] leading-none font-semibold text-evvnt-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[11px] text-evvnt-n400">{subtitle}</p>}
      </div>

      <label className="flex w-[220px] items-center gap-2 rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-3 py-1.5">
        <Search className="size-[13px] shrink-0 text-evvnt-n400" strokeWidth={1.3} />
        <input
          type="search"
          placeholder={searchPlaceholder}
          className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-evvnt-n700 outline-none placeholder:text-evvnt-n400"
        />
      </label>

      <button
        type="button"
        className="relative flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist transition-colors hover:bg-evvnt-tint"
        aria-label="Notifications"
      >
        <Bell className="size-[14px] text-evvnt-core" strokeWidth={1.2} />
        <span className="absolute top-[7px] right-[7px] size-1.5 rounded-full border-[1.5px] border-white bg-evvnt-vivid" />
      </button>

      <button
        type="button"
        className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist transition-colors hover:bg-evvnt-tint"
        aria-label="Search"
      >
        <Search className="size-[14px] text-evvnt-core" strokeWidth={1.2} />
      </button>

      <button
        type="button"
        onClick={onNewEvent}
        className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-evvnt-md bg-evvnt-core px-4 py-2 text-[13px] font-medium whitespace-nowrap text-white transition-colors hover:bg-evvnt-deep"
      >
        <Plus className="size-[13px] stroke-[1.5]" />
        New Event
      </button>
    </header>
  );
}
