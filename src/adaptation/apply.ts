/**
 * Theme adaptation helpers for layout, icons and component-level overrides.
 */

import { ComponentOverride, DesignTokens, Theme, ThemeAdaptation } from '../core/types';

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
  const layoutVars = generateLayoutCSSVariables(adaptation?.layout);
  const iconVars = generateIconCSSVariables(adaptation?.icons);
  const tokenVars = generateDesignTokenCSSVariables(theme.tokens);
  const overrideCSS = generateComponentOverrideCSS(adaptation?.componentOverrides);

  if (!layoutVars && !iconVars && !tokenVars && !overrideCSS) return '';

  return `
:root {
${layoutVars}
${iconVars}
${tokenVars}
}

${overrideCSS}
  `.trim();
}
