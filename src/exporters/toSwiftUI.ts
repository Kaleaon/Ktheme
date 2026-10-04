import { Theme } from '../core/types';
import { normalizeAdaptation, normalizeEffects, normalizeSemanticRoles, normalizeTypography, toHexColor } from './utils';

export interface SwiftUIExport {
  colors: Record<string, string>;
  typography: Record<string, unknown>;
  effects: Record<string, unknown>;
  adaptation: Record<string, unknown>;
  swift: string;
}

function asSwiftColor(hex: string): string {
  return `Color(hex: "${hex}")`;
}

export function toSwiftUI(theme: Theme): SwiftUIExport {
  const semantic = normalizeSemanticRoles(theme);
  const typography = normalizeTypography(theme);
  const effects = normalizeEffects(theme);
  const adaptation = normalizeAdaptation(theme);

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

  const swiftPalette = `struct KthemePalette {\n${Object.entries(colors)
    .map(([key, value]) => `    let ${key} = ${asSwiftColor(value)}`)
    .join('\n')}\n}`;

  const swiftTypography = `struct KthemeTypography {\n    let fontFamily = "${typography.fontFamily}"\n    let fontSizeSmall: CGFloat = ${typography.fontSize.small}\n    let fontSizeMedium: CGFloat = ${typography.fontSize.medium}\n    let fontSizeLarge: CGFloat = ${typography.fontSize.large}\n    let fontSizeXLarge: CGFloat = ${typography.fontSize.xlarge}\n}`;

  const layoutObj = adaptation.layout as Record<string, unknown>;
  const swiftAdaptation = `struct KthemeAdaptation {\n    let density = "${String(layoutObj.density)}"\n    let cornerStyle = "${String(layoutObj.cornerStyle)}"\n}`;

  const swift = `${swiftPalette}\n\n${swiftTypography}\n\n${swiftAdaptation}`;

  return {
    colors,
    typography,
    effects,
    adaptation,
    swift
  };
}
