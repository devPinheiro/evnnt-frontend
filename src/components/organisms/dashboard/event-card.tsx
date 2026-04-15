import { Calendar, MapPin } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import type { EvvntBannerKey } from "@data/evvnt-banners";
import { evvntBannerImage } from "@data/evvnt-banners";
import { cn } from "@utils";

export type EventStatusPill = "live" | "upcoming" | "draft" | "ended";

export type EventMetric = {
  label: string;
  value: ReactNode;
  accent?: boolean;
  /** Wider metric cell (e.g. draft checklist row). */
  span?: number;
};

export type EventCardProps = {
  title: string;
  banner: EvvntBannerKey | "custom";
  bannerStyle?: CSSProperties;
  status: EventStatusPill;
  typeLabel: string;
  accessLabel: string;
  accessVariant?: "public" | "private" | "password";
  dateLine: string;
  locationLine: string;
  metrics: EventMetric[];
  featured?: boolean;
  dimmed?: boolean;
  footerExtra?: ReactNode;
};

const pillClass: Record<EventStatusPill, string> = {
  live: "bg-[rgb(5_150_105_/_90%)] text-white",
  upcoming: "bg-[rgb(75_31_168_/_85%)] text-white",
  draft: "bg-black/50 text-white/70",
  ended: "bg-[rgb(107_114_128_/_70%)] text-white",
};

const pillLabel: Record<EventStatusPill, string> = {
  live: "● Live",
  upcoming: "Upcoming",
  draft: "Draft",
  ended: "Ended",
};

const accessClass = {
  public: "bg-evvnt-success-subtle text-evvnt-success",
  private: "bg-evvnt-tint text-evvnt-core",
  password: "bg-evvnt-warn-subtle text-evvnt-warn",
} as const;

export function EventCard({
  title,
  banner,
  bannerStyle,
  status,
  typeLabel,
  accessLabel,
  accessVariant = "public",
  dateLine,
  locationLine,
  metrics,
  featured,
  dimmed,
  footerExtra,
}: EventCardProps) {
  const bg = banner === "custom" ? bannerStyle : { backgroundImage: evvntBannerImage[banner] };

  return (
    <article
      className={cn(
        "flex cursor-pointer flex-col overflow-hidden rounded-evvnt-card border border-evvnt-n200 bg-white transition-all hover:-translate-y-px hover:shadow-[0_4px_16px_-2px_rgb(26_9_51_/_12%)]",
        featured && "border-evvnt-muted shadow-[0_2px_8px_rgb(26_9_51_/_8%)]",
        dimmed && "opacity-75",
      )}
    >
      <div className="relative flex h-20 items-end bg-evvnt-ink px-3 pb-2.5" style={bg}>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 from-0% to-transparent to-60%"
        />
        <span
          className={cn(
            "absolute top-2.5 right-2.5 z-[2] rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase",
            pillClass[status],
          )}
        >
          {pillLabel[status]}
        </span>
        <div className="relative z-[2] text-[13px] leading-tight font-bold text-white">{title}</div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-semibold tracking-wider text-evvnt-n400 uppercase">
            {typeLabel}
          </span>
          <span
            className={cn(
              "rounded-full px-1.5 py-px text-[9px] font-medium",
              accessClass[accessVariant],
            )}
          >
            {accessLabel}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-evvnt-n500">
          <Calendar className="size-[11px] shrink-0 text-evvnt-n400" strokeWidth={1} />
          {dateLine}
        </div>
        <div className="flex items-center gap-1 overflow-hidden text-[11px] text-evvnt-n500">
          <MapPin className="size-[11px] shrink-0 text-evvnt-n400" strokeWidth={1} />
          <span className="truncate">{locationLine}</span>
        </div>
      </div>

      <div className="mt-1 flex gap-0 border-t border-evvnt-n100">
        {metrics.map((m, i) => (
          <div
            key={`${m.label}-${i}`}
            className={cn(
              "flex min-w-0 flex-col items-center justify-center border-r border-evvnt-n100 py-2 last:border-r-0",
              m.span === 2 ? "min-w-0 flex-[2]" : "flex-1",
            )}
          >
            <div
              className={cn("text-[13px] font-bold text-evvnt-ink", m.accent && "text-evvnt-core")}
            >
              {m.value}
            </div>
            <div className="mt-0.5 text-center text-[9px] text-evvnt-n400">{m.label}</div>
          </div>
        ))}
      </div>
      {footerExtra}
    </article>
  );
}
