import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ui/collapsible";
import { cn } from "@utils";
import { Plus } from "lucide-react";
import { useState } from "react";

type FaqItem = {
  q: string;
  a: string;
};

const faqs: FaqItem[] = [
  {
    q: "Will it work on low-end Android and on 3G?",
    a: "Yes. Evvnt is built as a PWA that performs on 3G and Android Go-class devices. Page loads stay under 2.5s on 4G, and the check-in scanner keeps working offline — entries reconcile when you come back online.",
  },
  {
    q: "Which payment rails do you support?",
    a: "Paystack and Flutterwave are live on day one for card, transfer and USSD, with manual bank transfer reconciliation as a fallback. Evvnt Pay handles vendor settlements with a 0.5% in-platform fee.",
  },
  {
    q: "How does cash gifting work — and what about the fee?",
    a: "Every event gets a branded gift page with suggested amounts, optional messages and anonymity. Hosts see gifts in real time, acknowledge from the dashboard, then payout post-event. We charge a transparent 1% fee — shown to the guest before they send.",
  },
  {
    q: "Can my event staff check guests in without the network?",
    a: "Yes. The scanner PWA caches the guest list locally, validates QR codes offline, flags duplicates and reused screenshots, then reconciles attendance once the device is back online.",
  },
  {
    q: "Is my data safe and compliant?",
    a: "Evvnt is NDPR-compliant by default and GDPR-ready. We don't put PII in URLs, role-based access is enforced server-side, and all traffic is HTTPS. Card data never touches our servers — it stays with Paystack and Flutterwave.",
  },
];

export function LandingFAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative border-evvnt-n200/70 border-t bg-white"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:px-8 lg:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-evvnt-muted/50 bg-evvnt-mist px-3 py-1 text-[10.5px] font-semibold tracking-[0.16em] text-evvnt-core uppercase">
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="mt-5 font-bold tracking-[-0.035em] text-evvnt-ink text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.05]"
          >
            The questions Naija planners actually ask us.
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-evvnt-n500">
            Still wondering something? We'll happily get on a call — most of our team has run events
            in Lagos and Abuja themselves.
          </p>
        </div>

        <div className="divide-y divide-evvnt-n200/80">
          {faqs.map((item) => (
            <FaqRow key={item.q} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className={cn(
          "group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors",
          "hover:text-evvnt-core",
        )}
      >
        <span className="text-[15.5px] font-semibold tracking-tight text-evvnt-ink">{item.q}</span>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full border border-evvnt-n200 bg-white text-evvnt-n500 transition-[transform,background-color,color]",
            "group-hover:border-evvnt-muted group-hover:bg-evvnt-mist group-hover:text-evvnt-core",
            open && "rotate-45 bg-evvnt-tint text-evvnt-core border-evvnt-muted",
          )}
        >
          <Plus className="size-[15px]" strokeWidth={2} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="max-w-2xl pb-6 text-[14px] leading-relaxed text-evvnt-n500">{item.a}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
