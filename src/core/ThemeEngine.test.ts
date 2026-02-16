import { ThemeEngine } from './ThemeEngine';
import { NavyGoldTheme } from '../themes/presets';
import { AdaptationPresets } from '../themes/adaptationPresets';
import type { Theme } from './types';

describe('ThemeEngine adaptations', () => {
  it('creates and registers adapted themes', () => {
    const engine = new ThemeEngine();
    engine.registerTheme(NavyGoldTheme);

    const derived = engine.createAdaptedTheme('navy-gold', AdaptationPresets.frutigerAero, 'navy-gold-aero');

    expect(derived.metadata.id).toBe('navy-gold-aero');
    expect(derived.adaptation?.layout?.panelStyle).toBe('glass');
    expect(engine.getTheme('navy-gold-aero')).toBeDefined();
  });

  it('validates malformed adaptation payloads', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-adaptation'
      },
      adaptation: {
        layout: {
          density: 'comfortable' as const,
          cornerStyle: 'rounded' as const,
          spacingScale: 0
        },
        icons: {
          family: 'material' as const,
          style: 'outlined' as const,
          sizeScale: -1
        },
        componentOverrides: [
          {
            selector: '',
            styles: {
              color: 'red'
            }
          }
        ]
      }
    };

    const validation = engine.validateTheme(invalid);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Layout spacingScale must be greater than 0');
    expect(validation.errors).toContain('Icon sizeScale must be greater than 0');
    expect(validation.errors).toContain('Component override at index 0 is missing selector');
  });

  it('warns on low contrast and validates semantic/tokens additions', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-semantics'
      },
      colorScheme: {
        ...NavyGoldTheme.colorScheme,
        primary: '#777777',
        onPrimary: '#7A7A7A',
        semanticRoles: {
          success: '#22AA22',
          onSuccess: '#102010',
          warning: '#CCAA00'
        }
      },
      tokens: {
        density: {
          scale: 0,
          baseSpacing: 8
        },
        corners: {
          small: 4,
          medium: -2,
          large: 12
        }
      }
    };

    const validation = engine.validateTheme(invalid as unknown as Theme);

    expect(validation.valid).toBe(false);
    expect(validation.warnings.some(msg => msg.includes('Low contrast for primary/onPrimary'))).toBe(true);
    expect(validation.errors).toContain('Semantic role pair warning/onWarning is incomplete');
    expect(validation.errors).toContain('Semantic role pair info/onInfo is incomplete');
    expect(validation.errors).toContain('Density token scale must be greater than 0');
    expect(validation.errors).toContain('Corner token values must be non-negative');
  });

  it('resolves effects for reduced motion users', () => {
    const engine = new ThemeEngine();
    const theme = {
      ...NavyGoldTheme,
      effects: {
        ...NavyGoldTheme.effects,
        shimmer: {
          enabled: true,
          speed: 3,
          intensity: 0.6,
          angle: 120
        },
        transitions: {
          enabled: true,
          duration: 300,
          properties: ['all']
        },
        animations: {
          enabled: true,
          duration: 400,
          easing: 'ease-in-out' as const,
          reducedMotionPolicy: 'disable' as const
        }
      }
    };

    const resolved = engine.resolveEffectsForRuntime(theme, { prefersReducedMotion: true });

    expect(resolved?.shimmer?.enabled).toBe(false);
    expect(resolved?.animations?.enabled).toBe(false);
    expect((resolved?.transitions?.duration ?? 0) < 300).toBe(true);
  });

  it('resolves accessibility defaults and runtime overrides', () => {
    const engine = new ThemeEngine();
    const resolved = engine.resolveAccessibilityForRuntime(
      {
        ...NavyGoldTheme,
        accessibility: {
          minimumContrastRatio: 7,
          typography: {
            fontScale: 1.1,
            lineHeight: 1.7,
            letterSpacing: 0.02
          },
          interaction: {
            minimumTargetSize: 48,
            focusRingWidth: 3,
            focusRingOffset: 4,
            underlineLinks: true
          }
        }
      },
      {
        prefersReducedMotion: true,
        prefersHighContrast: true,
        userFontScale: 1.3
      }
    );

    expect(resolved.highContrast).toBe(true);
    expect(resolved.reducedMotion).toBe(true);
    expect(resolved.minimumContrastRatio).toBe(7);
    expect(resolved.fontScale).toBe(1.3);
    expect(resolved.minimumTargetSize).toBe(48);
  });

  it('validates accessibility configuration guardrails', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-a11y'
      },
      accessibility: {
        minimumContrastRatio: 2.5,
        typography: {
          fontScale: 0
        },
        interaction: {
          minimumTargetSize: 20
        }
      }
    };

    const validation = engine.validateTheme(invalid as unknown as Theme);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('Accessibility minimumContrastRatio must be >= 3');
    expect(validation.errors).toContain('Accessibility fontScale must be greater than 0');
    expect(
      validation.warnings.includes('Accessibility minimumTargetSize should be at least 24px (44px recommended)')
    ).toBe(true);
  });
});
