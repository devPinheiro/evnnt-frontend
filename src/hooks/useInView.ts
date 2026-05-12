import { type RefObject, useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  /** Margin around the root before triggering. Default `0px 0px -10% 0px`. */
  rootMargin?: string;
  /** Visibility threshold. Default `0.15`. */
  threshold?: number | number[];
  /** Disconnect after the first intersection. Default `true` for landing-style reveals. */
  once?: boolean;
};

/**
 * Lightweight IntersectionObserver hook used for scroll-reveal animations on the landing page.
 * Returns a ref to attach to the target element and a boolean indicating in-view state.
 * Falls back gracefully on SSR/older browsers by reporting `true` immediately.
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = "0px 0px -10% 0px", threshold = 0.15, once = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
