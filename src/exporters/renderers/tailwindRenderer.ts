import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';

export interface TailwindConfigExport {
  darkMode?: 'class' | 'media';
  theme: {
    extend: {
      colors: Record<string, string>;
      typography?: Record<string, unknown>;
      effects?: Record<string, unknown>;
      adaptation?: Record<string, unknown>;
      fontFamily?: Record<string, any>;
      fontSize?: Record<string, string>;
      boxShadow?: Record<string, string>;
      borderRadius?: Record<string, string>;
    };
  };
}

export class TailwindRenderer implements TokenRenderer<TailwindConfigExport> {
  readonly id = 'tailwind';
  readonly name = 'Tailwind CSS Exporter';

  render(tokens: NormalizedThemeTokens): TailwindConfigExport {
    return {
      darkMode: tokens.darkMode ? 'class' : 'media',
      theme: {
        extend: {
          colors: {
            primary: tokens.color.primary,
            background: tokens.color.background,
            surface: tokens.color.surface,
            error: tokens.color.error,
            success: tokens.color.semantic.success,
            warning: tokens.color.semantic.warning,
            info: tokens.color.semantic.info,
            critical: tokens.color.semantic.critical
          },
          fontFamily: {
            sans: [tokens.typography.fontFamily]
          },
          borderRadius: {
            sm: `${tokens.layout.corners.small}px`,
            DEFAULT: `${tokens.layout.corners.medium}px`,
            lg: `${tokens.layout.corners.large}px`,
            xl: `${tokens.layout.corners.xlarge}px`
          },
          typography: tokens.typography as unknown as Record<string, unknown>,
          effects: tokens.effects as unknown as Record<string, unknown>,
          adaptation: tokens.adaptation as unknown as Record<string, unknown>
        }
      }
    };
  }
}

export const tailwindRenderer = new TailwindRenderer();
