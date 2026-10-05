import { Theme } from '../core/types';
import { normalizeAdaptation, normalizeEffects, normalizeSemanticRoles, normalizeTypography, toHexColor } from './utils';

export interface FlutterThemeExport {
  colorScheme: Record<string, string>;
  typography: Record<string, unknown>;
  effects: Record<string, unknown>;
  adaptation: Record<string, unknown>;
  dart: string;
}

function asFlutterColor(hex: string): string {
  return `Color(0xFF${hex.replace('#', '')})`;
}

export function toFlutterTheme(theme: Theme): FlutterThemeExport {
  const semantic = normalizeSemanticRoles(theme);
  const typography = normalizeTypography(theme);
  const effects = normalizeEffects(theme);
  const adaptation = normalizeAdaptation(theme);

  const colorScheme: Record<string, string> = {
    primary: toHexColor(theme.colorScheme.primary),
    onPrimary: toHexColor(theme.colorScheme.onPrimary),
    background: toHexColor(theme.colorScheme.background),
    onBackground: toHexColor(theme.colorScheme.onBackground),
    surface: toHexColor(theme.colorScheme.surface),
    onSurface: toHexColor(theme.colorScheme.onSurface),
    error: toHexColor(theme.colorScheme.error),
    success: semantic.success,
    warning: semantic.warning,
    info: semantic.info,
    critical: semantic.critical
  };

  const dartColorScheme = `final kthemeColorScheme = const ColorScheme(\n${Object.entries(colorScheme)
    .map(([key, value]) => `  ${key}: ${asFlutterColor(value)}`)
    .join(',\n')}\n);`;

  const dartTypography = `class KthemeTypography {\n  static const fontFamily = '${typography.fontFamily}';\n  static const fontSizeSmall = ${typography.fontSize.small}.0;\n  static const fontSizeMedium = ${typography.fontSize.medium}.0;\n  static const fontSizeLarge = ${typography.fontSize.large}.0;\n  static const fontSizeXLarge = ${typography.fontSize.xlarge}.0;\n}`;

  const layoutObj = adaptation.layout as Record<string, unknown>;
  const dartAdaptation = `class KthemeAdaptation {\n  static const density = '${String(layoutObj.density)}';\n  static const cornerStyle = '${String(layoutObj.cornerStyle)}';\n}`;

  const dart = `${dartColorScheme}\n\n${dartTypography}\n\n${dartAdaptation}`;

  return {
    colorScheme,
    typography,
    effects,
    adaptation,
    dart
  };
}
