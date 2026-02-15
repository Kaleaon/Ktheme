/**
 * Ktheme Engine - Core theme management system
 * 
 * Provides functionality to register, validate, export, and import themes
 */

import { Theme, ThemeValidationResult } from './types';

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
