import { cn } from "@utils";
import { CalendarCheck, Gift, type LucideIcon, Ruler, ScanLine, Ticket, Users } from "lucide-react";
import type { ReactNode } from "react";

import { AsoEbiPattern } from "./AsoEbiPattern";

type FeatureCardData = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  /** Tailwind grid-area classes for the bento layout. */
  area: string;
  tone: "dark" | "light";
  visual: ReactNode;
};

export function LandingFeatures() {
  return (
    <section id="features" aria-labelledby="features-heading" className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <SectionHeader
          eyebrow="One platform · nine modules"
          title={
            <>
              The full event stack —{" "}
              <span className="text-evvnt-vivid">from save-the-date to settlement.</span>
            </>
          }
          subtitle="No more juggling WhatsApp groups, spreadsheets and three different payment links. Every guest, ticket, vendor and naira lives in one place."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[260px_260px_260px] lg:gap-6">
          {features.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-evvnt-muted/50 bg-evvnt-mist px-3 py-1 text-[10.5px] font-semibold tracking-[0.16em] text-evvnt-core uppercase">
        {eyebrow}
      </span>
      <h2
        id="features-heading"
        className="mt-5 font-bold text-balance tracking-[-0.035em] text-evvnt-ink text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-evvnt-n500">{subtitle}</p>
      ) : null}
    </div>
  );
}

function FeatureCard({ feature }: { feature: FeatureCardData }) {
  const Icon = feature.icon;
  const isDark = feature.tone === "dark";

  return (
    <article
      className={cn(
        "group/feature relative isolate overflow-hidden rounded-[18px] border transition-[border-color,box-shadow,transform] duration-500",
        "flex flex-col p-6 sm:p-7",
        feature.area,
        isDark
          ? "border-white/8 text-white bg-evvnt-ink"
          : "border-evvnt-n200 bg-white text-evvnt-ink shadow-[0_4px_20px_-10px_rgb(26_9_51_/_10%)] hover:border-evvnt-n300 hover:shadow-[0_18px_38px_-18px_rgb(26_9_51_/_18%)] hover:-translate-y-0.5",
      )}
      style={
        isDark
          ? {
              backgroundImage: "linear-gradient(140deg, #1a0933 0%, #2d0f6b 55%, #4b1fa8 100%)",
            }
          : undefined
      }
    >
      {isDark ? (
        <>
          <AsoEbiPattern color="#a78bfa" opacity={0.16} size={48} />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(124_58_237_/_45%)_0%,transparent_65%)]"
          />
        </>
      ) : null}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-evvnt-lg ring-1",
              isDark
                ? "bg-white/8 text-white ring-white/15 backdrop-blur-sm"
                : "bg-evvnt-mist text-evvnt-core ring-evvnt-muted/40",
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.75} />
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold tracking-[0.16em] uppercase",
              isDark ? "text-evvnt-muted/85" : "text-evvnt-n400",
            )}
          >
            {feature.eyebrow}
          </span>
        </div>

        <h3
          className={cn(
            "mt-7 max-w-[26ch] font-bold tracking-[-0.02em]",
            isDark
              ? "text-white text-[22px] sm:text-[26px]"
              : "text-evvnt-ink text-[19px] sm:text-[21px]",
            "leading-[1.12]",
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "mt-3 max-w-[44ch] text-[13.5px] leading-relaxed",
            isDark ? "text-white/72" : "text-evvnt-n500",
          )}
        >
          {feature.body}
        </p>

        <div className="mt-auto pt-6">{feature.visual}</div>
      </div>
    </article>
  );
}

/* ------------------------------ Visuals --------------------------------- */

function VisualGuestList() {
  const rows = [
    {
      name: "Adaeze N.",
      tag: "RSVP'd",
      pillClass: "bg-evvnt-success-subtle text-evvnt-success",
    },
    {
      name: "Tomi & Femi",
      tag: "Wedding party",
      pillClass: "bg-evvnt-tint text-evvnt-core",
    },
    {
      name: "Olamide K.",
      tag: "Awaiting",
      pillClass: "bg-evvnt-warn-subtle text-evvnt-warn",
    },
  ];
  return (
    <div className="space-y-2 rounded-evvnt-xl border border-evvnt-n200/80 bg-evvnt-canvas-soft p-2.5">
      {rows.map((r) => (
        <div
          key={r.name}
          className="flex items-center gap-3 rounded-evvnt-lg bg-white px-2.5 py-2 ring-1 ring-evvnt-n200/60"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-evvnt-deep to-evvnt-vivid text-[10px] font-bold text-white">
            {r.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span className="flex-1 text-[12px] font-semibold text-evvnt-ink">{r.name}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[9.5px] font-semibold", r.pillClass)}>
            {r.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

function VisualTicketScan() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-evvnt-xl border border-evvnt-n200/80 bg-white p-3 shadow-[0_8px_22px_-12px_rgb(26_9_51_/_15%)]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-evvnt-n400 uppercase">
            VIP · #00214
          </span>
          <span className="size-1.5 rounded-full bg-evvnt-success" />
        </div>
        <div className="mt-2 flex items-end gap-1.5 h-7 overflow-hidden">
          {[3, 7, 4, 6, 2, 8, 5, 7, 3, 6, 4, 7, 3, 8, 5].map((h, i) => (
            <span
              key={`bar-${i}-${h}`}
              className={cn(i % 2 === 0 ? "bg-evvnt-ink" : "bg-evvnt-vivid", "block w-1")}
              style={{ height: `${h * 3}px` }}
            />
          ))}
        </div>
        <div className="mt-2 text-[11px] font-semibold text-evvnt-ink">Tomi Adesanya</div>
        <div className="text-[9.5px] font-medium text-evvnt-n400">Eko Hotels · Gate 3</div>
      </div>
      <div className="relative overflow-hidden rounded-evvnt-xl bg-evvnt-ink p-3 text-white">
        <div
          aria-hidden
          className="absolute -right-10 -bottom-10 size-32 rounded-full bg-evvnt-vivid/35 blur-2xl"
        />
        <div className="relative flex items-start justify-between">
          <span className="text-[10px] font-bold tracking-wider text-evvnt-muted uppercase">
            Tonight
          </span>
          <span className="rounded-full bg-evvnt-success px-1.5 py-0.5 text-[8.5px] font-bold tracking-wider uppercase">
            Scanning
          </span>
        </div>
        <div className="relative mt-3 text-[22px] font-bold tabular-nums tracking-tight">1,204</div>
        <div className="relative text-[10px] text-white/55">of 1,500 capacity</div>
        <div className="relative mt-2.5 h-1 overflow-hidden rounded-full bg-white/12">
          <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-evvnt-vivid to-evvnt-soft" />
        </div>
      </div>
    </div>
  );
}

function VisualGifting() {
  const gifts = [
    { name: "Tola K.", amount: "₦25,000", when: "Just now" },
    { name: "Anonymous", amount: "₦10,000", when: "2 min ago" },
    { name: "Chukwu B.", amount: "₦50,000", when: "5 min ago" },
  ];
  return (
    <div className="space-y-2">
      {gifts.map((g) => (
        <div
          key={g.name + g.amount}
          className="flex items-center justify-between rounded-evvnt-lg border border-evvnt-n200/80 bg-white px-3 py-2"
        >
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-evvnt-ink truncate">{g.name}</div>
            <div className="text-[10px] text-evvnt-n400">{g.when}</div>
          </div>
          <span className="rounded-full bg-evvnt-success-subtle px-2 py-0.5 text-[11px] font-bold tabular-nums text-evvnt-success">
            {g.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

function VisualVendors() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { name: "Lagos Catering Co.", status: "Paid", tone: "success" },
        { name: "Eko Sound", status: "Due 3 Mar", tone: "warn" },
        { name: "Velvet Decor", status: "Approved", tone: "core" },
        { name: "Snap Studio", status: "Awaiting", tone: "muted" },
      ].map((v) => (
        <div
          key={v.name}
          className="rounded-evvnt-lg border border-evvnt-n200/80 bg-white px-2.5 py-2"
        >
          <div className="text-[11px] font-semibold text-evvnt-ink truncate">{v.name}</div>
          <div
            className={cn(
              "mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase",
              v.tone === "success" && "bg-evvnt-success-subtle text-evvnt-success",
              v.tone === "warn" && "bg-evvnt-warn-subtle text-evvnt-warn",
              v.tone === "core" && "bg-evvnt-tint text-evvnt-core",
              v.tone === "muted" && "bg-evvnt-n100 text-evvnt-n500",
            )}
          >
            {v.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function VisualPlanner() {
  return (
    <div className="overflow-hidden rounded-evvnt-xl border border-evvnt-n200/80 bg-evvnt-canvas-soft p-3">
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 18 }).map((_, i) => {
          const isStage = i < 3;
          const isAisle = i % 6 === 2 || i % 6 === 3;
          const cellKey = `floor-cell-${i}`;
          return (
            <span
              key={cellKey}
              className={cn(
                "block aspect-square rounded-[4px]",
                isStage && "bg-evvnt-ink",
                !isStage && isAisle && "bg-evvnt-n100",
                !isStage && !isAisle && "bg-evvnt-tint ring-1 ring-evvnt-muted/40",
              )}
            />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px]">
        <span className="font-semibold text-evvnt-n500">120m² · 14 tables · 112 seats</span>
        <span className="rounded-full bg-evvnt-success-subtle px-1.5 py-0.5 font-bold tracking-wider text-evvnt-success uppercase">
          Comfortable
        </span>
      </div>
    </div>
  );
}

function VisualEventCreation() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 rounded-evvnt-md border border-white/10 bg-white/8 px-3 py-2 text-[11.5px] backdrop-blur-sm">
        <span className="flex size-5 items-center justify-center rounded-full bg-evvnt-success text-[9px] font-bold text-white">
          1
        </span>
        <span className="font-semibold text-white">Basics</span>
        <span className="ml-auto text-[10px] text-white/55">Wedding · Lagos</span>
      </div>
      <div className="flex items-center gap-2 rounded-evvnt-md border border-white/10 bg-white/8 px-3 py-2 text-[11.5px] backdrop-blur-sm">
        <span className="flex size-5 items-center justify-center rounded-full bg-evvnt-success text-[9px] font-bold text-white">
          2
        </span>
        <span className="font-semibold text-white">Branding & slug</span>
        <span className="ml-auto text-[10px] text-white/55">evvnt.ng/tomi-femi</span>
      </div>
      <div className="flex items-center gap-2 rounded-evvnt-md border border-evvnt-soft/40 bg-evvnt-soft/15 px-3 py-2 text-[11.5px] backdrop-blur-sm ring-1 ring-evvnt-soft/40">
        <span className="flex size-5 items-center justify-center rounded-full bg-evvnt-vivid text-[9px] font-bold text-white">
          3
        </span>
        <span className="font-semibold text-white">Modules & team</span>
        <span className="ml-auto text-[10px] font-semibold text-evvnt-muted">In progress</span>
      </div>
    </div>
  );
}

const features: FeatureCardData[] = [
  {
    id: "event-creation",
    eyebrow: "Module 01",
    title: "Spin up an event in 3 steps.",
    body: "A guided wizard with type-aware defaults — weddings auto-enable gifting, concerts auto-enable ticketing. Custom slug, draft & publish, clone past events.",
    icon: CalendarCheck,
    area: "md:col-span-2 lg:col-span-3 lg:row-span-2",
    tone: "dark",
    visual: <VisualEventCreation />,
  },
  {
    id: "guests",
    eyebrow: "Module 02",
    title: "A live guest CRM.",
    body: "Import from CSV, tag, segment and message in bulk. Awaiting · Yes · No-show statuses sync across invites and check-in.",
    icon: Users,
    area: "md:col-span-1 lg:col-span-3 lg:row-span-1",
    tone: "light",
    visual: <VisualGuestList />,
  },
  {
    id: "tickets",
    eyebrow: "Module 04",
    title: "Sell tickets. Scan at the gate.",
    body: "Unlimited tiers, promo codes, Paystack & Flutterwave checkout — and a scanner PWA that keeps working when the network drops.",
    icon: Ticket,
    area: "md:col-span-1 lg:col-span-3 lg:row-span-1",
    tone: "light",
    visual: <VisualTicketScan />,
  },
  {
    id: "gifting",
    eyebrow: "Module 07",
    title: "Cash gifting, done properly.",
    body: "A branded gift page per event. Real-time gift alerts, host acknowledgements, ledger export and post-event payout — 1% transparent fee.",
    icon: Gift,
    area: "md:col-span-1 lg:col-span-2 lg:row-span-1",
    tone: "light",
    visual: <VisualGifting />,
  },
  {
    id: "vendors",
    eyebrow: "Module 05",
    title: "Vendors on a leash, not a thread.",
    body: "Onboard vendors, lock milestones, settle invoices via Evvnt Pay. One source of truth — no more 50-message WhatsApp threads.",
    icon: ScanLine,
    area: "md:col-span-1 lg:col-span-2 lg:row-span-1",
    tone: "light",
    visual: <VisualVendors />,
  },
  {
    id: "planner",
    eyebrow: "Module 09",
    title: "Will the hall hold them?",
    body: "Plug in dimensions, table type and guest count — get a live floor plan with NIA-grade spacing, capacity rating and cost estimate.",
    icon: Ruler,
    area: "md:col-span-2 lg:col-span-2 lg:row-span-1",
    tone: "light",
    visual: <VisualPlanner />,
  },
];
