import { Theme } from '../core/types';
import {
  normalizeAdaptation,
  normalizeBlur,
  normalizeCorners,
  normalizeEffects,
  normalizeSemanticRoles,
  normalizeShadows,
  normalizeShimmer,
  normalizeTypography,
  toHexColor
} from './utils';

export interface TailwindConfigExport {
  darkMode: 'class' | 'media';
  theme: {
    extend: {
      colors: Record<string, string>;
      borderRadius: Record<string, string>;
      fontFamily: Record<string, string | string[]>;
      fontSize: Record<string, string>;
      fontWeight: Record<string, string>;
      lineHeight: Record<string, string>;
      letterSpacing: Record<string, string>;
      boxShadow: Record<string, string>;
      backdropBlur: Record<string, string>;
      animation: Record<string, string>;
      typography?: Record<string, unknown>;
      effects?: Record<string, unknown>;
      adaptation?: Record<string, unknown>;
    };
  };
}

export function toTailwindConfig(theme: Theme): TailwindConfigExport {
  const semantic = normalizeSemanticRoles(theme);
  const blur = normalizeBlur(theme);
  const shadows = normalizeShadows(theme);
  const shimmer = normalizeShimmer(theme);
  const typography = normalizeTypography(theme);
  const corners = normalizeCorners(theme);
  const effects = normalizeEffects(theme);
  const adaptation = normalizeAdaptation(theme);

  return {
    darkMode: theme.darkMode ? 'class' : 'media',
    theme: {
      extend: {
        colors: {
          primary: toHexColor(theme.colorScheme.primary),
          background: toHexColor(theme.colorScheme.background),
          surface: toHexColor(theme.colorScheme.surface),
          error: toHexColor(theme.colorScheme.error),
          success: semantic.success,
          warning: semantic.warning,
          info: semantic.info,
          critical: semantic.critical
        },
        borderRadius: {
          small: `${corners.small}px`,
          medium: `${corners.medium}px`,
          large: `${corners.large}px`,
          xlarge: `${corners.xlarge}px`
        },
        fontFamily: {
          sans: typography.fontFamily,
          primary: typography.fontFamily
        },
        fontSize: {
          small: `${typography.fontSize.small}px`,
          medium: `${typography.fontSize.medium}px`,
          large: `${typography.fontSize.large}px`,
          xlarge: `${typography.fontSize.xlarge}px`
        },
        fontWeight: {
          light: `${typography.fontWeight.light}`,
          regular: `${typography.fontWeight.regular}`,
          medium: `${typography.fontWeight.medium}`,
          bold: `${typography.fontWeight.bold}`
        },
        lineHeight: {
          normal: `${typography.lineHeight}`
        },
        letterSpacing: {
          normal: `${typography.letterSpacing}em`
        },
        boxShadow: {
          glow: `0 0 ${shadows.blur}px ${shadows.color}`,
          elevation: `0 ${shadows.elevation}px ${shadows.blur}px ${shadows.color}`
        },
        backdropBlur: {
          glass: `${blur.radius}px`
        },
        animation: {
          shimmer: `shimmer ${shimmer.speed}s linear infinite`
        },
        typography,
        effects,
        adaptation
      }
    }
  };
}
