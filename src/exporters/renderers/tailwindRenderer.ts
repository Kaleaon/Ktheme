import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';
import { WebExporterOptions } from '../web/types';

export interface TailwindConfigExport {
  darkMode?: 'class' | 'media';
  theme: {
    extend: {
      colors: Record<string, string>;
      boxShadow?: Record<string, string>;
      backgroundImage?: Record<string, string>;
      backdropBlur?: Record<string, string>;
      animation?: Record<string, string>;
      fontFamily?: Record<string, string | string[]>;
      fontSize?: Record<string, string>;
      fontWeight?: Record<string, string>;
      lineHeight?: Record<string, string>;
      letterSpacing?: Record<string, string>;
      borderRadius?: Record<string, string>;
      typography?: Record<string, unknown>;
      effects?: Record<string, unknown>;
      adaptation?: Record<string, unknown>;
      [key: string]: unknown;
    };
  };
}

export class TailwindRenderer implements TokenRenderer<TailwindConfigExport> {
  readonly id = 'tailwind';
  readonly name = 'Tailwind CSS Exporter';

  render(tokens: NormalizedThemeTokens, options?: WebExporterOptions): TailwindConfigExport {
    const resolvedOptions: WebExporterOptions = {
      includeEffects: true,
      includeTypography: true,
      includeCorners: true,
      ...options
    };

    const colors: Record<string, string> = {
      primary: tokens.color.primary,
      background: tokens.color.background,
      surface: tokens.color.surface,
      error: tokens.color.error,
      success: tokens.color.semantic.success,
      warning: tokens.color.semantic.warning,
      info: tokens.color.semantic.info,
      critical: tokens.color.semantic.critical
    };

    const extend: TailwindConfigExport['theme']['extend'] = {
      colors,
      typography: tokens.typography as unknown as Record<string, unknown>,
      effects: tokens.effects as unknown as Record<string, unknown>,
      adaptation: tokens.adaptation as unknown as Record<string, unknown>
    };

    if (resolvedOptions.includeEffects) {
      colors['metallic-base'] = tokens.effects.metallic.gradient.base;
      colors['metallic-highlight'] = tokens.effects.metallic.gradient.highlight;
      colors['metallic-shadow'] = tokens.effects.metallic.gradient.shadow;
      colors['metallic-shimmer'] = tokens.effects.metallic.gradient.shimmer;
      colors['shimmer'] = tokens.effects.metallic.gradient.shimmer;
      colors['glow'] = tokens.effects.focusRing.color;

      extend.boxShadow = {
        glow: `0 0 ${tokens.effects.shadows.blur}px ${tokens.effects.shadows.color}`,
        elevation: `0 ${tokens.effects.shadows.elevation}px ${tokens.effects.shadows.blur}px ${tokens.effects.shadows.color}`
      };
      extend.backgroundImage = {
        metallic: `linear-gradient(135deg, ${tokens.effects.metallic.gradient.shadow} 0%, ${tokens.effects.metallic.gradient.base} 25%, ${tokens.effects.metallic.gradient.highlight} 50%, ${tokens.effects.metallic.gradient.base} 75%, ${tokens.effects.metallic.gradient.shadow} 100%)`
      };
      extend.backdropBlur = {
        glass: tokens.effects.blur.enabled ? `${tokens.effects.blur.radius}px` : '0px'
      };
      extend.animation = {
        shimmer: `shimmer ${tokens.effects.shimmer.enabled ? tokens.effects.shimmer.speed : 0}s linear infinite`
      };
    }

    if (resolvedOptions.includeTypography) {
      extend.fontFamily = {
        sans: tokens.typography.fontFamily,
        primary: tokens.typography.fontFamily
      };
      extend.fontSize = {
        small: `${tokens.typography.fontSize.small}px`,
        medium: `${tokens.typography.fontSize.medium}px`,
        large: `${tokens.typography.fontSize.large}px`,
        xlarge: `${tokens.typography.fontSize.xlarge}px`
      };
      extend.fontWeight = {
        light: String(tokens.typography.fontWeight.light),
        regular: String(tokens.typography.fontWeight.regular),
        medium: String(tokens.typography.fontWeight.medium),
        bold: String(tokens.typography.fontWeight.bold)
      };
      extend.lineHeight = {
        normal: String(tokens.typography.lineHeight)
      };
      extend.letterSpacing = {
        normal: `${tokens.typography.letterSpacing}em`
      };
    }

    if (resolvedOptions.includeCorners) {
      extend.borderRadius = {
        small: `${tokens.layout.corners.small}px`,
        medium: `${tokens.layout.corners.medium}px`,
        large: `${tokens.layout.corners.large}px`,
        xlarge: `${tokens.layout.corners.xlarge}px`
      };
    }

    return {
      darkMode: tokens.darkMode ? 'class' : 'media',
      theme: {
        extend
      }
    };
  }
}

export const tailwindRenderer = new TailwindRenderer();
