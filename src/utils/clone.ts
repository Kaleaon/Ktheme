/**
 * Utility function to deep clone theme objects or values using native structuredClone.
 * Eliminates JSON stringify/parse overhead while maintaining complete object isolation.
 *
 * @template T - The type of object or value being cloned
 * @param obj - The theme object or value to deep clone
 * @returns A deep copy of the theme with isolated references
 */
export function cloneTheme<T>(theme: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(theme);
  }
  if (theme === null || typeof theme !== 'object') {
    return theme;
  }
  if (Array.isArray(theme)) {
    return theme.map((item) => cloneTheme(item)) as unknown as T;
  }
  const copy = {} as Record<string, unknown>;
  const record = theme as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    copy[key] = cloneTheme(record[key]);
  }
  return copy as T;
}
