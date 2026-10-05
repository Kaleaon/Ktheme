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

export type NormalizedTypography = {
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
  [key: string]: unknown;
};

export function normalizeTypography(theme: Theme): NormalizedTypography {
  const typo = theme.typography;
  return {
    fontFamily: typo?.fontFamily ?? 'system-ui, -apple-system, sans-serif',
    fontSize: {
      small: typo?.fontSize?.small ?? 12,
      medium: typo?.fontSize?.medium ?? 16,
      large: typo?.fontSize?.large ?? 20,
      xlarge: typo?.fontSize?.xlarge ?? 28
    },
    fontWeight: {
      light: typo?.fontWeight?.light ?? 300,
      regular: typo?.fontWeight?.regular ?? 400,
      medium: typo?.fontWeight?.medium ?? 500,
      bold: typo?.fontWeight?.bold ?? 700
    },
    lineHeight: typo?.lineHeight ?? 1.5,
    letterSpacing: typo?.letterSpacing ?? 0
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

export function normalizeEffects(theme: Theme): Record<string, unknown> {
  const eff = theme.effects || {};
  const result: Record<string, unknown> = {};

  if (eff.metallic) {
    result.metallic = {
      enabled: eff.metallic.enabled,
      variant: eff.metallic.variant,
      intensity: eff.metallic.intensity,
      gradient: {
        base: toHexColor(eff.metallic.gradient.base),
        highlight: toHexColor(eff.metallic.gradient.highlight),
        shadow: toHexColor(eff.metallic.gradient.shadow),
        shimmer: toHexColor(eff.metallic.gradient.shimmer)
      }
    };
  } else {
    result.metallic = { enabled: false };
  }

  if (eff.shadows) {
    result.shadows = {
      enabled: eff.shadows.enabled,
      elevation: eff.shadows.elevation,
      blur: eff.shadows.blur,
      color: toHexColor(eff.shadows.color)
    };
  } else {
    result.shadows = { enabled: false };
  }

  if (eff.shimmer) {
    result.shimmer = {
      enabled: eff.shimmer.enabled,
      speed: eff.shimmer.speed,
      intensity: eff.shimmer.intensity,
      angle: eff.shimmer.angle
    };
  } else {
    result.shimmer = { enabled: false };
  }

  if (eff.blur) {
    result.blur = {
      enabled: eff.blur.enabled,
      radius: eff.blur.radius
    };
  } else {
    result.blur = { enabled: false };
  }

  if (eff.focusRing) {
    result.focusRing = {
      enabled: eff.focusRing.enabled,
      color: toHexColor(eff.focusRing.color),
      width: eff.focusRing.width,
      offset: eff.focusRing.offset
    };
  } else {
    result.focusRing = { enabled: false };
  }

  return result;
}

export function normalizeAdaptation(theme: Theme): Record<string, unknown> {
  const adapt = theme.adaptation || {};
  const result: Record<string, unknown> = {
    layout: {
      density: adapt.layout?.density ?? 'comfortable',
      cornerStyle: adapt.layout?.cornerStyle ?? 'rounded',
      spacingScale: adapt.layout?.spacingScale ?? 1.0,
      panelStyle: adapt.layout?.panelStyle ?? 'elevated',
      navigationStyle: adapt.layout?.navigationStyle ?? 'tabs'
    },
    icons: {
      family: adapt.icons?.family ?? 'material',
      style: adapt.icons?.style ?? 'outlined',
      sizeScale: adapt.icons?.sizeScale ?? 1.0,
      strokeWidth: adapt.icons?.strokeWidth ?? 2,
      cornerStyle: adapt.icons?.cornerStyle ?? 'rounded'
    }
  };

  if (adapt.desktopAdaptation) {
    result.desktopAdaptation = adapt.desktopAdaptation;
  }

  return result;
}
