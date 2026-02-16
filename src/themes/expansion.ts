import { Theme } from '../core/types';
import { darken, lighten, mix, opacity } from '../utils/colors';
import { ExpansionPackPlans } from './strategy';

export interface ExpansionPackImplementation {
  id: string;
  name: string;
  summary: string;
  apply: (theme: Theme) => Theme;
}

function cloneTheme(theme: Theme): Theme {
  return JSON.parse(JSON.stringify(theme)) as Theme;
}


function ensureSemanticRoles(theme: Theme): NonNullable<Theme['colorScheme']['semanticRoles']> {
  const existing = theme.colorScheme.semanticRoles;
  return {
    success: existing?.success ?? '#1B7F47',
    onSuccess: existing?.onSuccess ?? '#FFFFFF',
    successContainer: existing?.successContainer,
    onSuccessContainer: existing?.onSuccessContainer,
    warning: existing?.warning ?? '#A66200',
    onWarning: existing?.onWarning ?? '#FFFFFF',
    warningContainer: existing?.warningContainer,
    onWarningContainer: existing?.onWarningContainer,
    info: existing?.info ?? '#1A73E8',
    onInfo: existing?.onInfo ?? '#FFFFFF',
    infoContainer: existing?.infoContainer,
    onInfoContainer: existing?.onInfoContainer,
    critical: existing?.critical,
    onCritical: existing?.onCritical
  };
}

function appendMetadataLabel(name: string, label: string): string {
  const suffix = ` · ${label}`;
  return name.endsWith(suffix) ? name : `${name}${suffix}`;
}

function baseExpansion(theme: Theme, id: string, label: string): Theme {
  const next = cloneTheme(theme);
  next.metadata.tags = [...new Set([...(next.metadata.tags ?? []), 'expansion-pack', id])];
  next.metadata.name = appendMetadataLabel(next.metadata.name, label);
  next.metadata.updatedAt = new Date().toISOString();
  return next;
}

export const ExpansionPackImplementations: ExpansionPackImplementation[] = [
  {
    id: 'domain-packs',
    name: 'Domain Packs',
    summary: 'Adds finance-grade semantic roles and denser operational layouts.',
    apply: theme => {
      const next = baseExpansion(theme, 'domain-packs', 'Domain');
      next.colorScheme.semanticRoles = {
        ...ensureSemanticRoles(next),
        success: '#117A45',
        onSuccess: '#FFFFFF',
        successContainer: '#D7F7E6',
        onSuccessContainer: '#002111',
        warning: '#A05A00',
        onWarning: '#FFFFFF',
        warningContainer: '#FFE3BF',
        onWarningContainer: '#2F1600',
        info: next.colorScheme.primary,
        onInfo: next.colorScheme.onPrimary
      };
      next.adaptation = {
        ...next.adaptation,
        layout: {
          density: 'compact',
          cornerStyle: 'rounded',
          spacingScale: 0.95,
          panelStyle: 'elevated',
          navigationStyle: 'rail'
        }
      };
      return next;
    }
  },
  {
    id: 'localization-pack',
    name: 'Localization Pack',
    summary: 'Introduces script-aware type defaults and direction-safe overrides.',
    apply: theme => {
      const next = baseExpansion(theme, 'localization-pack', 'Localization');
      next.typography = {
        ...(next.typography ?? {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { small: 12, medium: 14, large: 18, xlarge: 24 },
          fontWeight: { light: 300, regular: 400, medium: 500, bold: 700 },
          lineHeight: 1.5,
          letterSpacing: 0
        }),
        fontFamily: 'Inter, Noto Sans, Noto Sans Arabic, Noto Sans CJK, system-ui, sans-serif',
        lineHeight: 1.58
      };
      next.adaptation = {
        ...next.adaptation,
        componentOverrides: [
          ...(next.adaptation?.componentOverrides ?? []),
          { selector: '[dir="rtl"] .layout-flow', styles: { direction: 'rtl' } },
          { selector: '.localized-copy', styles: { 'word-break': 'keep-all', 'line-break': 'strict' } }
        ]
      };
      return next;
    }
  },
  {
    id: 'accessibility-pack',
    name: 'Accessibility Pack',
    summary: 'Improves focus visibility, color contrast, and touch target comfort.',
    apply: theme => {
      const next = baseExpansion(theme, 'accessibility-pack', 'A11y');
      next.colorScheme.onPrimary = '#FFFFFF';
      next.colorScheme.onSecondary = '#FFFFFF';
      next.colorScheme.onTertiary = '#FFFFFF';
      next.effects = {
        ...next.effects,
        focusRing: {
          enabled: true,
          color: mix(next.colorScheme.primary, '#FFFFFF', 0.25),
          width: 3,
          offset: 2
        }
      };
      next.tokens = {
        ...next.tokens,
        density: {
          scale: 1.08,
          baseSpacing: 8
        }
      };
      return next;
    }
  },
  {
    id: 'motion-pack',
    name: 'Motion Pack',
    summary: 'Adds intent-led animation tokens with reduced-motion support.',
    apply: theme => {
      const next = baseExpansion(theme, 'motion-pack', 'Motion');
      next.effects = {
        ...next.effects,
        animations: {
          enabled: true,
          duration: 240,
          easing: 'ease-in-out',
          reducedMotionPolicy: 'reduce'
        },
        transitions: {
          enabled: true,
          duration: 180,
          properties: ['background-color', 'color', 'transform', 'box-shadow']
        }
      };
      return next;
    }
  },
  {
    id: 'data-viz-pack',
    name: 'Data Viz Pack',
    summary: 'Introduces chart-safe semantic series and annotation contrast helpers.',
    apply: theme => {
      const next = baseExpansion(theme, 'data-viz-pack', 'Data Viz');
      next.colorScheme.semanticRoles = {
        ...ensureSemanticRoles(next),
        success: '#1C8E4A',
        onSuccess: '#FFFFFF',
        warning: '#B96A00',
        onWarning: '#FFFFFF',
        info: '#1A73E8',
        onInfo: '#FFFFFF',
        critical: '#D93025',
        onCritical: '#FFFFFF'
      };
      next.effects = {
        ...next.effects,
        overlays: {
          enabled: true,
          color: opacity(next.colorScheme.surface, 0.72),
          opacity: 0.22,
          blendMode: 'overlay'
        }
      };
      return next;
    }
  },
  {
    id: 'email-docs-pack',
    name: 'Email + Docs Pack',
    summary: 'Applies long-form typography and print-safe neutral surfaces.',
    apply: theme => {
      const next = baseExpansion(theme, 'email-docs-pack', 'Email + Docs');
      next.typography = {
        ...(next.typography ?? {
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: { small: 12, medium: 14, large: 18, xlarge: 24 },
          fontWeight: { light: 300, regular: 400, medium: 500, bold: 700 },
          lineHeight: 1.6,
          letterSpacing: 0
        }),
        fontFamily: 'Source Serif 4, Georgia, Times New Roman, serif',
        lineHeight: 1.72,
        letterSpacing: 0.1
      };
      next.colorScheme.surface = lighten(next.colorScheme.surface, 8);
      next.colorScheme.onSurface = darken(next.colorScheme.onSurface, 12);
      return next;
    }
  },
  {
    id: 'seasonal-pack',
    name: 'Seasonal / Campaign Pack',
    summary: 'Layered campaign accents without mutating core brand tokens.',
    apply: theme => {
      const next = baseExpansion(theme, 'seasonal-pack', 'Campaign');
      next.effects = {
        ...next.effects,
        gradients: {
          enabled: true,
          angle: 135,
          stops: [
            { offset: 0, color: opacity(next.colorScheme.primary, 0.7) },
            { offset: 1, color: opacity(next.colorScheme.tertiary, 0.35) }
          ]
        },
        shimmer: {
          enabled: true,
          speed: 1.6,
          intensity: 0.2,
          angle: 18
        }
      };
      return next;
    }
  },
  {
    id: 'widget-skin-pack',
    name: 'Widget Skin Pack',
    summary: 'Optimizes compact iframe-friendly widgets and host-safe overlays.',
    apply: theme => {
      const next = baseExpansion(theme, 'widget-skin-pack', 'Widget');
      next.tokens = {
        ...next.tokens,
        density: {
          scale: 0.92,
          baseSpacing: 6
        },
        corners: {
          small: 6,
          medium: 10,
          large: 14,
          xlarge: 18
        }
      };
      next.adaptation = {
        ...next.adaptation,
        layout: {
          density: 'compact',
          cornerStyle: 'rounded',
          spacingScale: 0.9,
          panelStyle: 'flat',
          navigationStyle: 'tabs'
        }
      };
      return next;
    }
  },
  {
    id: 'platform-pack',
    name: 'Platform Pack',
    summary: 'Creates cross-surface defaults for web, mobile, and desktop parity.',
    apply: theme => {
      const next = baseExpansion(theme, 'platform-pack', 'Platform');
      next.adaptation = {
        ...next.adaptation,
        assets: {
          ...(next.adaptation?.assets ?? {}),
          fontFamilyOverride: 'Inter, Roboto, Segoe UI, SF Pro Text, system-ui, sans-serif'
        },
        icons: {
          family: 'material',
          style: 'outlined',
          sizeScale: 1,
          strokeWidth: 1.8,
          cornerStyle: 'rounded'
        }
      };
      return next;
    }
  },
  {
    id: 'ai-ui-pack',
    name: 'AI UI Pack',
    summary: 'Adds conversation/status-oriented semantics for assistant interfaces.',
    apply: theme => {
      const next = baseExpansion(theme, 'ai-ui-pack', 'AI UI');
      next.colorScheme.semanticRoles = {
        ...ensureSemanticRoles(next),
        info: '#5B5BD6',
        onInfo: '#FFFFFF',
        critical: '#A81818',
        onCritical: '#FFFFFF'
      };
      next.effects = {
        ...next.effects,
        blur: {
          enabled: true,
          radius: 8
        },
        overlays: {
          enabled: true,
          color: opacity('#6D73FF', 0.25),
          opacity: 0.18,
          blendMode: 'soft-light'
        }
      };
      return next;
    }
  }
];


function assertExpansionPlanCoverage(): void {
  const planIds = new Set(ExpansionPackPlans.map(pack => pack.id));
  const implementationIds = new Set(ExpansionPackImplementations.map(pack => pack.id));

  const missingImplementation = [...planIds].filter(id => !implementationIds.has(id));
  const unknownImplementation = [...implementationIds].filter(id => !planIds.has(id));

  if (missingImplementation.length || unknownImplementation.length) {
    throw new Error(
      `Expansion pack coverage mismatch. Missing: [${missingImplementation.join(', ')}], Unknown: [${unknownImplementation.join(', ')}]`
    );
  }
}

assertExpansionPlanCoverage();

const ExpansionPackMap = new Map(ExpansionPackImplementations.map(pack => [pack.id, pack]));

export function applyExpansionPack(theme: Theme, expansionPackId: string): Theme {
  const pack = ExpansionPackMap.get(expansionPackId);
  if (!pack) {
    throw new Error(`Unknown expansion pack: ${expansionPackId}`);
  }

  return pack.apply(theme);
}

export function applyAllExpansionPacks(theme: Theme): Record<string, Theme> {
  return ExpansionPackPlans.reduce<Record<string, Theme>>((acc, pack) => {
    acc[pack.id] = applyExpansionPack(theme, pack.id);
    return acc;
  }, {});
}
