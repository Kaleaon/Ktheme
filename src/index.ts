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
export * from './effects/advanced';
export * from './adaptation/apply';

// Utility exports
export * from './utils/colors';

// Theme exports
export * from './themes/presets';
export * from './themes/sets';
export * from './themes/adaptationPresets';

// Media design tokens exports
export * from './media/quickAccess';

// Re-export for convenience
import { ThemeEngine } from './core/ThemeEngine';
import { PresetThemes } from './themes/presets';
import { ThemeSets } from './themes/sets';
import { AdaptationPresets } from './themes/adaptationPresets';

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
  PresetThemes,
  ThemeSets,
  AdaptationPresets
};
