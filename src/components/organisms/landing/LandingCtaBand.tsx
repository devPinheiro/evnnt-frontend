import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@ui/button";
import { cn } from "@utils";
import { ArrowRight } from "lucide-react";

import { AsoEbiPattern } from "./AsoEbiPattern";

export function LandingCtaBand() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #1a0933 0%, #2d0f6b 45%, #4b1fa8 85%, #7c3aed 100%)",
      }}
    >
      <AsoEbiPattern color="#c4b5fd" opacity={0.12} size={68} />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(244_168_42_/_18%)_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-160px] -bottom-40 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgb(124_58_237_/_50%)_0%,transparent_68%)]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-evvnt-muted uppercase backdrop-blur-sm">
          Ready to ship
        </span>
        <h2
          id="cta-heading"
          className="mt-6 max-w-3xl font-bold text-balance tracking-[-0.04em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.02]"
        >
          Your next event is in two weeks. Give yourself the unfair advantage.
        </h2>
        <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-white/72">
          Start free, invite your team, and have your first guest list, invite and gift page live in
          under ten minutes.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "bg-white !text-evvnt-ink hover:bg-evvnt-mist shadow-[0_18px_44px_-14px_rgb(0_0_0_/_55%)] px-5 py-2.5 text-[14px]",
            )}
          >
            Create your first event
            <ArrowRight className="ml-2 size-4" strokeWidth={2.25} />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-evvnt-md border border-white/20 bg-white/5 px-4 py-2.5 text-[13px] font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            I already have an account
          </Link>
        </div>

        <p className="mt-7 text-[11.5px] tracking-wide text-white/55">
          No credit card · Cancel any time · Free tier never expires
        </p>
      </div>
    </section>
  );
}
