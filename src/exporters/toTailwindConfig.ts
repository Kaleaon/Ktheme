import { Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import { tailwindRenderer, TailwindConfigExport } from './renderers/tailwindRenderer';
import { TailwindConfigOptions } from './web/types';

export type { TailwindConfigExport, TailwindConfigOptions };

export function toTailwindConfig(theme: Theme, options?: TailwindConfigOptions): TailwindConfigExport {
  const ir = extractThemeTokens(theme);
  const base = tailwindRenderer.render(ir, options);

  const colors: Record<string, string> = { ...base.theme.extend.colors };
  let boxShadow: Record<string, string> | undefined = base.theme.extend.boxShadow ? { ...base.theme.extend.boxShadow } : undefined;
  let backgroundImage: Record<string, string> | undefined = base.theme.extend.backgroundImage ? { ...base.theme.extend.backgroundImage } : undefined;
  let backdropBlur: Record<string, string> | undefined = base.theme.extend.backdropBlur ? { ...base.theme.extend.backdropBlur } : undefined;
  let animation: Record<string, string> | undefined = base.theme.extend.animation ? { ...base.theme.extend.animation } : undefined;
  let fontFamily: Record<string, string | string[]> | undefined = base.theme.extend.fontFamily ? { ...base.theme.extend.fontFamily } : undefined;
  let fontSize: Record<string, string> | undefined = base.theme.extend.fontSize ? { ...base.theme.extend.fontSize } : undefined;
  let fontWeight: Record<string, string> | undefined = base.theme.extend.fontWeight ? { ...base.theme.extend.fontWeight } : undefined;
  let lineHeight: Record<string, string> | undefined = base.theme.extend.lineHeight ? { ...base.theme.extend.lineHeight } : undefined;
  let letterSpacing: Record<string, string> | undefined = base.theme.extend.letterSpacing ? { ...base.theme.extend.letterSpacing } : undefined;
  let borderRadius: Record<string, string> | undefined = base.theme.extend.borderRadius ? { ...base.theme.extend.borderRadius } : undefined;

  if (options?.includeEffects === false) {
    delete colors['metallic-base'];
    delete colors['metallic-highlight'];
    delete colors['metallic-shadow'];
    delete colors['metallic-shimmer'];
    delete colors['shimmer'];
    delete colors['glow'];
    boxShadow = undefined;
    backgroundImage = undefined;
    backdropBlur = undefined;
    animation = undefined;
  }

  if (options?.includeTypography === false) {
    fontFamily = undefined;
    fontSize = undefined;
    fontWeight = undefined;
    lineHeight = undefined;
    letterSpacing = undefined;
  }

  if (options?.includeCorners === false) {
    borderRadius = undefined;
  }

  return {
    darkMode: base.darkMode,
    theme: {
      extend: {
        colors,
        ...(boxShadow ? { boxShadow } : {}),
        ...(backgroundImage ? { backgroundImage } : {}),
        ...(backdropBlur ? { backdropBlur } : {}),
        ...(animation ? { animation } : {}),
        ...(fontFamily ? { fontFamily } : {}),
        ...(fontSize ? { fontSize } : {}),
        ...(fontWeight ? { fontWeight } : {}),
        ...(lineHeight ? { lineHeight } : {}),
        ...(letterSpacing ? { letterSpacing } : {}),
        ...(borderRadius ? { borderRadius } : {}),
        ...(base.theme.extend.typography ? { typography: base.theme.extend.typography } : {}),
        ...(base.theme.extend.effects ? { effects: base.theme.extend.effects } : {}),
        ...(base.theme.extend.adaptation ? { adaptation: base.theme.extend.adaptation } : {})
      }
    }
  };
}
