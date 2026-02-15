/**
 * Color utilities for Ktheme
 * Provides color conversion, manipulation, and validation
 */

import { Color, RGBColor, RGBAColor, HexColor } from '../core/types';

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: HexColor): RGBColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
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
    return hexToRgba(color);
  }
  if ('a' in color) {
    return color;
  }
  return { ...color, a: 1 };
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
  return /^#?([a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i.test(hex);
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
