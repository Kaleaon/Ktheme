/**
 * Ktheme - Advanced Theming and Design API
 * 
 * An open-source theme engine for creating and managing application themes
 * Based on the theming system from CleverFerret
 * 
 * @packageDocumentation
 */

// Core exports
export { ThemeEngine } from './core/ThemeEngine';
export * from './core/types';

// Effects exports
export * from './effects/metallic';

// Utility exports
export * from './utils/colors';

// Theme exports
export * from './themes/presets';

// Re-export for convenience
import { ThemeEngine } from './core/ThemeEngine';
import { PresetThemes } from './themes/presets';

/**
 * Create a new theme engine instance with preset themes
 */
export function createThemeEngine(includePresets: boolean = true): ThemeEngine {
  const engine = new ThemeEngine();
  
  if (includePresets) {
    Object.values(PresetThemes).forEach(theme => {
      engine.registerTheme(theme);
    });
  }
  
  return engine;
}

/**
 * Default export
 */
export default {
  ThemeEngine,
  createThemeEngine,
  PresetThemes
};
