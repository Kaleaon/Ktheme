import { Theme } from "../../core/types";
import {
  normalizeAdaptation,
  normalizeColorTokens,
  normalizeEffects,
  normalizeLayout,
  normalizeTypography,
} from "../utils";
import { NormalizedThemeTokens } from "./tokenIR";

/**
 * Extracts and normalizes tokens from a Theme object into a canonical NormalizedThemeTokens IR tree.
 * Performs unit normalization and fallback resolution for missing/optional tokens.
 *
 * @param theme - The source Theme object (full or partial)
 * @returns A fully normalized NormalizedThemeTokens IR structure
 */
export function extractThemeTokens(theme: Theme): NormalizedThemeTokens {
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
  };
}
