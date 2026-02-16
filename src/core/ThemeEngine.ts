/**
 * Ktheme Engine - Core theme management system
 * 
 * Provides functionality to register, validate, export, and import themes
 */

import { Theme, ThemeAdaptation, ThemeValidationResult, VisualEffects } from './types';
import { contrastRatio } from '../utils/colors';

export class ThemeEngine {
  private themes: Map<string, Theme> = new Map();
  private activeTheme: Theme | null = null;

  /**
   * Register a new theme
   */
  registerTheme(theme: Theme): void {
    const validation = this.validateTheme(theme);
    if (!validation.valid) {
      throw new Error(`Invalid theme: ${validation.errors.join(', ')}`);
    }
    
    this.themes.set(theme.metadata.id, theme);
  }

  /**
   * Get a theme by ID
   */
  getTheme(id: string): Theme | undefined {
    return this.themes.get(id);
  }

  /**
   * Get all registered themes
   */
  getAllThemes(): Theme[] {
    return Array.from(this.themes.values());
  }

  /**
   * Set active theme
   */
  setActiveTheme(id: string): void {
    const theme = this.themes.get(id);
    if (!theme) {
      throw new Error(`Theme not found: ${id}`);
    }
    this.activeTheme = theme;
  }

  /**
   * Get current active theme
   */
  getActiveTheme(): Theme | null {
    return this.activeTheme;
  }

  /**
   * Remove a theme
   */
  removeTheme(id: string): boolean {
    if (this.activeTheme?.metadata.id === id) {
      this.activeTheme = null;
    }
    return this.themes.delete(id);
  }


  /**
   * Create a derived theme with a specific adaptation profile.
   */
  createAdaptedTheme(baseThemeId: string, adaptation: ThemeAdaptation, newThemeId?: string): Theme {
    const base = this.getTheme(baseThemeId);
    if (!base) {
      throw new Error(`Theme not found: ${baseThemeId}`);
    }

    const now = new Date().toISOString();
    const derivedTheme: Theme = {
      ...base,
      metadata: {
        ...base.metadata,
        id: newThemeId ?? `${base.metadata.id}-adapted`,
        name: `${base.metadata.name} Adapted`,
        updatedAt: now
      },
      adaptation
    };

    this.registerTheme(derivedTheme);
    return derivedTheme;
  }


  /**
   * Resolve effects for runtime conditions such as reduced motion preferences.
   */
  resolveEffectsForRuntime(theme: Theme, options?: { prefersReducedMotion?: boolean }): VisualEffects | undefined {
    if (!theme.effects) return undefined;

    const prefersReducedMotion = options?.prefersReducedMotion ?? false;
    const resolved: VisualEffects = JSON.parse(JSON.stringify(theme.effects));

    if (prefersReducedMotion) {
      if (resolved.animations?.enabled) {
        const policy = resolved.animations.reducedMotionPolicy ?? 'reduce';
        if (policy === 'disable') {
          resolved.animations.enabled = false;
        } else if (policy === 'reduce') {
          resolved.animations.duration = Math.max(80, Math.round(resolved.animations.duration * 0.35));
        }
      }

      if (resolved.transitions?.enabled) {
        resolved.transitions.duration = Math.max(80, Math.round(resolved.transitions.duration * 0.4));
      }

      if (resolved.shimmer?.enabled) {
        resolved.shimmer.enabled = false;
      }
    }

    return resolved;
  }

  /**
   * Validate a theme
   */
  validateTheme(theme: Theme): ThemeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate metadata
    if (!theme.metadata) {
      errors.push('Theme metadata is required');
    } else {
      if (!theme.metadata.id) errors.push('Theme ID is required');
      if (!theme.metadata.name) errors.push('Theme name is required');
      if (!theme.metadata.version) errors.push('Theme version is required');
    }

    // Validate color scheme
    if (!theme.colorScheme) {
      errors.push('Color scheme is required');
    } else {
      const requiredColors = [
        'primary', 'onPrimary', 'background', 'onBackground',
        'surface', 'onSurface', 'error', 'onError'
      ];
      
      for (const color of requiredColors) {
        if (!(color in theme.colorScheme)) {
          errors.push(`Missing required color: ${color}`);
        }
      }
    }

    // Check for effects warnings
    if (theme.effects?.metallic?.enabled && theme.effects.metallic.intensity > 1) {
      warnings.push('Metallic intensity should be between 0 and 1');
    }

    if (theme.adaptation?.layout?.spacingScale !== undefined && theme.adaptation.layout.spacingScale <= 0) {
      errors.push('Layout spacingScale must be greater than 0');
    }

    if (theme.adaptation?.icons?.sizeScale !== undefined && theme.adaptation.icons.sizeScale <= 0) {
      errors.push('Icon sizeScale must be greater than 0');
    }

    if (theme.adaptation?.componentOverrides) {
      theme.adaptation.componentOverrides.forEach((override, index) => {
        if (!override.selector) {
          errors.push(`Component override at index ${index} is missing selector`);
        }
      });
    }

    const contrastPairs: Array<['primary' | 'background' | 'surface' | 'error', 'onPrimary' | 'onBackground' | 'onSurface' | 'onError', string]> = [
      ['primary', 'onPrimary', 'primary/onPrimary'],
      ['background', 'onBackground', 'background/onBackground'],
      ['surface', 'onSurface', 'surface/onSurface'],
      ['error', 'onError', 'error/onError']
    ];

    if (theme.colorScheme) {
      contrastPairs.forEach(([base, on, label]) => {
        const ratio = contrastRatio(theme.colorScheme[base], theme.colorScheme[on]);
        if (ratio < 4.5) {
          warnings.push(`Low contrast for ${label}: ${ratio.toFixed(2)} (recommended >= 4.5)`);
        }
      });
    }

    const roles = theme.colorScheme?.semanticRoles;
    if (roles) {
      const requiredSemanticPairs: Array<[string, string]> = [
        ['success', 'onSuccess'],
        ['warning', 'onWarning'],
        ['info', 'onInfo']
      ];

      requiredSemanticPairs.forEach(([base, on]) => {
        if (!(base in roles) || !(on in roles)) {
          errors.push(`Semantic role pair ${base}/${on} is incomplete`);
        }
      });
    }

    const layers = theme.colorScheme?.stateLayers;
    if (layers) {
      Object.entries(layers).forEach(([key, value]) => {
        if (typeof value !== 'string') {
          warnings.push(`State layer ${key} should be a CSS color string for portability`);
        }
      });
    }

    if (theme.tokens?.density && theme.tokens.density.scale <= 0) {
      errors.push('Density token scale must be greater than 0');
    }

    if (theme.tokens?.corners) {
      const cornerValues = Object.values(theme.tokens.corners);
      if (cornerValues.some(value => value < 0)) {
        errors.push('Corner token values must be non-negative');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Export a theme to JSON
   */
  exportTheme(id: string): string {
    const theme = this.themes.get(id);
    if (!theme) {
      throw new Error(`Theme not found: ${id}`);
    }
    return JSON.stringify(theme, null, 2);
  }

  /**
   * Import a theme from JSON
   */
  importTheme(json: string): Theme {
    try {
      const theme = JSON.parse(json) as Theme;
      this.registerTheme(theme);
      return theme;
    } catch (error) {
      throw new Error(`Failed to import theme: ${error}`);
    }
  }

  /**
   * Export all themes to JSON
   */
  exportAllThemes(): string {
    const themes = this.getAllThemes();
    return JSON.stringify(themes, null, 2);
  }

  /**
   * Search themes by tags
   */
  searchByTags(tags: string[]): Theme[] {
    return this.getAllThemes().filter(theme =>
      tags.some(tag => theme.metadata.tags.includes(tag))
    );
  }

  /**
   * Search themes by name
   */
  searchByName(query: string): Theme[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllThemes().filter(theme =>
      theme.metadata.name.toLowerCase().includes(lowerQuery) ||
      theme.metadata.description.toLowerCase().includes(lowerQuery)
    );
  }
}
