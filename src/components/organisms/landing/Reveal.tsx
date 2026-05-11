import { useInView } from "@hooks";
import { cn } from "@utils";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Translation distance before reveal (px). Default 18. */
  offset?: number;
  /** Animation delay in ms. Default 0. */
  delay?: number;
  children: ReactNode;
};

/**
 * Scroll-reveal wrapper — fades + translates a section once it enters the viewport.
 * Uses the shared `useInView` IntersectionObserver hook. Respects `prefers-reduced-motion`
 * automatically because all motion is CSS transition-driven.
 */
export function Reveal({
  as: Component = "div",
  offset = 18,
  delay = 0,
  className,
  children,
  style,
  ...rest
}: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

  return (
    <Component
      ref={ref}
      className={cn(
        "motion-safe:transition-[opacity,transform] motion-safe:duration-[700ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        className,
      )}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${offset}px)`,
        transitionDelay: `${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}
