import { useContext } from "react";
import { KthemeContext } from "./KthemeContext";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface MotionTokenValues {
  duration: string;
  easing: string;
  durationReduced: string;
  easingReduced: string;
  reducedMotion: boolean;
  transition: (property?: string, overrideDuration?: string, overrideEasing?: string) => string;
}

/**
 * Hook to consume DTCG-derived motion tokens dynamically from KthemeContext,
 * reacting to prefers-reduced-motion preferences.
 */
export function useMotionTokens(): MotionTokenValues {
  const ctx = useContext(KthemeContext);
  const reducedMotion = usePrefersReducedMotion();

  const duration = ctx?.tokens?.motionDuration || "300ms";
  const easing = ctx?.tokens?.motionEasing || "cubic-bezier(0.25, 0.1, 0.25, 1.0)";
  const durationReduced = ctx?.tokens?.motionDurationReduced || "0ms";
  const easingReduced = ctx?.tokens?.motionEasingReduced || "cubic-bezier(0.0, 0.0, 1.0, 1.0)";

  const activeDuration = reducedMotion ? durationReduced : duration;
  const activeEasing = reducedMotion ? easingReduced : easing;

  const transition = (
    property = "all",
    overrideDuration?: string,
    overrideEasing?: string,
  ): string => {
    if (reducedMotion) return "none";
    const d = overrideDuration || activeDuration;
    const e = overrideEasing || activeEasing;
    return `${property} ${d} ${e}`;
  };

  return {
    duration,
    easing,
    durationReduced,
    easingReduced,
    reducedMotion,
    transition,
  };
}
