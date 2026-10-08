/**
 * Preset themes for Ktheme
 * Based on CleverFerret's unified theme system
 */

import { Theme, MetallicVariant } from "../core/types";
import { getMetallicGradient } from "../effects/metallic";
import {
  ArtDecoAdaptation,
  ArtNouveauAdaptation,
  FrutigerAeroAdaptation,
  LCARSAdaptation,
  WindowsPhoneMetroAdaptation,
} from "./adaptationPresets";
import { SHARED_PRESET_IDS } from "./shared-preset-ids";
import {
  EMERALD_SILVER_COLOR_SCHEME,
  EMERALD_SILVER_METADATA,
  NAVY_GOLD_COLOR_SCHEME,
  NAVY_GOLD_METADATA,
  NAVY_GOLD_TYPOGRAPHY,
  OBSIDIAN_CRIMSON_COLOR_SCHEME,
  OBSIDIAN_CRIMSON_METADATA,
  PAPER_INK_COLOR_SCHEME,
  PAPER_INK_METADATA,
  ROSE_GOLD_COLOR_SCHEME,
  ROSE_GOLD_METADATA,
  SLATE_CYAN_COLOR_SCHEME,
  SLATE_CYAN_METADATA,
} from "./data/shared-presets-data";

const PRESET_CREATED_AT = "2026-03-30T00:00:00.000Z";
const PRESET_UPDATED_AT = "2026-03-30T00:00:00.000Z";

/**
 * Navy Gold Theme - Elegant navy background with gold accents
 */
export const NavyGoldTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    ...NAVY_GOLD_METADATA,
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: NAVY_GOLD_COLOR_SCHEME,
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD_ROYAL_BLUE,
      gradient: getMetallicGradient(MetallicVariant.GOLD_ROYAL_BLUE),
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
  },
  typography: NAVY_GOLD_TYPOGRAPHY,
};

/**
 * Emerald Silver Theme - Rich emerald with silver metallic highlights
 */
export const EmeraldSilverTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    ...EMERALD_SILVER_METADATA,
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: EMERALD_SILVER_COLOR_SCHEME,
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.SILVER,
      gradient: getMetallicGradient(MetallicVariant.SILVER),
      intensity: 0.7,
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: "#00000055",
    },
  },
};

/**
 * Rose Gold Theme - Warm rose gold with burgundy accents
 */
export const RoseGoldTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    ...ROSE_GOLD_METADATA,
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: ROSE_GOLD_COLOR_SCHEME,
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.ROSE_GOLD,
      gradient: getMetallicGradient(MetallicVariant.ROSE_GOLD),
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
  },
};

/**
 * Royal Bronze Theme - Regal purple with bronze accents
 */
export const RoyalBronzeTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "royal-bronze",
    name: "Royal Bronze",
    description: "Regal deep purple with luxurious bronze metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "regal", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#CD7F32",
    onPrimary: "#1A0A30",
    primaryContainer: "#A86428",
    onPrimaryContainer: "#D99952",

    secondary: "#2D1550",
    onSecondary: "#F0E6FF",
    secondaryContainer: "#220D40",
    onSecondaryContainer: "#F0E6FF",

    tertiary: "#9B7A5F",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#775D48",
    onTertiaryContainer: "#F0E6D9",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#1A0A30",
    onBackground: "#F0E6FF",
    surface: "#220D40",
    onSurface: "#F0E6FF",
    surfaceVariant: "#3D1F5C",
    onSurfaceVariant: "#D0B3E6",

    outline: "#9B7A99",
    outlineVariant: "#4D2F5C",

    scrim: "#000000",
    inverseSurface: "#F0E6FF",
    inverseOnSurface: "#1A0A30",
    inversePrimary: "#8A5F28",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.BRONZE,
      gradient: getMetallicGradient(MetallicVariant.BRONZE),
      intensity: 0.8,
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: "#00000066",
    },
  },
};

/**
 * Midnight Amber Theme - Sophisticated midnight blue with amber
 */
export const MidnightAmberTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "midnight-amber",
    name: "Midnight Amber",
    description: "Sophisticated midnight blue with warm amber metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "sophisticated", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#FFBF00",
    onPrimary: "#0C1824",
    primaryContainer: "#CC9900",
    onPrimaryContainer: "#FFD14D",

    secondary: "#1A2332",
    onSecondary: "#E8EEF5",
    secondaryContainer: "#15202E",
    onSecondaryContainer: "#E8EEF5",

    tertiary: "#D4A76A",
    onTertiary: "#0C1824",
    tertiaryContainer: "#A68254",
    onTertiaryContainer: "#F5E6D3",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#0C1824",
    onBackground: "#E8EEF5",
    surface: "#15202E",
    onSurface: "#E8EEF5",
    surfaceVariant: "#253447",
    onSurfaceVariant: "#B8C5D6",

    outline: "#8A95A6",
    outlineVariant: "#3D4854",

    scrim: "#000000",
    inverseSurface: "#E8EEF5",
    inverseOnSurface: "#0C1824",
    inversePrimary: "#8A6F00",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: getMetallicGradient(MetallicVariant.GOLD),
      intensity: 0.75,
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: "#00000055",
    },
  },
};

/**
 * Obsidian Crimson Theme - Bold dramatic black with crimson
 */
export const ObsidianCrimsonTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    ...OBSIDIAN_CRIMSON_METADATA,
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: OBSIDIAN_CRIMSON_COLOR_SCHEME,
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.COPPER,
      gradient: getMetallicGradient(MetallicVariant.COPPER),
      intensity: 0.8,
    },
    shadows: {
      enabled: true,
      elevation: 5,
      blur: 10,
      color: "#00000077",
    },
  },
};

/**
 * Slate Cyan Theme - Cool modern slate with cyan
 */
export const SlateCyanTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    ...SLATE_CYAN_METADATA,
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: SLATE_CYAN_COLOR_SCHEME,
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0.7,
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: "#00000055",
    },
  },
};

/**
 * Royal Silver Theme - Matching original Android theme
 */
export const RoyalSilverTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "royal-silver",
    name: "Royal Silver",
    description: "Royal purple background with elegant silver metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "royal", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#C0C0C0",
    onPrimary: "#1A1535",
    primaryContainer: "#9A9A9A",
    onPrimaryContainer: "#E0E0E0",

    secondary: "#2A1F50",
    onSecondary: "#F0EBFF",
    secondaryContainer: "#211A40",
    onSecondaryContainer: "#F0EBFF",

    tertiary: "#A89BC9",
    onTertiary: "#1A1535",
    tertiaryContainer: "#847AA0",
    onTertiaryContainer: "#F0EBFF",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#1A1535",
    onBackground: "#F0EBFF",
    surface: "#211A40",
    onSurface: "#F0EBFF",
    surfaceVariant: "#3D2F5C",
    onSurfaceVariant: "#C8BFE6",

    outline: "#9B8AB8",
    outlineVariant: "#4D3F66",

    scrim: "#000000",
    inverseSurface: "#F0EBFF",
    inverseOnSurface: "#1A1535",
    inversePrimary: "#7A7A7A",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.SILVER,
      gradient: getMetallicGradient(MetallicVariant.SILVER),
      intensity: 0.75,
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: "#00000055",
    },
  },
};

/**
 * Forest Copper Theme - Deep forest green with copper
 */
export const ForestCopperTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "forest-copper",
    name: "Forest Copper",
    description: "Deep forest green with warm copper metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "nature", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#B87333",
    onPrimary: "#0D1F0D",
    primaryContainer: "#935E29",
    onPrimaryContainer: "#D4965A",

    secondary: "#1A3D1A",
    onSecondary: "#E8F5E8",
    secondaryContainer: "#152915",
    onSecondaryContainer: "#E8F5E8",

    tertiary: "#8FA886",
    onTertiary: "#0D1F0D",
    tertiaryContainer: "#6D7D68",
    onTertiaryContainer: "#E8F5E8",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#0D1F0D",
    onBackground: "#E8F5E8",
    surface: "#152915",
    onSurface: "#E8F5E8",
    surfaceVariant: "#2A4D2A",
    onSurfaceVariant: "#B8D9B8",

    outline: "#7B9A7B",
    outlineVariant: "#3D5A3D",

    scrim: "#000000",
    inverseSurface: "#E8F5E8",
    inverseOnSurface: "#0D1F0D",
    inversePrimary: "#7A4F28",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.COPPER,
      gradient: getMetallicGradient(MetallicVariant.COPPER),
      intensity: 0.8,
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: "#00000066",
    },
  },
};

/**
 * Burgundy Rose Gold Theme - Rich burgundy with rose gold
 */
export const BurgundyRoseGoldTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "burgundy-rose-gold",
    name: "Burgundy Rose Gold",
    description: "Rich burgundy with elegant rose gold metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "elegant", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#B76E79",
    onPrimary: "#2D0F1A",
    primaryContainer: "#93575F",
    onPrimaryContainer: "#D4969E",

    secondary: "#4D1A2A",
    onSecondary: "#FFE6ED",
    secondaryContainer: "#3D1525",
    onSecondaryContainer: "#FFE6ED",

    tertiary: "#C99BA5",
    onTertiary: "#2D0F1A",
    tertiaryContainer: "#9F7A83",
    onTertiaryContainer: "#FFE6ED",

    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#2D0F1A",
    onBackground: "#FFE6ED",
    surface: "#3D1525",
    onSurface: "#FFE6ED",
    surfaceVariant: "#5C2A3D",
    onSurfaceVariant: "#E6C0CC",

    outline: "#B88A94",
    outlineVariant: "#6D3F4D",

    scrim: "#000000",
    inverseSurface: "#FFE6ED",
    inverseOnSurface: "#2D0F1A",
    inversePrimary: "#8A575F",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.ROSE_GOLD,
      gradient: getMetallicGradient(MetallicVariant.ROSE_GOLD),
      intensity: 0.8,
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: "#00000055",
    },
    shimmer: {
      enabled: true,
      speed: 4,
      intensity: 0.6,
      angle: 120,
    },
  },
};

/**
 * Charcoal Champagne Theme - Sophisticated charcoal with champagne
 */
export const CharcoalChampagneTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "charcoal-champagne",
    name: "Charcoal Champagne",
    description: "Sophisticated charcoal gray with warm champagne accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "sophisticated", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#F7E7CE",
    onPrimary: "#1F1F1F",
    primaryContainer: "#C5B8A5",
    onPrimaryContainer: "#FFF5E6",

    secondary: "#3D3D3D",
    onSecondary: "#F5F5F5",
    secondaryContainer: "#2A2A2A",
    onSecondaryContainer: "#F5F5F5",

    tertiary: "#D4C4A8",
    onTertiary: "#1F1F1F",
    tertiaryContainer: "#A89C86",
    onTertiaryContainer: "#FFF5E6",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#1F1F1F",
    onBackground: "#F5F5F5",
    surface: "#2A2A2A",
    onSurface: "#F5F5F5",
    surfaceVariant: "#3D3D3D",
    onSurfaceVariant: "#D0D0D0",

    outline: "#9A9A9A",
    outlineVariant: "#4D4D4D",

    scrim: "#000000",
    inverseSurface: "#F5F5F5",
    inverseOnSurface: "#1F1F1F",
    inversePrimary: "#9A8970",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: getMetallicGradient(MetallicVariant.GOLD),
      intensity: 0.65,
    },
    shadows: {
      enabled: true,
      elevation: 2,
      blur: 4,
      color: "#00000044",
    },
  },
};

/**
 * Slate Gunmetal Theme - Industrial slate with gunmetal
 */
export const SlateGunmetalTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "slate-gunmetal",
    name: "Slate Gunmetal",
    description: "Industrial slate gray with gunmetal metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "industrial", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#8F9CA8",
    onPrimary: "#1A2029",
    primaryContainer: "#6F7D87",
    onPrimaryContainer: "#B0BDC9",

    secondary: "#2D3844",
    onSecondary: "#E6ECF2",
    secondaryContainer: "#232C38",
    onSecondaryContainer: "#E6ECF2",

    tertiary: "#9DAAB6",
    onTertiary: "#1A2029",
    tertiaryContainer: "#7A8590",
    onTertiaryContainer: "#D9E3ED",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#1A2029",
    onBackground: "#E6ECF2",
    surface: "#232C38",
    onSurface: "#E6ECF2",
    surfaceVariant: "#3D4854",
    onSurfaceVariant: "#B8C5D6",

    outline: "#8897A4",
    outlineVariant: "#4D5A66",

    scrim: "#000000",
    inverseSurface: "#E6ECF2",
    inverseOnSurface: "#1A2029",
    inversePrimary: "#5A6670",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0.7,
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: "#00000055",
    },
  },
};

/**
 * Deep Purple Platinum Theme - Deep purple with platinum
 */
export const DeepPurplePlatinumTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "deep-purple-platinum",
    name: "Deep Purple Platinum",
    description:
      "Deep purple background with luxurious platinum metallic accents",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["metallic", "luxurious", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#E5E4E2",
    onPrimary: "#1A0F2E",
    primaryContainer: "#B8B7B5",
    onPrimaryContainer: "#F5F4F2",

    secondary: "#2E1A50",
    onSecondary: "#F0EBFF",
    secondaryContainer: "#24153D",
    onSecondaryContainer: "#F0EBFF",

    tertiary: "#C8BFE0",
    onTertiary: "#1A0F2E",
    tertiaryContainer: "#9F99B3",
    onTertiaryContainer: "#F0EBFF",

    error: "#CF6679",
    onError: "#FFFFFF",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#1A0F2E",
    onBackground: "#F0EBFF",
    surface: "#24153D",
    onSurface: "#F0EBFF",
    surfaceVariant: "#3D2A5C",
    onSurfaceVariant: "#D0C0E6",

    outline: "#9B8AB8",
    outlineVariant: "#4D3F6D",

    scrim: "#000000",
    inverseSurface: "#F0EBFF",
    inverseOnSurface: "#1A0F2E",
    inversePrimary: "#9A9998",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.PLATINUM,
      gradient: getMetallicGradient(MetallicVariant.PLATINUM),
      intensity: 0.8,
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: "#00000066",
    },
  },
};

/**
 * Paper Ink Theme - Minimalist reader theme (light mode)
 */
export const PaperInkTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    ...PAPER_INK_METADATA,
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: false,
  colorScheme: PAPER_INK_COLOR_SCHEME,
  effects: {
    shadows: {
      enabled: true,
      elevation: 1,
      blur: 2,
      color: "#00000011",
    },
  },
};

/**
 * Frutiger Aero Theme - Late 90s / early 2000s glossy glass aesthetic
 */
export const FrutigerAeroTheme: Theme = {
  schemaVersion: 2,
  ...PaperInkTheme,
  metadata: {
    ...PaperInkTheme.metadata,
    id: "frutiger-aero",
    name: "Frutiger Aero",
    description:
      "Glossy glassy sky-and-nature palette inspired by late 90s/early 2000s UI",
    tags: [
      ...new Set([
        ...(PaperInkTheme.metadata.tags ?? []),
        "frutiger-aero",
        "glassy",
        "nostalgia",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: false,
  colorScheme: {
    ...PaperInkTheme.colorScheme,
    primary: "#39B6F0",
    onPrimary: "#022A40",
    primaryContainer: "#A9E6FF",
    onPrimaryContainer: "#00314D",
    secondary: "#79D87E",
    onSecondary: "#07350D",
    secondaryContainer: "#C6F4CC",
    onSecondaryContainer: "#113D17",
    tertiary: "#B9DBFF",
    onTertiary: "#0D2C4F",
    tertiaryContainer: "#DAEEFF",
    onTertiaryContainer: "#123659",
    background: "#EAF7FF",
    onBackground: "#14344A",
    surface: "#F7FCFF",
    onSurface: "#173A52",
    surfaceVariant: "#DDF1FF",
    onSurfaceVariant: "#34566E",
    outline: "#6189A4",
    outlineVariant: "#A9C7DA",
    inverseSurface: "#173A52",
    inverseOnSurface: "#EAF7FF",
    inversePrimary: "#0A6FA0",
  },
  effects: {
    ...PaperInkTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.SILVER,
      gradient: getMetallicGradient(MetallicVariant.SILVER),
      intensity: 0,
    },
    blur: {
      enabled: true,
      radius: 12,
    },
    overlays: {
      enabled: true,
      color: "#A9DFFF",
      opacity: 0.22,
      blendMode: "screen",
    },
    gradients: {
      enabled: true,
      angle: 135,
      stops: [
        { offset: 0, color: "#EAF7FF" },
        { offset: 0.58, color: "#DAF0FF" },
        { offset: 1, color: "#BEEBFF" },
      ],
    },
    shimmer: {
      enabled: true,
      speed: 4,
      intensity: 0.32,
      angle: 120,
    },
  },
  adaptation: FrutigerAeroAdaptation,
};

/**
 * Solarpunk Civic Theme - Optimistic civic/nature interface language
 */
export const SolarpunkCivicTheme: Theme = {
  schemaVersion: 2,
  ...FrutigerAeroTheme,
  metadata: {
    ...FrutigerAeroTheme.metadata,
    id: "solarpunk-civic",
    name: "Solarpunk Civic",
    description:
      "Optimistic civic palette with daylight greens and trust-building clarity",
    tags: [
      ...new Set([
        ...(FrutigerAeroTheme.metadata.tags ?? []),
        "solarpunk",
        "civic",
        "daylight",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...FrutigerAeroTheme.colorScheme,
    primary: "#38B56A",
    onPrimary: "#04250F",
    primaryContainer: "#BFEFD0",
    onPrimaryContainer: "#0E3F20",
    secondary: "#4FAEEA",
    onSecondary: "#05253A",
    secondaryContainer: "#C8E9FF",
    onSecondaryContainer: "#103A57",
    tertiary: "#F2C46C",
    onTertiary: "#3A2A08",
    tertiaryContainer: "#FFE8BA",
    onTertiaryContainer: "#5A420F",
    background: "#F2FBF4",
    onBackground: "#1E3A27",
    surface: "#FBFFFC",
    onSurface: "#224231",
    surfaceVariant: "#E2F2E8",
    onSurfaceVariant: "#456355",
    outline: "#668977",
    outlineVariant: "#B3D0BF",
    inverseSurface: "#1C3A28",
    inverseOnSurface: "#EAF8EF",
    inversePrimary: "#1D7A44",
  },
};

/**
 * Neo-Noir Neon Theme - Cinematic dark base with disciplined neon accents
 */
export const NeoNoirNeonTheme: Theme = {
  schemaVersion: 2,
  ...ObsidianCrimsonTheme,
  metadata: {
    ...ObsidianCrimsonTheme.metadata,
    id: "neo-noir-neon",
    name: "Neo-Noir Neon",
    description:
      "Dark cinematic palette with constrained neon accents for control surfaces",
    tags: [
      ...new Set([
        ...(ObsidianCrimsonTheme.metadata.tags ?? []),
        "neo-noir",
        "neon",
        "cinematic",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...ObsidianCrimsonTheme.colorScheme,
    primary: "#A73CFF",
    onPrimary: "#140022",
    primaryContainer: "#4B1D73",
    onPrimaryContainer: "#E7CBFF",
    secondary: "#00D1FF",
    onSecondary: "#00222B",
    secondaryContainer: "#005E73",
    onSecondaryContainer: "#C5F4FF",
    tertiary: "#FF3D9E",
    onTertiary: "#2C0018",
    tertiaryContainer: "#7A2454",
    onTertiaryContainer: "#FFD1EA",
    background: "#090A10",
    onBackground: "#E7EAF7",
    surface: "#111420",
    onSurface: "#E7EAF7",
    surfaceVariant: "#1C2130",
    onSurfaceVariant: "#B9C0D8",
    outline: "#A0A7B7",
    outlineVariant: "#363D52",
    inverseSurface: "#E7EAF7",
    inverseOnSurface: "#090A10",
    inversePrimary: "#6D2DA3",
  },
  effects: {
    ...ObsidianCrimsonTheme.effects,
    shimmer: {
      enabled: true,
      speed: 5,
      intensity: 0.22,
      angle: 125,
    },
  },
};

/**
 * Calm Clinical Theme - Low-stress clinical palette with accessibility-first clarity
 */
export const CalmClinicalTheme: Theme = {
  schemaVersion: 2,
  ...PaperInkTheme,
  metadata: {
    ...PaperInkTheme.metadata,
    id: "calm-clinical",
    name: "Calm Clinical",
    description:
      "Low-stress healthcare/admin palette with clear status readability",
    tags: [
      ...new Set([
        ...(PaperInkTheme.metadata.tags ?? []),
        "clinical",
        "accessibility",
        "calm",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...PaperInkTheme.colorScheme,
    primary: "#3A7CA5",
    onPrimary: "#F3FAFF",
    primaryContainer: "#C4DFF2",
    onPrimaryContainer: "#17374D",
    secondary: "#4DAA7C",
    onSecondary: "#062A1C",
    secondaryContainer: "#CBEFDF",
    onSecondaryContainer: "#184933",
    tertiary: "#7D9AB2",
    onTertiary: "#0E2333",
    tertiaryContainer: "#D8E6F0",
    onTertiaryContainer: "#264256",
    background: "#F5FAFD",
    onBackground: "#1F394B",
    surface: "#FFFFFF",
    onSurface: "#1F394B",
    surfaceVariant: "#E5EEF4",
    onSurfaceVariant: "#445F72",
    outline: "#6B8698",
    outlineVariant: "#B5C8D5",
    inverseSurface: "#1F394B",
    inverseOnSurface: "#F5FAFD",
    inversePrimary: "#295A7A",
  },
};

/**
 * Ink Terminal Modern Theme - Terminal-inspired palette with readability guardrails
 */
export const InkTerminalModernTheme: Theme = {
  schemaVersion: 2,
  ...SlateGunmetalTheme,
  metadata: {
    ...SlateGunmetalTheme.metadata,
    id: "ink-terminal-modern",
    name: "Ink Terminal Modern",
    description:
      "Retro-terminal inspired interface with modern accessibility contrast",
    tags: [
      ...new Set([
        ...(SlateGunmetalTheme.metadata.tags ?? []),
        "terminal",
        "developer",
        "mono",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...SlateGunmetalTheme.colorScheme,
    primary: "#6CFF9A",
    onPrimary: "#03240F",
    primaryContainer: "#1F6640",
    onPrimaryContainer: "#D7FFE4",
    secondary: "#3E4E5E",
    onSecondary: "#EAF3FF",
    secondaryContainer: "#2A3644",
    onSecondaryContainer: "#D8E6F4",
    tertiary: "#8AD0B0",
    onTertiary: "#0E3021",
    tertiaryContainer: "#4A7A63",
    onTertiaryContainer: "#D9F2E6",
    background: "#0A1112",
    onBackground: "#D7F5E6",
    surface: "#101A1C",
    onSurface: "#D7F5E6",
    surfaceVariant: "#1B2A2D",
    onSurfaceVariant: "#A7C8BC",
    outline: "#6E8D82",
    outlineVariant: "#365047",
    inverseSurface: "#D7F5E6",
    inverseOnSurface: "#0A1112",
    inversePrimary: "#2BAA5F",
  },
  typography: {
    ...PaperInkTheme.typography!,
    fontFamily:
      '"JetBrains Mono", "IBM Plex Mono", "SFMono-Regular", monospace',
    lineHeight: 1.55,
  },
  effects: {
    ...SlateGunmetalTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0,
    },
  },
};

/**
 * Aurora Glass Night Theme - Premium glassmorphism over aurora-tinted dark surfaces
 */
export const AuroraGlassNightTheme: Theme = {
  schemaVersion: 2,
  ...SlateCyanTheme,
  metadata: {
    ...SlateCyanTheme.metadata,
    id: "aurora-glass-night",
    name: "Aurora Glass Night",
    description:
      "Night-first glass aesthetic with aurora accents and disciplined blur",
    tags: [
      ...new Set([
        ...(SlateCyanTheme.metadata.tags ?? []),
        "aurora",
        "glass",
        "consumer",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...SlateCyanTheme.colorScheme,
    primary: "#6DE8FF",
    onPrimary: "#03212A",
    primaryContainer: "#2A6F85",
    onPrimaryContainer: "#D6F7FF",
    secondary: "#8C7CFF",
    onSecondary: "#1A133C",
    secondaryContainer: "#4B4299",
    onSecondaryContainer: "#E3DDFF",
    tertiary: "#7CFFD8",
    onTertiary: "#053425",
    tertiaryContainer: "#2A7B63",
    onTertiaryContainer: "#D5FFEF",
    background: "#0A1224",
    onBackground: "#E7F0FF",
    surface: "#101C33",
    onSurface: "#E7F0FF",
    surfaceVariant: "#1D2B4A",
    onSurfaceVariant: "#B5C7E9",
    outline: "#8F9EBF",
    outlineVariant: "#334364",
    inverseSurface: "#E7F0FF",
    inverseOnSurface: "#0A1224",
    inversePrimary: "#2D8CA8",
  },
  effects: {
    ...SlateCyanTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0,
    },
    blur: {
      enabled: true,
      radius: 14,
    },
    overlays: {
      enabled: true,
      color: "#8CCBFF",
      opacity: 0.18,
      blendMode: "screen",
    },
  },
};

/**
 * Windows Phone Metro Theme - Flat, high-contrast tile-oriented theme
 */
export const WindowsPhoneMetroTheme: Theme = {
  schemaVersion: 2,
  ...SlateCyanTheme,
  metadata: {
    ...SlateCyanTheme.metadata,
    id: "windows-phone-metro",
    name: "Windows Phone Metro",
    description: "Flat, tile-first Metro-inspired interface theme",
    tags: [
      ...new Set([
        ...(SlateCyanTheme.metadata.tags ?? []),
        "metro",
        "windows-phone",
        "flat",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...SlateCyanTheme.colorScheme,
    primary: "#00AEEF",
    onPrimary: "#00151F",
    primaryContainer: "#0078D7",
    onPrimaryContainer: "#E8F7FF",
    secondary: "#005A9E",
    onSecondary: "#EAF4FF",
    tertiary: "#2D89EF",
    onTertiary: "#001021",
    background: "#001A33",
    onBackground: "#F0F8FF",
    surface: "#002448",
    onSurface: "#F0F8FF",
  },
  effects: {
    ...SlateCyanTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0,
    },
  },
  adaptation: WindowsPhoneMetroAdaptation,
};

/**
 * LCARS Theme - Starship-console inspired color and panel language
 */
export const LCARSTheme: Theme = {
  schemaVersion: 2,
  ...RoyalBronzeTheme,
  metadata: {
    ...RoyalBronzeTheme.metadata,
    id: "lcars",
    name: "LCARS",
    description:
      "LCARS-inspired interface with warm rails and compact controls",
    tags: [
      ...new Set([
        ...(RoyalBronzeTheme.metadata.tags ?? []),
        "lcars",
        "sci-fi",
        "console",
      ]),
    ],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  colorScheme: {
    ...RoyalBronzeTheme.colorScheme,
    primary: "#F2A65A",
    onPrimary: "#1B0E24",
    primaryContainer: "#CC7A2B",
    onPrimaryContainer: "#FFE6CC",
    secondary: "#C5678D",
    onSecondary: "#2B1224",
    tertiary: "#A485F7",
    onTertiary: "#170F2E",
    background: "#120C1C",
    onBackground: "#F3E9FF",
    surface: "#1C132A",
    onSurface: "#F3E9FF",
  },
  effects: {
    ...RoyalBronzeTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.BRONZE,
      gradient: getMetallicGradient(MetallicVariant.BRONZE),
      intensity: 0,
    },
  },
  adaptation: LCARSAdaptation,
};

/**
 * Art Nouveau Theme - Organic curves, botanical accents, and decorative linework.
 */
export const ArtNouveauTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "art-nouveau",
    name: "Art Nouveau",
    description:
      "Organic curves, botanical accents, and decorative linework with a warm natural palette",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["iconic", "organic", "botanical", "warm"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: false,
  colorScheme: {
    primary: "#7B5737",
    onPrimary: "#FFF7EE",
    primaryContainer: "#D9C2A9",
    onPrimaryContainer: "#352214",
    secondary: "#6B8F57",
    onSecondary: "#F6FFF1",
    secondaryContainer: "#CFE4BF",
    onSecondaryContainer: "#E8F0F5",
    tertiary: "#C57C52",
    onTertiary: "#FFF8F3",
    tertiaryContainer: "#F1C9AF",
    onTertiaryContainer: "#43210D",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    background: "#F6F0E6",
    onBackground: "#2C2218",
    surface: "#FFF8EE",
    onSurface: "#2C2218",
    surfaceVariant: "#E7D8C7",
    onSurfaceVariant: "#B8CAD6",
    outline: "#8897A4",
    outlineVariant: "#CBB8A5",
    scrim: "#000000",
    inverseSurface: "#372C22",
    inverseOnSurface: "#FDEDDD",
    inversePrimary: "#E7C8A8",
  },
  effects: {
    shadows: {
      enabled: true,
      elevation: 2,
      blur: 6,
      color: "#3A281A26",
    },
    shimmer: {
      enabled: true,
      speed: 6,
      intensity: 0.18,
      angle: 115,
    },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
    fontSize: {
      small: 13,
      medium: 16,
      large: 21,
      xlarge: 30,
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: 1.55,
    letterSpacing: 0.1,
  },
  adaptation: ArtNouveauAdaptation,
};

/**
 * Art Deco Theme - Geometric symmetry with premium high-contrast finishes.
 */
export const ArtDecoTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "art-deco",
    name: "Art Deco",
    description:
      "Geometric symmetry, stepped motifs, and premium gold-black-ivory contrast",
    author: "Ktheme",
    version: "1.0.0",
    tags: ["iconic", "geometric", "luxury", "high-contrast"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#D4AF37",
    onPrimary: "#1A1405",
    primaryContainer: "#8F7121",
    onPrimaryContainer: "#FFF2C6",
    secondary: "#F4E7CF",
    onSecondary: "#221A0A",
    secondaryContainer: "#3A3222",
    onSecondaryContainer: "#F4E7CF",
    tertiary: "#0F0F11",
    onTertiary: "#F6EAD1",
    tertiaryContainer: "#2A2A2E",
    onTertiaryContainer: "#F2E2B2",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#0B0A0A",
    onBackground: "#F3E8D0",
    surface: "#141314",
    onSurface: "#F3E8D0",
    surfaceVariant: "#232124",
    onSurfaceVariant: "#C9BDA2",
    outline: "#9E8A63",
    outlineVariant: "#4B4332",
    scrim: "#000000",
    inverseSurface: "#F3E8D0",
    inverseOnSurface: "#171311",
    inversePrimary: "#7A5F1D",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: getMetallicGradient(MetallicVariant.GOLD),
      intensity: 0.86,
    },
    shadows: {
      enabled: true,
      elevation: 6,
      blur: 14,
      color: "#00000088",
    },
    shimmer: {
      enabled: true,
      speed: 3,
      intensity: 0.4,
      angle: 90,
    },
  },
  typography: {
    fontFamily: '"Futura", "Avenir Next", "Arial", sans-serif',
    fontSize: {
      small: 12,
      medium: 16,
      large: 22,
      xlarge: 34,
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 600,
      bold: 800,
    },
    lineHeight: 1.4,
    letterSpacing: 0.35,
  },
  adaptation: ArtDecoAdaptation,
};

export const SharedPresetThemeIds = [...SHARED_PRESET_IDS];
/**
 * All preset themes
 */
/**
 * Linkpoint Gold Theme
 */
export const LinkpointGoldTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "linkpoint-gold",
    name: "Linkpoint Gold",
    description:
      "Signature Linkpoint UI kit theme featuring high-contrast gold metallic accents",
    author: "Linkpoint & Ktheme",
    version: "1.0.0",
    tags: ["metallic", "linkpoint", "dark", "gold"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#D4AF37",
    onPrimary: "#0A0D14",
    primaryContainer: "#856D34",
    onPrimaryContainer: "#FFF8DC",
    secondary: "#818CF8",
    onSecondary: "#0A0D14",
    secondaryContainer: "#312E81",
    onSecondaryContainer: "#E0E7FF",
    tertiary: "#38BDF8",
    onTertiary: "#0A0D14",
    tertiaryContainer: "#075985",
    onTertiaryContainer: "#E0F2FE",
    error: "#EF4444",
    onError: "#FFFFFF",
    errorContainer: "#7F1D1D",
    onErrorContainer: "#FEE2E2",
    background: "#0A0D14",
    onBackground: "#F3F4F6",
    surface: "#141722",
    onSurface: "#F3F4F6",
    surfaceVariant: "#1F293D",
    onSurfaceVariant: "#9CA3AF",
    outline: "#7586A2",
    outlineVariant: "#1F293D",
    scrim: "#000000",
    inverseSurface: "#F3F4F6",
    inverseOnSurface: "#0A0D14",
    inversePrimary: "#856D34",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: getMetallicGradient(MetallicVariant.GOLD),
      intensity: 0.85,
    },
    shadows: {
      enabled: true,
      elevation: 6,
      blur: 12,
      color: "#00000080",
    },
    shimmer: {
      enabled: true,
      speed: 2.5,
      intensity: 0.7,
      angle: 135,
    },
  },
};

/**
 * Linkpoint Cobalt Theme
 */
export const LinkpointCobaltTheme: Theme = {
  schemaVersion: 2,
  metadata: {
    id: "linkpoint-cobalt",
    name: "Linkpoint Cobalt",
    description:
      "Deep cobalt blue metallic theme designed for high-density command consoles",
    author: "Linkpoint & Ktheme",
    version: "1.0.0",
    tags: ["metallic", "linkpoint", "cobalt", "dark"],
    createdAt: PRESET_CREATED_AT,
    updatedAt: PRESET_UPDATED_AT,
  },
  darkMode: true,
  colorScheme: {
    primary: "#38BDF8",
    onPrimary: "#030712",
    primaryContainer: "#0369A1",
    onPrimaryContainer: "#E0F2FE",
    secondary: "#818CF8",
    onSecondary: "#030712",
    secondaryContainer: "#3730A3",
    onSecondaryContainer: "#E0E7FF",
    tertiary: "#F43F5E",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#881337",
    onTertiaryContainer: "#FFE4E6",
    error: "#EF4444",
    onError: "#FFFFFF",
    errorContainer: "#7F1D1D",
    onErrorContainer: "#FEE2E2",
    background: "#030712",
    onBackground: "#F9FAFB",
    surface: "#111827",
    onSurface: "#F9FAFB",
    surfaceVariant: "#1F2937",
    onSurfaceVariant: "#9CA3AF",
    outline: "#8090A9",
    outlineVariant: "#1F2937",
    scrim: "#000000",
    inverseSurface: "#F9FAFB",
    inverseOnSurface: "#030712",
    inversePrimary: "#0369A1",
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.COBALT,
      gradient: getMetallicGradient(MetallicVariant.COBALT),
      intensity: 0.8,
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 10,
      color: "#00000080",
    },
    shimmer: {
      enabled: true,
      speed: 2.0,
      intensity: 0.65,
      angle: 135,
    },
  },
};

export const PresetThemes = {
  NavyGold: NavyGoldTheme,
  EmeraldSilver: EmeraldSilverTheme,
  RoseGold: RoseGoldTheme,
  RoyalBronze: RoyalBronzeTheme,
  MidnightAmber: MidnightAmberTheme,
  ObsidianCrimson: ObsidianCrimsonTheme,
  SlateCyan: SlateCyanTheme,
  RoyalSilver: RoyalSilverTheme,
  ForestCopper: ForestCopperTheme,
  BurgundyRoseGold: BurgundyRoseGoldTheme,
  CharcoalChampagne: CharcoalChampagneTheme,
  SlateGunmetal: SlateGunmetalTheme,
  DeepPurplePlatinum: DeepPurplePlatinumTheme,
  PaperInk: PaperInkTheme,
  FrutigerAero: FrutigerAeroTheme,
  SolarpunkCivic: SolarpunkCivicTheme,
  NeoNoirNeon: NeoNoirNeonTheme,
  CalmClinical: CalmClinicalTheme,
  InkTerminalModern: InkTerminalModernTheme,
  AuroraGlassNight: AuroraGlassNightTheme,
  WindowsPhoneMetro: WindowsPhoneMetroTheme,
  LCARS: LCARSTheme,
  ArtNouveau: ArtNouveauTheme,
  ArtDeco: ArtDecoTheme,
  LinkpointGold: LinkpointGoldTheme,
  LinkpointCobalt: LinkpointCobaltTheme,
};

export const ENGINE_PRESET_IDS = Object.values(PresetThemes).map(
  (theme) => theme.metadata.id,
);

if (
  ENGINE_PRESET_IDS.length !== SHARED_PRESET_IDS.length ||
  ENGINE_PRESET_IDS.some((id, index) => id !== SHARED_PRESET_IDS[index])
) {
  throw new Error("Engine preset IDs are out of sync with shared preset IDs.");
}
