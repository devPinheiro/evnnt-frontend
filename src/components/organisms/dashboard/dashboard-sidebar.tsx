import {
  BarChart3,
  Calendar,
  CreditCard,
  Gift,
  ImageIcon,
  LayoutGrid,
  LayoutPanelLeft,
  LineChart,
  Mail,
  Settings,
  Ticket,
  Users,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { displayNameFromUser, getInitialsFromUser } from "@hooks";
import { useAuthStore } from "@store";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@utils";

import { useDashboardLayout } from "./dashboard-layout-context";

type NavGlyph =
  | "dashboard"
  | "planner"
  | "events"
  | "analytics"
  | "guests"
  | "tickets"
  | "vendors"
  | "finances"
  | "gifting"
  | "invites"
  | "gallery"
  | "settings"
  | "team";

type NavItem = {
  id: string;
  label: string;
  glyph: NavGlyph;
  badge?: string;
  active?: boolean;
  /** In-app route (TanStack Router) */
  to?: string;
};

const stroke = "size-[15px] stroke-[1.5]";

function navItemIsActive(item: NavItem, pathname: string): boolean {
  if (item.to === "/events/") {
    return pathname === "/events" || pathname === "/events/";
  }
  if (item.to) {
    return pathname === item.to;
  }
  return Boolean(item.active);
}

function NavIconBox({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-[15px] w-[15px] shrink-0 items-center justify-center text-white [&_svg]:stroke-white",
        active ? "opacity-100" : "opacity-45",
      )}
    >
      {children}
    </div>
  );
}

function NavGlyphIcon({ name, active }: { name: NavGlyph; active?: boolean }) {
  return (
    <NavIconBox active={active}>
      {name === "dashboard" && <LayoutGrid className={stroke} />}
      {name === "planner" && <LayoutPanelLeft className={stroke} />}
      {name === "events" && <Calendar className={stroke} />}
      {name === "analytics" && <LineChart className={stroke} />}
      {name === "guests" && <Users className={stroke} />}
      {name === "tickets" && <Ticket className={stroke} />}
      {name === "vendors" && <BarChart3 className={stroke} />}
      {name === "finances" && <CreditCard className={stroke} />}
      {name === "gifting" && <Gift className={stroke} />}
      {name === "invites" && <Mail className={stroke} />}
      {name === "gallery" && <ImageIcon className={stroke} />}
      {name === "settings" && <Settings className={stroke} />}
      {name === "team" && <UsersRound className={stroke} />}
    </NavIconBox>
  );
}

const workspaceItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", glyph: "dashboard", to: "/events/" },
  { id: "planner", label: "Planner", glyph: "planner", to: "/events/planner" },
  { id: "events", label: "My Events", glyph: "events", badge: "5" },
  { id: "analytics", label: "Analytics", glyph: "analytics", badge: "v1.1" },
];

const moduleItems: NavItem[] = [
  { id: "guests", label: "Guests", glyph: "guests" },
  { id: "tickets", label: "Tickets", glyph: "tickets" },
  { id: "vendors", label: "Vendors", glyph: "vendors" },
  { id: "finances", label: "Finances", glyph: "finances" },
  { id: "gifting", label: "Gifting", glyph: "gifting" },
  { id: "invites", label: "E-Invites", glyph: "invites", to: "/events/invites" },
  { id: "gallery", label: "Gallery", glyph: "gallery" },
];

const settingsItems: NavItem[] = [
  { id: "settings", label: "Settings", glyph: "settings" },
  { id: "team", label: "Team", glyph: "team" },
];

function NavRow({ item }: { item: NavItem }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = navItemIsActive(item, pathname);
  const { closeSidebar } = useDashboardLayout();

  const className = cn(
    "relative mb-px flex w-full cursor-pointer items-center gap-[9px] rounded-evvnt-md px-2.5 py-2 text-left transition-colors",
    "hover:bg-white/6",
    isActive && "bg-[rgb(124_58_237_/_22%)]",
  );

  const inner = (
    <>
      {isActive && (
        <span className="absolute top-1/2 left-0 h-[18px] w-[3px] -translate-y-1/2 rounded-r-sm bg-evvnt-vivid" />
      )}
      <NavGlyphIcon name={item.glyph} active={isActive} />
      <span
        className={cn(
          "text-[13px] font-normal text-white/50",
          isActive && "font-medium text-white",
        )}
      >
        {item.label}
      </span>
      {item.badge && (
        <span
          className={cn(
            "ml-auto rounded-full bg-[rgb(124_58_237_/_45%)] px-1.5 py-0.5 text-[9px] font-semibold text-evvnt-muted",
            item.badge.startsWith("v") &&
              "px-1.5 py-px text-[8px] font-bold tracking-wide uppercase",
          )}
        >
          {item.badge}
        </span>
      )}
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} className={className} onClick={() => closeSidebar()}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {inner}
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 pt-2.5 pb-1 text-[9px] font-semibold tracking-widest text-white/22 uppercase">
      {children}
    </div>
  );
}

type DashboardSidebarProps = {
  wordmark?: ReactNode;
  /** Override org chip (defaults from auth user). */
  orgInitials?: string;
  orgName?: string;
  orgPlanLine?: string;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
};

export function DashboardSidebar({
  wordmark,
  orgInitials: orgInitialsProp,
  orgName: orgNameProp,
  orgPlanLine = "Pro · 3 of 5 events used",
  userInitials: userInitialsProp,
  userName: userNameProp,
  userEmail: userEmailProp,
}: DashboardSidebarProps) {
  const user = useAuthStore((s) => s.user);
  const orgInitials = orgInitialsProp ?? getInitialsFromUser(user);
  const orgName = orgNameProp ?? displayNameFromUser(user);
  const userInitials = userInitialsProp ?? getInitialsFromUser(user);
  const userName = userNameProp ?? displayNameFromUser(user);
  const userEmail = userEmailProp ?? user?.email ?? "";

  return (
    <aside className="relative flex h-screen w-evvnt-sidebar shrink-0 flex-col overflow-hidden bg-evvnt-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[60px] top-5 h-60 w-60 rounded-full bg-[radial-gradient(circle,var(--color-evvnt-sidebar-glow)_0%,transparent_68%)]"
      />

      <div className="shrink-0 border-b border-white/7 px-5 pt-[22px] pb-4">
        {wordmark ?? (
          <>
            <div className="text-[21px] leading-none font-bold tracking-tight text-white">
              evvnt<em className="font-bold not-italic text-evvnt-vivid">.</em>
            </div>
            <div className="mt-0.5 text-[10px] tracking-wide text-white/28">
              Event Management OS
            </div>
          </>
        )}
      </div>

      <div className="mx-3 mt-2.5 flex shrink-0 items-center gap-2 rounded-evvnt-lg border border-[rgb(124_58_237_/_25%)] bg-[rgb(124_58_237_/_15%)] px-3 py-2">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-evvnt-sm bg-gradient-to-br from-evvnt-deep to-evvnt-vivid text-[10px] font-bold text-white">
          {orgInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs leading-none font-semibold text-white">{orgName}</div>
          <div className="mt-0.5 text-[10px] text-white/35">{orgPlanLine}</div>
        </div>
        <ChevronDownIcon className="ml-auto shrink-0 text-white/25" />
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 pt-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SectionLabel>Workspace</SectionLabel>
        {workspaceItems.map((item) => (
          <NavRow key={item.id} item={item} />
        ))}
        <SectionLabel>Event modules</SectionLabel>
        {moduleItems.map((item) => (
          <NavRow key={item.id} item={item} />
        ))}
        <SectionLabel>Settings</SectionLabel>
        {settingsItems.map((item) => (
          <NavRow key={item.id} item={item} />
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/7 px-4 py-3">
        <button type="button" className="flex w-full cursor-pointer items-center gap-2.5 text-left">
          <div className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-evvnt-deep to-evvnt-vivid text-[10px] font-bold text-white">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs leading-none font-semibold text-white/80">{userName}</div>
            <div className="mt-0.5 text-[10px] text-white/30">{userEmail}</div>
          </div>
          <MoreIcon className="shrink-0 text-white/25" />
        </button>
      </div>
    </aside>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <title>Menu</title>
      <path
        d="M3 5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <title>More options</title>
      <circle cx="7" cy="3" r="1" fill="currentColor" />
      <circle cx="7" cy="7" r="1" fill="currentColor" />
      <circle cx="7" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}
