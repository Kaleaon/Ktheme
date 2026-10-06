/**
 * Pure data constants module for shared theme presets.
 * Contains raw metadata and color palette definitions with zero runtime engine dependencies.
 */

export interface SharedMetadataData {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  tags: string[];
}

export interface SharedColorSchemeData {
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

export interface SharedEffectsData {
  metallic?: {
    enabled: boolean;
    variant:
      | "SILVER"
      | "GOLD"
      | "GOLD_ROYAL_BLUE"
      | "BRONZE"
      | "COPPER"
      | "PLATINUM"
      | "ROSE_GOLD"
      | "TITANIUM"
      | "CHROME"
      | "COBALT";
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
}

export interface SharedTypographyData {
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

export interface SharedPresetThemeData {
  metadata: SharedMetadataData;
  darkMode: boolean;
  colorScheme: SharedColorSchemeData;
  effects?: SharedEffectsData;
  typography?: SharedTypographyData;
}

// -----------------------------------------------------------------------------
// Navy Gold
// -----------------------------------------------------------------------------
export const NAVY_GOLD_METADATA: SharedMetadataData = {
  id: "navy-gold",
  name: "Navy Gold",
  description: "Elegant navy background with luxurious gold metallic accents",
  author: "Ktheme",
  version: "1.0.0",
  tags: ["metallic", "elegant", "dark"],
};

export const NAVY_GOLD_COLOR_SCHEME: SharedColorSchemeData = {
  primary: "#D4AF37",
  onPrimary: "#0A1630",
  primaryContainer: "#856D34",
  onPrimaryContainer: "#FFF8DC",
  secondary: "#4A90E2",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#2C5F9E",
  onSecondaryContainer: "#E3F2FD",
  tertiary: "#9C8970",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#6B5D4F",
  onTertiaryContainer: "#F5E6D3",
  error: "#CF6679",
  onError: "#FFFFFF",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  background: "#0A1630",
  onBackground: "#E8E3D8",
  surface: "#1A2645",
  onSurface: "#E8E3D8",
  surfaceVariant: "#2A3655",
  onSurfaceVariant: "#C9C4B9",
  outline: "#938F84",
  outlineVariant: "#44483E",
  scrim: "#000000",
  inverseSurface: "#E8E3D8",
  inverseOnSurface: "#0A1630",
  inversePrimary: "#6D5D28",
};

export const NAVY_GOLD_EFFECTS: SharedEffectsData = {
  metallic: {
    enabled: true,
    variant: "GOLD_ROYAL_BLUE",
    gradient: {
      base: "#D4AF37",
      highlight: "#FFD700",
      shadow: "#0A1630",
      shimmer: "#FFF8DC",
    },
    intensity: 0.8,
  },
  shadows: {
    enabled: true,
    elevation: 4,
    blur: 8,
    color: "#00000066",
  },
  shimmer: {
    enabled: true,
    speed: 3,
    intensity: 0.6,
    angle: 135,
  },
};

export const NAVY_GOLD_TYPOGRAPHY: SharedTypographyData = {
  fontFamily: "system-ui, -apple-system, sans-serif",
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 28,
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  lineHeight: 1.5,
  letterSpacing: 0,
};

// -----------------------------------------------------------------------------
// Rose Gold
// -----------------------------------------------------------------------------
export const ROSE_GOLD_METADATA: SharedMetadataData = {
  id: "rose-gold",
  name: "Rose Gold",
  description: "Warm and elegant rose gold with burgundy undertones",
  author: "Ktheme",
  version: "1.0.0",
  tags: ["metallic", "warm", "elegant", "dark"],
};

export const ROSE_GOLD_COLOR_SCHEME: SharedColorSchemeData = {
  primary: "#B76E79",
  onPrimary: "#3D1F2B",
  primaryContainer: "#7D4A52",
  onPrimaryContainer: "#F5D5D8",
  secondary: "#D4A5A5",
  onSecondary: "#442929",
  secondaryContainer: "#8C6969",
  onSecondaryContainer: "#F5E5E5",
  tertiary: "#C9A9A9",
  onTertiary: "#3D2929",
  tertiaryContainer: "#8A7474",
  onTertiaryContainer: "#F5EAEA",
  error: "#FFB4AB",
  onError: "#690005",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  background: "#3D1F2B",
  onBackground: "#F5E5E8",
  surface: "#4D2F3B",
  onSurface: "#F5E5E8",
  surfaceVariant: "#5D3F4B",
  onSurfaceVariant: "#E5D5D8",
  outline: "#9E8A8E",
  outlineVariant: "#4E3A3E",
  scrim: "#000000",
  inverseSurface: "#F5E5E8",
  inverseOnSurface: "#3D1F2B",
  inversePrimary: "#8A5A64",
};

export const ROSE_GOLD_EFFECTS: SharedEffectsData = {
  metallic: {
    enabled: true,
    variant: "ROSE_GOLD",
    gradient: {
      base: "#B76E79",
      highlight: "#E5BE8A",
      shadow: "#7D4A52",
      shimmer: "#F5D5D8",
    },
    intensity: 0.75,
  },
  shadows: {
    enabled: true,
    elevation: 2,
    blur: 4,
    color: "#00000044",
  },
  shimmer: {
    enabled: true,
    speed: 4,
    intensity: 0.5,
    angle: 120,
  },
};

// -----------------------------------------------------------------------------
// Emerald Silver
// -----------------------------------------------------------------------------
export const EMERALD_SILVER_METADATA: SharedMetadataData = {
  id: "emerald-silver",
  name: "Emerald Silver",
  description: "Rich emerald green with elegant silver metallic accents",
  author: "Ktheme",
  version: "1.0.0",
  tags: ["metallic", "nature", "dark"],
};

export const EMERALD_SILVER_COLOR_SCHEME: SharedColorSchemeData = {
  primary: "#C0C0C0",
  onPrimary: "#0D3B2E",
  primaryContainer: "#505050",
  onPrimaryContainer: "#F5F5F5",
  secondary: "#50C878",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#2E7D5A",
  onSecondaryContainer: "#D5F4E6",
  tertiary: "#8BA888",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#5D7A5A",
  onTertiaryContainer: "#E8F5E8",
  error: "#CF6679",
  onError: "#FFFFFF",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  background: "#0D3B2E",
  onBackground: "#E8F5E8",
  surface: "#1A5544",
  onSurface: "#E8F5E8",
  surfaceVariant: "#2A6554",
  onSurfaceVariant: "#C9E4D9",
  outline: "#8A9E94",
  outlineVariant: "#3E4E44",
  scrim: "#000000",
  inverseSurface: "#E8F5E8",
  inverseOnSurface: "#0D3B2E",
  inversePrimary: "#6B6B6B",
};

export const EMERALD_SILVER_EFFECTS: SharedEffectsData = {
  metallic: {
    enabled: true,
    variant: "SILVER",
    gradient: {
      base: "#C0C0C0",
      highlight: "#F5F5F5",
      shadow: "#505050",
      shimmer: "#E5E4E2",
    },
    intensity: 0.7,
  },
  shadows: {
    enabled: true,
    elevation: 3,
    blur: 6,
    color: "#00000055",
  },
};

// -----------------------------------------------------------------------------
// Obsidian Crimson
// -----------------------------------------------------------------------------
export const OBSIDIAN_CRIMSON_METADATA: SharedMetadataData = {
  id: "obsidian-crimson",
  name: "Obsidian Crimson",
  description: "Bold dramatic obsidian black with vibrant crimson accents",
  author: "Ktheme",
  version: "1.0.0",
  tags: ["metallic", "dramatic", "dark"],
};

export const OBSIDIAN_CRIMSON_COLOR_SCHEME: SharedColorSchemeData = {
  primary: "#DC143C",
  onPrimary: "#0A0A0A",
  primaryContainer: "#B00F30",
  onPrimaryContainer: "#E5395F",
  secondary: "#262626",
  onSecondary: "#F5F5F5",
  secondaryContainer: "#141414",
  onSecondaryContainer: "#F5F5F5",
  tertiary: "#A8505A",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#7D3C45",
  onTertiaryContainer: "#F5D9DC",
  error: "#FF6B6B",
  onError: "#0A0A0A",
  errorContainer: "#CC0000",
  onErrorContainer: "#FFD9D9",
  background: "#0A0A0A",
  onBackground: "#F5F5F5",
  surface: "#141414",
  onSurface: "#F5F5F5",
  surfaceVariant: "#2D2D2D",
  onSurfaceVariant: "#D0D0D0",
  outline: "#8A8A8A",
  outlineVariant: "#3D3D3D",
  scrim: "#000000",
  inverseSurface: "#F5F5F5",
  inverseOnSurface: "#0A0A0A",
  inversePrimary: "#8A0F28",
};

export const OBSIDIAN_CRIMSON_EFFECTS: SharedEffectsData = {
  metallic: {
    enabled: true,
    variant: "COPPER",
    gradient: {
      base: "#B87333",
      highlight: "#E8B4A0",
      shadow: "#6B3410",
      shimmer: "#F2D2B0",
    },
    intensity: 0.8,
  },
  shadows: {
    enabled: true,
    elevation: 5,
    blur: 10,
    color: "#00000077",
  },
};

// -----------------------------------------------------------------------------
// Paper & Ink
// -----------------------------------------------------------------------------
export const PAPER_INK_METADATA: SharedMetadataData = {
  id: "paper-ink",
  name: "Paper & Ink",
  description: "Minimalist light theme for comfortable reading",
  author: "Ktheme",
  version: "1.0.0",
  tags: ["minimalist", "light", "reader"],
};

export const PAPER_INK_COLOR_SCHEME: SharedColorSchemeData = {
  primary: "#2C2C2C",
  onPrimary: "#FAF9F6",
  primaryContainer: "#454545",
  onPrimaryContainer: "#FAF9F6",
  secondary: "#595959",
  onSecondary: "#FAF9F6",
  secondaryContainer: "#737373",
  onSecondaryContainer: "#FAF9F6",
  tertiary: "#6B6B6B",
  onTertiary: "#FAF9F6",
  tertiaryContainer: "#828282",
  onTertiaryContainer: "#FAF9F6",
  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#410002",
  background: "#F0F0EB",
  onBackground: "#2C2C2C",
  surface: "#FAF9F6",
  onSurface: "#2C2C2C",
  surfaceVariant: "#EBEAE4",
  onSurfaceVariant: "#454545",
  outline: "#7A7A7A",
  outlineVariant: "#C9C9C9",
  scrim: "#000000",
  inverseSurface: "#2C2C2C",
  inverseOnSurface: "#FAF9F6",
  inversePrimary: "#9A9A9A",
};

export const PAPER_INK_EFFECTS: SharedEffectsData = {
  shadows: {
    enabled: true,
    elevation: 1,
    blur: 2,
    color: "#00000011",
  },
};

// -----------------------------------------------------------------------------
// Slate Cyan
// -----------------------------------------------------------------------------
export const SLATE_CYAN_METADATA: SharedMetadataData = {
  id: "slate-cyan",
  name: "Slate Cyan",
  description: "Cool modern slate gray with vibrant cyan metallic accents",
  author: "Ktheme",
  version: "1.0.0",
  tags: ["metallic", "modern", "dark"],
};

export const SLATE_CYAN_COLOR_SCHEME: SharedColorSchemeData = {
  primary: "#00D9FF",
  onPrimary: "#1A1F24",
  primaryContainer: "#00A8CC",
  onPrimaryContainer: "#4DE2FF",
  secondary: "#2A333D",
  onSecondary: "#E8F0F5",
  secondaryContainer: "#232930",
  onSecondaryContainer: "#E8F0F5",
  tertiary: "#6BA5B8",
  onTertiary: "#1A1F24",
  tertiaryContainer: "#547D8F",
  onTertiaryContainer: "#D9EDF5",
  error: "#CF6679",
  onError: "#FFFFFF",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  background: "#1A1F24",
  onBackground: "#E8F0F5",
  surface: "#232930",
  onSurface: "#E8F0F5",
  surfaceVariant: "#3D4854",
  onSurfaceVariant: "#B8CAD6",
  outline: "#7A8A99",
  outlineVariant: "#4D5A66",
  scrim: "#000000",
  inverseSurface: "#E8F0F5",
  inverseOnSurface: "#1A1F24",
  inversePrimary: "#0080A0",
};

export const SLATE_CYAN_EFFECTS: SharedEffectsData = {
  metallic: {
    enabled: true,
    variant: "TITANIUM",
    gradient: {
      base: "#878681",
      highlight: "#BDBBB8",
      shadow: "#4A4A48",
      shimmer: "#D0CFCC",
    },
    intensity: 0.7,
  },
  shadows: {
    enabled: true,
    elevation: 3,
    blur: 6,
    color: "#00000055",
  },
};

// Map / array of all 6 shared theme preset data objects
export const SHARED_PRESETS_DATA: SharedPresetThemeData[] = [
  {
    metadata: NAVY_GOLD_METADATA,
    darkMode: true,
    colorScheme: NAVY_GOLD_COLOR_SCHEME,
    effects: NAVY_GOLD_EFFECTS,
    typography: NAVY_GOLD_TYPOGRAPHY,
  },
  {
    metadata: ROSE_GOLD_METADATA,
    darkMode: true,
    colorScheme: ROSE_GOLD_COLOR_SCHEME,
    effects: ROSE_GOLD_EFFECTS,
  },
  {
    metadata: EMERALD_SILVER_METADATA,
    darkMode: true,
    colorScheme: EMERALD_SILVER_COLOR_SCHEME,
    effects: EMERALD_SILVER_EFFECTS,
  },
  {
    metadata: OBSIDIAN_CRIMSON_METADATA,
    darkMode: true,
    colorScheme: OBSIDIAN_CRIMSON_COLOR_SCHEME,
    effects: OBSIDIAN_CRIMSON_EFFECTS,
  },
  {
    metadata: PAPER_INK_METADATA,
    darkMode: false,
    colorScheme: PAPER_INK_COLOR_SCHEME,
    effects: PAPER_INK_EFFECTS,
  },
  {
    metadata: SLATE_CYAN_METADATA,
    darkMode: true,
    colorScheme: SLATE_CYAN_COLOR_SCHEME,
    effects: SLATE_CYAN_EFFECTS,
  },
];
