import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@ui/button";
import { cn } from "@utils";
import { useEffect, useState } from "react";

const navAnchors = [
  { id: "features", label: "Product" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
] as const;

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
        scrolled
          ? "border-evvnt-n200/80 bg-white/85 shadow-[0_1px_24px_-12px_rgb(26_9_51_/_22%)] backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2 outline-none">
          <span className="flex size-8 items-center justify-center rounded-evvnt-lg bg-gradient-to-br from-evvnt-deep via-evvnt-core to-evvnt-vivid text-[14px] font-bold text-white shadow-[0_6px_18px_-6px_rgb(75_31_168_/_55%)]">
            e
          </span>
          <span className="text-[18px] leading-none font-bold tracking-tight text-evvnt-ink">
            evvnt<em className="font-bold not-italic text-evvnt-vivid">.</em>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 md:flex" aria-label="Marketing navigation">
          {navAnchors.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[13px] font-medium text-evvnt-n700 transition-colors hover:text-evvnt-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/login"
            className="hidden text-[13px] font-medium text-evvnt-n700 transition-colors hover:text-evvnt-ink sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "shadow-[0_8px_22px_-10px_rgb(75_31_168_/_55%)]",
            )}
          >
            Get started — free
          </Link>
        </div>
      </div>
    </header>
  );
}
