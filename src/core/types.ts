/**
 * Core theme types and interfaces for Ktheme
 * Inspired by CleverFerret's advanced theming system
 */

/**
 * RGB Color representation
 */
export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

/**
 * RGBA Color representation with alpha channel
 */
export interface RGBAColor extends RGBColor {
  a: number; // 0-1
}

/**
 * Hex color string (e.g., "#FF5733" or "#FF5733AA")
 */
export type HexColor = string;

/**
 * Color can be represented in multiple formats
 */
export type Color = RGBColor | RGBAColor | HexColor;

/**
 * Metallic gradient definition for shimmer and metallic effects
 */
export interface MetallicGradient {
  base: Color;
  highlight: Color;
  shadow: Color;
  shimmer: Color;
}

/**
 * Metallic theme variants
 */
export enum MetallicVariant {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  GOLD_ROYAL_BLUE = 'GOLD_ROYAL_BLUE',
  BRONZE = 'BRONZE',
  COPPER = 'COPPER',
  PLATINUM = 'PLATINUM',
  ROSE_GOLD = 'ROSE_GOLD',
  TITANIUM = 'TITANIUM',
  CHROME = 'CHROME',
  COBALT = 'COBALT'
}

/**
 * Complete color scheme for a theme
 */
export interface ColorScheme {
  primary: Color;
  onPrimary: Color;
  primaryContainer: Color;
  onPrimaryContainer: Color;
  
  secondary: Color;
  onSecondary: Color;
  secondaryContainer: Color;
  onSecondaryContainer: Color;
  
  tertiary: Color;
  onTertiary: Color;
  tertiaryContainer: Color;
  onTertiaryContainer: Color;
  
  error: Color;
  onError: Color;
  errorContainer: Color;
  onErrorContainer: Color;
  
  background: Color;
  onBackground: Color;
  surface: Color;
  onSurface: Color;
  surfaceVariant: Color;
  onSurfaceVariant: Color;
  
  outline: Color;
  outlineVariant: Color;
  
  // Additional colors
  scrim: Color;
  inverseSurface: Color;
  inverseOnSurface: Color;
  inversePrimary: Color;

  // Interactive state layer colors
  stateLayers?: {
    hover?: Color;
    pressed?: Color;
    focused?: Color;
    dragged?: Color;
  };

  // Semantic aliases for common product statuses
  semanticRoles?: {
    success: Color;
    onSuccess: Color;
    successContainer?: Color;
    onSuccessContainer?: Color;
    warning: Color;
    onWarning: Color;
    warningContainer?: Color;
    onWarningContainer?: Color;
    info: Color;
    onInfo: Color;
    infoContainer?: Color;
    onInfoContainer?: Color;
    critical?: Color;
    onCritical?: Color;
  };
}

/**
 * Visual effects configuration
 */
export interface VisualEffects {
  // Metallic effects
  metallic?: {
    enabled: boolean;
    variant: MetallicVariant;
    gradient: MetallicGradient;
    intensity: number; // 0-1
  };
  
  // Shadow effects
  shadows?: {
    enabled: boolean;
    elevation: number;
    blur: number;
    color: Color;
  };
  
  // Gradient effects
  gradients?: {
    enabled: boolean;
    angle: number; // degrees
    stops: Array<{ offset: number; color: Color }>;
  };
  
  // Shimmer/shine effects
  shimmer?: {
    enabled: boolean;
    speed: number;
    intensity: number;
    angle: number;
  };
  
  // Blur effects
  blur?: {
    enabled: boolean;
    radius: number;
  };
  
  // Animation effects
  animations?: {
    enabled: boolean;
    duration: number; // milliseconds
    easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    reducedMotionPolicy?: 'none' | 'reduce' | 'disable';
  };
  
  // Transition effects
  transitions?: {
    enabled: boolean;
    duration: number; // milliseconds
    properties: string[]; // CSS properties to transition
  };

  // Surface overlay effects
  overlays?: {
    enabled: boolean;
    color: Color;
    opacity: number; // 0-1
    blendMode?:
      | 'normal'
      | 'multiply'
      | 'screen'
      | 'overlay'
      | 'soft-light'
      | 'hard-light';
  };

  // Accessibility-focused focus ring
  focusRing?: {
    enabled: boolean;
    color: Color;
    width: number;
    offset: number;
  };

  // Subtle texture/noise for depth on flat surfaces
  noise?: {
    enabled: boolean;
    opacity: number; // 0-1
    scale: number;
  };
}

/**
 * Typography configuration
 */
export interface Typography {
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
 * Layout adaptation tokens for reshaping app structure per theme.
 */
export interface LayoutAdaptation {
  density: 'compact' | 'comfortable' | 'spacious';
  cornerStyle: 'sharp' | 'rounded' | 'pill';
  spacingScale: number;
  panelStyle?: 'flat' | 'elevated' | 'glass';
  navigationStyle?: 'tabs' | 'rail' | 'drawer' | 'pivot';
}

/**
 * Icon adaptation tokens for icon pack/weight/size control.
 */
export interface IconAdaptation {
  family: 'material' | 'fluent' | 'sf-symbols' | 'custom';
  style: 'outlined' | 'filled' | 'duotone' | 'line';
  sizeScale: number;
  strokeWidth?: number;
  cornerStyle?: 'sharp' | 'rounded';
}

/**
 * Explicit component-level layout/style override.
 */
export interface ComponentOverride {
  selector: string;
  styles: Record<string, string | number>;
}

/**
 * Theme adaptation profile used to restyle layout, icons and app chrome.
 */
export interface ThemeAdaptation {
  layout?: LayoutAdaptation;
  icons?: IconAdaptation;
  componentOverrides?: ComponentOverride[];
  assets?: {
    wallpaper?: string;
    iconSprite?: string;
    fontFamilyOverride?: string;
  };
}

/**
 * Design tokens beyond color/effects for shape/density scaling.
 */
export interface DesignTokens {
  density?: {
    scale: number;
    baseSpacing: number;
  };
  corners?: {
    small: number;
    medium: number;
    large: number;
    xlarge?: number;
  };
}

/**
 * Accessibility controls that products can expose to end users.
 */
export interface AccessibilityControls {
  allowContrastToggle?: boolean;
  allowMotionToggle?: boolean;
  allowFontScaleControl?: boolean;
  allowFocusRingToggle?: boolean;
}

/**
 * Accessibility defaults and guardrails that should be applied by host apps.
 */
export interface AccessibilitySettings {
  enabled?: boolean;
  minimumContrastRatio?: number;
  autoIncludeInGeneratedCSS?: boolean;
  controls?: AccessibilityControls;
  typography?: {
    fontScale?: number;
    lineHeight?: number;
    letterSpacing?: number;
  };
  motion?: {
    reduceMotionByDefault?: boolean;
    disableParallax?: boolean;
    disableShimmer?: boolean;
  };
  interaction?: {
    minimumTargetSize?: number;
    focusRingWidth?: number;
    focusRingOffset?: number;
    underlineLinks?: boolean;
  };
}

/**
 * Runtime accessibility preferences resolved from OS/user choices.
 */
export interface AccessibilityRuntimePreferences {
  prefersReducedMotion?: boolean;
  prefersHighContrast?: boolean;
  prefersForcedColors?: boolean;
  userFontScale?: number;
}

/**
 * Fully resolved accessibility policy used by render layers.
 */
export interface ResolvedAccessibilitySettings {
  enabled: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  forcedColors: boolean;
  minimumContrastRatio: number;
  fontScale: number;
  lineHeight: number;
  letterSpacing: number;
  minimumTargetSize: number;
  focusRingWidth: number;
  focusRingOffset: number;
  underlineLinks: boolean;
  disableParallax: boolean;
  disableShimmer: boolean;
  controls: Required<AccessibilityControls>;
}

/**
 * Theme metadata
 */
export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete theme definition
 */
export interface Theme {
  metadata: ThemeMetadata;
  darkMode: boolean;
  colorScheme: ColorScheme;
  effects?: VisualEffects;
  typography?: Typography;
  tokens?: DesignTokens;
  adaptation?: ThemeAdaptation;
  accessibility?: AccessibilitySettings;
}

/**
 * Theme validation result
 */
export interface ThemeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
