import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';

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

export class AndroidComposeRenderer implements TokenRenderer<AndroidComposeExport> {
  readonly id = 'android-compose';
  readonly name = 'Android Jetpack Compose Exporter';

  render(tokens: NormalizedThemeTokens, options?: AndroidComposeOptions): AndroidComposeExport {
    const packageName = options?.packageName ?? 'io.ktheme.compose';

    const colorScheme = MATERIAL3_COLOR_SCHEME_KEYS.reduce<Record<string, string>>((acc, key) => {
      acc[key] = tokens.color[key];
      return acc;
    }, {});

    const semanticColors: Record<string, string> = {
      success: tokens.color.semantic.success,
      warning: tokens.color.semantic.warning,
      info: tokens.color.semantic.info,
      critical: tokens.color.semantic.critical
    };

    const packageHeader = `package ${packageName}\n\nimport androidx.compose.material3.darkColorScheme\nimport androidx.compose.material3.lightColorScheme\nimport androidx.compose.ui.graphics.Color`;

    const colorSchemeFunction = tokens.darkMode ? 'darkColorScheme' : 'lightColorScheme';
    const kotlinColorScheme = `val KthemeColorScheme = ${colorSchemeFunction}(\n${Object.entries(colorScheme)
      .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
      .join(',\n')}\n)`;

    const kotlinSemanticColors = `data class KthemeSemanticColors(\n    val success: Color,\n    val warning: Color,\n    val info: Color,\n    val critical: Color\n)\n\nval KthemeSemanticColors = KthemeSemanticColors(\n${Object.entries(semanticColors)
      .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
      .join(',\n')}\n)`;

    const kotlinTypography = `object KthemeTypography {\n    val fontFamily = "${tokens.typography.fontFamily}"\n    val fontSizeSmall = ${tokens.typography.fontSize.small}.sp\n    val fontSizeMedium = ${tokens.typography.fontSize.medium}.sp\n    val fontSizeLarge = ${tokens.typography.fontSize.large}.sp\n    val fontSizeXLarge = ${tokens.typography.fontSize.xlarge}.sp\n}`;

    const kotlinAdaptation = `object KthemeAdaptation {\n    val density = "${tokens.layout.density}"\n    val cornerStyle = "${tokens.layout.cornerStyle}"\n}`;

    return {
      colorScheme,
      semanticColors,
      typography: tokens.typography as unknown as Record<string, unknown>,
      effects: tokens.effects as unknown as Record<string, unknown>,
      adaptation: tokens.adaptation as unknown as Record<string, unknown>,
      kotlin: `${packageHeader}\n\n${kotlinColorScheme}\n\n${kotlinSemanticColors}\n\n${kotlinTypography}\n\n${kotlinAdaptation}`
    };
  }
}

export const androidComposeRenderer = new AndroidComposeRenderer();
