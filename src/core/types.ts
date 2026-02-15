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
  };
  
  // Transition effects
  transitions?: {
    enabled: boolean;
    duration: number; // milliseconds
    properties: string[]; // CSS properties to transition
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
}

/**
 * Theme validation result
 */
export interface ThemeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
