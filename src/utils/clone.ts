/**
 * Utility function to deep clone theme objects or values using native structuredClone.
 * Eliminates JSON stringify/parse overhead while maintaining complete object isolation.
 *
 * @template T - The type of object or value being cloned
 * @param obj - The theme object or value to deep clone
 * @returns A deep copy of the theme with isolated references
 */
export function cloneTheme<T>(obj: T): T {
  const sc =
    typeof structuredClone === "function"
      ? structuredClone
      : (globalThis as Record<string, unknown>).structuredClone;
  if (typeof sc === "function") {
    return sc(obj);
  }
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cloneTheme(item)) as unknown as T;
  }
  const copy = {} as Record<string, unknown>;
  const record = obj as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    copy[key] = cloneTheme(record[key]);
  }
  return copy as T;
}
