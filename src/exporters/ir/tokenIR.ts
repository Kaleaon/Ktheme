import { DesktopAdaptation, MetallicVariant } from "../../core/types";

/**
 * Normalized color tokens in canonical IR format.
 * All color values are resolved hex strings (e.g., "#FF5733").
 */
export interface NormalizedColorTokens {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;

  outline: string;
  outlineVariant: string;

  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;

  semantic: {
    success: string;
    onSuccess: string;
    warning: string;
    onWarning: string;
    info: string;
    onInfo: string;
    critical: string;
    onCritical: string;
  };
}

/**
 * Normalized layout adaptation tokens.
 */
export interface NormalizedLayoutTokens {
  density: "compact" | "comfortable" | "spacious";
  cornerStyle: "sharp" | "rounded" | "pill";
  spacingScale: number;
  breakpoints: {
    compact: number;
    medium: number;
    expanded: number;
  };
  corners: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  panelStyle: "flat" | "elevated" | "glass";
  navigationStyle: "tabs" | "rail" | "drawer" | "pivot";
}

/**
 * Normalized typography tokens.
 */
export interface NormalizedTypographyTokens {
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

/**
 * Normalized visual effects tokens.
 */
export interface NormalizedEffectsTokens {
  metallic: {
    enabled: boolean;
    variant: MetallicVariant | string;
    intensity: number;
    gradient: {
      base: string;
      highlight: string;
      shadow: string;
      shimmer: string;
    };
  };
  shadows: {
    enabled: boolean;
    elevation: number;
    blur: number;
    color: string;
  };
  shimmer: {
    enabled: boolean;
    speed: number;
    intensity: number;
    angle: number;
  };
  blur: {
    enabled: boolean;
    radius: number;
  };
  animations: {
    enabled: boolean;
    duration: number;
    easing: "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out";
  };
  focusRing: {
    enabled: boolean;
    color: string;
    width: number;
    offset: number;
  };
}

/**
 * Normalized adaptation tokens.
 */
export interface NormalizedAdaptationTokens {
  layout: Record<string, unknown>;
  icons: {
    family: string;
    style: string;
    sizeScale: number;
    strokeWidth: number;
    cornerStyle: string;
  };
  desktopAdaptation?: DesktopAdaptation;
}

/**
 * Canonical Intermediate Token Representation (IR) schema for a Ktheme theme.
 */
export interface NormalizedThemeTokens {
  metadata: {
    id: string;
    name: string;
    description?: string;
    author?: string;
    version?: string;
    tags?: string[];
  };
  darkMode: boolean;
  color: NormalizedColorTokens;
  layout: NormalizedLayoutTokens;
  typography: NormalizedTypographyTokens;
  effects: NormalizedEffectsTokens;
  adaptation: NormalizedAdaptationTokens;
}
