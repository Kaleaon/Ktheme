import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { androidComposeRenderer, AndroidComposeExport, AndroidComposeOptions } from './renderers/androidComposeRenderer';

export type { AndroidComposeExport, AndroidComposeOptions };

export function toAndroidCompose(theme: Theme, options?: AndroidComposeOptions): AndroidComposeExport {
  const ir = extractThemeTokens(theme);
  return androidComposeRenderer.render(ir, options);
}
