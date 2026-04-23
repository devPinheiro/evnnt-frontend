import { CreditCard, Gift, Mail, ScanLine } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { cn } from "@utils";

const actions = [
  {
    id: "invite",
    title: "Send e-invite",
    subtitle: "WhatsApp + email · all or selected groups",
    icon: <Mail className="size-[14px] text-evvnt-core" strokeWidth={1.2} />,
    iconBg: "bg-evvnt-tint",
  },
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
        "flex flex-col overflow-hidden rounded-evvnt-2xl border border-evvnt-n200 bg-white shadow-[0_1px_2px_rgb(26_9_51_/_5%)]",
        className,
      )}
    >
      <div className="border-b border-evvnt-n100 bg-evvnt-n50/40 px-4 py-3.5 pb-3">
        <div className="text-[13px] font-semibold tracking-tight text-evvnt-ink">Quick actions</div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3 sm:gap-2.5">
        {actions.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => {
              if (a.id === "invite") {
                void navigate({ to: "/events/invites" });
              }
            }}
            className="flex cursor-pointer flex-col gap-1.5 rounded-evvnt-lg border border-evvnt-n200 bg-evvnt-mist p-3 text-left transition-all hover:border-evvnt-muted hover:bg-evvnt-tint hover:shadow-sm active:scale-[0.99]"
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
