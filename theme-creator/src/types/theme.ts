export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface MetallicGradient {
  base: string;
  highlight: string;
  shadow: string;
  shimmer: string;
}

export type MetallicVariant =
  | 'SILVER'
  | 'GOLD'
  | 'GOLD_ROYAL_BLUE'
  | 'BRONZE'
  | 'COPPER'
  | 'PLATINUM'
  | 'ROSE_GOLD'
  | 'TITANIUM'
  | 'CHROME'
  | 'COBALT';

export interface ColorScheme {
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
  outline: string;
  outlineVariant: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export interface VisualEffects {
  metallic?: {
    enabled: boolean;
    variant: MetallicVariant;
    gradient: MetallicGradient;
    intensity: number;
  };
  shadows?: {
    enabled: boolean;
    elevation: number;
    blur: number;
    color: string;
  };
  shimmer?: {
    enabled: boolean;
    speed: number;
    intensity: number;
    angle: number;
  };
  blur?: {
    enabled: boolean;
    radius: number;
  };
}

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

export interface KTheme {
  metadata: ThemeMetadata;
  darkMode: boolean;
  colorScheme: ColorScheme;
  effects?: VisualEffects;
  typography?: Typography;
}

export interface ThemePack {
  id: string;
  name: string;
  description: string;
  author: string;
  themes: KTheme[];
  createdAt: string;
}
