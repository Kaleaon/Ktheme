import { Color } from '../core/types';
import {
  compositeOver,
  contrastRatio,
  getContrastColor,
  normalizeColor,
  opacity,
  relativeLuminance
} from '../utils/colors';

export interface QuickAccessCardAlphaTokens {
  borderBase: number;
  chipBase: number;
  darkSurfaceBoost: number;
  lightSurfaceBoost: number;
  minBorderContrast: number;
  minChipContrast: number;
  maxAlpha: number;
  alphaStep: number;
}

export interface QuickAccessCardAlphaValues {
  border: number;
  chip: number;
}

export const MediaColors = {
  QuickAccessCardAlphas: {
    borderBase: 0.12,
    chipBase: 0.18,
    darkSurfaceBoost: 0.08,
    lightSurfaceBoost: 0.04,
    minBorderContrast: 1.2,
    minChipContrast: 1.35,
    maxAlpha: 0.5,
    alphaStep: 0.01
  } satisfies QuickAccessCardAlphaTokens
};

const clampAlpha = (value: number): number => Math.max(0, Math.min(1, value));

const ensureMinimumContrast = (
  overlayColor: Color,
  surfaceColor: Color,
  initialAlpha: number,
  minContrast: number,
  tokens: QuickAccessCardAlphaTokens
): number => {
  let alpha = clampAlpha(initialAlpha);
  let composite = compositeOver(opacity(overlayColor, alpha), surfaceColor);
  let ratio = contrastRatio(composite, surfaceColor);

  while (ratio < minContrast && alpha < tokens.maxAlpha) {
    alpha = clampAlpha(alpha + tokens.alphaStep);
    composite = compositeOver(opacity(overlayColor, alpha), surfaceColor);
    ratio = contrastRatio(composite, surfaceColor);
  }

  return alpha;
};

/**
 * Luminance-aware accessor for quick-access card overlay alpha values.
 */
export function getQuickAccessCardAlphas(params: {
  surface: Color;
  overlay?: Color;
  tokens?: Partial<QuickAccessCardAlphaTokens>;
}): QuickAccessCardAlphaValues {
  const tokens = {
    ...MediaColors.QuickAccessCardAlphas,
    ...params.tokens
  };

  const surface = normalizeColor(params.surface);
  const surfaceLuminance = relativeLuminance(surface);
  const overlayColor = params.overlay ?? getContrastColor(surface);

  const luminanceBoost = surfaceLuminance < 0.5
    ? tokens.darkSurfaceBoost
    : tokens.lightSurfaceBoost;

  const border = ensureMinimumContrast(
    overlayColor,
    surface,
    tokens.borderBase + luminanceBoost,
    tokens.minBorderContrast,
    tokens
  );

  const chip = ensureMinimumContrast(
    overlayColor,
    surface,
    tokens.chipBase + luminanceBoost,
    tokens.minChipContrast,
    tokens
  );

  return { border, chip };
}
