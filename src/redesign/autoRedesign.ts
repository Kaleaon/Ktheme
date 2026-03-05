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
    screenReaderCompatible?: boolean;
    keyboardOnlyOperable?: boolean;
    minimumTargetSize?: number;
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
  assistiveCompliance: {
    passed: boolean;
    missingFields: string[];
    autoFixesApplied: string[];
  };
}

export interface AutoRedesignError {
  code: 'assistive-compliance-failed';
  message: string;
  missingFields: string[];
  attemptedFixes: string[];
}

export interface AutoRedesignResult {
  theme?: Theme;
  report: AutoRedesignReport;
  error?: AutoRedesignError;
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

  if (constraints.minimumTargetSize !== undefined) {
    constrained.accessibility = {
      ...constrained.accessibility,
      interaction: {
        ...constrained.accessibility?.interaction,
        minimumTargetSize: constraints.minimumTargetSize
      }
    };
  }

  return constrained;
}

function resolveAssistiveConstraints(constraints?: AutoRedesignInput['constraints']): Required<
  Pick<NonNullable<AutoRedesignInput['constraints']>, 'screenReaderCompatible' | 'keyboardOnlyOperable' | 'minimumTargetSize'>
> {
  return {
    screenReaderCompatible: constraints?.screenReaderCompatible ?? true,
    keyboardOnlyOperable: constraints?.keyboardOnlyOperable ?? true,
    minimumTargetSize: constraints?.minimumTargetSize ?? 44
  };
}

function enforceAssistiveCompliance(
  theme: Theme,
  constraints: Required<Pick<NonNullable<AutoRedesignInput['constraints']>, 'screenReaderCompatible' | 'keyboardOnlyOperable' | 'minimumTargetSize'>>
): { theme: Theme; passed: boolean; missingFields: string[]; autoFixesApplied: string[] } {
  const compliantTheme = cloneTheme(theme);
  const autoFixesApplied: string[] = [];
  const missingFields: string[] = [];

  if (constraints.minimumTargetSize < 24) {
    missingFields.push('constraints.minimumTargetSize (must be >= 24)');
  }

  if (!compliantTheme.accessibility) {
    compliantTheme.accessibility = { enabled: true, autoIncludeInGeneratedCSS: true };
    autoFixesApplied.push('Added default accessibility profile.');
  }

  if (compliantTheme.accessibility.enabled !== true) {
    compliantTheme.accessibility.enabled = true;
    autoFixesApplied.push('Enabled accessibility defaults.');
  }

  if (compliantTheme.accessibility.minimumContrastRatio === undefined) {
    compliantTheme.accessibility.minimumContrastRatio = 4.5;
    autoFixesApplied.push('Set accessibility minimumContrastRatio to 4.5.');
  }

  compliantTheme.accessibility.controls = {
    allowContrastToggle: true,
    allowMotionToggle: true,
    allowFontScaleControl: true,
    allowFocusRingToggle: true,
    ...compliantTheme.accessibility.controls
  };

  const interactionMinimumTargetSize = Math.max(
    constraints.minimumTargetSize,
    compliantTheme.accessibility.interaction?.minimumTargetSize ?? constraints.minimumTargetSize
  );

  compliantTheme.accessibility.interaction = {
    focusRingWidth: 2,
    focusRingOffset: 2,
    underlineLinks: true,
    ...compliantTheme.accessibility.interaction,
    minimumTargetSize: interactionMinimumTargetSize
  };

  compliantTheme.effects = compliantTheme.effects ?? {};
  compliantTheme.effects.focusRing = {
    enabled: true,
    color: compliantTheme.colorScheme.primary,
    width: 2,
    offset: 2,
    ...compliantTheme.effects.focusRing
  };

  if (!compliantTheme.adaptation?.layout) {
    compliantTheme.adaptation = {
      ...compliantTheme.adaptation,
      layout: {
        density: 'comfortable',
        cornerStyle: 'rounded',
        spacingScale: 1,
        navigationStyle: 'rail'
      }
    };
    autoFixesApplied.push('Added default layout semantics for assistive compatibility.');
  }

  if (!compliantTheme.adaptation?.icons) {
    compliantTheme.adaptation = {
      ...compliantTheme.adaptation,
      icons: {
        family: 'material',
        style: 'outlined',
        sizeScale: 1,
        strokeWidth: 1.5,
        cornerStyle: 'rounded'
      }
    };
    autoFixesApplied.push('Added default icon semantics for screen reader/keyboard parity.');
  }

  if (constraints.keyboardOnlyOperable && !compliantTheme.effects.focusRing?.enabled) {
    missingFields.push('effects.focusRing.enabled');
  }

  if (constraints.screenReaderCompatible && !compliantTheme.adaptation?.layout?.navigationStyle) {
    missingFields.push('adaptation.layout.navigationStyle');
  }

  if ((compliantTheme.accessibility.interaction?.minimumTargetSize ?? 0) < constraints.minimumTargetSize) {
    missingFields.push('accessibility.interaction.minimumTargetSize');
  }

  return {
    theme: compliantTheme,
    passed: missingFields.length === 0,
    missingFields,
    autoFixesApplied
  };
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

  const assistiveConstraints = resolveAssistiveConstraints(input.constraints);

  workingTheme.adaptation = mergeAdaptation(workingTheme.adaptation, adaptationPreset);
  workingTheme = applyConstraints(workingTheme, input.constraints);
  const assistiveCompliance = enforceAssistiveCompliance(workingTheme, assistiveConstraints);
  workingTheme = assistiveCompliance.theme;

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

  const report: AutoRedesignReport = {
    selectedFamily: base.selectedFamily,
    baseThemeId: workingTheme.metadata.id,
    baseSelection: base.baseSelection,
    packsApplied: appliedPacks,
    contrastWarnings,
    overriddenTokens: changedPaths(originalBase, workingTheme),
    fallbackDecisions: base.fallbackDecisions,
    validation: finalValidation,
    assistiveCompliance: {
      passed: assistiveCompliance.passed,
      missingFields: assistiveCompliance.missingFields,
      autoFixesApplied: assistiveCompliance.autoFixesApplied
    }
  };

  if (!assistiveCompliance.passed) {
    return {
      report,
      error: {
        code: 'assistive-compliance-failed',
        message: 'Unable to produce assistive-compliant redesign output.',
        missingFields: assistiveCompliance.missingFields,
        attemptedFixes: assistiveCompliance.autoFixesApplied
      }
    };
  }

  return {
    theme: workingTheme,
    report
  };
}
