import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Event Planner", href: "#features" },
    ],
  },
  {
    title: "For",
    links: [
      { label: "Wedding hosts", href: "#features" },
      { label: "Corporate teams", href: "#features" },
      { label: "Agencies & planners", href: "#features" },
      { label: "Venues", href: "#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "NDPR", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
] as const;

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-evvnt-n200/80 border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_2fr] lg:gap-20 lg:px-8 lg:py-20">
        <div className="max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-evvnt-lg bg-gradient-to-br from-evvnt-deep via-evvnt-core to-evvnt-vivid text-[14px] font-bold text-white">
              e
            </span>
            <span className="text-[18px] leading-none font-bold tracking-tight text-evvnt-ink">
              evvnt<em className="font-bold not-italic text-evvnt-vivid">.</em>
            </span>
          </Link>
          <p className="mt-5 text-[13.5px] leading-relaxed text-evvnt-n500">
            The event operating system for Nigerian planners, hosts, corporates and venues. Built in
            Lagos. Trusted across the diaspora.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-[11.5px] font-semibold tracking-[0.16em] text-evvnt-n400 uppercase">
            <span className="size-1.5 rounded-full bg-evvnt-vivid" /> Made in Lagos · Naija proudly
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-bold tracking-[0.18em] text-evvnt-n400 uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] text-evvnt-n700 transition-colors hover:text-evvnt-core"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-evvnt-n200/70 border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-4 py-6 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="text-[12px] text-evvnt-n500">
            © {year} Evvnt Technologies Ltd. All rights reserved.
          </p>
          <p className="text-[12px] text-evvnt-n400">
            Powered by Paystack · Flutterwave · Cloudinary
          </p>
        </div>
      </div>
    </footer>
  );
}
