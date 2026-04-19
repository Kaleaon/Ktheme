import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

export interface AndroidComposeExport {
  colorScheme: Record<string, string>;
  semanticColors: Record<string, string>;
  kotlin: string;
}

const MATERIAL3_COLOR_SCHEME_KEYS = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary'
] as const;

function asComposeColor(hex: string): string {
  return `Color(0xFF${hex.replace('#', '')})`;
}

export function toAndroidCompose(theme: Theme): AndroidComposeExport {
  const semantic = normalizeSemanticRoles(theme);

  const colorScheme = MATERIAL3_COLOR_SCHEME_KEYS.reduce<Record<string, string>>((acc, key) => {
    acc[key] = toHexColor(theme.colorScheme[key]);
    return acc;
  }, {});

  const semanticColors: Record<string, string> = {
    success: semantic.success,
    warning: semantic.warning,
    info: semantic.info,
    critical: semantic.critical
  };

  const colorSchemeFunction = theme.darkMode ? 'darkColorScheme' : 'lightColorScheme';
  const kotlinColorScheme = `val KthemeColorScheme = ${colorSchemeFunction}(\n${Object.entries(colorScheme)
    .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
    .join(',\n')}\n)`;

  const kotlinSemanticColors = `data class KthemeSemanticColors(\n    val success: Color,\n    val warning: Color,\n    val info: Color,\n    val critical: Color\n)\n\nval KthemeSemanticColors = KthemeSemanticColors(\n${Object.entries(semanticColors)
    .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
    .join(',\n')}\n)`;

  return {
    colorScheme,
    semanticColors,
    kotlin: `${kotlinColorScheme}\n\n${kotlinSemanticColors}`
  };
}
