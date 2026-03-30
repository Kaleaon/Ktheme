/**
 * Ktheme Engine - Core theme management system
 * 
 * Provides functionality to register, validate, export, and import themes
 */

import {
  AccessibilityRuntimePreferences,
  Color,
  ResolvedAccessibilitySettings,
  Theme,
  ThemeAdaptation,
  ThemeValidationIssue,
  ThemeValidationResult,
  VisualEffects
} from './types';
import { contrastRatio, normalizeColor } from '../utils/colors';
import { resolveAccessibilitySettings } from '../accessibility/defaults';
import { validateComponentOverridePolicy } from '../adaptation/apply';
import { migrateTheme, SCHEMA_VERSION } from './migrations';

export class ThemeEngine {
  private themes: Map<string, Theme> = new Map();
  private activeTheme: Theme | null = null;

  /**
   * Register a new theme
   */
  registerTheme(theme: Theme): void {
    const normalizedTheme = theme.schemaVersion
      ? theme
      : migrateTheme(theme, 0, SCHEMA_VERSION);
    const validation = this.validateTheme(normalizedTheme);
    if (!validation.valid) {
      throw new Error(`Invalid theme: ${validation.errors.join(', ')}`);
    }
    
    this.themes.set(normalizedTheme.metadata.id, normalizedTheme);
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
   * Resolve accessibility settings for runtime conditions and user preferences.
   */
  resolveAccessibilityForRuntime(
    theme: Theme,
    preferences?: AccessibilityRuntimePreferences
  ): ResolvedAccessibilitySettings {
    return resolveAccessibilitySettings(theme, preferences);
  }

  /**
   * Validate a theme
   */
  validateTheme(theme: Theme): ThemeValidationResult {
    const issues: ThemeValidationIssue[] = [];
    const addIssue = (issue: ThemeValidationIssue): void => {
      issues.push(issue);
    };
    const addError = (
      message: string,
      code: ThemeValidationIssue['code'],
      path?: string
    ): void => addIssue({ severity: 'error', message, code, path });
    const addWarning = (
      message: string,
      code: ThemeValidationIssue['code'],
      path?: string
    ): void => addIssue({ severity: 'warning', message, code, path });
    const validateColorField = (color: unknown, path: string): void => {
      try {
        normalizeColor(color as Theme['colorScheme']['primary']);
      } catch (error) {
        addError(
          `Invalid color at ${path}: ${(error as Error).message}`,
          'invalid-token',
          path
        );
      }
    };
    const validateRange = (
      value: number | undefined,
      path: string,
      options: { min?: number; max?: number; minExclusive?: number; maxExclusive?: number; message: string }
    ): void => {
      if (value === undefined) return;
      if (!Number.isFinite(value)) {
        addError(`${options.message} (must be a finite number)`, 'invalid-effects', path);
        return;
      }
      if (options.min !== undefined && value < options.min) {
        addError(options.message, 'invalid-effects', path);
      }
      if (options.max !== undefined && value > options.max) {
        addError(options.message, 'invalid-effects', path);
      }
      if (options.minExclusive !== undefined && value <= options.minExclusive) {
        addError(options.message, 'invalid-effects', path);
      }
      if (options.maxExclusive !== undefined && value >= options.maxExclusive) {
        addError(options.message, 'invalid-effects', path);
      }
    };

    // Validate metadata
    if (!theme.metadata) {
      addError('Theme metadata is required', 'missing-metadata', 'metadata');
    } else {
      if (!theme.metadata.id) addError('Theme ID is required', 'missing-metadata', 'metadata.id');
      if (!theme.metadata.name) addError('Theme name is required', 'missing-metadata', 'metadata.name');
      if (!theme.metadata.description) addError('Theme description is required', 'missing-metadata', 'metadata.description');
      if (!theme.metadata.author) addError('Theme author is required', 'missing-metadata', 'metadata.author');
      if (!theme.metadata.version) addError('Theme version is required', 'missing-metadata', 'metadata.version');
      if (!Array.isArray(theme.metadata.tags)) {
        addError('Theme tags must be an array of strings', 'missing-metadata', 'metadata.tags');
      } else if (theme.metadata.tags.some(tag => typeof tag !== 'string')) {
        addError('Theme tags must be an array of strings', 'missing-metadata', 'metadata.tags');
      }
    }

    // Validate color scheme
    if (!theme.colorScheme) {
      addError('Color scheme is required', 'missing-color', 'colorScheme');
    } else {
      const requiredColors = [
        'primary', 'onPrimary', 'background', 'onBackground',
        'surface', 'onSurface', 'error', 'onError'
      ];
      
      for (const color of requiredColors) {
        if (!(color in theme.colorScheme)) {
          addError(`Missing required color: ${color}`, 'missing-color', `colorScheme.${color}`);
        } else {
          validateColorField(theme.colorScheme[color as keyof typeof theme.colorScheme], `colorScheme.${color}`);
        }
      }

      Object.entries(theme.colorScheme).forEach(([key, value]) => {
        if (key === 'semanticRoles' || key === 'stateLayers') return;
        validateColorField(value, `colorScheme.${key}`);
      });
    }

    const roles = theme.colorScheme?.semanticRoles;
    if (roles) {
      Object.entries(roles).forEach(([key, value]) => {
        if (value !== undefined) {
          validateColorField(value, `colorScheme.semanticRoles.${key}`);
        }
      });
    }

    const layers = theme.colorScheme?.stateLayers;
    if (layers) {
      Object.entries(layers).forEach(([key, value]) => {
        if (value !== undefined) {
          validateColorField(value, `colorScheme.stateLayers.${key}`);
        }
      });
    }

    if (theme.effects?.metallic) {
      validateRange(theme.effects.metallic.intensity, 'effects.metallic.intensity', {
        min: 0,
        max: 1,
        message: 'Metallic intensity must be between 0 and 1'
      });

      validateColorField(theme.effects.metallic.gradient.base, 'effects.metallic.gradient.base');
      validateColorField(theme.effects.metallic.gradient.highlight, 'effects.metallic.gradient.highlight');
      validateColorField(theme.effects.metallic.gradient.shadow, 'effects.metallic.gradient.shadow');
      validateColorField(theme.effects.metallic.gradient.shimmer, 'effects.metallic.gradient.shimmer');
    }

    if (theme.effects?.shadows) {
      validateRange(theme.effects.shadows.elevation, 'effects.shadows.elevation', {
        min: 0,
        message: 'Shadow elevation must be greater than or equal to 0'
      });
      validateRange(theme.effects.shadows.blur, 'effects.shadows.blur', {
        min: 0,
        message: 'Shadow blur must be greater than or equal to 0'
      });
      validateColorField(theme.effects.shadows.color, 'effects.shadows.color');
    }

    if (theme.effects?.gradients) {
      theme.effects.gradients.stops.forEach((stop, index) => {
        validateRange(stop.offset, `effects.gradients.stops[${index}].offset`, {
          min: 0,
          max: 1,
          message: 'Gradient stop offset must be between 0 and 1'
        });
        validateColorField(stop.color, `effects.gradients.stops[${index}].color`);
      });
    }

    if (theme.effects?.overlays) {
      validateColorField(theme.effects.overlays.color, 'effects.overlays.color');
      validateRange(theme.effects.overlays.opacity, 'effects.overlays.opacity', {
        min: 0,
        max: 1,
        message: 'Overlay opacity must be between 0 and 1'
      });
    }

    if (theme.effects?.focusRing) {
      validateColorField(theme.effects.focusRing.color, 'effects.focusRing.color');
    }

    if (theme.effects?.noise) {
      validateRange(theme.effects.noise.opacity, 'effects.noise.opacity', {
        min: 0,
        max: 1,
        message: 'Noise opacity must be between 0 and 1'
      });
    }

    if (theme.effects?.blur) {
      validateRange(theme.effects.blur.radius, 'effects.blur.radius', {
        min: 0,
        message: 'Blur radius must be greater than or equal to 0'
      });
    }

    if (theme.effects?.animations) {
      validateRange(theme.effects.animations.duration, 'effects.animations.duration', {
        minExclusive: 0,
        message: 'Animation duration must be greater than 0'
      });
    }

    if (theme.effects?.transitions) {
      validateRange(theme.effects.transitions.duration, 'effects.transitions.duration', {
        minExclusive: 0,
        message: 'Transition duration must be greater than 0'
      });
    }

    if (theme.effects?.shimmer?.enabled) {
      validateRange(theme.effects.shimmer.speed, 'effects.shimmer.speed', {
        minExclusive: 0,
        message: 'Shimmer speed must be greater than 0'
      });
      validateRange(theme.effects.shimmer.intensity, 'effects.shimmer.intensity', {
        min: 0,
        max: 1,
        message: 'Shimmer intensity must be between 0 and 1'
      });
    }

    if (theme.adaptation?.layout?.spacingScale !== undefined && theme.adaptation.layout.spacingScale <= 0) {
      addError('Layout spacingScale must be greater than 0', 'invalid-adaptation', 'adaptation.layout.spacingScale');
    }

    if (theme.adaptation?.layout) {
      const { accessibility } = theme.adaptation.layout;
      if (!accessibility) {
        addError('Layout accessibility profile is required when adaptation.layout is provided', 'invalid-adaptation', 'adaptation.layout.accessibility');
      } else {
        const requiredLandmarks: Array<keyof typeof accessibility.landmarks> = ['main', 'nav', 'header', 'footer'];
        requiredLandmarks.forEach(key => {
          if (!accessibility.landmarks[key]) {
            addError(`Layout accessibility landmark ${key} is required`, 'invalid-adaptation', `adaptation.layout.accessibility.landmarks.${key}`);
          }
          if (!accessibility.naming[key]) {
            addError(`Layout accessibility naming label ${key} is required`, 'invalid-adaptation', `adaptation.layout.accessibility.naming.${key}`);
          }
        });

        if (!accessibility.naming.strategy) {
          addError('Layout accessibility naming strategy is required', 'invalid-adaptation', 'adaptation.layout.accessibility.naming.strategy');
        }

        if (!accessibility.keyboard.order) {
          addError('Layout accessibility keyboard order is required', 'invalid-adaptation', 'adaptation.layout.accessibility.keyboard.order');
        }

        if (!accessibility.keyboard.focusPolicy) {
          addError('Layout accessibility focus policy is required', 'invalid-adaptation', 'adaptation.layout.accessibility.keyboard.focusPolicy');
        }

        if (accessibility.keyboard.trapFocusWithinModals === undefined) {
          addError('Layout accessibility trapFocusWithinModals is required', 'invalid-adaptation', 'adaptation.layout.accessibility.keyboard.trapFocusWithinModals');
        }

        if (!accessibility.liveRegion.mode) {
          addError('Layout accessibility live-region mode is required', 'invalid-adaptation', 'adaptation.layout.accessibility.liveRegion.mode');
        }

        if (accessibility.liveRegion.atomic === undefined) {
          addError('Layout accessibility live-region atomic is required', 'invalid-adaptation', 'adaptation.layout.accessibility.liveRegion.atomic');
        }

        if (!accessibility.liveRegion.relevant) {
          addError('Layout accessibility live-region relevant policy is required', 'invalid-adaptation', 'adaptation.layout.accessibility.liveRegion.relevant');
        }
      }
    }

    if (theme.adaptation?.icons?.sizeScale !== undefined && theme.adaptation.icons.sizeScale <= 0) {
      addError('Icon sizeScale must be greater than 0', 'invalid-adaptation', 'adaptation.icons.sizeScale');
    }

    if (
      theme.adaptation?.layout?.density === 'spacious' &&
      theme.adaptation.layout.spacingScale !== undefined &&
      theme.adaptation.layout.spacingScale < 0.85
    ) {
      addWarning(
        'Tiny spacingScale is likely incompatible with spacious density',
        'invalid-adaptation',
        'adaptation.layout.spacingScale'
      );
    }

    if (theme.adaptation?.icons) {
      const { style, sizeScale, strokeWidth } = theme.adaptation.icons;

      if ((style === 'outlined' || style === 'line') && sizeScale < 0.75) {
        addError(
          `Icon style ${style} requires sizeScale >= 0.75 for legibility`,
          'invalid-adaptation',
          'adaptation.icons.sizeScale'
        );
      }

      if ((style === 'outlined' || style === 'line') && strokeWidth !== undefined && (strokeWidth < 1 || strokeWidth > 3)) {
        addError(
          `Icon style ${style} requires strokeWidth between 1 and 3`,
          'invalid-adaptation',
          'adaptation.icons.strokeWidth'
        );
      }

      if (style === 'filled' && strokeWidth !== undefined && strokeWidth > 0.5) {
        addWarning(
          'Filled icon style typically does not use visible strokeWidth values',
          'invalid-adaptation',
          'adaptation.icons.strokeWidth'
        );
      }
    }

    if (theme.adaptation?.componentOverrides) {
      const overrideIssues = validateComponentOverridePolicy(theme.adaptation.componentOverrides);
      overrideIssues.forEach(issue => {
        if (issue.severity === 'error') {
          addError(issue.message, issue.code, issue.path);
        } else {
          addWarning(issue.message, issue.code, issue.path);
        }
      });
    }

    const contrastPairs: Array<[
      'primary' | 'secondary' | 'tertiary' | 'background' | 'surface' | 'surfaceVariant' | 'error',
      'onPrimary' | 'onSecondary' | 'onTertiary' | 'onBackground' | 'onSurface' | 'onSurfaceVariant' | 'onError',
      string
    ]> = [
      ['primary', 'onPrimary', 'primary/onPrimary'],
      ['secondary', 'onSecondary', 'secondary/onSecondary'],
      ['tertiary', 'onTertiary', 'tertiary/onTertiary'],
      ['background', 'onBackground', 'background/onBackground'],
      ['surface', 'onSurface', 'surface/onSurface'],
      ['surfaceVariant', 'onSurfaceVariant', 'surfaceVariant/onSurfaceVariant'],
      ['error', 'onError', 'error/onError']
    ];

    const tryContrastRatio = (foreground: Color, background: Color): number | undefined => {
      try {
        return contrastRatio(foreground, background);
      } catch {
        return undefined;
      }
    };

    if (theme.colorScheme) {
      contrastPairs.forEach(([base, on, label]) => {
        const ratio = tryContrastRatio(theme.colorScheme[base], theme.colorScheme[on]);
        if (ratio !== undefined && ratio < 4.5) {
          addWarning(
            `Low contrast for ${label}: ${ratio.toFixed(2)} (recommended >= 4.5)`,
            'low-contrast',
            `colorScheme.${label}`
          );
        }
      });
    }

    if (roles) {
      const requiredSemanticPairs: Array<[string, string]> = [
        ['success', 'onSuccess'],
        ['warning', 'onWarning'],
        ['info', 'onInfo']
      ];

      requiredSemanticPairs.forEach(([base, on]) => {
        if (!(base in roles) || !(on in roles)) {
          addError(`Semantic role pair ${base}/${on} is incomplete`, 'incomplete-semantic-role', `colorScheme.semanticRoles`);
        } else {
          const ratio = tryContrastRatio(roles[base as keyof typeof roles]!, roles[on as keyof typeof roles]!);
          if (ratio !== undefined && ratio < 4.5) {
            addWarning(
              `Low contrast for semantic role ${base}/${on}: ${ratio.toFixed(2)} (recommended >= 4.5)`,
              'low-contrast',
              `colorScheme.semanticRoles.${base}`
            );
          }
        }
      });

      const criticalProvided = Boolean(roles.critical) || Boolean(roles.onCritical);
      if (criticalProvided && (!roles.critical || !roles.onCritical)) {
        addError('Semantic role pair critical/onCritical is incomplete', 'incomplete-semantic-role', 'colorScheme.semanticRoles');
      } else if (roles.critical && roles.onCritical) {
        const ratio = tryContrastRatio(roles.critical, roles.onCritical);
        if (ratio !== undefined && ratio < 4.5) {
          addWarning(
            `Low contrast for semantic role critical/onCritical: ${ratio.toFixed(2)} (recommended >= 4.5)`,
            'low-contrast',
            'colorScheme.semanticRoles.critical'
          );
        }
      }
    }

    if (theme.tokens?.density && theme.tokens.density.scale <= 0) {
      addError('Density token scale must be greater than 0', 'invalid-token', 'tokens.density.scale');
    }

    if (theme.tokens?.corners) {
      const cornerValues = Object.values(theme.tokens.corners);
      if (cornerValues.some(value => value < 0)) {
        addError('Corner token values must be non-negative', 'invalid-token', 'tokens.corners');
      }
    }

    if (theme.accessibility) {
      if (theme.accessibility.minimumContrastRatio !== undefined && theme.accessibility.minimumContrastRatio < 3) {
        addError('Accessibility minimumContrastRatio must be >= 3', 'invalid-accessibility', 'accessibility.minimumContrastRatio');
      }

      if (theme.accessibility.typography?.fontScale !== undefined && theme.accessibility.typography.fontScale <= 0) {
        addError('Accessibility fontScale must be greater than 0', 'invalid-accessibility', 'accessibility.typography.fontScale');
      }

      if (
        theme.accessibility.interaction?.minimumTargetSize !== undefined &&
        theme.accessibility.interaction.minimumTargetSize < 24
      ) {
        addWarning(
          'Accessibility minimumTargetSize should be at least 24px (44px recommended)',
          'invalid-accessibility',
          'accessibility.interaction.minimumTargetSize'
        );
      }
    }

    const errors = issues.filter(issue => issue.severity === 'error').map(issue => issue.message);
    const warnings = issues.filter(issue => issue.severity === 'warning').map(issue => issue.message);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      issues
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
    const exportPayload = {
      ...theme,
      schemaVersion: SCHEMA_VERSION
    };
    return JSON.stringify(exportPayload, null, 2);
  }

  /**
   * Import a theme from JSON
   */
  importTheme(json: string): Theme {
    try {
      const importedTheme = JSON.parse(json) as Theme;
      const fromVersion = importedTheme.schemaVersion ?? 0;
      const theme =
        fromVersion === SCHEMA_VERSION
          ? importedTheme
          : migrateTheme(importedTheme, fromVersion, SCHEMA_VERSION);
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
    const themes = this.getAllThemes().map(theme => ({
      ...theme,
      schemaVersion: SCHEMA_VERSION
    }));
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
      (theme.metadata.description ?? '').toLowerCase().includes(lowerQuery)
    );
  }
}
