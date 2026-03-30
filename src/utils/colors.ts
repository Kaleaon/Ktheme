/**
 * Color utilities for Ktheme
 * Provides color conversion, manipulation, and validation
 */

import { Color, ColorScheme, HSLColor, HexColor, RGBColor, RGBAColor } from '../core/types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHue(hue: number): number {
  const wrapped = hue % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

const HEX_3_PATTERN = /^#?([a-f\d]{3})$/i;
const HEX_4_PATTERN = /^#?([a-f\d]{4})$/i;
const HEX_6_PATTERN = /^#?([a-f\d]{6})$/i;
const HEX_8_PATTERN = /^#?([a-f\d]{8})$/i;
const RGB_PATTERN =
  /^rgb\(\s*(\d{1,3})\s*(?:,\s*|\s+)(\d{1,3})\s*(?:,\s*|\s+)(\d{1,3})\s*\)$/i;
const RGBA_PATTERN =
  /^rgba\(\s*(\d{1,3})\s*(?:,\s*|\s+)(\d{1,3})\s*(?:,\s*|\s+)(\d{1,3})\s*(?:,\s*|\s+)\s*(\d*\.?\d+)\s*\)$/i;

function isByteValue(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 255;
}

function isAlphaValue(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function expandShorthandHex(hex: string): string {
  return hex
    .split('')
    .map(char => `${char}${char}`)
    .join('');
}

function parseHexColor(hex: string): RGBAColor | null {
  const normalizedHex = hex.trim();
  const hexBody = normalizedHex.startsWith('#') ? normalizedHex.slice(1) : normalizedHex;

  if (HEX_3_PATTERN.test(hexBody)) {
    const expanded = expandShorthandHex(hexBody);
    return {
      r: parseInt(expanded.slice(0, 2), 16),
      g: parseInt(expanded.slice(2, 4), 16),
      b: parseInt(expanded.slice(4, 6), 16),
      a: 1
    };
  }

  if (HEX_4_PATTERN.test(hexBody)) {
    const expanded = expandShorthandHex(hexBody);
    return {
      r: parseInt(expanded.slice(0, 2), 16),
      g: parseInt(expanded.slice(2, 4), 16),
      b: parseInt(expanded.slice(4, 6), 16),
      a: parseInt(expanded.slice(6, 8), 16) / 255
    };
  }

  if (HEX_6_PATTERN.test(hexBody)) {
    return {
      r: parseInt(hexBody.slice(0, 2), 16),
      g: parseInt(hexBody.slice(2, 4), 16),
      b: parseInt(hexBody.slice(4, 6), 16),
      a: 1
    };
  }

  if (HEX_8_PATTERN.test(hexBody)) {
    return {
      r: parseInt(hexBody.slice(0, 2), 16),
      g: parseInt(hexBody.slice(2, 4), 16),
      b: parseInt(hexBody.slice(4, 6), 16),
      a: parseInt(hexBody.slice(6, 8), 16) / 255
    };
  }

  return null;
}

function parseCssRgbColor(input: string): RGBAColor | null {
  const normalized = input.trim();
  const rgbaMatch = normalized.match(RGBA_PATTERN);
  if (rgbaMatch) {
    const r = Number.parseInt(rgbaMatch[1], 10);
    const g = Number.parseInt(rgbaMatch[2], 10);
    const b = Number.parseInt(rgbaMatch[3], 10);
    const a = Number.parseFloat(rgbaMatch[4]);
    if (isByteValue(r) && isByteValue(g) && isByteValue(b) && isAlphaValue(a)) {
      return { r, g, b, a };
    }
    return null;
  }

  const rgbMatch = normalized.match(RGB_PATTERN);
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1], 10);
    const g = Number.parseInt(rgbMatch[2], 10);
    const b = Number.parseInt(rgbMatch[3], 10);
    if (isByteValue(r) && isByteValue(g) && isByteValue(b)) {
      return { r, g, b, a: 1 };
    }
  }

  return null;
}

export function isValidColorString(color: string): boolean {
  return parseHexColor(color) !== null || parseCssRgbColor(color) !== null;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: HexColor): RGBColor {
  const parsed = parseHexColor(hex);
  if (!parsed) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parsed.r,
    g: parsed.g,
    b: parsed.b
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGBColor): HexColor {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Convert hex color to RGBA
 */
export function hexToRgba(hex: HexColor, alpha: number = 1): RGBAColor {
  const rgb = hexToRgb(hex);
  return { ...rgb, a: alpha };
}

/**
 * Convert RGBA to hex (with alpha)
 */
export function rgbaToHex(rgba: RGBAColor): HexColor {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  const alphaHex = toHex(rgba.a * 255);
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}${alphaHex}`;
}

/**
 * Normalize color to RGBA
 */
export function normalizeColor(color: Color): RGBAColor {
  if (typeof color === 'string') {
    const hexParsed = parseHexColor(color);
    if (hexParsed) {
      return hexParsed;
    }

    const rgbParsed = parseCssRgbColor(color);
    if (rgbParsed) {
      return rgbParsed;
    }

    throw new Error(
      `Invalid color string format: ${color}. Accepted formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA, rgb(r,g,b), rgba(r,g,b,a)`
    );
  }

  const { r, g, b } = color;
  if (!isByteValue(r) || !isByteValue(g) || !isByteValue(b)) {
    throw new Error(`Invalid RGB channels: r=${r}, g=${g}, b=${b}`);
  }

  if ('a' in color) {
    if (!isAlphaValue(color.a)) {
      throw new Error(`Invalid alpha channel: a=${color.a}`);
    }
    return color;
  }
  return { r, g, b, a: 1 };
}

/**
 * Darken a color by a percentage
 */
export function darken(color: Color, percent: number): RGBAColor {
  const rgba = normalizeColor(color);
  const factor = 1 - percent / 100;
  return {
    r: Math.max(0, rgba.r * factor),
    g: Math.max(0, rgba.g * factor),
    b: Math.max(0, rgba.b * factor),
    a: rgba.a
  };
}

/**
 * Lighten a color by a percentage
 */
export function lighten(color: Color, percent: number): RGBAColor {
  const rgba = normalizeColor(color);
  const factor = percent / 100;
  return {
    r: Math.min(255, rgba.r + (255 - rgba.r) * factor),
    g: Math.min(255, rgba.g + (255 - rgba.g) * factor),
    b: Math.min(255, rgba.b + (255 - rgba.b) * factor),
    a: rgba.a
  };
}

/**
 * Adjust opacity of a color
 */
export function opacity(color: Color, alpha: number): RGBAColor {
  const rgba = normalizeColor(color);
  return { ...rgba, a: Math.max(0, Math.min(1, alpha)) };
}

/**
 * Mix two colors
 */
export function mix(color1: Color, color2: Color, weight: number = 0.5): RGBAColor {
  const rgba1 = normalizeColor(color1);
  const rgba2 = normalizeColor(color2);
  
  return {
    r: rgba1.r * (1 - weight) + rgba2.r * weight,
    g: rgba1.g * (1 - weight) + rgba2.g * weight,
    b: rgba1.b * (1 - weight) + rgba2.b * weight,
    a: rgba1.a * (1 - weight) + rgba2.a * weight
  };
}

/**
 * Get contrast color (black or white) for a background
 */
export function getContrastColor(backgroundColor: Color): HexColor {
  const rgb = normalizeColor(backgroundColor);
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Validate if a string is a valid hex color
 */
export function isValidHex(hex: string): boolean {
  const value = hex.trim();
  return HEX_3_PATTERN.test(value) || HEX_4_PATTERN.test(value) || HEX_6_PATTERN.test(value) || HEX_8_PATTERN.test(value);
}

/**
 * Convert color to CSS string
 */
export function toCssColor(color: Color): string {
  if (typeof color === 'string') {
    return color;
  }
  if ('a' in color && color.a < 1) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  }
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

/**
 * Composite a foreground color over a background color
 */
export function compositeOver(foreground: Color, background: Color): RGBAColor {
  const fg = normalizeColor(foreground);
  const bg = normalizeColor(background);

  const outAlpha = fg.a + bg.a * (1 - fg.a);

  if (outAlpha === 0) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / outAlpha,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / outAlpha,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / outAlpha,
    a: outAlpha
  };
}

/**
 * Calculate WCAG relative luminance for a color
 */
export function relativeLuminance(color: Color): number {
  const rgba = normalizeColor(color);
  const toLinear = (channel: number): number => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const r = toLinear(rgba.r);
  const g = toLinear(rgba.g);
  const b = toLinear(rgba.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function contrastRatio(colorA: Color, colorB: Color): number {
  const luminanceA = relativeLuminance(colorA);
  const luminanceB = relativeLuminance(colorB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  let s = 0;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = 60 * (((g - b) / delta) % 6);
        break;
      case g:
        h = 60 * ((b - r) / delta + 2);
        break;
      default:
        h = 60 * ((r - g) / delta + 4);
        break;
    }
  }

  return {
    h: normalizeHue(h),
    s: s * 100,
    l: l * 100
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = normalizeHue(hsl.h);
  const s = clamp(hsl.s, 0, 100) / 100;
  const l = clamp(hsl.l, 0, 100) / 100;

  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - chroma / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h < 60) {
    rPrime = chroma;
    gPrime = x;
  } else if (h < 120) {
    rPrime = x;
    gPrime = chroma;
  } else if (h < 180) {
    gPrime = chroma;
    bPrime = x;
  } else if (h < 240) {
    gPrime = x;
    bPrime = chroma;
  } else if (h < 300) {
    rPrime = x;
    bPrime = chroma;
  } else {
    rPrime = chroma;
    bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255)
  };
}

/**
 * Convert hex color to HSL
 */
export function hexToHsl(hex: HexColor): HSLColor {
  return rgbToHsl(hexToRgb(hex));
}

/**
 * Convert HSL color to hex
 */
export function hslToHex(hsl: HSLColor): HexColor {
  return rgbToHex(hslToRgb(hsl));
}

function colorToHsl(color: Color): HSLColor {
  const rgb = normalizeColor(color);
  return rgbToHsl(rgb);
}

/**
 * Build analogous palette around a seed color.
 */
export function analogousPalette(color: Color, count: number = 5, spread: number = 30): HexColor[] {
  const hsl = colorToHsl(color);
  const total = Math.max(2, count);
  const start = hsl.h - spread;
  const increment = (spread * 2) / (total - 1);

  return Array.from({ length: total }, (_, index) =>
    hslToHex({ ...hsl, h: normalizeHue(start + increment * index) })
  );
}

/**
 * Get the complementary color for a seed color.
 */
export function complementaryColor(color: Color): HexColor {
  const hsl = colorToHsl(color);
  return hslToHex({ ...hsl, h: normalizeHue(hsl.h + 180) });
}

/**
 * Build a triadic palette.
 */
export function triadicPalette(color: Color): HexColor[] {
  const hsl = colorToHsl(color);
  return [0, 120, 240].map(shift => hslToHex({ ...hsl, h: normalizeHue(hsl.h + shift) }));
}

/**
 * Build a split complementary palette.
 */
export function splitComplementaryPalette(color: Color): HexColor[] {
  const hsl = colorToHsl(color);
  return [0, 150, 210].map(shift => hslToHex({ ...hsl, h: normalizeHue(hsl.h + shift) }));
}

/**
 * Saturation adjustment helper.
 */
export function adjustSaturation(color: Color, amount: number): HexColor {
  const hsl = colorToHsl(color);
  return hslToHex({ ...hsl, s: clamp(hsl.s + amount, 0, 100) });
}

/**
 * Hue adjustment helper.
 */
export function adjustHue(color: Color, degrees: number): HexColor {
  const hsl = colorToHsl(color);
  return hslToHex({ ...hsl, h: normalizeHue(hsl.h + degrees) });
}

/**
 * Generate a coherent partial color scheme from a single brand color.
 */
export function generatePaletteFromSeed(seedColor: Color): Partial<ColorScheme> {
  const baseHsl = colorToHsl(seedColor);
  const secondary = adjustHue(seedColor, 30);
  const tertiary = adjustHue(seedColor, -30);
  const surface = hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.12, 4, 16), l: 97 });
  const surfaceVariant = hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.2, 8, 24), l: 92 });
  const background = hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.08, 2, 12), l: 99 });
  const onSurface = hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.18, 8, 24), l: 14 });

  return {
    primary: hslToHex({ ...baseHsl, s: clamp(baseHsl.s, 45, 90), l: 46 }),
    onPrimary: hslToHex({ ...baseHsl, s: clamp(baseHsl.s * 0.4, 20, 40), l: 98 }),
    primaryContainer: hslToHex({ ...baseHsl, s: clamp(baseHsl.s * 0.6, 25, 60), l: 88 }),
    onPrimaryContainer: hslToHex({ ...baseHsl, s: clamp(baseHsl.s * 0.7, 35, 75), l: 20 }),
    secondary,
    onSecondary: getContrastColor(secondary),
    secondaryContainer: lighten(secondary, 40),
    onSecondaryContainer: darken(secondary, 55),
    tertiary,
    onTertiary: getContrastColor(tertiary),
    tertiaryContainer: lighten(tertiary, 38),
    onTertiaryContainer: darken(tertiary, 52),
    background,
    onBackground: onSurface,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant: hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.2, 8, 22), l: 30 }),
    outline: hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.12, 4, 16), l: 58 }),
    outlineVariant: hslToHex({ h: baseHsl.h, s: clamp(baseHsl.s * 0.12, 4, 16), l: 72 })
  };
}
