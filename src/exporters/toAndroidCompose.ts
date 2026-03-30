import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

export interface AndroidComposeExport {
  colorScheme: Record<string, string>;
  kotlin: string;
}

function asComposeColor(hex: string): string {
  return `Color(0xFF${hex.replace('#', '')})`;
}

export function toAndroidCompose(theme: Theme): AndroidComposeExport {
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

  const kotlin = `val KthemeColorScheme = darkColorScheme(\n${Object.entries(colorScheme)
    .map(([key, value]) => `    ${key} = ${asComposeColor(value)}`)
    .join(',\n')}\n)`;

  return {
    colorScheme,
    kotlin
  };
}
