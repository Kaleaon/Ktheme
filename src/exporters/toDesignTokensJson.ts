import { Theme } from '../core/types';
import { normalizeAdaptation, normalizeEffects, normalizeSemanticRoles, normalizeTypography, toHexColor } from './utils';

interface DesignTokenValue {
  $type: string;
  $value: unknown;
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
      [key: string]: unknown;
    };
    typography: Record<string, unknown>;
    effect: Record<string, unknown>;
    adaptation: Record<string, unknown>;
  };
}

function designToken(type: string, value: unknown): DesignTokenValue {
  return {
    $type: type,
    $value: value
  };
}

export function toDesignTokensJson(theme: Theme): DesignTokensJsonExport {
  const semantic = normalizeSemanticRoles(theme);
  const typography = normalizeTypography(theme);
  const effects = normalizeEffects(theme);
  const adaptation = normalizeAdaptation(theme);

  return {
    $schema: 'https://www.designtokens.org/tr/drafts/format/',
    theme: {
      color: {
        primary: designToken('color', toHexColor(theme.colorScheme.primary)),
        background: designToken('color', toHexColor(theme.colorScheme.background)),
        surface: designToken('color', toHexColor(theme.colorScheme.surface)),
        error: designToken('color', toHexColor(theme.colorScheme.error)),
        semantic: {
          success: designToken('color', semantic.success),
          warning: designToken('color', semantic.warning),
          info: designToken('color', semantic.info),
          critical: designToken('color', semantic.critical)
        }
      },
      typography: {
        fontFamily: designToken('fontFamily', typography.fontFamily),
        fontSize: {
          small: designToken('dimension', `${typography.fontSize.small}px`),
          medium: designToken('dimension', `${typography.fontSize.medium}px`),
          large: designToken('dimension', `${typography.fontSize.large}px`),
          xlarge: designToken('dimension', `${typography.fontSize.xlarge}px`)
        },
        fontWeight: {
          light: designToken('number', typography.fontWeight.light),
          regular: designToken('number', typography.fontWeight.regular),
          medium: designToken('number', typography.fontWeight.medium),
          bold: designToken('number', typography.fontWeight.bold)
        },
        lineHeight: designToken('number', typography.lineHeight),
        letterSpacing: designToken('dimension', `${typography.letterSpacing}em`)
      },
      effect: {
        metallic: designToken('effect', effects.metallic),
        shadows: designToken('effect', effects.shadows),
        shimmer: designToken('effect', effects.shimmer),
        blur: designToken('effect', effects.blur),
        focusRing: designToken('effect', effects.focusRing)
      },
      adaptation: {
        layout: designToken('adaptation', adaptation.layout),
        icons: designToken('adaptation', adaptation.icons),
        ...(adaptation.desktopAdaptation ? { desktopAdaptation: designToken('adaptation', adaptation.desktopAdaptation) } : {})
      }
    }
  };
}
