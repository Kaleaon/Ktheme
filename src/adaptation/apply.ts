/**
 * Theme adaptation helpers for layout, icons and component-level overrides.
 */

import { ColorScheme, ComponentOverride, DesignTokens, Theme, ThemeAdaptation } from '../core/types';
import { toCssColor } from '../utils/colors';
import { ComponentOverride, DesignTokens, Theme, ThemeAdaptation } from '../core/types';
import { resolveAccessibilitySettings, shouldAutoIncludeAccessibilityCSS } from '../accessibility/defaults';

function normalizeNumericValue(key: string, value: string | number): string {
  if (typeof value === 'number' && !['opacity', 'z-index', 'font-weight', 'line-height'].includes(key)) {
    return `${value}px`;
  }
  return `${value}`;
}

/**
 * Generate CSS custom properties from layout adaptation tokens.
 */
export function generateLayoutCSSVariables(adaptation?: ThemeAdaptation['layout']): string {
  if (!adaptation) return '';

  const radiusMap = {
    sharp: 0,
    rounded: 12,
    pill: 999
  } as const;

  const densityMap = {
    compact: 0.85,
    comfortable: 1,
    spacious: 1.2
  } as const;

  return `
    --kt-layout-density: ${adaptation.density};
    --kt-layout-density-scale: ${densityMap[adaptation.density]};
    --kt-layout-spacing-scale: ${adaptation.spacingScale};
    --kt-layout-corner-style: ${adaptation.cornerStyle};
    --kt-layout-radius: ${radiusMap[adaptation.cornerStyle]}px;
    --kt-layout-panel-style: ${adaptation.panelStyle ?? 'flat'};
    --kt-layout-navigation-style: ${adaptation.navigationStyle ?? 'tabs'};
  `;
}

/**
 * Generate CSS custom properties from icon adaptation tokens.
 */
export function generateIconCSSVariables(adaptation?: ThemeAdaptation['icons']): string {
  if (!adaptation) return '';

  return `
    --kt-icon-family: ${adaptation.family};
    --kt-icon-style: ${adaptation.style};
    --kt-icon-size-scale: ${adaptation.sizeScale};
    --kt-icon-stroke-width: ${adaptation.strokeWidth ?? 1.8};
    --kt-icon-corner-style: ${adaptation.cornerStyle ?? 'rounded'};
  `;
}


/**
 * Generate CSS custom properties from design tokens.
 */
export function generateDesignTokenCSSVariables(tokens?: DesignTokens): string {
  if (!tokens) return '';

  return `
    --kt-density-scale: ${tokens.density?.scale ?? 1};
    --kt-density-base-spacing: ${tokens.density?.baseSpacing ?? 8}px;
    --kt-corner-small: ${tokens.corners?.small ?? 4}px;
    --kt-corner-medium: ${tokens.corners?.medium ?? 8}px;
    --kt-corner-large: ${tokens.corners?.large ?? 12}px;
    --kt-corner-xlarge: ${tokens.corners?.xlarge ?? 16}px;
  `;
}

function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate CSS custom properties from the full color scheme.
 */
export function generateColorSchemeCSSVariables(scheme: ColorScheme): string {
  const lines: string[] = [];

  Object.entries(scheme).forEach(([key, value]) => {
    if (key === 'stateLayers' || key === 'semanticRoles' || value === undefined) {
      return;
    }

    lines.push(`    --kt-${toKebabCase(key)}: ${toCssColor(value)};`);
  });

  if (scheme.stateLayers) {
    Object.entries(scheme.stateLayers).forEach(([key, value]) => {
      if (value !== undefined) {
        lines.push(`    --kt-state-${toKebabCase(key)}: ${toCssColor(value)};`);
      }
    });
  }

  if (scheme.semanticRoles) {
    Object.entries(scheme.semanticRoles).forEach(([key, value]) => {
      if (value !== undefined) {
        lines.push(`    --kt-${toKebabCase(key)}: ${toCssColor(value)};`);
      }
    });
  }

  return lines.join('\n');
}

/**
 * Generate accessibility CSS variables and built-in utility rules.
 */
export function generateAccessibilityCSS(theme: Theme): string {
  if (!shouldAutoIncludeAccessibilityCSS(theme)) return '';

  const settings = resolveAccessibilitySettings(theme);
  if (!settings.enabled) return '';

  const focusColor = `${theme.colorScheme.primary}`;

  return `
    --kt-a11y-min-contrast: ${settings.minimumContrastRatio};
    --kt-a11y-font-scale: ${settings.fontScale};
    --kt-a11y-line-height: ${settings.lineHeight};
    --kt-a11y-letter-spacing: ${settings.letterSpacing}em;
    --kt-a11y-target-size: ${settings.minimumTargetSize}px;
    --kt-a11y-focus-width: ${settings.focusRingWidth}px;
    --kt-a11y-focus-offset: ${settings.focusRingOffset}px;
    --kt-a11y-focus-color: ${focusColor};
    --kt-a11y-underline-links: ${settings.underlineLinks ? 'underline' : 'none'};
  `;
}

export function generateAccessibilityUtilityCSS(theme: Theme): string {
  if (!shouldAutoIncludeAccessibilityCSS(theme)) return '';

  const settings = resolveAccessibilitySettings(theme);
  if (!settings.enabled) return '';

  const reducedMotionBlock = settings.reducedMotion
    ? `
* {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}`
    : '';

  return `
[data-ktheme] {
  font-size: calc(1rem * var(--kt-a11y-font-scale));
  line-height: var(--kt-a11y-line-height);
  letter-spacing: var(--kt-a11y-letter-spacing);
}

[data-ktheme] a {
  text-decoration: var(--kt-a11y-underline-links);
}

[data-ktheme] :is(button, [role="button"], input, select, textarea, a) {
  min-width: var(--kt-a11y-target-size);
  min-height: var(--kt-a11y-target-size);
}

[data-ktheme] :focus-visible {
  outline: var(--kt-a11y-focus-width) solid var(--kt-a11y-focus-color);
  outline-offset: var(--kt-a11y-focus-offset);
}

@media (prefers-reduced-motion: reduce) {
${reducedMotionBlock}
}

@media (forced-colors: active) {
  [data-ktheme] :focus-visible {
    outline-color: CanvasText;
  }
}
  `.trim();
}

/**
 * Convert component overrides into CSS blocks.
 */
export function generateComponentOverrideCSS(overrides?: ComponentOverride[]): string {
  if (!overrides?.length) return '';

  return overrides
    .map(override => {
      const body = Object.entries(override.styles)
        .map(([key, value]) => `  ${key}: ${normalizeNumericValue(key, value)};`)
        .join('\n');

      return `${override.selector} {\n${body}\n}`;
    })
    .join('\n\n');
}

/**
 * Generate complete adaptation CSS for a full theme.
 */
export function generateThemeAdaptationCSS(theme: Theme): string {
  const adaptation = theme.adaptation;
  const colorVars = generateColorSchemeCSSVariables(theme.colorScheme);
  const layoutVars = generateLayoutCSSVariables(adaptation?.layout);
  const iconVars = generateIconCSSVariables(adaptation?.icons);
  const tokenVars = generateDesignTokenCSSVariables(theme.tokens);
  const accessibilityVars = generateAccessibilityCSS(theme);
  const overrideCSS = generateComponentOverrideCSS(adaptation?.componentOverrides);
  const accessibilityUtilityCSS = generateAccessibilityUtilityCSS(theme);

  if (!colorVars && !layoutVars && !iconVars && !tokenVars && !overrideCSS) return '';
  if (!layoutVars && !iconVars && !tokenVars && !accessibilityVars && !overrideCSS && !accessibilityUtilityCSS) return '';

  return `
:root {
${colorVars}
${layoutVars}
${iconVars}
${tokenVars}
${accessibilityVars}
}

${overrideCSS}

${accessibilityUtilityCSS}
  `.trim();
}
