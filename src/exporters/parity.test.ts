import { MetallicVariant, Theme } from '../core/types';
import { extractThemeTokens } from './ir/extractIR';
import {
  androidComposeRenderer,
  cssVarsRenderer,
  designTokensRenderer,
  flutterRenderer,
  swiftUIRenderer,
  tailwindRenderer
} from './renderers';
import { NavyGoldTheme } from '../themes/presets';
import { toAndroidCompose } from './toAndroidCompose';
import { toCssVars } from './toCssVars';
import { toDesignTokensJson } from './toDesignTokensJson';
import { toFlutterTheme } from './toFlutterTheme';
import { toSwiftUI } from './toSwiftUI';
import { toTailwindConfig } from './toTailwindConfig';
import {
  exportEffectVars,
  exportTypographyVars,
  exportCornerVars
} from './web';

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
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      small: 13,
      medium: 16,
      large: 22,
      xlarge: 32
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    lineHeight: 1.6,
    letterSpacing: 0.5
  },
  tokens: {
    corners: {
      small: 6,
      medium: 10,
      large: 16,
      xlarge: 24
    }
  },
  adaptation: {
    layout: {
      density: 'compact',
      cornerStyle: 'pill',
      spacingScale: 1.2,
      panelStyle: 'glass',
      navigationStyle: 'rail',
      accessibility: {
        landmarks: { main: 'main', nav: 'nav', header: 'header', footer: 'footer' },
        naming: { strategy: 'native', main: 'main', nav: 'nav', header: 'header', footer: 'footer' },
        keyboard: { order: 'document', focusPolicy: 'native', trapFocusWithinModals: false },
        liveRegion: { mode: 'off', atomic: true, relevant: 'all' }
      },
      breakpoints: {
        compact: 500,
        medium: 900,
        expanded: 1300
      }
    }
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      intensity: 0.8,
      gradient: {
        base: '#D4AF37',
        highlight: '#FFF8DC',
        shadow: '#8B6508',
        shimmer: '#FFDF00'
      }
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: '#00000066'
    },
    shimmer: {
      enabled: true,
      speed: 1500,
      intensity: 0.7,
      angle: 60
    },
    blur: {
      enabled: true,
      radius: 12
    },
    animations: {
      enabled: true,
      duration: 250,
      easing: 'ease-out'
    },
    focusRing: {
      enabled: true,
      color: '#111111',
      width: 3,
      offset: 2
    }
  }
};

const sparseTheme: Theme = {
  metadata: {
    id: 'sparse-fixture',
    name: 'Sparse Exporter Fixture',
    description: 'Sparse theme for fallback testing',
    author: 'tests',
    version: '1.0.0',
    tags: ['test'],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  darkMode: false,
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
    inversePrimary: '#999999'
  }
};

const richFixtureTheme: Theme = {
  ...fixtureTheme,
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: {
        base: '#D4AF37',
        highlight: '#FFD700',
        shadow: '#856D34',
        shimmer: '#FFF8DC'
      },
      intensity: 0.9
    },
    shimmer: {
      enabled: true,
      speed: 1.5,
      intensity: 0.8,
      angle: 120
    },
    blur: {
      enabled: true,
      radius: 12
    },
    focusRing: {
      enabled: true,
      color: '#FFD700',
      width: 3,
      offset: 2
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: {
      small: 11,
      medium: 15,
      large: 20,
      xlarge: 28
    },
    fontWeight: {
      light: 200,
      regular: 400,
      medium: 600,
      bold: 800
    },
    lineHeight: 1.4,
    letterSpacing: 0.02
  },
  tokens: {
    corners: {
      small: 6,
      medium: 10,
      large: 14,
      xlarge: 22
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

describe('exporter parity & IR pipeline', () => {
  describe('IR Extraction (extractThemeTokens)', () => {
    it('extracts complete NormalizedThemeTokens covering color, layout, typography, and effects categories', () => {
      const ir = extractThemeTokens(fixtureTheme);

      expect(ir.metadata.id).toBe('export-fixture');
      expect(ir.metadata.name).toBe('Exporter Fixture');
      expect(ir.darkMode).toBe(true);

      // Color category
      expect(ir.color.primary).toBe('#111111');
      expect(ir.color.background).toBe('#121212');
      expect(ir.color.semantic.success).toBe('#00C853');
      expect(ir.color.semantic.warning).toBe('#FFAB00');

      // Layout category
      expect(ir.layout.density).toBe('compact');
      expect(ir.layout.cornerStyle).toBe('pill');
      expect(ir.layout.spacingScale).toBe(1.2);
      expect(ir.layout.panelStyle).toBe('glass');
      expect(ir.layout.navigationStyle).toBe('rail');
      expect(ir.layout.breakpoints).toEqual({ compact: 500, medium: 900, expanded: 1300 });
      expect(ir.layout.corners).toEqual({ small: 6, medium: 10, large: 16, xlarge: 24 });

      // Typography category
      expect(ir.typography.fontFamily).toBe('Inter, sans-serif');
      expect(ir.typography.fontSize.large).toBe(22);
      expect(ir.typography.fontWeight.bold).toBe(700);
      expect(ir.typography.lineHeight).toBe(1.6);
      expect(ir.typography.letterSpacing).toBe(0.5);

      // Visual effects category
      expect(ir.effects.metallic.enabled).toBe(true);
      expect(ir.effects.metallic.variant).toBe(MetallicVariant.GOLD);
      expect(ir.effects.metallic.gradient.base).toBe('#D4AF37');
      expect(ir.effects.shadows.elevation).toBe(4);
      expect(ir.effects.shimmer.speed).toBe(1500);
      expect(ir.effects.blur.radius).toBe(12);
      expect(ir.effects.animations.duration).toBe(250);
      expect(ir.effects.focusRing.width).toBe(3);
    });

    it('executes full fallback resolution for partial themes without dropping tokens', () => {
      const minimalTheme: Theme = {
        metadata: {
          id: 'minimal',
          name: 'Minimal',
          description: '',
          author: '',
          version: '1.0.0',
          tags: [],
          createdAt: '',
          updatedAt: ''
        },
        darkMode: false,
        colorScheme: {
          primary: '#0055FF',
          onPrimary: '#FFFFFF',
          primaryContainer: '#0022AA',
          onPrimaryContainer: '#FFFFFF',
          secondary: '#333333',
          onSecondary: '#FFFFFF',
          secondaryContainer: '#111111',
          onSecondaryContainer: '#FFFFFF',
          tertiary: '#777777',
          onTertiary: '#FFFFFF',
          tertiaryContainer: '#444444',
          onTertiaryContainer: '#FFFFFF',
          error: '#FF0000',
          onError: '#FFFFFF',
          errorContainer: '#AA0000',
          onErrorContainer: '#FFFFFF',
          background: '#FFFFFF',
          onBackground: '#000000',
          surface: '#F8F8F8',
          onSurface: '#000000',
          surfaceVariant: '#EEEEEE',
          onSurfaceVariant: '#000000',
          outline: '#CCCCCC',
          outlineVariant: '#DDDDDD',
          scrim: '#000000',
          inverseSurface: '#000000',
          inverseOnSurface: '#FFFFFF',
          inversePrimary: '#88BBFF'
        }
      };

      const ir = extractThemeTokens(minimalTheme);

      expect(ir.color.primary).toBe('#0055FF');
      expect(ir.layout.density).toBe('comfortable');
      expect(ir.layout.cornerStyle).toBe('rounded');
      expect(ir.layout.spacingScale).toBe(1.0);
      expect(ir.typography.fontFamily).toBe('system-ui, -apple-system, sans-serif');
      expect(ir.effects.metallic.enabled).toBe(false);
      expect(ir.effects.shadows.enabled).toBe(false);
    });
  });

  describe('Target Platform Renderers', () => {
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
    });

    it('guarantees end-to-end parity between direct IR rendering and exporter wrappers', () => {
      const ir = extractThemeTokens(fixtureTheme);

      expect(cssVarsRenderer.render(ir)).toEqual(toCssVars(fixtureTheme));
      expect(tailwindRenderer.render(ir)).toEqual(toTailwindConfig(fixtureTheme));
      expect(androidComposeRenderer.render(ir)).toEqual(toAndroidCompose(fixtureTheme));
      expect(swiftUIRenderer.render(ir)).toEqual(toSwiftUI(fixtureTheme));
      expect(flutterRenderer.render(ir)).toEqual(toFlutterTheme(fixtureTheme));
      expect(designTokensRenderer.render(ir)).toEqual(toDesignTokensJson(fixtureTheme));
    });

    it('implements TokenRenderer contract across all six platform renderers', () => {
      const renderers = [
        cssVarsRenderer,
        tailwindRenderer,
        androidComposeRenderer,
        swiftUIRenderer,
        flutterRenderer,
        designTokensRenderer
      ];

      const ir = extractThemeTokens(fixtureTheme);

      for (const renderer of renderers) {
        expect(renderer.id).toBeDefined();
        expect(renderer.name).toBeDefined();
        const output = renderer.render(ir);
        expect(output).toBeDefined();
        expect(typeof output).toBe('object');
      }
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
  });

  describe('Performance & Determinism', () => {
    it('executes IR extraction and rendering within performance budget', () => {
      // Warm up JIT execution path
      for (let i = 0; i < 5; i++) {
        const warmIr = extractThemeTokens(fixtureTheme);
        cssVarsRenderer.render(warmIr);
        tailwindRenderer.render(warmIr);
        androidComposeRenderer.render(warmIr);
        swiftUIRenderer.render(warmIr);
        flutterRenderer.render(warmIr);
        designTokensRenderer.render(warmIr);
      }

      const iterations = 10;
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        const ir = extractThemeTokens(fixtureTheme);
        cssVarsRenderer.render(ir);
        tailwindRenderer.render(ir);
        androidComposeRenderer.render(ir);
        swiftUIRenderer.render(ir);
        flutterRenderer.render(ir);
        designTokensRenderer.render(ir);
      }
      const duration = (performance.now() - start) / iterations;

      expect(duration).toBeLessThan(50);
    });

    it('produces deterministic code output across repeated executions', () => {
      const ir1 = extractThemeTokens(fixtureTheme);
      const ir2 = extractThemeTokens(fixtureTheme);

      expect(ir1).toEqual(ir2);
      expect(cssVarsRenderer.render(ir1)).toEqual(cssVarsRenderer.render(ir2));
      expect(androidComposeRenderer.render(ir1)).toEqual(androidComposeRenderer.render(ir2));
      expect(tailwindRenderer.render(ir1)).toEqual(tailwindRenderer.render(ir2));
    });
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

  describe('web exporters options and sub-modules', () => {
    it('exports all domains by default for toCssVars and toTailwindConfig', () => {
      const cssVars = toCssVars(fixtureTheme);
      const tailwind = toTailwindConfig(fixtureTheme);

      // CSS Vars checks
      expect(cssVars.vars['--ktheme-primary']).toBe('#111111');
      expect(cssVars.vars['--ktheme-effect-metallic-variant']).toBeDefined();
      expect(cssVars.vars['--ktheme-effect-glass-blur']).toBe('12px');
      expect(cssVars.vars['--ktheme-font-family']).toBe('Inter, sans-serif');
      expect(cssVars.vars['--ktheme-corner-small']).toBe('6px');
      expect(cssVars.cssText).toContain('--ktheme-effect-glass-blur: 12px;');
      expect(cssVars.cssText).toContain('--ktheme-font-family: Inter, sans-serif;');

      // Tailwind checks
      expect(tailwind.theme.extend.colors.primary).toBe('#111111');
      expect(tailwind.theme.extend.colors['metallic-base']).toBeDefined();
      expect(tailwind.theme.extend.fontFamily?.primary).toEqual('Inter, sans-serif');
      expect(tailwind.theme.extend.borderRadius?.small).toBe('6px');
    });

    it('selectively excludes domains using options in toCssVars', () => {
      const noEffects = toCssVars(fixtureTheme, { includeEffects: false });
      expect(noEffects.vars['--ktheme-primary']).toBe('#111111');
      expect(noEffects.vars['--ktheme-effect-metallic-variant']).toBeUndefined();
      expect(noEffects.vars['--ktheme-font-family']).toBeDefined();
      expect(noEffects.vars['--ktheme-corner-small']).toBeDefined();

      const noTypography = toCssVars(fixtureTheme, { includeTypography: false });
      expect(noTypography.vars['--ktheme-effect-metallic-variant']).toBeDefined();
      expect(noTypography.vars['--ktheme-font-family']).toBeUndefined();
      expect(noTypography.vars['--ktheme-corner-small']).toBeDefined();

      const noCorners = toCssVars(fixtureTheme, { includeCorners: false });
      expect(noCorners.vars['--ktheme-effect-metallic-variant']).toBeDefined();
      expect(noCorners.vars['--ktheme-font-family']).toBeDefined();
      expect(noCorners.vars['--ktheme-corner-small']).toBeUndefined();

      const minimal = toCssVars(fixtureTheme, {
        includeEffects: false,
        includeTypography: false,
        includeCorners: false
      });
      expect(Object.keys(minimal.vars)).toEqual([
        '--ktheme-primary',
        '--ktheme-on-primary',
        '--ktheme-background',
        '--ktheme-on-background',
        '--ktheme-surface',
        '--ktheme-on-surface',
        '--ktheme-error',
        '--ktheme-semantic-success',
        '--ktheme-semantic-warning',
        '--ktheme-semantic-info',
        '--ktheme-semantic-critical'
      ]);
    });

    it('selectively excludes domains using options in toTailwindConfig', () => {
      const noEffects = toTailwindConfig(fixtureTheme, { includeEffects: false });
      expect(noEffects.theme.extend.colors['metallic-base']).toBeUndefined();
      expect(noEffects.theme.extend.boxShadow).toBeUndefined();
      expect(noEffects.theme.extend.fontFamily).toBeDefined();
      expect(noEffects.theme.extend.borderRadius).toBeDefined();

      const noTypography = toTailwindConfig(fixtureTheme, { includeTypography: false });
      expect(noTypography.theme.extend.colors['metallic-base']).toBeDefined();
      expect(noTypography.theme.extend.fontFamily).toBeUndefined();
      expect(noTypography.theme.extend.fontSize).toBeUndefined();
      expect(noTypography.theme.extend.borderRadius).toBeDefined();

      const noCorners = toTailwindConfig(fixtureTheme, { includeCorners: false });
      expect(noCorners.theme.extend.colors['metallic-base']).toBeDefined();
      expect(noCorners.theme.extend.fontFamily).toBeDefined();
      expect(noCorners.theme.extend.borderRadius).toBeUndefined();
    });

    it('exports rich theme effects, typography, and corners correctly via domain builders', () => {
      const effects = exportEffectVars(richFixtureTheme);
      expect(effects.vars['--ktheme-effect-metallic-variant']).toBe('GOLD');
      expect(effects.vars['--ktheme-effect-metallic-base']).toBe('#D4AF37');
      expect(effects.vars['--ktheme-effect-shimmer-speed']).toBe('1.5s');
      expect(effects.vars['--ktheme-effect-glass-blur']).toBe('12px');
      expect(effects.vars['--ktheme-effect-glow-color']).toBe('#FFD700');
      expect(effects.tailwind.colors?.['metallic-base']).toBe('#D4AF37');
      expect(effects.tailwind.boxShadow?.glow).toBe('0 0 3px #FFD700');

      const typography = exportTypographyVars(richFixtureTheme);
      expect(typography.vars['--ktheme-font-family']).toBe('Roboto, sans-serif');
      expect(typography.vars['--ktheme-font-size-small']).toBe('11px');
      expect(typography.vars['--ktheme-font-size-xlarge']).toBe('28px');
      expect(typography.vars['--ktheme-font-weight-bold']).toBe('800');
      expect(typography.tailwind.fontFamily?.primary).toEqual(['Roboto, sans-serif']);

      const corners = exportCornerVars(richFixtureTheme);
      expect(corners.vars['--ktheme-corner-small']).toBe('6px');
      expect(corners.vars['--ktheme-corner-large']).toBe('14px');
      expect(corners.tailwind.borderRadius?.large).toBe('14px');
    });
  });

  it('exports expanded CSS variables for fully configured themes and uses fallbacks for sparse themes', () => {
    // Test sparse theme fallbacks
    const sparseVars = toCssVars(sparseTheme);
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
    const sparseTailwind = toTailwindConfig(sparseTheme);
    expect(sparseTailwind.theme.extend.borderRadius).toEqual({
      small: '4px',
      medium: '8px',
      large: '12px',
      xlarge: '16px'
    });
    expect(sparseTailwind.theme.extend.fontFamily?.sans).toBe('system-ui, -apple-system, sans-serif');
    expect(sparseTailwind.theme.extend.fontSize?.medium).toBe('16px');
    expect(sparseTailwind.theme.extend.fontWeight?.bold).toBe('700');
    expect(sparseTailwind.theme.extend.lineHeight?.normal).toBe('1.5');
    expect(sparseTailwind.theme.extend.letterSpacing?.normal).toBe('0em');
    expect(sparseTailwind.theme.extend.backdropBlur?.glass).toBe('0px');
    expect(sparseTailwind.theme.extend.animation?.shimmer).toBe('shimmer 0s linear infinite');

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

