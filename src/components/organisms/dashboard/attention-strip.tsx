import { cn } from "@utils";

export type AttentionBadgeVariant = "danger" | "warn" | "purple";

export type AttentionItem = {
  id: string;
  dotColor: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant: AttentionBadgeVariant;
  action: string;
};

const badgeStyles: Record<AttentionBadgeVariant, string> = {
  danger: "bg-evvnt-danger-subtle text-evvnt-danger",
  warn: "bg-evvnt-warn-subtle text-evvnt-warn",
  purple: "bg-evvnt-tint text-evvnt-core",
};

type AttentionStripProps = {
  title?: string;
  count?: number;
  items: AttentionItem[];
  className?: string;
  /** `rail`: narrow column beside charts — vertical card stack per item. */
  layout?: "default" | "rail";
};

export function AttentionStrip({
  title = "Needs your attention",
  count,
  items,
  className,
  layout = "default",
}: AttentionStripProps) {
  const rail = layout === "rail";

  return (
    <section className={cn("flex flex-col gap-3", rail && "gap-2.5", className)}>
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h2
            className={cn(
              "font-bold tracking-tight text-evvnt-ink",
              rail ? "text-[15px] leading-snug" : "text-[17px]",
            )}
          >
            {title}
          </h2>
          {count != null && (
            <p className={cn("mt-0.5 text-evvnt-n500", rail ? "text-[10px]" : "text-[11px]")}>
              {count} items need review
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((a) =>
          rail ? (
            <button
              key={a.id}
              type="button"
              className="flex cursor-pointer flex-col items-start gap-2 rounded-[13px] border border-evvnt-n200/90 bg-white px-3.5 py-3 text-left shadow-[0_4px_18px_-10px_rgb(26_9_51_/_10%)] transition-all hover:border-evvnt-n300 hover:bg-evvnt-n50/80 hover:shadow-[0_10px_28px_-12px_rgb(26_9_51_/_12%)] focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div className="flex w-full items-start gap-2">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ background: a.dotColor }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] leading-snug font-semibold text-evvnt-ink">
                    {a.title}
                  </div>
                  <div className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-evvnt-n500">
                    {a.subtitle}
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-2 border-evvnt-n100 border-t border-dashed pt-2">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap",
                    badgeStyles[a.badgeVariant],
                  )}
                >
                  {a.badge}
                </span>
                <span className="shrink-0 text-[11px] font-medium whitespace-nowrap text-evvnt-vivid">
                  {a.action}
                </span>
              </div>
            </button>
          ) : (
            <button
              key={a.id}
              type="button"
              className="flex cursor-pointer flex-wrap items-center gap-x-2 gap-y-1.5 rounded-[13px] border border-evvnt-n200/90 bg-white px-3.5 py-3 text-left shadow-[0_4px_18px_-10px_rgb(26_9_51_/_10%)] transition-all hover:border-evvnt-n300 hover:bg-evvnt-n50/80 hover:shadow-[0_10px_28px_-12px_rgb(26_9_51_/_12%)] focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-2.5"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: a.dotColor }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-evvnt-ink">{a.title}</div>
                <div className="mt-0.5 truncate text-[11px] text-evvnt-n500">{a.subtitle}</div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap",
                  badgeStyles[a.badgeVariant],
                )}
              >
                {a.badge}
              </span>
              <span className="shrink-0 text-[11px] font-medium whitespace-nowrap text-evvnt-vivid">
                {a.action}
              </span>
            </button>
          ),
        )}
      </div>
    </section>
  );
}
