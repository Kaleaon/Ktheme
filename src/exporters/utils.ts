import { Color, Theme } from '../core/types';
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

export function normalizeTypography(theme: Theme): {
  fontFamily: string;
  fontSize: { small: number; medium: number; large: number; xlarge: number };
  fontWeight: { light: number; regular: number; medium: number; bold: number };
  lineHeight: number;
  letterSpacing: number;
} {
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
