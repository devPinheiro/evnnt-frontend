const partners = ["Paystack", "Flutterwave", "Cloudinary", "WhatsApp Business", "Bank Transfer"];

export function LandingTrustStrip() {
  return (
    <section
      aria-label="Trust and integrations"
      className="relative border-evvnt-n200/70 border-b bg-white"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">
        <div className="flex items-center gap-3 text-center lg:text-left">
          <span className="size-2 shrink-0 rounded-full bg-evvnt-vivid" />
          <p className="text-[12.5px] font-semibold tracking-[0.18em] text-evvnt-n500 uppercase">
            Built for Lagos · Abuja · Port Harcourt — and the diaspora
          </p>
        </div>

        <div className="h-px flex-1 bg-gradient-to-r from-evvnt-n200/0 via-evvnt-n200 to-evvnt-n200/0 lg:max-w-[180px]" />

        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:flex-1 lg:justify-end">
          {partners.map((p) => (
            <li
              key={p}
              className="text-[13px] font-semibold tracking-tight text-evvnt-n400 transition-colors hover:text-evvnt-n700"
            >
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
