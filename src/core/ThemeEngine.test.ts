import { ThemeEngine } from './ThemeEngine';
import { NavyGoldTheme } from '../themes/presets';
import { AdaptationPresets } from '../themes/adaptationPresets';
import type { Theme } from './types';
import { DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE } from '../accessibility/defaults';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCHEMA_VERSION } from './migrations';

describe('ThemeEngine adaptations', () => {
  const loadFixture = (fileName: string): string =>
    readFileSync(join(__dirname, '__fixtures__', fileName), 'utf-8');

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
          spacingScale: 0,
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
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


  it('errors when layout accessibility contract is missing', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'missing-layout-a11y-contract'
      },
      adaptation: {
        layout: {
          density: 'comfortable' as const,
          cornerStyle: 'rounded' as const,
          spacingScale: 1
        }
      }
    };

    const validation = engine.validateTheme(invalid as unknown as Theme);
    expect(validation.errors).toContain('Layout accessibility profile is required when adaptation.layout is provided');
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


  it('validates expanded contrast pairs including semantic roles', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-contrast-extended'
      },
      colorScheme: {
        ...NavyGoldTheme.colorScheme,
        secondary: '#808080',
        onSecondary: '#858585',
        tertiary: '#707070',
        onTertiary: '#747474',
        surfaceVariant: '#666666',
        onSurfaceVariant: '#696969',
        semanticRoles: {
          success: '#556b2f',
          onSuccess: '#5f7b30',
          warning: '#a07100',
          onWarning: '#aa7900',
          info: '#0f5f8f',
          onInfo: '#116896',
          critical: '#8f1f1f'
        }
      }
    };

    const validation = engine.validateTheme(invalid as unknown as Theme);

    expect(validation.warnings.some(msg => msg.includes('secondary/onSecondary'))).toBe(true);
    expect(validation.warnings.some(msg => msg.includes('tertiary/onTertiary'))).toBe(true);
    expect(validation.warnings.some(msg => msg.includes('surfaceVariant/onSurfaceVariant'))).toBe(true);
    expect(validation.warnings.some(msg => msg.includes('semantic role success/onSuccess'))).toBe(true);
    expect(validation.errors).toContain('Semantic role pair critical/onCritical is incomplete');
  });

  it('flags problematic adaptation combinations and unsafe component overrides', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-overrides'
      },
      adaptation: {
        layout: {
          density: 'spacious' as const,
          cornerStyle: 'rounded' as const,
          spacingScale: 0.7,
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        },
        icons: {
          family: 'material' as const,
          style: 'outlined' as const,
          sizeScale: 0.6,
          strokeWidth: 4
        },
        componentOverrides: [
          {
            selector: 'body',
            styles: {
              color: 'red'
            }
          },
          {
            selector: '.card{color:red}',
            styles: {
              padding: 12
            }
          },
          {
            selector: '.danger',
            styles: {
              background: 'url(javascript:alert(1))'
            }
          },
          {
            selector: '.x > .y > .z > .a > .b',
            styles: {
              color: '#fff'
            }
          },
          {
            selector: '.card:has(.cta)',
            styles: {
              color: '#fff'
            }
          },
          {
            selector: '.legacy',
            styles: {
              behavior: 'url(#default#VML)'
            }
          },
          {
            selector: '.empty',
            styles: {}
          }
        ]
      }
    };

    const validation = engine.validateTheme(invalid as unknown as Theme);

    expect(validation.errors).toContain('Icon style outlined requires sizeScale >= 0.75 for legibility');
    expect(validation.errors).toContain('Icon style outlined requires strokeWidth between 1 and 3');
    expect(validation.warnings).toContain('Tiny spacingScale is likely incompatible with spacious density');
    expect(validation.warnings.some(msg => msg.includes('dangerously broad'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('contains unsupported CSS syntax'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('unsafe or unsupported CSS value'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('unsupported pseudo selector'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('too complex'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('is not an allowed property'))).toBe(true);
    expect(validation.warnings.some(msg => msg.includes('has no style declarations'))).toBe(true);
  });

  it('includes structured validation issues with severity and codes', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-issues-structured'
      },
      adaptation: {
        layout: {
          density: 'spacious' as const,
          cornerStyle: 'rounded' as const,
          spacingScale: 0.7,
          accessibility: DEFAULT_LAYOUT_ACCESSIBILITY_PROFILE
        },
        icons: {
          family: 'material' as const,
          style: 'outlined' as const,
          sizeScale: 0.6,
          strokeWidth: 4
        }
      }
    };

    const validation = engine.validateTheme(invalid as unknown as Theme);

    expect(validation.issues.length).toBeGreaterThan(0);
    expect(validation.issues.some(issue => issue.severity === 'error' && issue.code === 'invalid-adaptation')).toBe(true);
    expect(validation.issues.some(issue => issue.severity === 'warning' && issue.path === 'adaptation.layout.spacingScale')).toBe(true);
    expect(validation.errors.length).toBe(validation.issues.filter(issue => issue.severity === 'error').length);
    expect(validation.warnings.length).toBe(validation.issues.filter(issue => issue.severity === 'warning').length);
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

  it('imports legacy fixture without schemaVersion and migrates to current schema', () => {
    const engine = new ThemeEngine();
    const imported = engine.importTheme(loadFixture('legacy-theme-no-schema.json'));

    expect(imported.schemaVersion).toBe(SCHEMA_VERSION);

    const exported = JSON.parse(engine.exportTheme(imported.metadata.id)) as Theme;
    expect(exported.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('imports legacy v0 fixture and yields schema-equivalent migrated output', () => {
    const engine = new ThemeEngine();
    const fromNoSchema = engine.importTheme(loadFixture('legacy-theme-no-schema.json'));
    const fromV0 = engine.importTheme(loadFixture('legacy-theme-v0.json'));

    const { schemaVersion: noSchemaVersion, metadata: noSchemaMeta, ...noSchemaRest } = fromNoSchema;
    const { schemaVersion: v0Version, metadata: v0Meta, ...v0Rest } = fromV0;

    expect(noSchemaVersion).toBe(SCHEMA_VERSION);
    expect(v0Version).toBe(SCHEMA_VERSION);
    expect(noSchemaRest).toEqual(v0Rest);
    expect(noSchemaMeta.id).not.toEqual(v0Meta.id);
  it('rejects invalid colors across scheme semantic roles state layers and effects', () => {
    const engine = new ThemeEngine();
    const invalid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'invalid-colors-everywhere'
      },
      colorScheme: {
        ...NavyGoldTheme.colorScheme,
        primary: 'rgb(300, 0, 0)',
        onPrimary: 'rgba(255,255,255,1)',
        semanticRoles: {
          success: '#22AA22',
          onSuccess: '#001100',
          warning: 'rgba(120, 30, 20, 1.2)',
          onWarning: '#FFFFFF',
          info: '#2080AA',
          onInfo: '#001122'
        },
        stateLayers: {
          hover: 'hsl(10, 50%, 50%)'
        }
      },
      effects: {
        metallic: {
          enabled: true,
          variant: NavyGoldTheme.effects?.metallic?.variant ?? 'GOLD',
          intensity: 1.2,
          gradient: {
            base: '#123456',
            highlight: '#abcdef',
            shadow: '#000000',
            shimmer: 'rgb(999, 1, 1)'
          }
        },
        shadows: {
          enabled: true,
          elevation: -1,
          blur: -4,
          color: 'rgba(0, 0, 0, 2)'
        },
        overlays: {
          enabled: true,
          color: '#000000',
          opacity: -0.1
        },
        noise: {
          enabled: true,
          opacity: 1.1,
          scale: 1
        }
      }
    } as unknown as Theme;

    const validation = engine.validateTheme(invalid);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some(msg => msg.includes('colorScheme.primary'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('colorScheme.semanticRoles.warning'))).toBe(true);
    expect(validation.errors.some(msg => msg.includes('colorScheme.stateLayers.hover'))).toBe(true);
    expect(validation.errors).toContain('Metallic intensity must be between 0 and 1');
    expect(validation.errors).toContain('Shadow elevation must be greater than or equal to 0');
    expect(validation.errors).toContain('Overlay opacity must be between 0 and 1');
  });

  it('accepts mixed valid color formats and numeric boundaries', () => {
    const engine = new ThemeEngine();
    const valid = {
      ...NavyGoldTheme,
      metadata: {
        ...NavyGoldTheme.metadata,
        id: 'valid-mixed-formats-boundary'
      },
      colorScheme: {
        ...NavyGoldTheme.colorScheme,
        primary: '#11223344',
        onPrimary: 'rgb(255, 255, 255)',
        semanticRoles: {
          success: '#228B22',
          onSuccess: '#FFFFFF',
          warning: 'rgba(120, 80, 0, 1)',
          onWarning: '#FFFFFF',
          info: '#0077CC',
          onInfo: '#FFFFFF'
        },
        stateLayers: {
          hover: 'rgba(255, 255, 255, 0.08)',
          pressed: '#0000001a'
        }
      },
      effects: {
        metallic: {
          enabled: true,
          variant: NavyGoldTheme.effects?.metallic?.variant ?? 'GOLD',
          intensity: 0,
          gradient: {
            base: '#111111',
            highlight: '#fefefe',
            shadow: '#000000',
            shimmer: '#ffffffff'
          }
        },
        shadows: {
          enabled: true,
          elevation: 0,
          blur: 0,
          color: 'rgba(0, 0, 0, 0.4)'
        },
        overlays: {
          enabled: true,
          color: '#000',
          opacity: 1
        },
        blur: {
          enabled: true,
          radius: 0
        },
        shimmer: {
          enabled: true,
          speed: 0.01,
          intensity: 1,
          angle: 45
        },
        animations: {
          enabled: true,
          duration: 1,
          easing: 'ease'
        },
        transitions: {
          enabled: true,
          duration: 1,
          properties: ['opacity']
        },
        noise: {
          enabled: true,
          opacity: 0,
          scale: 2
        }
      }
    } as unknown as Theme;

    const validation = engine.validateTheme(valid);
    expect(validation.errors).toEqual([]);
  });
});
