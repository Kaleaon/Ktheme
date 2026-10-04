import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { cssVarsRenderer, CssVarsExport } from './renderers/cssVarsRenderer';
import { WebExporterOptions } from './web/types';

export type { CssVarsExport };

export function toCssVars(theme: Theme, options?: WebExporterOptions): CssVarsExport {
  const ir = extractThemeTokens(theme);
  return cssVarsRenderer.render(ir, options);
}
