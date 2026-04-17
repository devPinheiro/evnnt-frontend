import { useEffect, useState } from "react";

function getMatches(query: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia(query).matches;
}

/** Subscribes to `window.matchMedia` — initial sync read avoids dialog/sheet flash on load. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
