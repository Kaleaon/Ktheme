import { Theme } from '../core/types';
import { normalizeSemanticRoles, toHexColor } from './utils';

interface DesignTokenValue {
  $type: 'color';
  $value: string;
}

export interface DesignTokensJsonExport {
  $schema: string;
  theme: {
    color: {
      primary: DesignTokenValue;
      background: DesignTokenValue;
      surface: DesignTokenValue;
      error: DesignTokenValue;
      semantic: {
        success: DesignTokenValue;
        warning: DesignTokenValue;
        info: DesignTokenValue;
        critical: DesignTokenValue;
      };
    };
  };
}

function colorToken(value: string): DesignTokenValue {
  return {
    $type: 'color',
    $value: value
  };
}

export function toDesignTokensJson(theme: Theme): DesignTokensJsonExport {
  const semantic = normalizeSemanticRoles(theme);

  return {
    $schema: 'https://www.designtokens.org/tr/drafts/format/',
    theme: {
      color: {
        primary: colorToken(toHexColor(theme.colorScheme.primary)),
        background: colorToken(toHexColor(theme.colorScheme.background)),
        surface: colorToken(toHexColor(theme.colorScheme.surface)),
        error: colorToken(toHexColor(theme.colorScheme.error)),
        semantic: {
          success: colorToken(semantic.success),
          warning: colorToken(semantic.warning),
          info: colorToken(semantic.info),
          critical: colorToken(semantic.critical)
        }
      }
    }
  };
}
