import { AppBreadcrumb } from "@molecules/app-breadcrumb";
import { Bell, Calendar, Menu, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@ui/button";
import { cn } from "@utils";

import { useDashboardLayout } from "./dashboard-layout-context";

type DashboardTopbarProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Override default path-based crumbs, or `false` to hide. */
  breadcrumb?: ReactNode | false;
  searchPlaceholder?: string;
  onNewEvent?: () => void;
  className?: string;
};

function formatTopbarDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function DashboardTopbar({
  title,
  subtitle,
  breadcrumb,
  searchPlaceholder = "Search events, guests, vendors…",
  onNewEvent,
  className,
}: DashboardTopbarProps) {
  const { openSidebar } = useDashboardLayout();
  const dateLabel = formatTopbarDate(new Date());

  return (
    <header
      className={cn(
        "flex shrink-0 flex-col gap-3 border-b border-evvnt-n200/80 bg-white/95 px-4 py-3 shadow-[0_4px_24px_-16px_rgb(26_9_51_/_10%)] backdrop-blur-[6px] sm:px-6 lg:h-[4.25rem] lg:flex-row lg:items-center lg:gap-4 lg:py-0",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="size-9 shrink-0 p-0 text-evvnt-core hover:bg-evvnt-tint lg:hidden"
            aria-label="Open navigation menu"
            onClick={openSidebar}
          >
            <Menu className="size-[18px]" strokeWidth={1.5} />
          </Button>
          <div className="min-w-0 flex-1">
            {breadcrumb !== false &&
              (breadcrumb ?? <AppBreadcrumb className="mb-1 hidden sm:block" />)}
            <h1 className="text-lg leading-tight font-bold tracking-tight text-evvnt-ink sm:text-xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-evvnt-n500 sm:line-clamp-none sm:text-[13px]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end lg:max-w-[min(100%,520px)] lg:flex-initial">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[11px] border border-evvnt-n200 bg-evvnt-canvas-soft px-3 py-2 transition-colors focus-within:border-evvnt-muted focus-within:bg-white focus-within:ring-2 focus-within:ring-evvnt-muted/40 lg:max-w-[260px] lg:flex-initial">
          <Search className="size-[14px] shrink-0 text-evvnt-n400" strokeWidth={1.3} />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-evvnt-n700 outline-none placeholder:text-evvnt-n400"
          />
        </label>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden h-10 gap-2 rounded-[11px] px-3 font-medium text-evvnt-ink sm:inline-flex"
            aria-label={`Workspace date: ${dateLabel}`}
          >
            <Calendar className="size-[15px] text-evvnt-n500" strokeWidth={1.35} />
            <span className="text-[13px] tabular-nums">{dateLabel}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="relative size-10 rounded-[11px] p-0 hover:bg-evvnt-tint"
            aria-label="Notifications"
          >
            <Bell className="size-[15px] text-evvnt-core" strokeWidth={1.2} />
            <span className="absolute top-2 right-2 size-2 rounded-full border-2 border-white bg-evvnt-vivid" />
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="size-10 rounded-[11px] p-0 hover:bg-evvnt-tint lg:hidden"
            aria-label="Search"
          >
            <Search className="size-[15px] text-evvnt-core" strokeWidth={1.2} />
          </Button>

          <Button
            type="button"
            onClick={onNewEvent}
            variant="primary"
            size="md"
            className="h-10 gap-1.5 rounded-[11px] px-4 text-[13px] font-semibold shadow-[0_4px_14px_-4px_rgb(75_31_168_/_35%)]"
          >
            <Plus className="size-[14px] shrink-0 stroke-[1.5]" />
            <span className="hidden min-[380px]:inline">New Event</span>
            <span className="min-[380px]:hidden">New</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
