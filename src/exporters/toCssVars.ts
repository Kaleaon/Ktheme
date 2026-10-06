import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { cssVarsRenderer, CssVarsExport } from './renderers/cssVarsRenderer';
import { CssVarsOptions } from './web/types';

export type { CssVarsExport, CssVarsOptions };

export function toCssVars(theme: Theme, options?: CssVarsOptions): CssVarsExport {
  const ir = extractThemeTokens(theme);
  return cssVarsRenderer.render(ir, options);
}
