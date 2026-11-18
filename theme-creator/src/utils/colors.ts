import {
  contrastRatio as coreContrastRatio,
  hexToRgb as coreHexToRgb,
  isValidColorString,
  mix as coreMix,
  relativeLuminance as coreRelativeLuminance,
  rgbToHex as coreRgbToHex,
} from "../../../src/utils/colors";

const FALLBACK_HEX = "#000000";

function clampByte(channel: number): number {
  if (!Number.isFinite(channel)) {
    return 0;
  }
  return Math.max(0, Math.min(255, Math.round(channel)));
}

function isSupportedColor(value: unknown): value is string {
  return typeof value === "string" && isValidColorString(value);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  if (typeof hex !== "string") {
    return { r: 0, g: 0, b: 0 };
  }
  try {
    return coreHexToRgb(hex);
  } catch {
    return { r: 0, g: 0, b: 0 };
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return coreRgbToHex({
    r: clampByte(r),
    g: clampByte(g),
    b: clampByte(b),
  });
}

export function luminance(hex: string): number {
  const color = isSupportedColor(hex) ? hex : FALLBACK_HEX;
  return coreRelativeLuminance(color);
}

export function contrastRatio(hex1: string, hex2: string): number {
  if (!isSupportedColor(hex1) || !isSupportedColor(hex2)) {
    return 1;
  }
  return coreContrastRatio(hex1, hex2);
}

export function adjustBrightness(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const offset = Number.isFinite(amount) ? amount : 0;
  return rgbToHex(r + offset, g + offset, b + offset);
}

export function mixColors(hex1: string, hex2: string, weight: number): string {
  const color1 = isSupportedColor(hex1) ? hex1 : FALLBACK_HEX;
  const color2 = isSupportedColor(hex2) ? hex2 : FALLBACK_HEX;
  const clampedWeight = Number.isFinite(weight)
    ? Math.max(0, Math.min(1, weight))
    : 0.5;
  const mixed = coreMix(color1, color2, clampedWeight);
  return rgbToHex(mixed.r, mixed.g, mixed.b);
}
