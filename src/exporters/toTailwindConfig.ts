import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';
import {
  TailwindConfigOptions,
  exportEffectVars,
  exportTypographyVars,
  exportCornerVars
} from './web';

export interface TailwindConfigExport {
  darkMode: 'class' | 'media';
  theme: {
    extend: {
      colors: Record<string, string>;
      fontFamily?: Record<string, string | string[]>;
      fontSize?: Record<string, string>;
      fontWeight?: Record<string, string>;
      lineHeight?: Record<string, string>;
      letterSpacing?: Record<string, string>;
      borderRadius?: Record<string, string>;
      boxShadow?: Record<string, string>;
      backgroundImage?: Record<string, string>;
      backdropBlur?: Record<string, string>;
      [key: string]: unknown;
    };
  };
}

export function toTailwindConfig(
  theme: Theme,
  options?: TailwindConfigOptions
): TailwindConfigExport {
  const resolvedOptions: TailwindConfigOptions = {
    includeEffects: true,
    includeTypography: true,
    includeCorners: true,
    ...options
  };

  const semantic = normalizeSemanticRoles(theme);

  const colors: Record<string, string> = {
    primary: toHexColor(theme.colorScheme.primary),
    background: toHexColor(theme.colorScheme.background),
    surface: toHexColor(theme.colorScheme.surface),
    error: toHexColor(theme.colorScheme.error),
    success: semantic.success,
    warning: semantic.warning,
    info: semantic.info,
    critical: semantic.critical
  };

  const extend: TailwindConfigExport['theme']['extend'] = {
    colors
  };

  if (resolvedOptions.includeEffects) {
    const effectsResult = exportEffectVars(theme, resolvedOptions);
    if (effectsResult.tailwind.colors) {
      Object.assign(colors, effectsResult.tailwind.colors);
    }
    if (effectsResult.tailwind.boxShadow) {
      extend.boxShadow = effectsResult.tailwind.boxShadow;
    }
    if (effectsResult.tailwind.backgroundImage) {
      extend.backgroundImage = effectsResult.tailwind.backgroundImage;
    }
    if (effectsResult.tailwind.backdropBlur) {
      extend.backdropBlur = effectsResult.tailwind.backdropBlur;
    }
  }

  if (resolvedOptions.includeTypography) {
    const typographyResult = exportTypographyVars(theme, resolvedOptions);
    if (typographyResult.tailwind.fontFamily) {
      extend.fontFamily = typographyResult.tailwind.fontFamily;
    }
    if (typographyResult.tailwind.fontSize) {
      extend.fontSize = typographyResult.tailwind.fontSize;
    }
    if (typographyResult.tailwind.fontWeight) {
      extend.fontWeight = typographyResult.tailwind.fontWeight;
    }
    if (typographyResult.tailwind.lineHeight) {
      extend.lineHeight = typographyResult.tailwind.lineHeight;
    }
    if (typographyResult.tailwind.letterSpacing) {
      extend.letterSpacing = typographyResult.tailwind.letterSpacing;
    }
  }

  if (resolvedOptions.includeCorners) {
    const cornersResult = exportCornerVars(theme, resolvedOptions);
    if (cornersResult.tailwind.borderRadius) {
      extend.borderRadius = cornersResult.tailwind.borderRadius;
    }
  }

  return {
    darkMode: theme.darkMode ? 'class' : 'media',
    theme: {
      extend
    }
  };
}
