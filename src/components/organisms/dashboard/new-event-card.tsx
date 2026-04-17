import { Plus } from "lucide-react";

type NewEventCardProps = {
  onClick?: () => void;
};

export function NewEventCard({ onClick }: NewEventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[10.5rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-evvnt-card border-2 border-dashed border-evvnt-muted/80 bg-gradient-to-b from-evvnt-mist to-white px-5 py-6 transition-all hover:border-evvnt-core hover:from-evvnt-tint/60 hover:to-evvnt-mist hover:shadow-sm"
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-evvnt-tint text-evvnt-core shadow-sm transition-all group-hover:scale-105 group-hover:bg-evvnt-core group-hover:text-white">
        <Plus className="size-5 stroke-2" />
      </div>
      <div className="text-[13px] font-semibold text-evvnt-core">Create new event</div>
      <p className="max-w-[14rem] text-center text-[11px] leading-relaxed text-evvnt-n500">
        Start from scratch or use a template — go live in minutes
      </p>
    </button>
  );
}
