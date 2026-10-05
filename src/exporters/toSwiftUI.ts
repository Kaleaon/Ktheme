import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { swiftUIRenderer, SwiftUIExport } from './renderers/swiftUIRenderer';

export type { SwiftUIExport };

export function toSwiftUI(theme: Theme): SwiftUIExport {
  const ir = extractThemeTokens(theme);
  return swiftUIRenderer.render(ir);
}
