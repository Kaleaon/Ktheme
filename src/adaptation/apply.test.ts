import {
  generateComponentOverrideCSS,
  generateDesignTokenCSSVariables,
  generateIconCSSVariables,
  generateLayoutCSSVariables,
  generateThemeAdaptationCSS
} from './apply';
import { Theme } from '../core/types';

describe('adaptation CSS generators', () => {
  it('generates layout and icon CSS custom properties', () => {
    const layoutVars = generateLayoutCSSVariables({
      density: 'spacious',
      cornerStyle: 'sharp',
      spacingScale: 1.25,
      panelStyle: 'flat',
      navigationStyle: 'pivot'
    });

    const iconVars = generateIconCSSVariables({
      family: 'fluent',
      style: 'line',
      sizeScale: 1,
      strokeWidth: 1.6,
      cornerStyle: 'sharp'
    });

    expect(layoutVars).toContain('--kt-layout-density: spacious;');
    expect(layoutVars).toContain('--kt-layout-corner-style: sharp;');
    expect(iconVars).toContain('--kt-icon-family: fluent;');
    expect(iconVars).toContain('--kt-icon-style: line;');
  });

  it('generates design token variables', () => {
    const tokenVars = generateDesignTokenCSSVariables({
      density: {
        scale: 1.1,
        baseSpacing: 10
      },
      corners: {
        small: 2,
        medium: 8,
        large: 14,
        xlarge: 20
      }
    });

    expect(tokenVars).toContain('--kt-density-scale: 1.1;');
    expect(tokenVars).toContain('--kt-corner-xlarge: 20px;');
  });

  it('renders component overrides and complete adaptation CSS', () => {
    const overrideCSS = generateComponentOverrideCSS([
      {
        selector: '.tile',
        styles: {
          'border-radius': 0,
          'text-transform': 'uppercase'
        }
      }
    ]);

    expect(overrideCSS).toContain('.tile {');
    expect(overrideCSS).toContain('border-radius: 0px;');
    expect(overrideCSS).toContain('text-transform: uppercase;');

    const theme: Theme = {
      metadata: {
        id: 'x',
        name: 'x',
        description: 'x',
        author: 'x',
        version: '1.0.0',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      darkMode: true,
      colorScheme: {
        primary: '#000',
        onPrimary: '#fff',
        primaryContainer: '#000',
        onPrimaryContainer: '#fff',
        secondary: '#000',
        onSecondary: '#fff',
        secondaryContainer: '#000',
        onSecondaryContainer: '#fff',
        tertiary: '#000',
        onTertiary: '#fff',
        tertiaryContainer: '#000',
        onTertiaryContainer: '#fff',
        error: '#000',
        onError: '#fff',
        errorContainer: '#000',
        onErrorContainer: '#fff',
        background: '#000',
        onBackground: '#fff',
        surface: '#000',
        onSurface: '#fff',
        surfaceVariant: '#000',
        onSurfaceVariant: '#fff',
        outline: '#fff',
        outlineVariant: '#888',
        scrim: '#000',
        inverseSurface: '#fff',
        inverseOnSurface: '#000',
        inversePrimary: '#fff'
      },
      tokens: {
        density: {
          scale: 1,
          baseSpacing: 8
        },
        corners: {
          small: 4,
          medium: 8,
          large: 12
        }
      },
      adaptation: {
        layout: {
          density: 'comfortable',
          cornerStyle: 'rounded',
          spacingScale: 1
        },
        icons: {
          family: 'material',
          style: 'outlined',
          sizeScale: 1
        },
        componentOverrides: [
          {
            selector: '.tile',
            styles: {
              'border-radius': 8
            }
          }
        ]
      }
    };

    const css = generateThemeAdaptationCSS(theme);

    expect(css).toContain(':root {');
    expect(css).toContain('--kt-layout-density: comfortable;');
    expect(css).toContain('--kt-icon-family: material;');
    expect(css).toContain('--kt-density-base-spacing: 8px;');
    expect(css).toContain('.tile {');
  });

  it('can generate css only from tokens even without adaptation', () => {
    const theme: Theme = {
      metadata: {
        id: 'tokens-only',
        name: 'tokens-only',
        description: 'tokens-only',
        author: 'x',
        version: '1.0.0',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      darkMode: true,
      colorScheme: {
        primary: '#000',
        onPrimary: '#fff',
        primaryContainer: '#000',
        onPrimaryContainer: '#fff',
        secondary: '#000',
        onSecondary: '#fff',
        secondaryContainer: '#000',
        onSecondaryContainer: '#fff',
        tertiary: '#000',
        onTertiary: '#fff',
        tertiaryContainer: '#000',
        onTertiaryContainer: '#fff',
        error: '#000',
        onError: '#fff',
        errorContainer: '#000',
        onErrorContainer: '#fff',
        background: '#000',
        onBackground: '#fff',
        surface: '#000',
        onSurface: '#fff',
        surfaceVariant: '#000',
        onSurfaceVariant: '#fff',
        outline: '#fff',
        outlineVariant: '#888',
        scrim: '#000',
        inverseSurface: '#fff',
        inverseOnSurface: '#000',
        inversePrimary: '#fff'
      },
      tokens: {
        density: {
          scale: 1,
          baseSpacing: 8
        },
        corners: {
          small: 4,
          medium: 8,
          large: 12
        }
      }
    };

    const css = generateThemeAdaptationCSS(theme);
    expect(css).toContain('--kt-density-scale: 1;');
  });
});
