/**
 * Theme adaptation helpers for layout, icons and component-level overrides.
 */

import { ColorScheme, ComponentOverride, DesignTokens, Theme, ThemeAdaptation } from '../core/types';
import { toCssColor } from '../utils/colors';
import { resolveAccessibilitySettings, shouldAutoIncludeAccessibilityCSS } from '../accessibility/defaults';

const ALLOWED_COMPONENT_OVERRIDE_PROPERTIES = new Set([
  // Layout and box model
  'display', 'visibility', 'overflow', 'overflow-x', 'overflow-y',
  'box-sizing', 'position', 'top', 'right', 'bottom', 'left', 'inset',
  'z-index', 'float', 'clear',
  'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
  'aspect-ratio',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'margin-inline', 'margin-block',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'padding-inline', 'padding-block',
  'gap', 'row-gap', 'column-gap',
  // Flex and grid
  'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'flex-direction', 'flex-wrap', 'order',
  'justify-content', 'justify-items', 'justify-self', 'align-content', 'align-items', 'align-self',
  'grid-template-columns', 'grid-template-rows', 'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
  'grid-column', 'grid-row', 'place-content', 'place-items', 'place-self',
  // Typography
  'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant',
  'line-height', 'letter-spacing', 'text-transform', 'text-align', 'text-decoration',
  'text-overflow', 'white-space', 'word-break', 'word-spacing',
  // Color and paint
  'color', 'background', 'background-color', 'background-image', 'background-size', 'background-position', 'background-repeat',
  'opacity', 'filter', 'backdrop-filter',
  // Border and outline
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-color', 'border-width', 'border-style',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'outline', 'outline-color', 'outline-width', 'outline-style', 'outline-offset',
  // Effects
  'box-shadow', 'transition', 'transition-property', 'transition-duration', 'transition-delay', 'transition-timing-function',
  'transform', 'transform-origin'
]);

const UNSUPPORTED_PSEUDO_SELECTORS = [
  ':has(',
  '::part(',
  '::slotted(',
  ':host',
  ':host-context'
];

const SAFE_KEYWORD_PATTERN = /^(?:inherit|initial|unset|revert|none|auto|normal|bold|bolder|lighter|uppercase|lowercase|capitalize|transparent|currentcolor|solid|dashed|dotted|double|hidden|visible|relative|absolute|static|sticky|fixed|block|inline|inline-block|inline-flex|flex|grid|contents|center|left|right|start|end|stretch|space-between|space-around|space-evenly|nowrap|wrap|column|row|baseline|middle|top|bottom)$/i;
const SAFE_NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;
const SAFE_LENGTH_PATTERN = /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ch|ex|pt|pc|cm|mm|in|fr)$/i;
const SAFE_HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const SAFE_FUNCTION_PATTERN = /^(rgba?|hsla?|calc|min|max|clamp|var|blur|saturate|contrast|brightness|grayscale|sepia|hue-rotate|drop-shadow|linear-gradient|radial-gradient|conic-gradient)\(/i;

function normalizeNumericValue(key: string, value: string | number): string {
  if (typeof value === 'number' && !['opacity', 'z-index', 'font-weight', 'line-height'].includes(key)) {
    return `${value}px`;
  }
  return `${value}`;
}

function tokenizeCssValue(raw: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of raw) {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);

    if (/\s/.test(char) && depth === 0) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }

  if (current) tokens.push(current);
  return tokens;
}

function isSafeCssValueToken(token: string): boolean {
  if (!token) return false;
  if (SAFE_KEYWORD_PATTERN.test(token)) return true;
  if (SAFE_NUMBER_PATTERN.test(token)) return true;
  if (SAFE_LENGTH_PATTERN.test(token)) return true;
  if (SAFE_HEX_PATTERN.test(token)) return true;
  if (SAFE_FUNCTION_PATTERN.test(token)) return true;
  if (/^var\(--[a-z0-9-_]+\)$/i.test(token)) return true;
  return false;
}

function validateCssValueStrict(value: string | number): boolean {
  if (typeof value === 'number') return Number.isFinite(value);

  const normalized = value.trim();
  if (!normalized) return false;
  if (/[{};]/.test(normalized)) return false;
  if (/javascript\s*:|expression\s*\(|behavior\s*:|@import/i.test(normalized)) return false;
  if (/url\s*\(/i.test(normalized)) return false;

  const tokens = tokenizeCssValue(normalized);
  if (!tokens.length) return false;
  return tokens.every(isSafeCssValueToken);
}

export interface ComponentOverrideValidationIssue {
  severity: 'error' | 'warning';
  message: string;
  code: 'invalid-component-override' | 'unsafe-component-override';
  path: string;
}

export function validateComponentOverridePolicy(overrides?: ComponentOverride[]): ComponentOverrideValidationIssue[] {
  const issues: ComponentOverrideValidationIssue[] = [];
  if (!overrides?.length) return issues;

  overrides.forEach((override, index) => {
    const selectorPath = `adaptation.componentOverrides[${index}].selector`;
    const stylesPath = `adaptation.componentOverrides[${index}].styles`;

    if (!override.selector?.trim()) {
      issues.push({
        severity: 'error',
        code: 'invalid-component-override',
        message: `Component override at index ${index} is missing selector`,
        path: selectorPath
      });
      return;
    }

    const selector = override.selector.trim();
    if (selector.length > 160) {
      issues.push({
        severity: 'error',
        code: 'invalid-component-override',
        message: `Component override selector at index ${index} is too long (max 160 characters)`,
        path: selectorPath
      });
    }

    if (/[{};@]/.test(selector)) {
      issues.push({
        severity: 'error',
        code: 'unsafe-component-override',
        message: `Component override selector at index ${index} contains unsupported CSS syntax`,
        path: selectorPath
      });
    }

    if ((selector.match(/[>+~]/g)?.length ?? 0) > 3) {
      issues.push({
        severity: 'error',
        code: 'invalid-component-override',
        message: `Component override selector at index ${index} is too complex (too many combinators)`,
        path: selectorPath
      });
    }

    if (selector.split(',').length > 4) {
      issues.push({
        severity: 'error',
        code: 'invalid-component-override',
        message: `Component override selector at index ${index} targets too many selector groups`,
        path: selectorPath
      });
    }

    const unsupportedPseudo = UNSUPPORTED_PSEUDO_SELECTORS.find(pseudo => selector.includes(pseudo));
    if (unsupportedPseudo) {
      issues.push({
        severity: 'error',
        code: 'invalid-component-override',
        message: `Component override selector at index ${index} uses unsupported pseudo selector ${unsupportedPseudo}`,
        path: selectorPath
      });
    }

    if (/^\s*(\*|:root|html|body)\b/.test(selector)) {
      issues.push({
        severity: 'warning',
        code: 'unsafe-component-override',
        message: `Component override selector at index ${index} is dangerously broad (${selector})`,
        path: selectorPath
      });
    }

    const styleEntries = Object.entries(override.styles);
    if (styleEntries.length === 0) {
      issues.push({
        severity: 'warning',
        code: 'invalid-component-override',
        message: `Component override at index ${index} has no style declarations`,
        path: stylesPath
      });
      return;
    }

    styleEntries.forEach(([property, value]) => {
      const propertyPath = `${stylesPath}.${property}`;
      if (!ALLOWED_COMPONENT_OVERRIDE_PROPERTIES.has(property)) {
        issues.push({
          severity: 'error',
          code: 'invalid-component-override',
          message: `Component override style ${property} at index ${index} is not an allowed property`,
          path: propertyPath
        });
      }

      if (!validateCssValueStrict(value)) {
        issues.push({
          severity: 'error',
          code: 'unsafe-component-override',
          message: `Component override style ${property} at index ${index} contains an unsafe or unsupported CSS value`,
          path: propertyPath
        });
      }
    });
  });

  return issues;
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
 * Generate CSS variables and helper hooks from the layout accessibility contract.
 */
export function generateLayoutAccessibilityCSS(layout?: ThemeAdaptation['layout']): string {
  if (!layout?.accessibility) return '';

  const profile = layout.accessibility;

  return `
    --kt-layout-landmark-main: ${profile.landmarks.main};
    --kt-layout-landmark-nav: ${profile.landmarks.nav};
    --kt-layout-landmark-header: ${profile.landmarks.header};
    --kt-layout-landmark-footer: ${profile.landmarks.footer};
    --kt-layout-label-main: ${JSON.stringify(profile.naming.main)};
    --kt-layout-label-nav: ${JSON.stringify(profile.naming.nav)};
    --kt-layout-label-header: ${JSON.stringify(profile.naming.header)};
    --kt-layout-label-footer: ${JSON.stringify(profile.naming.footer)};
    --kt-layout-label-strategy: ${profile.naming.strategy};
    --kt-layout-keyboard-order: ${profile.keyboard.order};
    --kt-layout-focus-policy: ${profile.keyboard.focusPolicy};
    --kt-layout-live-region-mode: ${profile.liveRegion.mode};
    --kt-layout-live-region-atomic: ${profile.liveRegion.atomic ? 'true' : 'false'};
    --kt-layout-live-region-relevant: ${profile.liveRegion.relevant};
  `;
}

export function generateLayoutAccessibilityHookCSS(layout?: ThemeAdaptation['layout']): string {
  if (!layout?.accessibility) return '';

  return `
/*
  Layout accessibility contract attribute mappings:
  - landmarks.main -> [data-kt-landmark="main"] / .kt-landmark-main
  - landmarks.nav -> [data-kt-landmark="nav"] / .kt-landmark-nav
  - landmarks.header -> [data-kt-landmark="header"] / .kt-landmark-header
  - landmarks.footer -> [data-kt-landmark="footer"] / .kt-landmark-footer
  - naming.* -> [data-kt-label]
  - keyboard.* -> [data-kt-kb-order] + [data-kt-focus-policy]
  - liveRegion.* -> [data-kt-live-region]
*/
[data-kt-landmark="main"], .kt-landmark-main {
  --kt-landmark-role: var(--kt-layout-landmark-main);
}

[data-kt-landmark="nav"], .kt-landmark-nav {
  --kt-landmark-role: var(--kt-layout-landmark-nav);
}

[data-kt-landmark="header"], .kt-landmark-header {
  --kt-landmark-role: var(--kt-layout-landmark-header);
}

[data-kt-landmark="footer"], .kt-landmark-footer {
  --kt-landmark-role: var(--kt-layout-landmark-footer);
}

[data-kt-label][data-kt-label="main"] {
  --kt-layout-label: var(--kt-layout-label-main);
}

[data-kt-label][data-kt-label="nav"] {
  --kt-layout-label: var(--kt-layout-label-nav);
}

[data-kt-focus-policy="managed"] :focus-visible,
.kt-focus-policy-managed :focus-visible {
  scroll-margin: calc(var(--kt-a11y-target-size, 44px) * 0.5);
}

[data-kt-live-region] {
  --kt-live-region-mode: var(--kt-layout-live-region-mode);
  --kt-live-region-atomic: var(--kt-layout-live-region-atomic);
  --kt-live-region-relevant: var(--kt-layout-live-region-relevant);
}
  `.trim();
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

  const rejectedPaths = new Set(
    validateComponentOverridePolicy(overrides)
      .filter(issue => issue.severity === 'error')
      .map(issue => issue.path)
  );

  return overrides
    .map((override, index) => {
      const selectorPath = `adaptation.componentOverrides[${index}].selector`;
      if (rejectedPaths.has(selectorPath)) return '';

      const body = Object.entries(override.styles)
        .filter(([property]) => !rejectedPaths.has(`adaptation.componentOverrides[${index}].styles.${property}`))
        .map(([key, value]) => `  ${key}: ${normalizeNumericValue(key, value)};`)
        .join('\n');

      if (!body.trim()) return '';
      return `${override.selector} {\n${body}\n}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Generate complete adaptation CSS for a full theme.
 */
export function generateThemeAdaptationCSS(theme: Theme): string {
  const adaptation = theme.adaptation;
  const colorVars = generateColorSchemeCSSVariables(theme.colorScheme);
  const layoutVars = generateLayoutCSSVariables(adaptation?.layout);
  const layoutAccessibilityVars = generateLayoutAccessibilityCSS(adaptation?.layout);
  const layoutAccessibilityHooks = generateLayoutAccessibilityHookCSS(adaptation?.layout);
  const iconVars = generateIconCSSVariables(adaptation?.icons);
  const tokenVars = generateDesignTokenCSSVariables(theme.tokens);
  const accessibilityVars = generateAccessibilityCSS(theme);
  const overrideCSS = generateComponentOverrideCSS(adaptation?.componentOverrides);
  const accessibilityUtilityCSS = generateAccessibilityUtilityCSS(theme);

  if (!colorVars && !layoutVars && !layoutAccessibilityVars && !iconVars && !tokenVars && !overrideCSS) return '';
  if (!layoutVars && !layoutAccessibilityVars && !iconVars && !tokenVars && !accessibilityVars && !overrideCSS && !layoutAccessibilityHooks && !accessibilityUtilityCSS) return '';

  return `
:root {
${colorVars}
${layoutVars}
${layoutAccessibilityVars}
${iconVars}
${tokenVars}
${accessibilityVars}
}

${overrideCSS}

${layoutAccessibilityHooks}

${accessibilityUtilityCSS}
  `.trim();
}
