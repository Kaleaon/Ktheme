import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';

export interface FlutterThemeExport {
  colorScheme: Record<string, string>;
  typography: Record<string, unknown>;
  effects: Record<string, unknown>;
  adaptation: Record<string, unknown>;
  dart: string;
}

function asFlutterColor(hex: string): string {
  return `Color(0xFF${hex.replace('#', '')})`;
}

export class FlutterRenderer implements TokenRenderer<FlutterThemeExport> {
  readonly id = 'flutter';
  readonly name = 'Flutter Theme Exporter';

  render(tokens: NormalizedThemeTokens): FlutterThemeExport {
    const colorScheme: Record<string, string> = {
      primary: tokens.color.primary,
      onPrimary: tokens.color.onPrimary,
      background: tokens.color.background,
      onBackground: tokens.color.onBackground,
      surface: tokens.color.surface,
      onSurface: tokens.color.onSurface,
      error: tokens.color.error,
      success: tokens.color.semantic.success,
      warning: tokens.color.semantic.warning,
      info: tokens.color.semantic.info,
      critical: tokens.color.semantic.critical
    };

    const dartColorScheme = `final kthemeColorScheme = const ColorScheme(\n${Object.entries(colorScheme)
      .map(([key, value]) => `  ${key}: ${asFlutterColor(value)}`)
      .join(',\n')}\n);`;

    const dartTypography = `class KthemeTypography {\n  static const fontFamily = '${tokens.typography.fontFamily}';\n  static const fontSizeSmall = ${tokens.typography.fontSize.small}.0;\n  static const fontSizeMedium = ${tokens.typography.fontSize.medium}.0;\n  static const fontSizeLarge = ${tokens.typography.fontSize.large}.0;\n  static const fontSizeXLarge = ${tokens.typography.fontSize.xlarge}.0;\n}`;

    const dartAdaptation = `class KthemeAdaptation {\n  static const density = '${tokens.layout.density}';\n  static const cornerStyle = '${tokens.layout.cornerStyle}';\n}`;

    const dart = `${dartColorScheme}\n\n${dartTypography}\n\n${dartAdaptation}`;

    return {
      colorScheme,
      typography: tokens.typography as unknown as Record<string, unknown>,
      effects: tokens.effects as unknown as Record<string, unknown>,
      adaptation: tokens.adaptation as unknown as Record<string, unknown>,
      dart
    };
  }
}

export const flutterRenderer = new FlutterRenderer();
