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
    <section className={cn("flex flex-col gap-2", className)}>
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-evvnt-ink">{title}</span>
          {count != null && (
            <span className="ml-1.5 text-[11px] text-evvnt-n400">· {count} items</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((a) => (
          <button
            key={a.id}
            type="button"
            className="flex cursor-pointer items-center gap-2.5 rounded-evvnt-lg border border-evvnt-n200 bg-white px-3.5 py-2.5 text-left transition-colors hover:bg-evvnt-n50"
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
