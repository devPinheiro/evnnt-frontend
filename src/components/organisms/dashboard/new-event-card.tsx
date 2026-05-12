import { Plus } from "lucide-react";

import { cn } from "@utils";

type NewEventCardProps = {
  onClick?: () => void;
};

/** Apple-style “add” tile — neutral chrome, minimal decoration. */
export function NewEventCard({ onClick }: NewEventCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/create flex min-h-[12rem] cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] border border-dashed border-black/[0.14] bg-evvnt-n50/50 p-5 text-left",
        "shadow-[0_1px_2px_rgb(0_0_0_/_4%)] transition-[border-color,box-shadow,background-color] duration-200 ease-out",
        "hover:border-black/[0.22] hover:bg-white hover:shadow-[0_2px_4px_rgb(0_0_0_/_5%),0_8px_20px_rgb(0_0_0_/_5%)]",
        "focus-visible:ring-2 focus-visible:ring-evvnt-core/25 focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            "bg-evvnt-n200/80 text-evvnt-n700",
            "transition-colors group-hover/create:bg-evvnt-ink group-hover/create:text-white",
          )}
        >
          <Plus className="size-5" strokeWidth={1.75} />
        </div>
      </div>
      <div>
        <div className="text-[17px] leading-snug font-semibold tracking-[-0.015em] text-evvnt-ink">
          New event
        </div>
        <p className="mt-1.5 max-w-[17rem] text-[13px] leading-relaxed text-evvnt-n500">
          Start from a template or an empty event.
        </p>
        <div className="mt-3 inline-flex items-center gap-0.5 text-[13px] font-medium text-evvnt-n500 transition-colors group-hover/create:text-evvnt-core">
          Add
          <span className="text-[13px] opacity-70" aria-hidden>
            ›
          </span>
        </div>
      </div>
    </button>
  );
}
