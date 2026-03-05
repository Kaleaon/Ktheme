import { Theme, ThemeAdaptation } from '../core/types';
import { applyExpansionPack } from './expansion';
import { DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE } from '../accessibility/defaults';
import {
  AuroraGlassNightTheme,
  CalmClinicalTheme,
  CharcoalChampagneTheme,
  FrutigerAeroTheme,
  LCARSTheme,
  NeoNoirNeonTheme,
  PaperInkTheme,
  PresetThemes,
  RoyalSilverTheme,
  SlateGunmetalTheme,
  WindowsPhoneMetroTheme
} from './presets';

export type IconicPackId =
  | 'windows-activation-pack'
  | 'lcars-activation-pack'
  | 'art-nouveau-pack'
  | 'art-deco-pack';

export type IconicPackVariant = 'light' | 'dark' | 'high-contrast';

export type AppArchetype = 'dashboard' | 'consumer' | 'developer' | 'content';

export interface IconicPackRecipe {
  id: IconicPackId;
  name: string;
  description: string;
  basePresetId: string;
  variantMatrix?: Partial<Record<IconicPackVariant, string>>;
  allowedExpansionPacks: string[];
  adaptationDefaults: Partial<Record<AppArchetype, ThemeAdaptation>>;
}

export interface ApplyIconicPackOptions {
  variant?: IconicPackVariant;
  appArchetype?: AppArchetype;
  expansionPacks?: string[];
}

const PresetThemeById = Object.values(PresetThemes).reduce<Record<string, Theme>>((acc, theme) => {
  acc[theme.metadata.id] = theme;
  return acc;
}, {});

const cloneTheme = (theme: Theme): Theme => JSON.parse(JSON.stringify(theme)) as Theme;
const cloneValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const IconicPackRecipes: Record<IconicPackId, IconicPackRecipe> = {
  'windows-activation-pack': {
    id: 'windows-activation-pack',
    name: 'Windows Activation Pack',
    description: 'Metro-inspired product launch profile for tile-first dashboards and shell experiences.',
    basePresetId: WindowsPhoneMetroTheme.metadata.id,
    variantMatrix: {
      dark: WindowsPhoneMetroTheme.metadata.id,
      light: PaperInkTheme.metadata.id,
      'high-contrast': SlateGunmetalTheme.metadata.id
    },
    allowedExpansionPacks: ['platform-pack', 'accessibility-pack', 'motion-pack', 'widget-skin-pack'],
    adaptationDefaults: {
      dashboard: WindowsPhoneMetroTheme.adaptation,
      consumer: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'sharp',
          spacingScale: 1.15,
          panelStyle: 'flat',
          navigationStyle: 'pivot',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      },
      content: {
        layout: {
          density: 'spacious',
          cornerStyle: 'sharp',
          spacingScale: 1.2,
          panelStyle: 'flat',
          navigationStyle: 'tabs',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      }
    }
  },
  'lcars-activation-pack': {
    id: 'lcars-activation-pack',
    name: 'LCARS Activation Pack',
    description: 'Console-first command palette with rails and bold segment geometry.',
    basePresetId: LCARSTheme.metadata.id,
    variantMatrix: {
      dark: LCARSTheme.metadata.id,
      light: RoyalSilverTheme.metadata.id,
      'high-contrast': CharcoalChampagneTheme.metadata.id
    },
    allowedExpansionPacks: ['platform-pack', 'accessibility-pack', 'ai-ui-pack', 'data-viz-pack'],
    adaptationDefaults: {
      dashboard: LCARSTheme.adaptation,
      developer: {
        layout: {
          density: 'compact',
          cornerStyle: 'pill',
          spacingScale: 0.9,
          panelStyle: 'flat',
          navigationStyle: 'rail',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      },
      content: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'pill',
          spacingScale: 1,
          panelStyle: 'flat',
          navigationStyle: 'drawer',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      }
    }
  },
  'art-nouveau-pack': {
    id: 'art-nouveau-pack',
    name: 'Art Nouveau Pack',
    description: 'Organic curves with luminous gradients for expressive product branding.',
    basePresetId: FrutigerAeroTheme.metadata.id,
    variantMatrix: {
      light: FrutigerAeroTheme.metadata.id,
      dark: AuroraGlassNightTheme.metadata.id,
      'high-contrast': CalmClinicalTheme.metadata.id
    },
    allowedExpansionPacks: ['seasonal-pack', 'platform-pack', 'motion-pack', 'email-docs-pack'],
    adaptationDefaults: {
      consumer: FrutigerAeroTheme.adaptation,
      content: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'rounded',
          spacingScale: 1.12,
          panelStyle: 'glass',
          navigationStyle: 'tabs',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      },
      dashboard: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'rounded',
          spacingScale: 1.02,
          panelStyle: 'elevated',
          navigationStyle: 'rail',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      }
    }
  },
  'art-deco-pack': {
    id: 'art-deco-pack',
    name: 'Art Deco Pack',
    description: 'Structured glamour with geometric contrast and premium metallic depth.',
    basePresetId: NeoNoirNeonTheme.metadata.id,
    variantMatrix: {
      dark: NeoNoirNeonTheme.metadata.id,
      light: RoyalSilverTheme.metadata.id,
      'high-contrast': CharcoalChampagneTheme.metadata.id
    },
    allowedExpansionPacks: ['domain-pack', 'data-viz-pack', 'accessibility-pack', 'motion-pack'],
    adaptationDefaults: {
      dashboard: {
        layout: {
          density: 'compact',
          cornerStyle: 'rounded',
          spacingScale: 0.96,
          panelStyle: 'elevated',
          navigationStyle: 'tabs',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      },
      consumer: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'rounded',
          spacingScale: 1.08,
          panelStyle: 'elevated',
          navigationStyle: 'drawer',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      },
      content: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'rounded',
          spacingScale: 1.06,
          panelStyle: 'flat',
          navigationStyle: 'tabs',
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        }
      }
    }
  }
};

export function getIconicPackById(packId: IconicPackId): IconicPackRecipe {
  return IconicPackRecipes[packId];
}

export function getIconicPacks(): IconicPackRecipe[] {
  return Object.values(IconicPackRecipes);
}

export function applyIconicPack(packId: IconicPackId, options: ApplyIconicPackOptions = {}): Theme {
  const pack = IconicPackRecipes[packId];
  if (!pack) {
    throw new Error(`Unknown iconic pack: ${packId}`);
  }

  const variant = options.variant ?? 'dark';
  const presetId = pack.variantMatrix?.[variant] ?? pack.basePresetId;
  const baseTheme = PresetThemeById[presetId];

  if (!baseTheme) {
    throw new Error(`Unknown base preset for iconic pack ${packId}: ${presetId}`);
  }

  const themed = cloneTheme(baseTheme);
  themed.metadata.tags = [...new Set([...(themed.metadata.tags ?? []), 'iconic-pack', packId, variant])];

  if (options.appArchetype) {
    const adaptation = pack.adaptationDefaults[options.appArchetype];
    if (adaptation) {
      themed.adaptation = {
        ...(themed.adaptation ?? {}),
        ...cloneValue(adaptation)
      };
    }
  }

  const eligibleExpansionPacks = options.expansionPacks?.filter(expansionPackId =>
    pack.allowedExpansionPacks.includes(expansionPackId)
  ) ?? [];

  return eligibleExpansionPacks.reduce((acc, expansionPackId) => applyExpansionPack(acc, expansionPackId), themed);
}
