import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { designTokensRenderer, DesignTokensJsonExport } from './renderers/designTokensRenderer';

export type { DesignTokensJsonExport };

export function toDesignTokensJson(theme: Theme): DesignTokensJsonExport {
  const ir = extractThemeTokens(theme);
  return designTokensRenderer.render(ir);
}
