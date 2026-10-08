import { useKtheme } from "./useKtheme";
import { KthemeTokens } from "./KthemeContext";

export function useKthemeToken(): KthemeTokens;
export function useKthemeToken(
  tokenName: keyof KthemeTokens | string,
  fallback?: string,
): string;
export function useKthemeToken(
  tokenName?: keyof KthemeTokens | string,
  fallback?: string,
): KthemeTokens | string {
  const { tokens } = useKtheme();

  if (!tokenName) {
    return tokens;
  }

  const value = tokens[tokenName];
  if (value !== undefined && value !== null) {
    return value;
  }

  return getKthemeCssVar(String(tokenName), fallback);
}

/**
 * Returns the CSS variable expression for a Ktheme token name.
 * e.g. getKthemeCssVar('primary') -> 'var(--ktheme-primary, var(--md-sys-color-primary))'
 */
export function getKthemeCssVar(tokenName: string, fallback?: string): string {
  const kebab = tokenName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
  const kthemeName = `--ktheme-${kebab}`;
  const md3Name = `--md-sys-color-${kebab}`;
  if (fallback) {
    return `var(${kthemeName}, var(${md3Name}, ${fallback}))`;
  }
  return `var(${kthemeName}, var(${md3Name}))`;
}
