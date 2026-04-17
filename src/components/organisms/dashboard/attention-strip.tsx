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
};

export function AttentionStrip({
  title = "Needs your attention",
  count,
  items,
  className,
}: AttentionStripProps) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-evvnt-ink">{title}</h2>
          {count != null && (
            <p className="mt-0.5 text-[11px] text-evvnt-n500">{count} items need review</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((a) => (
          <button
            key={a.id}
            type="button"
            className="flex cursor-pointer flex-wrap items-center gap-x-2 gap-y-1.5 rounded-evvnt-xl border border-evvnt-n200 bg-white px-3.5 py-3 text-left shadow-[0_1px_2px_rgb(26_9_51_/_4%)] transition-all hover:border-evvnt-n300 hover:bg-evvnt-n50 hover:shadow-[0_2px_8px_-2px_rgb(26_9_51_/_10%)] sm:gap-2.5"
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
        ))}
      </div>
    </section>
  );
}
