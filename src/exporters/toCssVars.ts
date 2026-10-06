import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { cssVarsRenderer, CssVarsExport } from './renderers/cssVarsRenderer';
import { CssVarsOptions } from './web/types';

export type { CssVarsExport, CssVarsOptions };

export function toCssVars(theme: Theme, options?: CssVarsOptions): CssVarsExport {
  const ir = extractThemeTokens(theme);
  const base = cssVarsRenderer.render(ir, options);
  const vars: Record<string, string> = { ...base.vars };

  if (options?.includeEffects === false) {
    for (const key of Object.keys(vars)) {
      if (
        key.startsWith('--ktheme-effect-') ||
        key.startsWith('--ktheme-effects-') ||
        key.startsWith('--ktheme-glass-') ||
        key.startsWith('--ktheme-metallic-') ||
        key.startsWith('--ktheme-glow-') ||
        key.startsWith('--ktheme-shimmer-')
      ) {
        delete vars[key];
      }
    }
  }

  if (options?.includeTypography === false) {
    for (const key of Object.keys(vars)) {
      if (
        key.startsWith('--ktheme-font-') ||
        key.startsWith('--ktheme-typography-') ||
        key === '--ktheme-line-height' ||
        key === '--ktheme-letter-spacing'
      ) {
        delete vars[key];
      }
    }
  }

  if (options?.includeCorners === false) {
    for (const key of Object.keys(vars)) {
      if (key.startsWith('--ktheme-corner-') || key.startsWith('--ktheme-adaptation-')) {
        delete vars[key];
      }
    }
  }

  const cssBody = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return {
    vars,
    cssText: `:root {\n${cssBody}\n}`
  };
}


