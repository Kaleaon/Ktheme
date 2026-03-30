import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

export interface FlutterThemeExport {
  colorScheme: Record<string, string>;
  dart: string;
}

function asFlutterColor(hex: string): string {
  return `Color(0xFF${hex.replace('#', '')})`;
}

export function toFlutterTheme(theme: Theme): FlutterThemeExport {
  const semantic = normalizeSemanticRoles(theme);

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

  const dart = `final kthemeColorScheme = const ColorScheme(\n${Object.entries(colorScheme)
    .map(([key, value]) => `  ${key}: ${asFlutterColor(value)}`)
    .join(',\n')}\n);`;

  return {
    colorScheme,
    dart
  };
}
