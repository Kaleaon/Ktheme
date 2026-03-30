import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

export interface TailwindConfigExport {
  darkMode: 'class' | 'media';
  theme: {
    extend: {
      colors: Record<string, string>;
    };
  };
}

export function toTailwindConfig(theme: Theme): TailwindConfigExport {
  const semantic = normalizeSemanticRoles(theme);

  return {
    darkMode: theme.darkMode ? 'class' : 'media',
    theme: {
      extend: {
        colors: {
          primary: toHexColor(theme.colorScheme.primary),
          background: toHexColor(theme.colorScheme.background),
          surface: toHexColor(theme.colorScheme.surface),
          error: toHexColor(theme.colorScheme.error),
          success: semantic.success,
          warning: semantic.warning,
          info: semantic.info,
          critical: semantic.critical
        }
      }
    }
  };
}
