/**
 * Batched CSS variable DOM mutation system to prevent unnecessary React re-renders
 * and layout thrashing during dynamic token updates.
 */

type StyleMap = Record<string, string>;

const pendingMutations: Map<HTMLElement, StyleMap> = new Map();
let rafId: number | null = null;

function flushMutations() {
  pendingMutations.forEach((styles, element) => {
    if (!element || !element.style) return;
    Object.entries(styles).forEach(([prop, val]) => {
      if (val !== undefined && val !== null) {
        element.style.setProperty(prop, val);
      } else {
        element.style.removeProperty(prop);
      }
    });
  });
  pendingMutations.clear();
  rafId = null;
}

/**
 * Batches CSS variable mutations on a target DOM element.
 *
 * @param element Target DOM element (defaults to document.documentElement)
 * @param styles Map of CSS custom property names (e.g. '--md-sys-color-primary') and values
 */
export function batchSetCssVariables(
  element: HTMLElement | null | undefined,
  styles: StyleMap
): void {
  const targetEl = element || (typeof document !== 'undefined' ? document.documentElement : null);
  if (!targetEl) return;

  const existing = pendingMutations.get(targetEl) || {};
  pendingMutations.set(targetEl, { ...existing, ...styles });

  if (rafId === null) {
    if (typeof requestAnimationFrame === 'function') {
      rafId = requestAnimationFrame(flushMutations);
    } else {
      flushMutations();
    }
  }
}

/**
 * Synchronously flushes any pending CSS variable DOM mutations.
 */
export function flushCssVariables(): void {
  if (rafId !== null) {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
    }
    flushMutations();
  }
}
