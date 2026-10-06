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

  return (
    fallback ||
    `var(--md-sys-color-${String(tokenName)}, var(--ktheme-${String(
      tokenName,
    )}))`
  );
}

/**
 * Returns the CSS variable expression for a Ktheme token name.
 * e.g. getKthemeCssVar('primary') -> 'var(--md-sys-color-primary)'
 */
export function getKthemeCssVar(tokenName: string, fallback?: string): string {
  const md3Name = `--md-sys-color-${tokenName
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()}`;
  if (fallback) {
    return `var(${md3Name}, var(--ktheme-${tokenName}, ${fallback}))`;
  }
  return `var(${md3Name}, var(--ktheme-${tokenName}))`;
}
