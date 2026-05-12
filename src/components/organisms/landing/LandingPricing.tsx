import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@ui/button";
import { cn } from "@utils";
import { Check } from "lucide-react";

type Plan = {
  id: "starter" | "pro" | "agency" | "enterprise";
  name: string;
  price: string;
  priceSuffix?: string;
  cadence: string;
  description: string;
  cta: string;
  ctaTo: "/signup";
  features: string[];
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₦0",
    cadence: "forever · 1 event a month",
    description: "Run a single event end-to-end, free.",
    cta: "Start free",
    ctaTo: "/signup",
    features: [
      "1 active event",
      "Up to 50 guests",
      "Basic ticketing & e-invite",
      "Paystack & Flutterwave checkout",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₦15,000",
    priceSuffix: "/mo",
    cadence: "5 events a month",
    description: "For hosts and small teams running real events.",
    cta: "Start free trial",
    ctaTo: "/signup",
    features: [
      "Unlimited guests",
      "Vendors, finance & gifting",
      "Branded invites + WhatsApp send",
      "Hall capacity & cost planner",
      "Photo gallery with moderation",
    ],
    highlighted: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: "₦45,000",
    priceSuffix: "/mo",
    cadence: "Unlimited events",
    description: "Multi-event control for professional planners.",
    cta: "Start free trial",
    ctaTo: "/signup",
    features: [
      "Multi-event dashboard",
      "Client portal & reporting",
      "White-label invites",
      "Vendor CRM across events",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "SLA + dedicated support",
    description: "For corporates, agencies and venues at scale.",
    cta: "Talk to us",
    ctaTo: "/signup",
    features: [
      "SSO and approval workflows",
      "Custom integrations",
      "SLAs and onboarding",
      "Bulk billing & invoicing",
    ],
  },
];

export function LandingPricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative bg-evvnt-canvas-soft"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-evvnt-muted/50 bg-white px-3 py-1 text-[10.5px] font-semibold tracking-[0.16em] text-evvnt-core uppercase">
            Pricing · Hybrid model
          </span>
          <h2
            id="pricing-heading"
            className="mt-5 font-bold text-balance tracking-[-0.035em] text-evvnt-ink text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]"
          >
            Start free. Pay only when your events do.
          </h2>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-evvnt-n500">
            A predictable monthly plan plus small fees on what actually moves — 1.5% on tickets
            (capped at ₦2,500), 1% on cash gifts, 0.5% on Evvnt Pay vendor settlements.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <p className="mt-8 text-[12.5px] text-evvnt-n500">
          Prices in Nigerian Naira (₦). Bank transfer accepted for annual billing. All tiers include
          NDPR-compliant data handling and WCAG 2.1 AA accessibility.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const highlighted = plan.highlighted;

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[18px] border transition-[border-color,box-shadow,transform] duration-300",
        "p-6 sm:p-7",
        highlighted
          ? "border-transparent bg-evvnt-ink text-white shadow-[0_28px_60px_-22px_rgb(75_31_168_/_55%)]"
          : "border-evvnt-n200 bg-white text-evvnt-ink shadow-[0_4px_20px_-10px_rgb(26_9_51_/_10%)] hover:-translate-y-0.5 hover:border-evvnt-n300 hover:shadow-[0_18px_38px_-18px_rgb(26_9_51_/_18%)]",
      )}
      style={
        highlighted
          ? {
              backgroundImage: "linear-gradient(155deg, #1a0933 0%, #2d0f6b 55%, #4b1fa8 100%)",
            }
          : undefined
      }
    >
      {highlighted ? (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[9.5px] font-bold tracking-[0.16em] text-evvnt-muted uppercase ring-1 ring-white/20 backdrop-blur-sm">
          Most popular
        </span>
      ) : null}

      <div>
        <h3
          className={cn(
            "text-[15px] font-bold tracking-tight",
            highlighted ? "text-evvnt-muted" : "text-evvnt-n500",
          )}
        >
          {plan.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span
            className={cn(
              "font-bold tracking-tight",
              plan.price === "Custom" ? "text-[28px]" : "text-[34px]",
              highlighted ? "text-white" : "text-evvnt-ink",
            )}
          >
            {plan.price}
          </span>
          {plan.priceSuffix ? (
            <span
              className={cn(
                "text-[13px] font-semibold",
                highlighted ? "text-white/65" : "text-evvnt-n500",
              )}
            >
              {plan.priceSuffix}
            </span>
          ) : null}
        </div>
        <div
          className={cn(
            "mt-1 text-[12px] font-medium",
            highlighted ? "text-white/60" : "text-evvnt-n400",
          )}
        >
          {plan.cadence}
        </div>
        <p
          className={cn(
            "mt-4 text-[13.5px] leading-relaxed",
            highlighted ? "text-white/72" : "text-evvnt-n500",
          )}
        >
          {plan.description}
        </p>
      </div>

      <ul className="mt-6 flex-1 space-y-2.5">
        {plan.features.map((f) => (
          <li
            key={f}
            className={cn(
              "flex items-start gap-2 text-[13px]",
              highlighted ? "text-white/85" : "text-evvnt-n700",
            )}
          >
            <Check
              className={cn(
                "mt-0.5 size-[15px] shrink-0",
                highlighted ? "text-evvnt-soft" : "text-evvnt-vivid",
              )}
              strokeWidth={2.25}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-7">
        <Link
          to={plan.ctaTo}
          className={cn(
            buttonVariants({ size: "md" }),
            "w-full justify-center",
            highlighted
              ? "bg-white !text-evvnt-ink hover:bg-evvnt-mist"
              : "bg-evvnt-ink !text-white hover:bg-evvnt-deep",
          )}
        >
          {plan.cta}
        </Link>
      </div>
    </article>
  );
}
