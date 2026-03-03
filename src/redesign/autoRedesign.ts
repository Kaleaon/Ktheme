import { ThemeEngine } from '../core/ThemeEngine';
import { Theme, ThemeAdaptation } from '../core/types';
import { contrastRatio } from '../utils/colors';
import { AdaptationPresets } from '../themes/adaptationPresets';
import { applyExpansionPack } from '../themes/expansion';
import { PresetThemes } from '../themes/presets';
import { createThemeFromFamily } from '../themes/strategy';

export interface AutoRedesignInput {
  appArchetype?: string;
  targetAestheticFamily?: string;
  constraints?: {
    mode?: 'dark' | 'light';
    minimumContrast?: number;
    reducedMotion?: boolean;
  };
  expansionPackIds?: string[];
  adaptationPresetId?: keyof typeof AdaptationPresets;
}

export interface AutoRedesignReport {
  selectedFamily: string;
  baseThemeId: string;
  baseSelection: 'preset' | 'family' | 'fallback';
  packsApplied: string[];
  contrastWarnings: string[];
  overriddenTokens: string[];
  fallbackDecisions: string[];
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export interface AutoRedesignResult {
  theme: Theme;
  report: AutoRedesignReport;
}

const aestheticPresetMap: Record<string, Theme> = {
  metro: PresetThemes.WindowsPhoneMetro,
  lcars: PresetThemes.LCARS,
  'art-deco': PresetThemes.NavyGold,
  'art-nouveau': PresetThemes.FrutigerAero,
  frutiger: PresetThemes.FrutigerAero
};

const aestheticFamilyMap: Record<string, string> = {
  'art-deco': 'luxury-dark',
  'art-nouveau': 'nature-organic',
  metro: 'neo-minimal',
  lcars: 'brutalist-ui'
};

const archetypeDefaults: Record<string, { packs: string[]; adaptation?: keyof typeof AdaptationPresets }> = {
  dashboard: { packs: ['data-viz-pack', 'platform-pack'], adaptation: 'windowsPhoneMetro' },
  chat: { packs: ['ai-ui-pack', 'motion-pack'], adaptation: 'frutigerAero' },
  storefront: { packs: ['seasonal-pack', 'widget-skin-pack'], adaptation: 'frutigerAero' }
};

function cloneTheme(theme: Theme): Theme {
  return JSON.parse(JSON.stringify(theme)) as Theme;
}

function mergeAdaptation(base: ThemeAdaptation | undefined, addition: ThemeAdaptation | undefined): ThemeAdaptation | undefined {
  if (!base && !addition) return undefined;

  const merged: ThemeAdaptation = {
    ...base,
    ...addition,
    assets: {
      ...base?.assets,
      ...addition?.assets
    },
    componentOverrides: [...(base?.componentOverrides ?? []), ...(addition?.componentOverrides ?? [])]
  };

  const mergedLayout = addition?.layout ?? base?.layout;
  if (mergedLayout) {
    merged.layout = {
      ...mergedLayout,
      ...addition?.layout
    };
  }

  const mergedIcons = addition?.icons ?? base?.icons;
  if (mergedIcons) {
    merged.icons = {
      ...mergedIcons,
      ...addition?.icons
    };
  }

  return merged;
}

function changedPaths(before: unknown, after: unknown, prefix = ''): string[] {
  if (before === after) return [];
  const beforeObj = before as Record<string, unknown>;
  const afterObj = after as Record<string, unknown>;

  if (
    typeof before !== 'object' || before === null ||
    typeof after !== 'object' || after === null ||
    Array.isArray(before) || Array.isArray(after)
  ) {
    return [prefix || 'root'];
  }

  const keys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);
  return [...keys].flatMap(key => changedPaths(beforeObj[key], afterObj[key], prefix ? `${prefix}.${key}` : key));
}

function resolveBaseTheme(targetAestheticFamily?: string): {
  selectedFamily: string;
  theme: Theme;
  baseSelection: 'preset' | 'family' | 'fallback';
  fallbackDecisions: string[];
} {
  const fallbackDecisions: string[] = [];
  const requested = targetAestheticFamily?.toLowerCase().trim();

  if (requested && aestheticPresetMap[requested]) {
    return {
      selectedFamily: requested,
      theme: cloneTheme(aestheticPresetMap[requested]),
      baseSelection: 'preset',
      fallbackDecisions
    };
  }

  const familyId = requested ? (aestheticFamilyMap[requested] ?? requested) : 'neo-minimal';
  try {
    return {
      selectedFamily: familyId,
      theme: createThemeFromFamily(familyId),
      baseSelection: requested ? 'family' : 'fallback',
      fallbackDecisions
    };
  } catch {
    fallbackDecisions.push(`Unknown aesthetic \"${targetAestheticFamily ?? 'undefined'}\". Fell back to PaperInk preset.`);
    return {
      selectedFamily: 'paper-ink',
      theme: cloneTheme(PresetThemes.PaperInk),
      baseSelection: 'fallback',
      fallbackDecisions
    };
  }
}

function applyConstraints(theme: Theme, constraints: AutoRedesignInput['constraints']): Theme {
  if (!constraints) return theme;

  const constrained = cloneTheme(theme);

  if (constraints.mode) {
    constrained.darkMode = constraints.mode === 'dark';
  }

  if (constraints.reducedMotion) {
    if (constrained.effects?.shimmer) {
      constrained.effects.shimmer.enabled = false;
    }
    if (constrained.effects?.animations) {
      constrained.effects.animations.enabled = false;
      constrained.effects.animations.reducedMotionPolicy = 'disable';
    }
    if (constrained.effects?.transitions) {
      constrained.effects.transitions.duration = Math.min(constrained.effects.transitions.duration, 90);
    }
  }

  if (constraints.minimumContrast !== undefined) {
    constrained.accessibility = {
      ...constrained.accessibility,
      minimumContrastRatio: constraints.minimumContrast
    };
  }

  return constrained;
}

export function autoRedesign(input: AutoRedesignInput): AutoRedesignResult {
  const base = resolveBaseTheme(input.targetAestheticFamily);
  const originalBase = cloneTheme(base.theme);

  const archetype = input.appArchetype?.toLowerCase().trim();
  const defaults = archetype ? archetypeDefaults[archetype] : undefined;
  const packIds = [...new Set([...(defaults?.packs ?? []), ...(input.expansionPackIds ?? [])])];

  let workingTheme = cloneTheme(base.theme);
  const appliedPacks: string[] = [];
  for (const packId of packIds) {
    try {
      workingTheme = applyExpansionPack(workingTheme, packId);
      appliedPacks.push(packId);
    } catch {
      base.fallbackDecisions.push(`Ignored unknown expansion pack \"${packId}\".`);
    }
  }

  const adaptationPresetId = input.adaptationPresetId ?? defaults?.adaptation;
  const adaptationPreset = adaptationPresetId ? AdaptationPresets[adaptationPresetId] : undefined;
  if (adaptationPresetId && !adaptationPreset) {
    base.fallbackDecisions.push(`Unknown adaptation preset \"${adaptationPresetId}\". Kept base adaptation.`);
  }

  workingTheme.adaptation = mergeAdaptation(workingTheme.adaptation, adaptationPreset);
  workingTheme = applyConstraints(workingTheme, input.constraints);

  const engine = new ThemeEngine();
  const validation = engine.validateTheme(workingTheme);

  if (!validation.valid) {
    base.fallbackDecisions.push('Validation failed; fell back to PaperInk preset to satisfy ThemeEngine gate.');
    workingTheme = cloneTheme(PresetThemes.PaperInk);
  }

  const finalValidation = engine.validateTheme(workingTheme);
  const contrastWarnings = finalValidation.warnings.filter(item => item.startsWith('Low contrast'));
  const minContrast = input.constraints?.minimumContrast;

  if (minContrast !== undefined) {
    const pairs: Array<['primary' | 'background' | 'surface' | 'error', 'onPrimary' | 'onBackground' | 'onSurface' | 'onError', string]> = [
      ['primary', 'onPrimary', 'primary/onPrimary'],
      ['background', 'onBackground', 'background/onBackground'],
      ['surface', 'onSurface', 'surface/onSurface'],
      ['error', 'onError', 'error/onError']
    ];

    pairs.forEach(([baseToken, onToken, label]) => {
      const ratio = contrastRatio(workingTheme.colorScheme[baseToken], workingTheme.colorScheme[onToken]);
      if (ratio < minContrast) {
        contrastWarnings.push(`Below minimum contrast for ${label}: ${ratio.toFixed(2)} (< ${minContrast})`);
      }
    });
  }

  return {
    theme: workingTheme,
    report: {
      selectedFamily: base.selectedFamily,
      baseThemeId: workingTheme.metadata.id,
      baseSelection: base.baseSelection,
      packsApplied: appliedPacks,
      contrastWarnings,
      overriddenTokens: changedPaths(originalBase, workingTheme),
      fallbackDecisions: base.fallbackDecisions,
      validation: finalValidation
    }
  };
}
