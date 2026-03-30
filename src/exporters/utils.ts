import { Color, Theme } from '../core/types';
import { normalizeColor, rgbToHex } from '../utils/colors';

export function toHexColor(color: Color): string {
  if (typeof color === 'string') {
    return color.toUpperCase();
  }

  return rgbToHex(normalizeColor(color)).toUpperCase();
}

export function normalizeSemanticRoles(theme: Theme): {
  success: string;
  warning: string;
  info: string;
  critical: string;
} {
  const roles = theme.colorScheme.semanticRoles;

  return {
    success: toHexColor(roles?.success ?? theme.colorScheme.secondary),
    warning: toHexColor(roles?.warning ?? theme.colorScheme.tertiary),
    info: toHexColor(roles?.info ?? theme.colorScheme.primaryContainer),
    critical: toHexColor(roles?.critical ?? theme.colorScheme.error)
  };
}
