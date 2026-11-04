import { Theme } from "../../core/types";
import { resolveLayoutStandard } from "../../standards/layouts";
import {
  normalizeAdaptation,
  normalizeColorTokens,
  normalizeEffects,
  normalizeLayout,
  normalizeTypography,
} from "../utils";
import { DTCGMotionTokenGroup, NormalizedThemeTokens } from "./tokenIR";
import { MotionASTTransformer } from "../../core/MotionASTTransformer";

/**
 * Extracts and normalizes tokens from a Theme object into a canonical NormalizedThemeTokens IR tree.
 * Performs unit normalization and fallback resolution for missing/optional tokens.
 *
 * @param theme - The source Theme object (full or partial)
 * @returns A fully normalized NormalizedThemeTokens IR structure
 */
export function extractThemeTokens(theme: Theme): NormalizedThemeTokens {
  const effects = theme.effects;
  const customMotion = (theme as unknown as { motion?: DTCGMotionTokenGroup }).motion;
  const motion: DTCGMotionTokenGroup = customMotion ?? MotionASTTransformer.createMotionTokenGroup({
    duration: effects?.animations?.duration ?? 300,
    easing: effects?.animations?.easing ?? "ease-in-out",
    reducedMotionPolicy: effects?.animations?.reducedMotionPolicy ?? "disable",
    description: `${theme.metadata?.name ?? "Theme"} DTCG motion token group`,
  });

  return {
    metadata: {
      id: theme.metadata?.id ?? "theme",
      name: theme.metadata?.name ?? "Theme",
      description: theme.metadata?.description,
      author: theme.metadata?.author,
      version: theme.metadata?.version,
      tags: theme.metadata?.tags ? [...theme.metadata.tags] : undefined,
    },
    darkMode: theme.darkMode ?? false,
    color: normalizeColorTokens(theme),
    layout: normalizeLayout(theme),
    typography: normalizeTypography(theme),
    effects: normalizeEffects(theme),
    adaptation: normalizeAdaptation(theme),
    motion,
    layoutStandard: resolveLayoutStandard(theme),
  };
}
