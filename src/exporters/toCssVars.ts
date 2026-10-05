import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { cssVarsRenderer, CssVarsExport } from './renderers/cssVarsRenderer';

export type { CssVarsExport };

export function toCssVars(theme: Theme): CssVarsExport {
  const ir = extractThemeTokens(theme);
  return cssVarsRenderer.render(ir);
}
