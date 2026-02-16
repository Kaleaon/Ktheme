/**
 * Curated theme sets for quick discovery and onboarding.
 */

import { Theme } from '../core/types';
import {
  BurgundyRoseGoldTheme,
  CharcoalChampagneTheme,
  DeepPurplePlatinumTheme,
  EmeraldSilverTheme,
  ForestCopperTheme,
  MidnightAmberTheme,
  NavyGoldTheme,
  ObsidianCrimsonTheme,
  PaperInkTheme,
  RoseGoldTheme,
  RoyalBronzeTheme,
  RoyalSilverTheme,
  SlateCyanTheme,
  SlateGunmetalTheme
} from './presets';

/**
 * A named group of themes designed for a specific style or use-case.
 */
export interface ThemeSet {
  id: string;
  name: string;
  description: string;
  themes: Theme[];
}

export const ThemeSets: Record<string, ThemeSet> = {
  starter: {
    id: 'starter',
    name: 'Starter Collection',
    description: 'Balanced themes for first-time adopters of Ktheme.',
    themes: [NavyGoldTheme, SlateCyanTheme, PaperInkTheme]
  },
  metallicShowcase: {
    id: 'metallic-showcase',
    name: 'Metallic Showcase',
    description: 'Best themes for metallic gradients and premium UI accents.',
    themes: [
      NavyGoldTheme,
      EmeraldSilverTheme,
      RoseGoldTheme,
      RoyalBronzeTheme,
      DeepPurplePlatinumTheme
    ]
  },
  executiveDark: {
    id: 'executive-dark',
    name: 'Executive Dark',
    description: 'High-contrast dark themes for dashboards and enterprise tools.',
    themes: [
      ObsidianCrimsonTheme,
      CharcoalChampagneTheme,
      SlateGunmetalTheme,
      MidnightAmberTheme
    ]
  },
  creativeStudio: {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Expressive palettes for branding, creative tooling, and media apps.',
    themes: [
      BurgundyRoseGoldTheme,
      RoyalSilverTheme,
      ForestCopperTheme,
      RoseGoldTheme
    ]
  },
  readability: {
    id: 'readability',
    name: 'Readability First',
    description: 'Themes optimized for long-form reading and low-fatigue interfaces.',
    themes: [PaperInkTheme, CharcoalChampagneTheme, SlateCyanTheme]
  }
};

/**
 * Return all available theme sets.
 */
export function getThemeSets(): ThemeSet[] {
  return Object.values(ThemeSets);
}

/**
 * Retrieve a theme set by either map key or set id.
 */
export function getThemeSet(id: string): ThemeSet | undefined {
  return Object.values(ThemeSets).find(set => set.id === id) ?? ThemeSets[id];
}

