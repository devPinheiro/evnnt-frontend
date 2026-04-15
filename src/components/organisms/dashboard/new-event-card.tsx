import { Plus } from "lucide-react";

type NewEventCardProps = {
  onClick?: () => void;
};

export function NewEventCard({ onClick }: NewEventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-evvnt-card border-[1.5px] border-dashed border-evvnt-muted bg-evvnt-mist px-5 py-5 transition-all hover:border-evvnt-core hover:bg-evvnt-tint"
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-evvnt-tint text-evvnt-core transition-all group-hover:bg-evvnt-core group-hover:text-white">
        <Plus className="size-5 stroke-2" />
      </div>
      <div className="text-[13px] font-semibold text-evvnt-core">Create new event</div>
      <p className="max-w-[220px] text-center text-[11px] leading-snug text-evvnt-n400">
        Start with a template or build from scratch — live in under 3 minutes
      </p>
    </button>
  );
}
