import { AppBreadcrumb } from "@molecules/app-breadcrumb";
import { Bell, Menu, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";

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

export function DashboardTopbar({
  title,
  subtitle,
  breadcrumb,
  searchPlaceholder = "Search events, guests, vendors…",
  onNewEvent,
  className,
}: DashboardTopbarProps) {
  const { openSidebar } = useDashboardLayout();

  return (
    <header
      className={cn(
        "flex shrink-0 flex-col gap-3 border-b border-evvnt-n200 bg-white px-4 py-3 shadow-[0_1px_0_rgb(26_9_51_/_4%)] sm:px-6 lg:h-14 lg:flex-row lg:items-center lg:gap-3 lg:py-0",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 lg:min-w-0 lg:flex-1">
        <button
          type="button"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist text-evvnt-core transition-colors hover:bg-evvnt-tint lg:hidden"
          aria-label="Open navigation menu"
          onClick={openSidebar}
        >
          <Menu className="size-[18px]" strokeWidth={1.5} />
        </button>
        <div className="min-w-0 flex-1">
          {breadcrumb !== false && (breadcrumb ?? <AppBreadcrumb className="mb-1.5" />)}
          <h1 className="text-[15px] leading-tight font-semibold tracking-tight text-evvnt-ink sm:text-base">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-evvnt-n500 sm:line-clamp-none sm:text-xs">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end lg:flex-1">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist px-3 py-1.5 lg:max-w-[220px] lg:flex-initial">
          <Search className="size-[13px] shrink-0 text-evvnt-n400" strokeWidth={1.3} />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-evvnt-n700 outline-none placeholder:text-evvnt-n400"
          />
        </label>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            className="relative flex size-[34px] cursor-pointer items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist transition-colors hover:bg-evvnt-tint"
            aria-label="Notifications"
          >
            <Bell className="size-[14px] text-evvnt-core" strokeWidth={1.2} />
            <span className="absolute top-[7px] right-[7px] size-1.5 rounded-full border-[1.5px] border-white bg-evvnt-vivid" />
          </button>

          <button
            type="button"
            className="flex size-[34px] cursor-pointer items-center justify-center rounded-evvnt-md border border-evvnt-n200 bg-evvnt-mist transition-colors hover:bg-evvnt-tint lg:hidden"
            aria-label="Search"
          >
            <Search className="size-[14px] text-evvnt-core" strokeWidth={1.2} />
          </button>

          <button
            type="button"
            onClick={onNewEvent}
            className="flex cursor-pointer items-center gap-1.5 rounded-evvnt-md bg-evvnt-core px-3 py-2 text-[13px] font-medium whitespace-nowrap text-white transition-colors hover:bg-evvnt-deep sm:px-4"
          >
            <Plus className="size-[13px] shrink-0 stroke-[1.5]" />
            <span className="hidden min-[380px]:inline">New Event</span>
            <span className="min-[380px]:hidden">New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
