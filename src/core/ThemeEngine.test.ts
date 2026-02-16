import { ThemeEngine } from './ThemeEngine';
import { NavyGoldTheme } from '../themes/presets';
import { AdaptationPresets } from '../themes/adaptationPresets';

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

    const validation = engine.validateTheme(invalid as any);

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
});
