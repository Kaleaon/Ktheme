import { MetallicVariant, Theme } from '../core/types';
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

  it('exports typography, visual effects, and adaptation tokens across all adapters', () => {
    const themeWithTokens: Theme = {
      ...fixtureTheme,
      typography: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: { small: 12, medium: 16, large: 20, xlarge: 28 },
        fontWeight: { light: 300, regular: 400, medium: 500, bold: 700 },
        lineHeight: 1.5,
        letterSpacing: 0.05
      },
      effects: {
        metallic: {
          enabled: true,
          variant: MetallicVariant.GOLD,
          intensity: 0.8,
          gradient: {
            base: '#FFD700',
            highlight: '#FFF8DC',
            shadow: '#B8860B',
            shimmer: '#FFFFFF'
          }
        },
        shadows: {
          enabled: true,
          elevation: 4,
          blur: 8,
          color: '#000000'
        }
      },
      adaptation: {
        layout: {
          density: 'compact',
          cornerStyle: 'sharp',
          spacingScale: 1.0
        },
        desktopAdaptation: {
          windowChrome: {
            titleBarHeight: 28,
            headerStyle: 'embedded',
            cornerStyle: 'sharp',
            panelRadius: 8,
            controlRadius: 6,
            borderWidth: 1,
            shadow: '0 10px 20px rgba(0,0,0,0.5)'
          },
          menuBar: {
            height: 30,
            fontSize: 12
          },
          taskbar: {
            height: 44,
            buttonRadius: 6
          },
          cameraHud: {
            panelRadius: 10
          },
          sweep: {
            elbowWidth: 32
          }
        }
      }
    };

    const css = toCssVars(themeWithTokens);
    expect(css.vars['--ktheme-typography-font-family']).toBe('Roboto, sans-serif');
    expect(css.vars['--ktheme-effects-metallic-enabled']).toBe('true');
    expect(css.vars['--ktheme-adaptation-desktop-window-chrome-title-bar-height']).toBe('28px');

    const tailwind = toTailwindConfig(themeWithTokens);
    expect(tailwind.theme.extend.typography).toBeDefined();
    expect(tailwind.theme.extend.effects).toBeDefined();
    expect(tailwind.theme.extend.adaptation).toBeDefined();

    const compose = toAndroidCompose(themeWithTokens);
    expect(compose.typography).toBeDefined();
    expect(compose.effects).toBeDefined();
    expect(compose.adaptation).toBeDefined();
    expect(compose.kotlin).toContain('object KthemeTypography');
    expect(compose.kotlin).toContain('object KthemeAdaptation');

    const swift = toSwiftUI(themeWithTokens);
    expect(swift.typography).toBeDefined();
    expect(swift.effects).toBeDefined();
    expect(swift.adaptation).toBeDefined();
    expect(swift.swift).toContain('struct KthemeTypography');
    expect(swift.swift).toContain('struct KthemeAdaptation');

    const flutter = toFlutterTheme(themeWithTokens);
    expect(flutter.typography).toBeDefined();
    expect(flutter.effects).toBeDefined();
    expect(flutter.adaptation).toBeDefined();
    expect(flutter.dart).toContain('class KthemeTypography');
    expect(flutter.dart).toContain('class KthemeAdaptation');

    const designTokens = toDesignTokensJson(themeWithTokens);
    expect(designTokens.theme.typography).toBeDefined();
    expect(designTokens.theme.effect).toBeDefined();
    expect(designTokens.theme.adaptation).toBeDefined();
  });
});
