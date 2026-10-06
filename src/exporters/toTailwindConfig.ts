import { Theme } from '../core/types';
import { toHexColor } from './utils';
import { extractThemeTokens } from './ir/extractIR';
import { tailwindRenderer, TailwindConfigExport } from './renderers/tailwindRenderer';
import { exportEffectVars, exportTypographyVars, exportCornerVars, WebExporterOptions } from './web';

export type { TailwindConfigExport };

export function toTailwindConfig(theme: Theme, options?: WebExporterOptions): TailwindConfigExport {
  if (options === undefined) {
    const ir = extractThemeTokens(theme);
    return tailwindRenderer.render(ir);
  }

  const cs = theme.colorScheme;
  const extend: Record<string, any> = {
    colors: {
      primary: toHexColor(cs.primary),
      background: toHexColor(cs.background),
      surface: toHexColor(cs.surface),
      error: toHexColor(cs.error),
      success: toHexColor(cs.semanticRoles?.success ?? cs.secondary),
      warning: toHexColor(cs.semanticRoles?.warning ?? cs.tertiary),
      info: toHexColor(cs.semanticRoles?.info ?? cs.primaryContainer),
      critical: toHexColor(cs.semanticRoles?.critical ?? cs.error)
    }
  };

  if (options.includeEffects !== false) {
    const effects = exportEffectVars(theme, options);
    Object.assign(extend.colors, effects.tailwind.colors || {});
    if (effects.tailwind.boxShadow && Object.keys(effects.tailwind.boxShadow).length > 0) {
      extend.boxShadow = effects.tailwind.boxShadow;
    }
  }

  if (options.includeTypography !== false) {
    const typography = exportTypographyVars(theme, options);
    if (typography.tailwind.fontFamily && Object.keys(typography.tailwind.fontFamily).length > 0) {
      extend.fontFamily = typography.tailwind.fontFamily;
    }
    if (typography.tailwind.fontSize && Object.keys(typography.tailwind.fontSize).length > 0) {
      extend.fontSize = typography.tailwind.fontSize;
    }
  }

  if (options.includeCorners !== false) {
    const corners = exportCornerVars(theme, options);
    if (corners.tailwind.borderRadius && Object.keys(corners.tailwind.borderRadius).length > 0) {
      extend.borderRadius = corners.tailwind.borderRadius;
    }
  }

  return {
    theme: {
      extend: extend as TailwindConfigExport['theme']['extend']
    }
  };
}
