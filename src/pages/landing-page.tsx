import {
  LandingCtaBand,
  LandingFAQ,
  LandingFeatures,
  LandingFooter,
  LandingHero,
  LandingNav,
  LandingPricing,
  LandingTrustStrip,
  Reveal,
} from "@organisms/landing";
import { useEffect } from "react";

/**
 * Public marketing landing — Naija-premium aesthetic. Rendered at `/` for unauthed visitors;
 * logged-in users redirect to `/dashboard` via the route's `beforeLoad`.
 */
export function LandingPage() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Evvnt — The Event Operating System for Nigeria";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-evvnt-ink">
      <LandingNav />
      <main className="relative">
        <LandingHero />
        <Reveal>
          <LandingTrustStrip />
        </Reveal>
        <Reveal>
          <LandingFeatures />
        </Reveal>
        <Reveal>
          <LandingPricing />
        </Reveal>
        <Reveal>
          <LandingFAQ />
        </Reveal>
        <Reveal>
          <LandingCtaBand />
        </Reveal>
      </main>
      <LandingFooter />
    </div>
  );
}
