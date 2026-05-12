import { useNavigate } from "@tanstack/react-router";
import { CreditCard, Gift, ScanLine } from "lucide-react";

import { cn } from "@utils";

const actions = [
  {
    id: "checkin",
    title: "Open check-in",
    subtitle: "QR scanner · offline mode supported",
    icon: <ScanLine className="size-[14px] text-evvnt-success" strokeWidth={1.1} />,
    iconBg: "bg-evvnt-success-subtle",
  },
  {
    id: "gift",
    title: "Gift page",
    subtitle: "Share gift link · view payout balance",
    icon: <Gift className="size-[14px] text-evvnt-core" strokeWidth={1.1} />,
    iconBg: "bg-gradient-to-br from-evvnt-tint to-evvnt-muted",
  },
  {
    id: "pay",
    title: "Pay vendor",
    subtitle: "Evvnt Pay · Paystack · Flutterwave",
    icon: <CreditCard className="size-[14px] text-evvnt-warn" strokeWidth={1.1} />,
    iconBg: "bg-evvnt-warn-subtle",
  },
] as const;

export function QuickActions({ className }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[14px] border border-evvnt-n200/90 bg-white shadow-[0_4px_22px_-12px_rgb(26_9_51_/_10%)]",
        className,
      )}
    >
      <div className="border-b border-evvnt-n100 bg-evvnt-n50/50 px-4 py-3.5 pb-3">
        <div className="text-[13px] font-bold tracking-tight text-evvnt-ink">Quick actions</div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 sm:gap-2.5">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => {
              void navigate({ to: "/events" });
            }}
            className="flex cursor-pointer flex-col gap-1.5 rounded-[12px] border border-evvnt-n200/90 bg-evvnt-canvas-soft p-3 text-left transition-all hover:border-evvnt-n300 hover:bg-white hover:shadow-[0_8px_20px_-12px_rgb(26_9_51_/_14%)] focus-visible:ring-2 focus-visible:ring-evvnt-muted focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <div
              className={cn("flex size-7 items-center justify-center rounded-evvnt-sm", a.iconBg)}
            >
              {a.icon}
            </div>
            <div className="text-xs font-semibold text-evvnt-ink">{a.title}</div>
            <p className="text-[10px] leading-snug text-evvnt-n400">{a.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
