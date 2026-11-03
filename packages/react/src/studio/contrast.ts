/**
 * WCAG Level AA contrast auditing utilities for ThemeStudio
 */

export interface ContrastPairAudit {
  id: string;
  label: string;
  tokenA: string;
  tokenB: string;
  colorA: string;
  colorB: string;
  ratio: number;
  pass: boolean;
  threshold: number;
  statusText: string;
}

export interface ContrastAuditSummary {
  pairs: ContrastPairAudit[];
  violations: ContrastPairAudit[];
  hasErrors: boolean;
  pass: boolean;
  [key: string]: unknown;
}

const lumCache = new Map<string, number>();

/**
 * Calculates WCAG relative luminance for a given color string (hex or rgb).
 * Falls back safely to 0.5 if input is invalid.
 */
export function calcLuminance(color: string | null | undefined): number {
  if (!color || typeof color !== "string") return 0.5;
  const trimmed = color.trim();
  if (lumCache.has(trimmed)) {
    return lumCache.get(trimmed)!;
  }

  const hexMatch = trimmed.match(/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  let r = 0;
  let g = 0;
  let b = 0;

  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    } else if (hex.length === 8) {
      hex = hex.slice(0, 6);
    }
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    const rgbMatch = trimmed.match(/\d+(\.\d+)?/g);
    if (!rgbMatch || rgbMatch.length < 3) {
      lumCache.set(trimmed, 0.5);
      return 0.5;
    }
    r = Math.min(255, Math.max(0, parseFloat(rgbMatch[0])));
    g = Math.min(255, Math.max(0, parseFloat(rgbMatch[1])));
    b = Math.min(255, Math.max(0, parseFloat(rgbMatch[2])));
  }

  const toLinear = (c: number): number => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const val = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  lumCache.set(trimmed, val);
  return val;
}

/**
 * Calculates the WCAG contrast ratio between two colors.
 */
export function calcContrastRatio(
  colorA: string | null | undefined,
  colorB: string | null | undefined,
): number {
  const lumA = calcLuminance(colorA);
  const lumB = calcLuminance(colorB);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 10) / 10;
}

/**
 * Formats a contrast ratio and returns a standard WCAG badge string.
 * e.g., "4.8:1 AA PASS" or "2.1:1 AA FAIL"
 */
export function formatBadgeText(ratio: number, threshold = 4.5): string {
  const pass = ratio >= threshold;
  return `${ratio.toFixed(1)}:1 AA ${pass ? "PASS" : "FAIL"}`;
}

/**
 * Get contrast counterpart for an editable token key.
 */
export function getTokenCounterpart(
  key: string,
  tokens: Record<string, string>,
): { key: string; color: string; label: string } {
  switch (key) {
    case "primary":
      return {
        key: "background",
        color: tokens.background || "#0A1630",
        label: "Background",
      };
    case "secondary":
      return {
        key: "background",
        color: tokens.background || "#0A1630",
        label: "Background",
      };
    case "surface": {
      const text =
        tokens.ink ||
        tokens.onSurface ||
        (calcLuminance(tokens.surface) > 0.5 ? "#000000" : "#FFFFFF");
      return {
        key: "text",
        color: text,
        label: "Text",
      };
    }
    case "background":
      return {
        key: "primary",
        color: tokens.primary || "#D4AF37",
        label: "Primary",
      };
    case "outline":
      return {
        key: "surface",
        color: tokens.surface || "#1A2645",
        label: "Surface",
      };
    case "error":
      return {
        key: "background",
        color: tokens.background || "#0A1630",
        label: "Background",
      };
    case "warning":
      return {
        key: "background",
        color: tokens.background || "#0A1630",
        label: "Background",
      };
    case "success":
      return {
        key: "background",
        color: tokens.background || "#0A1630",
        label: "Background",
      };
    default:
      return {
        key: "background",
        color: tokens.background || "#0A1630",
        label: "Background",
      };
  }
}

/**
 * Audits critical theme pairs and all editable controls.
 */
export function auditThemeTokens(
  tokens: Record<string, string>,
): ContrastAuditSummary {
  const pairs: ContrastPairAudit[] = [];

  // 1. Primary vs Background
  const priColor = tokens.primary || tokens.pri || "#D4AF37";
  const bgColor = tokens.background || tokens.bg || "#0A1630";
  const priBgRatio = calcContrastRatio(priColor, bgColor);
  pairs.push({
    id: "primary-vs-background",
    label: "Primary vs Background",
    tokenA: "primary",
    tokenB: "background",
    colorA: priColor,
    colorB: bgColor,
    ratio: priBgRatio,
    pass: priBgRatio >= 4.5,
    threshold: 4.5,
    statusText: formatBadgeText(priBgRatio, 4.5),
  });

  // 2. Surface vs Text
  const surfColor = tokens.surface || tokens.surf || "#1A2645";
  const textColor =
    tokens.onSurface ||
    tokens.ink ||
    tokens.text ||
    (calcLuminance(surfColor) > 0.5 ? "#000000" : "#E8E3D8");
  const surfTextRatio = calcContrastRatio(surfColor, textColor);
  pairs.push({
    id: "surface-vs-text",
    label: "Surface vs Text",
    tokenA: "surface",
    tokenB: "text",
    colorA: surfColor,
    colorB: textColor,
    ratio: surfTextRatio,
    pass: surfTextRatio >= 4.5,
    threshold: 4.5,
    statusText: formatBadgeText(surfTextRatio, 4.5),
  });

  // 3. Outline vs Surface
  const outColor = tokens.outline || tokens.outv || "#44483E";
  const outSurfRatio = calcContrastRatio(outColor, surfColor);
  pairs.push({
    id: "outline-vs-surface",
    label: "Outline vs Surface",
    tokenA: "outline",
    tokenB: "surface",
    colorA: outColor,
    colorB: surfColor,
    ratio: outSurfRatio,
    pass: outSurfRatio >= 4.5,
    threshold: 4.5,
    statusText: formatBadgeText(outSurfRatio, 4.5),
  });

  const violations = pairs.filter((p) => !p.pass);
  const result: ContrastAuditSummary = {
    pairs,
    violations,
    hasErrors: violations.length > 0,
    pass: violations.length === 0,
    "primary vs background": pairs[0],
    "surface vs text": pairs[1],
    "outline vs surface": pairs[2],
    primaryVsBackground: pairs[0],
    surfaceVsText: pairs[1],
    outlineVsSurface: pairs[2],
  };

  return result;
}
