import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { tailwindRenderer, TailwindConfigExport } from './renderers/tailwindRenderer';
import { TailwindConfigOptions } from './web/types';

export type { TailwindConfigExport, TailwindConfigOptions };

export function toTailwindConfig(theme: Theme, options?: TailwindConfigOptions): TailwindConfigExport {
  const ir = extractThemeTokens(theme);
  return tailwindRenderer.render(ir, options);
}


