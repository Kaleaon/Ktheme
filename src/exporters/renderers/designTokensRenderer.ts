import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';

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

export class DesignTokensRenderer implements TokenRenderer<DesignTokensJsonExport> {
  readonly id = 'design-tokens';
  readonly name = 'W3C Design Tokens JSON Exporter';

  render(tokens: NormalizedThemeTokens): DesignTokensJsonExport {
    return {
      $schema: 'https://www.designtokens.org/tr/drafts/format/',
      theme: {
        color: {
          primary: designToken('color', tokens.color.primary),
          background: designToken('color', tokens.color.background),
          surface: designToken('color', tokens.color.surface),
          error: designToken('color', tokens.color.error),
          semantic: {
            success: designToken('color', tokens.color.semantic.success),
            warning: designToken('color', tokens.color.semantic.warning),
            info: designToken('color', tokens.color.semantic.info),
            critical: designToken('color', tokens.color.semantic.critical)
          }
        },
        typography: {
          fontFamily: designToken('fontFamily', tokens.typography.fontFamily),
          fontSize: {
            small: designToken('dimension', `${tokens.typography.fontSize.small}px`),
            medium: designToken('dimension', `${tokens.typography.fontSize.medium}px`),
            large: designToken('dimension', `${tokens.typography.fontSize.large}px`),
            xlarge: designToken('dimension', `${tokens.typography.fontSize.xlarge}px`)
          },
          fontWeight: {
            light: designToken('number', tokens.typography.fontWeight.light),
            regular: designToken('number', tokens.typography.fontWeight.regular),
            medium: designToken('number', tokens.typography.fontWeight.medium),
            bold: designToken('number', tokens.typography.fontWeight.bold)
          },
          lineHeight: designToken('number', tokens.typography.lineHeight),
          letterSpacing: designToken('dimension', `${tokens.typography.letterSpacing}em`)
        },
        effect: {
          metallic: designToken('effect', tokens.effects.metallic),
          shadows: designToken('effect', tokens.effects.shadows),
          shimmer: designToken('effect', tokens.effects.shimmer),
          blur: designToken('effect', tokens.effects.blur),
          focusRing: designToken('effect', tokens.effects.focusRing)
        },
        adaptation: {
          layout: designToken('adaptation', tokens.adaptation.layout),
          icons: designToken('adaptation', tokens.adaptation.icons),
          ...(tokens.adaptation.desktopAdaptation ? { desktopAdaptation: designToken('adaptation', tokens.adaptation.desktopAdaptation) } : {})
        }
      }
    };
  }
}

export const designTokensRenderer = new DesignTokensRenderer();
