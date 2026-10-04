import { SHARED_PRESETS_DATA } from './data/shared-presets-data';

export interface SharedColorScheme {
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

export interface SharedPresetTheme {
  metadata: {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  darkMode: boolean;
  colorScheme: SharedColorScheme;
  effects?: {
    metallic?: {
      enabled: boolean;
      variant:
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
      gradient: {
        base: string;
        highlight: string;
        shadow: string;
        shimmer: string;
      };
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
  };
  typography?: {
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
  };
}

const SHARED_THEME_CREATED_AT = '2026-02-15T00:00:00.000Z';
const SHARED_THEME_UPDATED_AT = '2026-02-15T00:00:00.000Z';

export const SHARED_PRESET_THEMES: SharedPresetTheme[] = SHARED_PRESETS_DATA.map((themeData) => ({
  ...themeData,
  metadata: {
    ...themeData.metadata,
    createdAt: SHARED_THEME_CREATED_AT,
    updatedAt: SHARED_THEME_UPDATED_AT,
  },
}));

export const SHARED_PRESET_THEME_IDS = SHARED_PRESET_THEMES.map((theme) => theme.metadata.id);
