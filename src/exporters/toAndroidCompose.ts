import { Theme } from '../core/types';
import { normalizeAdaptation, normalizeEffects, normalizeSemanticRoles, normalizeTypography, toHexColor } from './utils';

export interface AndroidComposeExport {
  colorScheme: Record<string, string>;
  semanticColors: Record<string, string>;
  typography: Record<string, unknown>;
  effects: Record<string, unknown>;
  adaptation: Record<string, unknown>;
  kotlin: string;
}

export interface AndroidComposeOptions {
  packageName?: string;
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

function formatArgbHex(hex: string): string {
  const clean = hex.replace('#', '').trim().toUpperCase();
  if (clean.length === 8) {
    return clean;
  }
  if (clean.length === 6) {
    return `FF${clean}`;
  }
  if (clean.length === 3) {
    const [r, g, b] = clean;
    return `FF${r}${r}${g}${g}${b}${b}`;
  }
  if (clean.length === 4) {
    const [a, r, g, b] = clean;
    return `${a}${a}${r}${r}${g}${g}${b}${b}`;
  }
  return clean.padStart(8, 'F');
}

function asComposeColor(hex: string): string {
  return `Color(0x${formatArgbHex(hex)})`;
}

export function toAndroidCompose(theme: Theme, options?: AndroidComposeOptions): AndroidComposeExport {
  const packageName = options?.packageName ?? 'io.ktheme.compose';
  const semantic = normalizeSemanticRoles(theme);
  const typography = normalizeTypography(theme);
  const effects = normalizeEffects(theme);
  const adaptation = normalizeAdaptation(theme);

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

  const packageHeader = `package ${packageName}\n\nimport androidx.compose.material3.darkColorScheme\nimport androidx.compose.material3.lightColorScheme\nimport androidx.compose.ui.graphics.Color`;

  const colorSchemeFunction = theme.darkMode ? 'darkColorScheme' : 'lightColorScheme';
  const kotlinColorScheme = `val KthemeColorScheme = ${colorSchemeFunction}(\n${Object.entries(colorScheme)
    .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
    .join(',\n')}\n)`;

  const kotlinSemanticColors = `data class KthemeSemanticColors(\n    val success: Color,\n    val warning: Color,\n    val info: Color,\n    val critical: Color\n)\n\nval KthemeSemanticColors = KthemeSemanticColors(\n${Object.entries(semanticColors)
    .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
    .join(',\n')}\n)`;

  const kotlinTypography = `object KthemeTypography {\n    val fontFamily = "${typography.fontFamily}"\n    val fontSizeSmall = ${typography.fontSize.small}.sp\n    val fontSizeMedium = ${typography.fontSize.medium}.sp\n    val fontSizeLarge = ${typography.fontSize.large}.sp\n    val fontSizeXLarge = ${typography.fontSize.xlarge}.sp\n}`;

  const layoutObj = adaptation.layout as Record<string, unknown>;
  const kotlinAdaptation = `object KthemeAdaptation {\n    val density = "${String(layoutObj.density)}"\n    val cornerStyle = "${String(layoutObj.cornerStyle)}"\n}`;

  return {
    colorScheme,
    semanticColors,
    typography,
    effects,
    adaptation,
    kotlin: `${packageHeader}\n\n${kotlinColorScheme}\n\n${kotlinSemanticColors}\n\n${kotlinTypography}\n\n${kotlinAdaptation}`
  };
}
