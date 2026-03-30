import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

export interface SwiftUIExport {
  colors: Record<string, string>;
  swift: string;
}

function asSwiftColor(hex: string): string {
  return `Color(hex: \"${hex}\")`;
}

export function toSwiftUI(theme: Theme): SwiftUIExport {
  const semantic = normalizeSemanticRoles(theme);

  const colors: Record<string, string> = {
    primary: toHexColor(theme.colorScheme.primary),
    background: toHexColor(theme.colorScheme.background),
    surface: toHexColor(theme.colorScheme.surface),
    error: toHexColor(theme.colorScheme.error),
    success: semantic.success,
    warning: semantic.warning,
    info: semantic.info,
    critical: semantic.critical
  };

  const swift = `struct KthemePalette {\n${Object.entries(colors)
    .map(([key, value]) => `    let ${key} = ${asSwiftColor(value)}`)
    .join('\n')}\n}`;

  return {
    colors,
    swift
  };
}
