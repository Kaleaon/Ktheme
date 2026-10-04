import { Theme } from '../core/types';
import {
  normalizeBlur,
  normalizeCorners,
  normalizeMetallic,
  normalizeSemanticRoles,
  normalizeShadows,
  normalizeShimmer,
  normalizeTypography,
  toHexColor
} from './utils';

export interface CssVarsExport {
  vars: Record<string, string>;
  cssText: string;
}

export function toCssVars(theme: Theme): CssVarsExport {
  const semantic = normalizeSemanticRoles(theme);
  const blur = normalizeBlur(theme);
  const metallic = normalizeMetallic(theme);
  const shadows = normalizeShadows(theme);
  const shimmer = normalizeShimmer(theme);
  const typography = normalizeTypography(theme);
  const corners = normalizeCorners(theme);

  const vars: Record<string, string> = {
    '--ktheme-primary': toHexColor(theme.colorScheme.primary),
    '--ktheme-on-primary': toHexColor(theme.colorScheme.onPrimary),
    '--ktheme-background': toHexColor(theme.colorScheme.background),
    '--ktheme-on-background': toHexColor(theme.colorScheme.onBackground),
    '--ktheme-surface': toHexColor(theme.colorScheme.surface),
    '--ktheme-on-surface': toHexColor(theme.colorScheme.onSurface),
    '--ktheme-error': toHexColor(theme.colorScheme.error),
    '--ktheme-semantic-success': semantic.success,
    '--ktheme-semantic-warning': semantic.warning,
    '--ktheme-semantic-info': semantic.info,
    '--ktheme-semantic-critical': semantic.critical,

    // Glass effects
    '--ktheme-glass-blur': `${blur.radius}px`,

    // Metallic effects
    '--ktheme-metallic-variant': metallic.variant,
    '--ktheme-metallic-intensity': `${metallic.intensity}`,
    '--ktheme-metallic-base': metallic.base,
    '--ktheme-metallic-highlight': metallic.highlight,
    '--ktheme-metallic-shadow': metallic.shadow,
    '--ktheme-metallic-shimmer': metallic.shimmer,

    // Glow / Shadow effects
    '--ktheme-glow-intensity': `${shadows.elevation}`,
    '--ktheme-glow-blur': `${shadows.blur}px`,
    '--ktheme-glow-color': shadows.color,

    // Shimmer effects
    '--ktheme-shimmer-speed': `${shimmer.speed}s`,
    '--ktheme-shimmer-intensity': `${shimmer.intensity}`,
    '--ktheme-shimmer-angle': `${shimmer.angle}deg`,

    // Typography
    '--ktheme-font-family': typography.fontFamily,
    '--ktheme-font-size-small': `${typography.fontSize.small}px`,
    '--ktheme-font-size-medium': `${typography.fontSize.medium}px`,
    '--ktheme-font-size-large': `${typography.fontSize.large}px`,
    '--ktheme-font-size-xlarge': `${typography.fontSize.xlarge}px`,
    '--ktheme-font-weight-light': `${typography.fontWeight.light}`,
    '--ktheme-font-weight-regular': `${typography.fontWeight.regular}`,
    '--ktheme-font-weight-medium': `${typography.fontWeight.medium}`,
    '--ktheme-font-weight-bold': `${typography.fontWeight.bold}`,
    '--ktheme-font-line-height': `${typography.lineHeight}`,
    '--ktheme-font-letter-spacing': `${typography.letterSpacing}em`,

    // Corner radii
    '--ktheme-corner-small': `${corners.small}px`,
    '--ktheme-corner-medium': `${corners.medium}px`,
    '--ktheme-corner-large': `${corners.large}px`,
    '--ktheme-corner-xlarge': `${corners.xlarge}px`
  };

  const cssBody = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return {
    vars,
    cssText: `:root {\n${cssBody}\n}`
  };
}

