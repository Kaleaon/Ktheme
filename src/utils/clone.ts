/**
 * Utility function to deep clone theme objects or values using native structuredClone.
 * Eliminates JSON stringify/parse overhead while maintaining complete object isolation.
 *
 * @template T - The type of object or value being cloned
 * @param theme - The theme object or value to deep clone
 * @returns A deep copy of the theme with isolated references
 */
export function cloneTheme<T>(theme: T): T {
  const globalWithSC = globalThis as unknown as { structuredClone?: (val: unknown) => unknown };
  if (typeof globalWithSC.structuredClone === 'function') {
    return globalWithSC.structuredClone(theme) as T;
  }

  if (typeof structuredClone === 'function') {
    return structuredClone(theme);
  }

  return fallbackClone(theme);
}

function fallbackClone<T>(val: T): T {
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map((item) => fallbackClone(item)) as unknown as T;
  }
  const copy: Record<string, unknown> = {};
  const obj = val as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    copy[key] = fallbackClone(obj[key]);
  }
  return copy as T;
}
