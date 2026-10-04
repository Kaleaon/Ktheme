import { MetallicVariant, Theme } from '../core/types';
import { NavyGoldTheme } from '../themes/presets';
import { toAndroidCompose } from './toAndroidCompose';
import { toCssVars } from './toCssVars';
import { toDesignTokensJson } from './toDesignTokensJson';
import { toFlutterTheme } from './toFlutterTheme';
import { toSwiftUI } from './toSwiftUI';
import { toTailwindConfig } from './toTailwindConfig';

const fixtureTheme: Theme = {
  metadata: {
    id: 'export-fixture',
    name: 'Exporter Fixture',
    description: 'Fixture used for exporter parity tests',
    author: 'tests',
    version: '1.0.0',
    tags: ['test'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  darkMode: true,
  colorScheme: {
    primary: '#111111',
    onPrimary: '#FFFFFF',
    primaryContainer: '#333333',
    onPrimaryContainer: '#FFFFFF',
    secondary: '#222222',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#444444',
    onSecondaryContainer: '#FFFFFF',
    tertiary: '#555555',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#666666',
    onTertiaryContainer: '#FFFFFF',
    error: '#D32F2F',
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#000000',
    background: '#121212',
    onBackground: '#F5F5F5',
    surface: '#1E1E1E',
    onSurface: '#FAFAFA',
    surfaceVariant: '#2A2A2A',
    onSurfaceVariant: '#EEEEEE',
    outline: '#777777',
    outlineVariant: '#888888',
    scrim: '#000000',
    inverseSurface: '#F5F5F5',
    inverseOnSurface: '#111111',
    inversePrimary: '#999999',
    semanticRoles: {
      success: '#00C853',
      onSuccess: '#FFFFFF',
      warning: '#FFAB00',
      onWarning: '#000000',
      info: '#2196F3',
      onInfo: '#FFFFFF',
      critical: '#B00020',
      onCritical: '#FFFFFF'
    }
  }
};

const configuredTheme: Theme = {
  ...fixtureTheme,
  effects: {
    blur: { enabled: true, radius: 14 },
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      intensity: 0.85,
      gradient: {
        base: '#D4AF37',
        highlight: '#FFD700',
        shadow: '#856D34',
        shimmer: '#FFF8DC'
      }
    },
    shadows: {
      enabled: true,
      elevation: 6,
      blur: 12,
      color: '#00000088'
    },
    shimmer: {
      enabled: true,
      speed: 2.5,
      intensity: 0.7,
      angle: 120
    }
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontSize: { small: 14, medium: 18, large: 24, xlarge: 32 },
    fontWeight: { light: 300, regular: 400, medium: 600, bold: 800 },
    lineHeight: 1.6,
    letterSpacing: 0.02
  },
  tokens: {
    corners: { small: 6, medium: 10, large: 16, xlarge: 24 }
  }
};

const material3Roles = [
  'primary',
  'onPrimary',
  'primaryContainer',
  'onPrimaryContainer',
  'secondary',
  'onSecondary',
  'secondaryContainer',
  'onSecondaryContainer',
  'tertiary',
  'onTertiary',
  'tertiaryContainer',
  'onTertiaryContainer',
  'error',
  'onError',
  'errorContainer',
  'onErrorContainer',
  'background',
  'onBackground',
  'surface',
  'onSurface',
  'surfaceVariant',
  'onSurfaceVariant',
  'outline',
  'outlineVariant',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'inversePrimary'
] as const;

describe('exporter parity', () => {
  it('maps semantic role colors consistently across all export adapters', () => {
    const cssVars = toCssVars(fixtureTheme);
    const tailwind = toTailwindConfig(fixtureTheme);
    const compose = toAndroidCompose(fixtureTheme);
    const swift = toSwiftUI(fixtureTheme);
    const flutter = toFlutterTheme(fixtureTheme);
    const designTokens = toDesignTokensJson(fixtureTheme);

    expect(cssVars.vars['--ktheme-semantic-success']).toBe('#00C853');
    expect(cssVars.vars['--ktheme-semantic-warning']).toBe('#FFAB00');
    expect(cssVars.vars['--ktheme-semantic-info']).toBe('#2196F3');
    expect(cssVars.vars['--ktheme-semantic-critical']).toBe('#B00020');

    expect(tailwind.theme.extend.colors.success).toBe('#00C853');
    expect(compose.semanticColors.success).toBe('#00C853');
    expect(swift.colors.success).toBe('#00C853');
    expect(flutter.colorScheme.success).toBe('#00C853');
    expect(designTokens.theme.color.semantic.success.$value).toBe('#00C853');

    expect(tailwind.theme.extend.colors.warning).toBe('#FFAB00');
    expect(compose.semanticColors.warning).toBe('#FFAB00');
    expect(swift.colors.warning).toBe('#FFAB00');
    expect(flutter.colorScheme.warning).toBe('#FFAB00');
    expect(designTokens.theme.color.semantic.warning.$value).toBe('#FFAB00');

    expect(tailwind.theme.extend.colors.info).toBe('#2196F3');
    expect(compose.semanticColors.info).toBe('#2196F3');
    expect(swift.colors.info).toBe('#2196F3');
    expect(flutter.colorScheme.info).toBe('#2196F3');
    expect(designTokens.theme.color.semantic.info.$value).toBe('#2196F3');

    expect(tailwind.theme.extend.colors.critical).toBe('#B00020');
    expect(compose.semanticColors.critical).toBe('#B00020');
    expect(swift.colors.critical).toBe('#B00020');
    expect(flutter.colorScheme.critical).toBe('#B00020');
    expect(designTokens.theme.color.semantic.critical.$value).toBe('#B00020');
  });

  it('exports Android Compose using only valid Material 3 ColorScheme roles', () => {
    const compose = toAndroidCompose(fixtureTheme);

    expect(compose.kotlin).toContain('package io.ktheme.compose');
    expect(compose.kotlin).toContain('import androidx.compose.ui.graphics.Color');
    expect(compose.kotlin).toContain('val KthemeColorScheme = darkColorScheme(');
    expect(compose.kotlin).toContain('Color(0xFF111111)');

    const customCompose = toAndroidCompose(fixtureTheme, { packageName: 'com.charmorph.app.ui.theme' });
    expect(customCompose.kotlin).toContain('package com.charmorph.app.ui.theme');

    const colorSchemeArgs = compose.kotlin
      .split('val KthemeColorScheme = darkColorScheme(')[1]
      .split('\n)')[0]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/,$/, '').split(' = ')[0]);

    const argSet = new Set(colorSchemeArgs);

    for (const role of material3Roles) {
      expect(argSet.has(role)).toBe(true);
      expect(compose.colorScheme[role]).toBeDefined();
    }

    for (const arg of argSet) {
      expect(material3Roles).toContain(arg as (typeof material3Roles)[number]);
    }

    expect(argSet.has('success')).toBe(false);
    expect(argSet.has('warning')).toBe(false);
    expect(argSet.has('info')).toBe(false);
    expect(argSet.has('critical')).toBe(false);
  });

  it('exports semantic Android Compose roles separately from ColorScheme', () => {
    const compose = toAndroidCompose(fixtureTheme);

    expect(compose.kotlin).toContain('data class KthemeSemanticColors(');
    expect(compose.kotlin).toContain('val KthemeSemanticColors = KthemeSemanticColors(');

    expect(compose.semanticColors).toEqual({
      success: '#00C853',
      warning: '#FFAB00',
      info: '#2196F3',
      critical: '#B00020'
    });
  });

  it('switches Android Compose color scheme function based on darkMode', () => {
    const darkCompose = toAndroidCompose(fixtureTheme);
    const lightCompose = toAndroidCompose({ ...fixtureTheme, darkMode: false });

    expect(darkCompose.kotlin).toContain('darkColorScheme(');
    expect(darkCompose.kotlin).not.toContain('lightColorScheme(');
    expect(lightCompose.kotlin).toContain('lightColorScheme(');
    expect(lightCompose.kotlin).not.toContain('darkColorScheme(');
  });

  it('exports expanded CSS variables for fully configured themes and uses fallbacks for sparse themes', () => {
    // Test sparse theme fallbacks
    const sparseVars = toCssVars(fixtureTheme);
    expect(sparseVars.vars['--ktheme-glass-blur']).toBe('0px');
    expect(sparseVars.vars['--ktheme-metallic-variant']).toBe('SILVER');
    expect(sparseVars.vars['--ktheme-metallic-intensity']).toBe('0');
    expect(sparseVars.vars['--ktheme-metallic-base']).toBe('#C0C0C0');
    expect(sparseVars.vars['--ktheme-glow-intensity']).toBe('0');
    expect(sparseVars.vars['--ktheme-glow-blur']).toBe('0px');
    expect(sparseVars.vars['--ktheme-shimmer-speed']).toBe('0s');
    expect(sparseVars.vars['--ktheme-font-family']).toBe('system-ui, -apple-system, sans-serif');
    expect(sparseVars.vars['--ktheme-font-size-small']).toBe('12px');
    expect(sparseVars.vars['--ktheme-corner-small']).toBe('4px');
    expect(sparseVars.cssText).toContain('--ktheme-glass-blur: 0px;');

    // Test configured theme
    const fullVars = toCssVars(configuredTheme);
    expect(fullVars.vars['--ktheme-glass-blur']).toBe('14px');
    expect(fullVars.vars['--ktheme-metallic-variant']).toBe('GOLD');
    expect(fullVars.vars['--ktheme-metallic-intensity']).toBe('0.85');
    expect(fullVars.vars['--ktheme-metallic-base']).toBe('#D4AF37');
    expect(fullVars.vars['--ktheme-metallic-highlight']).toBe('#FFD700');
    expect(fullVars.vars['--ktheme-glow-intensity']).toBe('6');
    expect(fullVars.vars['--ktheme-glow-blur']).toBe('12px');
    expect(fullVars.vars['--ktheme-glow-color']).toBe('#00000088');
    expect(fullVars.vars['--ktheme-shimmer-speed']).toBe('2.5s');
    expect(fullVars.vars['--ktheme-shimmer-intensity']).toBe('0.7');
    expect(fullVars.vars['--ktheme-shimmer-angle']).toBe('120deg');
    expect(fullVars.vars['--ktheme-font-family']).toBe('"Inter", sans-serif');
    expect(fullVars.vars['--ktheme-font-size-small']).toBe('14px');
    expect(fullVars.vars['--ktheme-font-size-medium']).toBe('18px');
    expect(fullVars.vars['--ktheme-font-size-large']).toBe('24px');
    expect(fullVars.vars['--ktheme-font-size-xlarge']).toBe('32px');
    expect(fullVars.vars['--ktheme-font-weight-bold']).toBe('800');
    expect(fullVars.vars['--ktheme-font-line-height']).toBe('1.6');
    expect(fullVars.vars['--ktheme-font-letter-spacing']).toBe('0.02em');
    expect(fullVars.vars['--ktheme-corner-small']).toBe('6px');
    expect(fullVars.vars['--ktheme-corner-medium']).toBe('10px');
    expect(fullVars.vars['--ktheme-corner-large']).toBe('16px');
    expect(fullVars.vars['--ktheme-corner-xlarge']).toBe('24px');

    expect(fullVars.cssText).toContain(':root {');
    expect(fullVars.cssText).toContain('--ktheme-glass-blur: 14px;');
    expect(fullVars.cssText).toContain('--ktheme-metallic-variant: GOLD;');
    expect(fullVars.cssText).toContain('--ktheme-corner-xlarge: 24px;');

    // Test with preset theme NavyGoldTheme
    const navyGoldVars = toCssVars(NavyGoldTheme);
    expect(navyGoldVars.vars['--ktheme-metallic-variant']).toBe('GOLD_ROYAL_BLUE');
    expect(navyGoldVars.vars['--ktheme-shimmer-speed']).toBe('3s');
  });

  it('exports expanded Tailwind configurations with borderRadius, typography, shadows, backdropBlur, and animation', () => {
    // Test sparse theme
    const sparseTailwind = toTailwindConfig(fixtureTheme);
    expect(sparseTailwind.theme.extend.borderRadius).toEqual({
      small: '4px',
      medium: '8px',
      large: '12px',
      xlarge: '16px'
    });
    expect(sparseTailwind.theme.extend.fontFamily.sans).toBe('system-ui, -apple-system, sans-serif');
    expect(sparseTailwind.theme.extend.fontSize.medium).toBe('16px');
    expect(sparseTailwind.theme.extend.fontWeight.bold).toBe('700');
    expect(sparseTailwind.theme.extend.lineHeight.normal).toBe('1.5');
    expect(sparseTailwind.theme.extend.letterSpacing.normal).toBe('0em');
    expect(sparseTailwind.theme.extend.backdropBlur.glass).toBe('0px');
    expect(sparseTailwind.theme.extend.animation.shimmer).toBe('shimmer 0s linear infinite');

    // Test fully configured theme
    const fullTailwind = toTailwindConfig(configuredTheme);
    expect(fullTailwind.theme.extend.borderRadius).toEqual({
      small: '6px',
      medium: '10px',
      large: '16px',
      xlarge: '24px'
    });
    expect(fullTailwind.theme.extend.fontFamily).toEqual({
      sans: '"Inter", sans-serif',
      primary: '"Inter", sans-serif'
    });
    expect(fullTailwind.theme.extend.fontSize).toEqual({
      small: '14px',
      medium: '18px',
      large: '24px',
      xlarge: '32px'
    });
    expect(fullTailwind.theme.extend.fontWeight).toEqual({
      light: '300',
      regular: '400',
      medium: '600',
      bold: '800'
    });
    expect(fullTailwind.theme.extend.lineHeight).toEqual({
      normal: '1.6'
    });
    expect(fullTailwind.theme.extend.letterSpacing).toEqual({
      normal: '0.02em'
    });
    expect(fullTailwind.theme.extend.boxShadow).toEqual({
      glow: '0 0 12px #00000088',
      elevation: '0 6px 12px #00000088'
    });
    expect(fullTailwind.theme.extend.backdropBlur).toEqual({
      glass: '14px'
    });
    expect(fullTailwind.theme.extend.animation).toEqual({
      shimmer: 'shimmer 2.5s linear infinite'
    });
  });
});

