import type { InviteAudienceRow } from "@/services/invites.services";
import { Users } from "lucide-react";

type InviteAudiencePanelProps = {
  audiences: InviteAudienceRow[];
  selectedAudienceId?: string;
  onSelectAudience?: (audienceId: string) => void;
};

export function InviteAudiencePanel({
  audiences,
  selectedAudienceId,
  onSelectAudience,
}: InviteAudiencePanelProps) {
  return (
    <section className="rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]">
      <div className="border-b border-evvnt-n100 px-4 py-3.5">
        <h2 className="text-[13px] font-semibold tracking-tight text-evvnt-ink">Audience</h2>
        <p className="mt-0.5 text-[11px] text-evvnt-n500">Select the segment to target</p>
      </div>
      <div className="space-y-2.5 p-3.5">
        {audiences.length === 0 ? (
          <div className="rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist px-3 py-2.5 text-[11px] text-evvnt-n500">
            No audience segments found for this event.
          </div>
        ) : null}
        {audiences.map((row) => {
          const selected = row.id === selectedAudienceId;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onSelectAudience?.(row.id)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-evvnt-lg border border-evvnt-n200 bg-white px-3 py-2.5 text-left transition-colors hover:border-evvnt-muted hover:bg-evvnt-tint"
              aria-pressed={selected}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-evvnt-sm bg-evvnt-tint text-evvnt-core">
                <Users className="size-3.5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-evvnt-ink">{row.label}</span>
                <span className="mt-0.5 block text-[10px] text-evvnt-n500">
                  {row.hint ?? "Audience segment"}
                </span>
              </span>
              <span className="text-xs font-bold text-evvnt-core">
                {row.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
