import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { tailwindRenderer, TailwindConfigExport } from './renderers/tailwindRenderer';
import { WebExporterOptions } from './web/types';

export type { TailwindConfigExport };

export function toTailwindConfig(
  theme: Theme,
  options?: WebExporterOptions
): TailwindConfigExport {
  const ir = extractThemeTokens(theme);
  return tailwindRenderer.render(ir, options);
}
