import {
  parseTokensStudio,
  tokensStudioToKTheme,
  TokensStudioParseResult,
  ConvertOptions,
} from "../../../src/importers/tokensStudioImporter";
import { KthemeTokens } from "./KthemeContext";

export { parseTokensStudio, tokensStudioToKTheme };
export type { TokensStudioParseResult };

/**
 * Dynamically converts Tokens Studio JSON string or object into a KthemeTokens object suitable for use in KthemeProvider or React runtime token updates.
 */
export function importTokensStudioJson(
  jsonContent: string | Record<string, any>,
  options?: ConvertOptions
): KthemeTokens {
  const theme = tokensStudioToKTheme(jsonContent, options);

  const tokens: KthemeTokens = {
    primary: String(theme.colorScheme.primary),
    onPrimary: String(theme.colorScheme.onPrimary),
    primaryContainer: theme.colorScheme.primaryContainer ? String(theme.colorScheme.primaryContainer) : undefined,
    onPrimaryContainer: theme.colorScheme.onPrimaryContainer ? String(theme.colorScheme.onPrimaryContainer) : undefined,
    secondary: String(theme.colorScheme.secondary),
    onSecondary: String(theme.colorScheme.onSecondary),
    secondaryContainer: theme.colorScheme.secondaryContainer ? String(theme.colorScheme.secondaryContainer) : undefined,
    onSecondaryContainer: theme.colorScheme.onSecondaryContainer ? String(theme.colorScheme.onSecondaryContainer) : undefined,
    tertiary: theme.colorScheme.tertiary ? String(theme.colorScheme.tertiary) : undefined,
    onTertiary: theme.colorScheme.onTertiary ? String(theme.colorScheme.onTertiary) : undefined,
    surface: String(theme.colorScheme.surface),
    onSurface: String(theme.colorScheme.onSurface),
    surfaceVariant: theme.colorScheme.surfaceVariant ? String(theme.colorScheme.surfaceVariant) : undefined,
    background: String(theme.colorScheme.background),
    onBackground: String(theme.colorScheme.onBackground),
    outline: String(theme.colorScheme.outline),
    error: String(theme.colorScheme.error),
    surf2: theme.colorScheme.surfaceVariant ? String(theme.colorScheme.surfaceVariant) : String(theme.colorScheme.surface),
    ink: String(theme.colorScheme.onBackground),
    ink2: theme.colorScheme.onSurfaceVariant ? String(theme.colorScheme.onSurfaceVariant) : String(theme.colorScheme.onSurface),
    font: theme.typography?.fontFamily || "system-ui, sans-serif",
    dfont: theme.typography?.displayFontFamily || theme.typography?.fontFamily || "system-ui, sans-serif",
    rs: theme.tokens?.corners?.medium !== undefined ? `${theme.tokens.corners.medium}px` : "8px",
    rl: theme.tokens?.corners?.large !== undefined ? `${theme.tokens.corners.large}px` : "16px",
    pad: theme.tokens?.density?.baseSpacing !== undefined ? `${theme.tokens.density.baseSpacing}px` : "16px",
  };

  return tokens;
}
