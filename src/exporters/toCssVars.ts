import { Theme } from '../core/types';
import { toHexColor } from './utils';
import { extractThemeTokens } from './ir/extractIR';
import { cssVarsRenderer, CssVarsExport } from './renderers/cssVarsRenderer';
import { exportEffectVars, exportTypographyVars, exportCornerVars, WebExporterOptions } from './web';

export type { CssVarsExport };

export function toCssVars(theme: Theme, options?: WebExporterOptions): CssVarsExport {
  if (options === undefined) {
    const ir = extractThemeTokens(theme);
    return cssVarsRenderer.render(ir);
  }

  const cs = theme.colorScheme;
  const vars: Record<string, string> = {
    '--ktheme-primary': toHexColor(cs.primary),
    '--ktheme-on-primary': toHexColor(cs.onPrimary),
    '--ktheme-background': toHexColor(cs.background),
    '--ktheme-on-background': toHexColor(cs.onBackground),
    '--ktheme-surface': toHexColor(cs.surface),
    '--ktheme-on-surface': toHexColor(cs.onSurface),
    '--ktheme-error': toHexColor(cs.error),
    '--ktheme-semantic-success': toHexColor(cs.semanticRoles?.success ?? cs.secondary),
    '--ktheme-semantic-warning': toHexColor(cs.semanticRoles?.warning ?? cs.tertiary),
    '--ktheme-semantic-info': toHexColor(cs.semanticRoles?.info ?? cs.primaryContainer),
    '--ktheme-semantic-critical': toHexColor(cs.semanticRoles?.critical ?? cs.error)
  };

  if (options.includeEffects !== false) {
    Object.assign(vars, exportEffectVars(theme, options).vars);
  }
  if (options.includeTypography !== false) {
    Object.assign(vars, exportTypographyVars(theme, options).vars);
  }
  if (options.includeCorners !== false) {
    Object.assign(vars, exportCornerVars(theme, options).vars);
  }

  const cssBody = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return {
    vars,
    cssText: `:root {\n${cssBody}\n}`
  };
}
