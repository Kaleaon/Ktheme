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
export function cloneTheme<T>(obj: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cloneTheme) as unknown as T;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }
  const copy = {} as Record<string | symbol, unknown>;
  for (const key of Reflect.ownKeys(obj)) {
    copy[key] = cloneTheme((obj as Record<string | symbol, unknown>)[key]);
  }
  return copy as T;
}
