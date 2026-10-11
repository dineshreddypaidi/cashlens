import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query. Returns false when matchMedia is
 * unavailable, so callers get the mobile-safe default rather than a crash.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tailwind's `sm` breakpoint (40rem / 640px). */
export const SM_UP = "(min-width: 40rem)";
