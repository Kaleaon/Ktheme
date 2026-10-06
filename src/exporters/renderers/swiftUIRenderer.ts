import { NormalizedThemeTokens } from "../ir/tokenIR";
import { TokenRenderer } from "./TokenRenderer";

export interface SwiftUIExport {
  colors: Record<string, string>;
  typography: Record<string, unknown>;
  effects: Record<string, unknown>;
  adaptation: Record<string, unknown>;
  swift: string;
}

function asSwiftColor(hex: string): string {
  return `Color(hex: "${hex}")`;
}

export class SwiftUIRenderer implements TokenRenderer<SwiftUIExport> {
  readonly id = "swiftui";
  readonly name = "SwiftUI Exporter";

  render(tokens: NormalizedThemeTokens): SwiftUIExport {
    const colors: Record<string, string> = {
      primary: tokens.color.primary,
      background: tokens.color.background,
      surface: tokens.color.surface,
      error: tokens.color.error,
      success: tokens.color.semantic.success,
      warning: tokens.color.semantic.warning,
      info: tokens.color.semantic.info,
      critical: tokens.color.semantic.critical,
    };

    const swiftPalette = `struct KthemePalette {\n${Object.entries(colors)
      .map(([key, value]) => `    let ${key} = ${asSwiftColor(value)}`)
      .join("\n")}\n}`;

    const swiftTypography = `struct KthemeTypography {\n    let fontFamily = "${tokens.typography.fontFamily}"\n    let fontSizeSmall: CGFloat = ${tokens.typography.fontSize.small}\n    let fontSizeMedium: CGFloat = ${tokens.typography.fontSize.medium}\n    let fontSizeLarge: CGFloat = ${tokens.typography.fontSize.large}\n    let fontSizeXLarge: CGFloat = ${tokens.typography.fontSize.xlarge}\n}`;

    const swiftAdaptation = `struct KthemeAdaptation {\n    let density = "${tokens.layout.density}"\n    let cornerStyle = "${tokens.layout.cornerStyle}"\n}`;

    const swift = `${swiftPalette}\n\n${swiftTypography}\n\n${swiftAdaptation}`;

    return {
      colors,
      typography: tokens.typography as unknown as Record<string, unknown>,
      effects: tokens.effects as unknown as Record<string, unknown>,
      adaptation: tokens.adaptation as unknown as Record<string, unknown>,
      swift,
    };
  }
}

export const swiftUIRenderer = new SwiftUIRenderer();
