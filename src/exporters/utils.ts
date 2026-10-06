import { Color, DesktopAdaptation, MetallicVariant, Theme } from "../core/types";
import { getMetallicGradient } from "../effects/metallic";
import { normalizeColor, rgbToHex } from "../utils/colors";
import {
  NormalizedAdaptationTokens,
  NormalizedColorTokens,
  NormalizedEffectsTokens,
  NormalizedLayoutTokens,
  NormalizedTypographyTokens,
} from "./ir/tokenIR";

export function toHexColor(color: Color): string {
  if (typeof color === "string") {
    return color.toUpperCase();
  }

  return rgbToHex(normalizeColor(color)).toUpperCase();
}

export interface NormalizedSemanticRoles {
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  info: string;
  onInfo: string;
  critical: string;
  onCritical: string;
}

export function normalizeSemanticRoles(theme: Theme): NormalizedSemanticRoles {
  const cs = theme.colorScheme;
  const roles = cs?.semanticRoles;

  const secondary = toHexColor(cs?.secondary ?? "#666666");
  const onSecondary = toHexColor(cs?.onSecondary ?? "#FFFFFF");
  const tertiary = toHexColor(cs?.tertiary ?? "#888888");
  const onTertiary = toHexColor(cs?.onTertiary ?? "#FFFFFF");
  const primary = toHexColor(cs?.primary ?? "#000000");
  const onPrimary = toHexColor(cs?.onPrimary ?? "#FFFFFF");
  const primaryContainer = toHexColor(cs?.primaryContainer ?? primary);
  const onPrimaryContainer = toHexColor(cs?.onPrimaryContainer ?? onPrimary);
  const error = toHexColor(cs?.error ?? "#D32F2F");
  const onError = toHexColor(cs?.onError ?? "#FFFFFF");

  return {
    success: roles?.success ? toHexColor(roles.success) : secondary,
    onSuccess: roles?.onSuccess ? toHexColor(roles.onSuccess) : onSecondary,
    warning: roles?.warning ? toHexColor(roles.warning) : tertiary,
    onWarning: roles?.onWarning ? toHexColor(roles.onWarning) : onTertiary,
    info: roles?.info ? toHexColor(roles.info) : primaryContainer,
    onInfo: roles?.onInfo ? toHexColor(roles.onInfo) : onPrimaryContainer,
    critical: roles?.critical ? toHexColor(roles.critical) : error,
    onCritical: roles?.onCritical ? toHexColor(roles.onCritical) : onError,
  };
}

export function normalizeColorTokens(theme: Theme): NormalizedColorTokens {
  const cs = theme.colorScheme;

  const primary = toHexColor(cs?.primary ?? "#000000");
  const onPrimary = toHexColor(cs?.onPrimary ?? "#FFFFFF");
  const primaryContainer = toHexColor(cs?.primaryContainer ?? primary);
  const onPrimaryContainer = toHexColor(cs?.onPrimaryContainer ?? onPrimary);

  const secondary = toHexColor(cs?.secondary ?? "#666666");
  const onSecondary = toHexColor(cs?.onSecondary ?? "#FFFFFF");
  const secondaryContainer = toHexColor(cs?.secondaryContainer ?? secondary);
  const onSecondaryContainer = toHexColor(
    cs?.onSecondaryContainer ?? onSecondary,
  );

  const tertiary = toHexColor(cs?.tertiary ?? "#888888");
  const onTertiary = toHexColor(cs?.onTertiary ?? "#FFFFFF");
  const tertiaryContainer = toHexColor(cs?.tertiaryContainer ?? tertiary);
  const onTertiaryContainer = toHexColor(cs?.onTertiaryContainer ?? onTertiary);

  const error = toHexColor(cs?.error ?? "#D32F2F");
  const onError = toHexColor(cs?.onError ?? "#FFFFFF");
  const errorContainer = toHexColor(cs?.errorContainer ?? error);
  const onErrorContainer = toHexColor(cs?.onErrorContainer ?? onError);

  const background = toHexColor(cs?.background ?? "#121212");
  const onBackground = toHexColor(cs?.onBackground ?? "#FFFFFF");
  const surface = toHexColor(cs?.surface ?? "#1E1E1E");
  const onSurface = toHexColor(cs?.onSurface ?? "#FFFFFF");
  const surfaceVariant = toHexColor(cs?.surfaceVariant ?? surface);
  const onSurfaceVariant = toHexColor(cs?.onSurfaceVariant ?? onSurface);

  const outline = toHexColor(cs?.outline ?? "#777777");
  const outlineVariant = toHexColor(cs?.outlineVariant ?? outline);

  const scrim = toHexColor(cs?.scrim ?? "#000000");
  const inverseSurface = toHexColor(cs?.inverseSurface ?? onSurface);
  const inverseOnSurface = toHexColor(cs?.inverseOnSurface ?? surface);
  const inversePrimary = toHexColor(cs?.inversePrimary ?? primary);

  const semantic = normalizeSemanticRoles(theme);

  return {
    primary,
    onPrimary,
    primaryContainer,
    onPrimaryContainer,
    secondary,
    onSecondary,
    secondaryContainer,
    onSecondaryContainer,
    tertiary,
    onTertiary,
    tertiaryContainer,
    onTertiaryContainer,
    error,
    onError,
    errorContainer,
    onErrorContainer,
    background,
    onBackground,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant,
    outline,
    outlineVariant,
    scrim,
    inverseSurface,
    inverseOnSurface,
    inversePrimary,
    semantic,
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
    xlarge: corners?.xlarge ?? 16,
  };
}

export function normalizeLayout(theme: Theme): NormalizedLayoutTokens {
  const layoutAdaptation = theme.adaptation?.layout;
  return {
    density: layoutAdaptation?.density ?? "comfortable",
    cornerStyle: layoutAdaptation?.cornerStyle ?? "rounded",
    spacingScale: layoutAdaptation?.spacingScale ?? 1.0,
    breakpoints: {
      compact: layoutAdaptation?.breakpoints?.compact ?? 600,
      medium: layoutAdaptation?.breakpoints?.medium ?? 840,
      expanded: layoutAdaptation?.breakpoints?.expanded ?? 1200,
    },
    corners: normalizeCorners(theme),
    panelStyle: layoutAdaptation?.panelStyle ?? "flat",
    navigationStyle: layoutAdaptation?.navigationStyle ?? "tabs",
  };
}

export type NormalizedTypography = NormalizedTypographyTokens;

export function normalizeTypography(theme: Theme): NormalizedTypographyTokens {
  const typo = theme.typography;
  return {
    fontFamily: typo?.fontFamily ?? "system-ui, -apple-system, sans-serif",
    fontSize: {
      small: typo?.fontSize?.small ?? 12,
      medium: typo?.fontSize?.medium ?? 16,
      large: typo?.fontSize?.large ?? 20,
      xlarge: typo?.fontSize?.xlarge ?? 28,
    },
    fontWeight: {
      light: typo?.fontWeight?.light ?? 300,
      regular: typo?.fontWeight?.regular ?? 400,
      medium: typo?.fontWeight?.medium ?? 500,
      bold: typo?.fontWeight?.bold ?? 700,
    },
    lineHeight: typo?.lineHeight ?? 1.5,
    letterSpacing: typo?.letterSpacing ?? 0,
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
    radius: blur?.radius ?? 8,
  };
}

export interface NormalizedMetallic {
  enabled: boolean;
  variant: MetallicVariant | string;
  intensity: number;
  gradient: {
    base: string;
    highlight: string;
    shadow: string;
    shimmer: string;
  };
}

export function normalizeMetallic(theme: Theme): NormalizedMetallic {
  const metallic = theme.effects?.metallic;
  const variant = metallic?.variant ?? MetallicVariant.SILVER;
  const defaultGradient =
    getMetallicGradient(variant as MetallicVariant) ??
    getMetallicGradient(MetallicVariant.SILVER) ?? {
      base: "#C0C0C0",
      highlight: "#FFFFFF",
      shadow: "#808080",
      shimmer: "#E0E0E0",
    };

  const gradientInput = metallic?.gradient;

  return {
    enabled: metallic?.enabled ?? false,
    variant,
    intensity: metallic?.intensity ?? 0.5,
    gradient: {
      base: gradientInput?.base
        ? toHexColor(gradientInput.base)
        : toHexColor(defaultGradient.base),
      highlight: gradientInput?.highlight
        ? toHexColor(gradientInput.highlight)
        : toHexColor(defaultGradient.highlight),
      shadow: gradientInput?.shadow
        ? toHexColor(gradientInput.shadow)
        : toHexColor(defaultGradient.shadow),
      shimmer: gradientInput?.shimmer
        ? toHexColor(gradientInput.shimmer)
        : toHexColor(defaultGradient.shimmer),
    },
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
    elevation: shadows?.elevation ?? 2,
    blur: shadows?.blur ?? 4,
    color: shadows?.color ? toHexColor(shadows.color) : "#000000",
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
    speed: shimmer?.speed ?? 2000,
    intensity: shimmer?.intensity ?? 0.5,
    angle: shimmer?.angle ?? 45,
  };
}

export interface NormalizedAnimations {
  enabled: boolean;
  duration: number;
  easing: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
}

export function normalizeAnimations(theme: Theme): NormalizedAnimations {
  const anim = theme.effects?.animations;
  return {
    enabled: anim?.enabled ?? true,
    duration: anim?.duration ?? 300,
    easing: anim?.easing ?? "ease-in-out",
  };
}

export interface NormalizedFocusRing {
  enabled: boolean;
  color: string;
  width: number;
  offset: number;
}

export function normalizeFocusRing(
  theme: Theme,
  defaultColor?: string,
): NormalizedFocusRing {
  const focusRing = theme.effects?.focusRing;
  const primaryColor = theme.colorScheme?.primary
    ? toHexColor(theme.colorScheme.primary)
    : "#000000";
  return {
    enabled: focusRing?.enabled ?? true,
    color: focusRing?.color
      ? toHexColor(focusRing.color)
      : defaultColor ?? primaryColor,
    width: focusRing?.width ?? 2,
    offset: focusRing?.offset ?? 2,
  };
}

export function normalizeEffects(theme: Theme): NormalizedEffectsTokens {
  return {
    metallic: normalizeMetallic(theme),
    shadows: normalizeShadows(theme),
    shimmer: normalizeShimmer(theme),
    blur: normalizeBlur(theme),
    animations: normalizeAnimations(theme),
    focusRing: normalizeFocusRing(theme),
  };
}

export function normalizeAdaptation(theme: Theme): NormalizedAdaptationTokens {
  const adapt = theme.adaptation || {};
  const density = adapt.layout?.density ?? "comfortable";
  const cornerStyle = adapt.layout?.cornerStyle ?? "rounded";
  const spacingScale = adapt.layout?.spacingScale ?? 1.0;
  const panelStyle = adapt.layout?.panelStyle ?? "flat";
  const navigationStyle = adapt.layout?.navigationStyle ?? "tabs";

  return {
    layout: {
      density,
      cornerStyle,
      spacingScale,
      panelStyle,
      navigationStyle,
    },
    icons: {
      family: adapt.icons?.family ?? "material",
      style: adapt.icons?.style ?? "outlined",
      sizeScale: adapt.icons?.sizeScale ?? 1.0,
      strokeWidth: adapt.icons?.strokeWidth ?? 2,
      cornerStyle: adapt.icons?.cornerStyle ?? "rounded",
    },
    ...(adapt.desktopAdaptation
      ? { desktopAdaptation: adapt.desktopAdaptation }
      : {}),
  };
}
