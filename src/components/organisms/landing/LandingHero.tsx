import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@ui/button";
import { cn } from "@utils";
import { ArrowRight, Calendar, CheckCircle2, MapPin, Sparkles } from "lucide-react";

import { AsoEbiPattern } from "./AsoEbiPattern";

const saffron = "#f4a82a";

export function LandingHero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden text-white"
      style={{ backgroundImage: "var(--background-image-evvnt-banner-1)" }}
    >
      <AsoEbiPattern color="#c4b5fd" opacity={0.14} size={64} />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgb(244_168_42_/_22%)_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgb(124_58_237_/_45%)_0%,transparent_68%)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-evvnt-soft/40 to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 pt-16 pb-28 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pt-28 lg:pb-36">
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-evvnt-muted uppercase backdrop-blur-sm">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: saffron }} />
            Built in Lagos · Live across Nigeria
          </div>

          <h1 className="mt-7 font-bold text-balance tracking-[-0.04em] text-[clamp(2.5rem,6vw,5rem)] leading-[0.98]">
            Run every event on{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(120deg, #ffffff 0%, #ede9fe 35%, ${saffron} 100%)`,
              }}
            >
              one platform built for Nigeria.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/75 sm:text-[17px]">
            Plan, sell tickets, manage guests, collect cash gifts and settle vendors — from Lagos to
            the diaspora. Paystack and Flutterwave on day one. Offline check-in when the network
            goes.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/signup"
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "bg-white !text-evvnt-ink hover:bg-evvnt-mist shadow-[0_18px_40px_-14px_rgb(0_0_0_/_45%)] px-5 py-2.5 text-[14px]",
              )}
            >
              Create your first event
              <ArrowRight className="ml-2 size-4" strokeWidth={2.25} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-evvnt-md border border-white/20 bg-white/5 px-4 py-2.5 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              See it work
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[12.5px] text-white/65">
            {[
              "Free Starter — 1 event, 50 guests",
              "1.5% ticket fee (capped at ₦2,500)",
              "RSVP, ticketing & gifting in one flow",
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-[14px] text-evvnt-soft" strokeWidth={2} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroEventStack />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-evvnt-ink/0 to-white"
      />
    </section>
  );
}

function HeroEventStack() {
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[480px] sm:h-[520px] lg:h-[560px]">
      {/* back card */}
      <MiniEventCard
        className="absolute top-2 right-0 w-[78%] -rotate-3 opacity-90"
        bannerVar="var(--background-image-evvnt-banner-2)"
        type="Corporate · Summit"
        title="Lagos Founders Forum 2026"
        date="Sat · 28 Feb · 2026"
        location="The Wheatbaker · Ikoyi"
        statusLabel="Upcoming"
        statusTone="upcoming"
        kpis={[
          { label: "RSVPs", value: "412" },
          { label: "Tickets", value: "₦8.4M" },
        ]}
      />

      {/* front featured card */}
      <MiniEventCard
        className="absolute top-16 left-0 w-[86%] rotate-[1.5deg]"
        bannerVar="var(--background-image-evvnt-banner-1)"
        type="Wedding · Traditional"
        title="Tomi & Femi's Wedding"
        date="Sat · 14 Dec · 2025"
        location="Eko Hotels & Suites · VI"
        statusLabel="Live"
        statusTone="live"
        featured
        kpis={[
          { label: "Guests", value: "286" },
          { label: "Gifts", value: "₦1.92M" },
          { label: "Vendors", value: "12" },
        ]}
      />

      {/* small front pill */}
      <MiniEventCard
        className="absolute right-2 bottom-2 w-[70%] -rotate-2"
        bannerVar="var(--background-image-evvnt-banner-new)"
        type="Concert · Afrobeats"
        title="Lagos Live: Closing Night"
        date="Fri · 20 Dec · 2025"
        location="Eko Convention Centre"
        statusLabel="Selling"
        statusTone="upcoming"
        kpis={[
          { label: "Sold", value: "1,204" },
          { label: "Capacity", value: "1,500" },
        ]}
      />

      {/* floating chip — gifting */}
      <div
        className="absolute -bottom-4 left-2 flex items-center gap-2.5 rounded-evvnt-xl border border-white/15 bg-white/8 px-3 py-2 backdrop-blur-md"
        style={{ boxShadow: "0 14px 30px -16px rgba(0,0,0,0.55)" }}
      >
        <span
          className="flex size-7 items-center justify-center rounded-evvnt-md"
          style={{ backgroundColor: `${saffron}33`, color: saffron }}
        >
          <Sparkles className="size-3.5" strokeWidth={2.25} />
        </span>
        <div className="text-[11px] leading-tight text-white/85">
          <div className="font-semibold">Tola K. sent ₦25,000</div>
          <div className="text-white/55">Cash gift · just now</div>
        </div>
      </div>
    </div>
  );
}

type MiniEventCardProps = {
  className?: string;
  bannerVar: string;
  type: string;
  title: string;
  date: string;
  location: string;
  statusLabel: string;
  statusTone: "live" | "upcoming";
  featured?: boolean;
  kpis: Array<{ label: string; value: string }>;
};

function MiniEventCard({
  className,
  bannerVar,
  type,
  title,
  date,
  location,
  statusLabel,
  statusTone,
  featured,
  kpis,
}: MiniEventCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-white/12 bg-white text-evvnt-ink",
        "shadow-[0_28px_60px_-20px_rgb(0_0_0_/_55%)] backdrop-blur-sm transition-transform duration-500 will-change-transform",
        "hover:rotate-0 hover:scale-[1.01]",
        featured && "ring-2 ring-evvnt-vivid/40",
        className,
      )}
    >
      <div className="relative h-[88px] overflow-hidden" style={{ backgroundImage: bannerVar }}>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-evvnt-ink/65 via-evvnt-ink/15 to-transparent"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
          <span className="rounded-lg border border-white/20 bg-black/30 px-2 py-1 text-[9px] font-semibold tracking-wider text-white uppercase backdrop-blur-md">
            {type}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-[9px] font-bold tracking-wider uppercase ring-1 ring-white/25",
              statusTone === "live" ? "bg-evvnt-success text-white" : "bg-evvnt-core/95 text-white",
            )}
          >
            {statusTone === "live" ? "● " : ""}
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="px-3.5 py-3">
        <h3 className="line-clamp-1 text-[13.5px] font-bold tracking-tight text-evvnt-ink">
          {title}
        </h3>
        <div className="mt-2 space-y-1.5 rounded-evvnt-lg bg-evvnt-canvas-soft px-2.5 py-2">
          <div className="flex items-center gap-2 text-[11px] text-evvnt-n700">
            <Calendar className="size-3" strokeWidth={1.6} />
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-evvnt-n700">
            <MapPin className="size-3" strokeWidth={1.6} />
            <span className="font-medium">{location}</span>
          </div>
        </div>
        <div
          className={cn("mt-2.5 grid gap-1.5", kpis.length === 3 ? "grid-cols-3" : "grid-cols-2")}
        >
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-evvnt-md border border-evvnt-n200/70 bg-gradient-to-b from-white to-evvnt-n50/40 px-2 py-1.5 text-center"
            >
              <div className="text-[11.5px] font-bold tabular-nums text-evvnt-ink">{k.value}</div>
              <div className="mt-0.5 text-[8px] font-semibold tracking-wider text-evvnt-n400 uppercase">
                {k.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
