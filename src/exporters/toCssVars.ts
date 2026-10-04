import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';
import {
  CssVarsOptions,
  exportEffectVars,
  exportTypographyVars,
  exportCornerVars
} from './web';

export interface CssVarsExport {
  vars: Record<string, string>;
  cssText: string;
}

export function toCssVars(theme: Theme, options?: CssVarsOptions): CssVarsExport {
  const resolvedOptions: CssVarsOptions = {
    includeEffects: true,
    includeTypography: true,
    includeCorners: true,
    ...options
  };

  const semantic = normalizeSemanticRoles(theme);
  const vars: Record<string, string> = {
    '--ktheme-primary': toHexColor(theme.colorScheme.primary),
    '--ktheme-on-primary': toHexColor(theme.colorScheme.onPrimary),
    '--ktheme-background': toHexColor(theme.colorScheme.background),
    '--ktheme-on-background': toHexColor(theme.colorScheme.onBackground),
    '--ktheme-surface': toHexColor(theme.colorScheme.surface),
    '--ktheme-on-surface': toHexColor(theme.colorScheme.onSurface),
    '--ktheme-error': toHexColor(theme.colorScheme.error),
    '--ktheme-semantic-success': semantic.success,
    '--ktheme-semantic-warning': semantic.warning,
    '--ktheme-semantic-info': semantic.info,
    '--ktheme-semantic-critical': semantic.critical
  };

  if (resolvedOptions.includeEffects) {
    Object.assign(vars, exportEffectVars(theme, resolvedOptions).vars);
  }

  if (resolvedOptions.includeTypography) {
    Object.assign(vars, exportTypographyVars(theme, resolvedOptions).vars);
  }

  if (resolvedOptions.includeCorners) {
    Object.assign(vars, exportCornerVars(theme, resolvedOptions).vars);
  }

  const cssBody = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return {
    vars,
    cssText: `:root {\n${cssBody}\n}`
  };
}
