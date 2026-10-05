import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { tailwindRenderer, TailwindConfigExport } from './renderers/tailwindRenderer';

export type { TailwindConfigExport };

export function toTailwindConfig(theme: Theme): TailwindConfigExport {
  const ir = extractThemeTokens(theme);
  return tailwindRenderer.render(ir);
}
