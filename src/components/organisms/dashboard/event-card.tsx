import { Calendar, ChevronRight, MapPin } from "lucide-react";
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

/** Frosted capsule — semantic text on light blur (Apple-style label). */
const statusTone: Record<EventStatusPill, string> = {
  live: "text-evvnt-success",
  upcoming: "text-evvnt-core",
  draft: "text-evvnt-n600",
  ended: "text-evvnt-n500",
};

const pillLabel: Record<EventStatusPill, string> = {
  live: "Live",
  upcoming: "Upcoming",
  draft: "Draft",
  ended: "Ended",
};

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
        "group/card relative flex cursor-pointer flex-col overflow-hidden rounded-[20px]",
        "border border-black/[0.08] bg-white shadow-[0_1px_2px_rgb(0_0_0_/_4%),0_4px_12px_rgb(0_0_0_/_4%)]",
        "transition-[box-shadow,border-color] duration-200 ease-out",
        "hover:border-black/[0.12] hover:shadow-[0_2px_4px_rgb(0_0_0_/_5%),0_8px_24px_rgb(0_0_0_/_6%)]",
        featured && "ring-1 ring-black/[0.06]",
        dimmed && "opacity-[0.78] saturate-[0.85]",
      )}
    >
      <div className={cn("relative h-[8rem] shrink-0 overflow-hidden sm:h-[8.5rem]")} style={bg}>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-3.5">
          <span className="max-w-[58%] truncate rounded-full border border-white/35 bg-white/55 px-2.5 py-1 text-[11px] font-medium text-evvnt-ink/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/45">
            {typeLabel}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full border border-white/35 bg-white/55 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-xl supports-[backdrop-filter]:bg-white/45",
              statusTone[status],
            )}
          >
            {status === "live" ? "● " : ""}
            {pillLabel[status]}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-4">
        {featured && <p className="mb-1 text-[11px] font-medium text-evvnt-core/90">Featured</p>}
        <h3 className="line-clamp-2 text-[17px] leading-snug font-semibold tracking-[-0.015em] text-evvnt-ink">
          {title}
        </h3>

        <p
          className={cn(
            "mt-2 rounded-lg bg-evvnt-n100/90 px-2.5 py-1.5 text-[13px] leading-snug text-evvnt-n600",
            accessVariant === "password" && "text-evvnt-warn",
          )}
        >
          {accessLabel}
        </p>

        <div className="mt-4 space-y-0 rounded-xl bg-evvnt-n50/80 ring-1 ring-black/[0.05]">
          <div className="flex items-center gap-3 border-black/[0.06] border-b px-3 py-2.5 sm:px-3.5">
            <Calendar className="size-[15px] shrink-0 text-evvnt-n400" strokeWidth={1.5} />
            <span className="min-w-0 text-[13px] leading-snug text-evvnt-n700">{dateLine}</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 sm:px-3.5">
            <MapPin className="size-[15px] shrink-0 text-evvnt-n400" strokeWidth={1.5} />
            <span className="min-w-0 text-[13px] leading-snug text-evvnt-n700">{locationLine}</span>
          </div>
        </div>

        {/* Hairline-separated metric cells (grouped list / Settings-row feel) */}
        <div
          className={cn(
            "mt-4 grid gap-px overflow-hidden rounded-xl bg-black/[0.07] p-px",
            metrics.some((m) => m.span === 2) ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4",
          )}
        >
          {metrics.map((m, i) => (
            <div
              key={`${m.label}-${i}`}
              className={cn(
                "flex min-w-0 flex-col justify-center bg-evvnt-n50/90 px-2 py-3 text-center sm:px-1",
                m.span === 2 && "col-span-2",
              )}
            >
              <div
                className={cn(
                  "text-[15px] leading-tight font-semibold tabular-nums tracking-[-0.02em] text-evvnt-ink",
                  m.accent && "text-evvnt-core",
                )}
              >
                {m.value}
              </div>
              {m.label ? (
                <div className="mt-0.5 text-[11px] leading-snug font-normal text-evvnt-n500">
                  {m.label}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end border-black/[0.06] border-t pt-3">
          <span className="inline-flex items-center gap-0.5 text-[13px] font-medium text-evvnt-n500 transition-colors group-hover/card:text-evvnt-core">
            View
            <ChevronRight className="size-4 opacity-70" strokeWidth={1.75} />
          </span>
        </div>
      </div>

      {footerExtra}
    </article>
  );
}
