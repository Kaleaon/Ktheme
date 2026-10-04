import { Color, MetallicVariant, Theme } from '../core/types';
import { getMetallicGradient } from '../effects/metallic';
import { normalizeColor, rgbToHex } from '../utils/colors';

export function toHexColor(color: Color): string {
  if (typeof color === 'string') {
    return color.toUpperCase();
  }

  return rgbToHex(normalizeColor(color)).toUpperCase();
}

export function normalizeSemanticRoles(theme: Theme): {
  success: string;
  warning: string;
  info: string;
  critical: string;
} {
  const roles = theme.colorScheme.semanticRoles;

  return {
    success: toHexColor(roles?.success ?? theme.colorScheme.secondary),
    warning: toHexColor(roles?.warning ?? theme.colorScheme.tertiary),
    info: toHexColor(roles?.info ?? theme.colorScheme.primaryContainer),
    critical: toHexColor(roles?.critical ?? theme.colorScheme.error)
  };
}

export interface NormalizedBlur {
  enabled: boolean;
  radius: number;
}

export function normalizeBlur(theme: Theme): NormalizedBlur {
  const blur = theme.effects?.blur;
  return {
    enabled: blur?.enabled ?? false,
    radius: blur?.radius ?? 0
  };
}

export interface NormalizedMetallic {
  enabled: boolean;
  variant: string;
  intensity: number;
  base: string;
  highlight: string;
  shadow: string;
  shimmer: string;
}

export function normalizeMetallic(theme: Theme): NormalizedMetallic {
  const metallic = theme.effects?.metallic;
  const defaultVariant = MetallicVariant.SILVER;
  const defaultGradient = getMetallicGradient(defaultVariant);

  const variant = metallic?.variant ?? defaultVariant;
  const gradient = metallic?.gradient ?? getMetallicGradient(variant as MetallicVariant) ?? defaultGradient;

  return {
    enabled: metallic?.enabled ?? false,
    variant: String(variant),
    intensity: metallic?.intensity ?? 0,
    base: toHexColor(gradient.base),
    highlight: toHexColor(gradient.highlight),
    shadow: toHexColor(gradient.shadow),
    shimmer: toHexColor(gradient.shimmer)
  };
}

export interface NormalizedShadows {
  enabled: boolean;
  elevation: number;
  blur: number;
  color: string;
}

export function normalizeShadows(theme: Theme): NormalizedShadows {
  const shadows = theme.effects?.shadows;
  return {
    enabled: shadows?.enabled ?? false,
    elevation: shadows?.elevation ?? 0,
    blur: shadows?.blur ?? 0,
    color: toHexColor(shadows?.color ?? '#000000')
  };
}

export interface NormalizedShimmer {
  enabled: boolean;
  speed: number;
  intensity: number;
  angle: number;
}

export function normalizeShimmer(theme: Theme): NormalizedShimmer {
  const shimmer = theme.effects?.shimmer;
  return {
    enabled: shimmer?.enabled ?? false,
    speed: shimmer?.speed ?? 0,
    intensity: shimmer?.intensity ?? 0,
    angle: shimmer?.angle ?? 0
  };
}

export interface NormalizedTypography {
  fontFamily: string;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  lineHeight: number;
  letterSpacing: number;
}

export function normalizeTypography(theme: Theme): NormalizedTypography {
  const typography = theme.typography;
  return {
    fontFamily: typography?.fontFamily ?? 'system-ui, -apple-system, sans-serif',
    fontSize: {
      small: typography?.fontSize?.small ?? 12,
      medium: typography?.fontSize?.medium ?? 16,
      large: typography?.fontSize?.large ?? 20,
      xlarge: typography?.fontSize?.xlarge ?? 28
    },
    fontWeight: {
      light: typography?.fontWeight?.light ?? 300,
      regular: typography?.fontWeight?.regular ?? 400,
      medium: typography?.fontWeight?.medium ?? 500,
      bold: typography?.fontWeight?.bold ?? 700
    },
    lineHeight: typography?.lineHeight ?? 1.5,
    letterSpacing: typography?.letterSpacing ?? 0
  };
}

export interface NormalizedCorners {
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

export function normalizeCorners(theme: Theme): NormalizedCorners {
  const corners = theme.tokens?.corners;
  return {
    small: corners?.small ?? 4,
    medium: corners?.medium ?? 8,
    large: corners?.large ?? 12,
    xlarge: corners?.xlarge ?? 16
  };
}

