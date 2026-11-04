import { useState, useEffect } from "react";

/**
 * React hook to detect user OS preference for reduced motion.
 * Conforms to WCAG 2.3.3 and 2.2.2 compliance guidelines.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      (mediaQueryList as unknown as { addListener: (cb: (e: MediaQueryListEvent) => void) => void }).addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        (mediaQueryList as unknown as { removeListener: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener(listener);
      }
    };
  }, []);

  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
