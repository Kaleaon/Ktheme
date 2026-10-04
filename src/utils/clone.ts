/**
 * Utility function to deep clone theme objects or values using native structuredClone.
 * Eliminates JSON stringify/parse overhead while maintaining complete object isolation.
 *
 * @template T - The type of object or value being cloned
 * @param theme - The theme object or value to deep clone
 * @returns A deep copy of the theme with isolated references
 */
export function cloneTheme<T>(theme: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(theme);
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const v8 = require('v8');
    if (v8 && typeof v8.serialize === 'function') {
      return v8.deserialize(v8.serialize(theme));
    }
  } catch {
    // fallback if not in node
  }
  return JSON.parse(JSON.stringify(theme));
}
