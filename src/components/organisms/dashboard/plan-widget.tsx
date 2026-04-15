import { ArrowRight } from "lucide-react";

type PlanWidgetProps = {
  tier?: string;
  priceLine?: string;
  eventsUsed?: string;
  guestsLine?: string;
  progressPct?: number;
  progressLabel?: string;
  upgradeLabel?: string;
  onUpgrade?: () => void;
};

export function PlanWidget({
  tier = "Pro",
  priceLine = "₦15,000/mo",
  eventsUsed = "3 / 5",
  guestsLine = "∞",
  progressPct = 60,
  progressLabel = "3 of 5 events used this month",
  upgradeLabel = "Upgrade to Agency · ₦45,000/mo",
  onUpgrade,
}: PlanWidgetProps) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-evvnt-2xl p-4"
      style={{ backgroundImage: "var(--background-image-evvnt-plan)" }}
    >
      <div
        aria-hidden
        className="absolute -right-5 -bottom-5 size-[120px] rounded-full bg-white/6"
      />
      <div aria-hidden className="absolute -top-8 right-10 size-20 rounded-full bg-white/4" />

      <div className="relative">
        <div className="mb-1 text-[10px] font-semibold tracking-wide text-white/45 uppercase">
          Your plan
        </div>
        <div className="flex items-center gap-2 text-[17px] font-bold text-white">
          {tier}
          <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
            {priceLine}
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-evvnt-sm bg-white/10 p-2">
            <div className="text-[15px] font-bold text-white">{eventsUsed}</div>
            <div className="mt-0.5 text-[9px] text-white/50">Active events</div>
          </div>
          <div className="rounded-evvnt-sm bg-white/10 p-2">
            <div className="text-[15px] font-bold text-white">{guestsLine}</div>
            <div className="mt-0.5 text-[9px] text-white/50">Guests per event</div>
          </div>
        </div>

        <div className="mb-1.5 mt-2 h-1 overflow-hidden rounded-sm bg-white/15">
          <div className="h-full rounded-sm bg-white" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/50">
          <span>{progressLabel}</span>
          <span>{progressPct}%</span>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1 rounded-evvnt-sm border border-white/20 bg-white/15 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25"
        >
          {upgradeLabel}
          <ArrowRight className="size-3" strokeWidth={1.3} />
        </button>
      </div>
    </div>
  );
}
