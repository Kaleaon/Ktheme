/**
 * Centralized support export for Ktheme and design system runtimes.
 * Provides document parsing, data prop extraction, and runtime boot helpers.
 */

export interface DcDocumentParsed {
  template: string;
  js: string;
  props: Record<string, unknown> | null;
  preview: Record<string, unknown> | null;
}

export function parseDcDocument(
  doc: Document = typeof document !== "undefined"
    ? document
    : (null as unknown as Document),
): DcDocumentParsed | null {
  if (!doc) return null;
  const dc = doc.querySelector("x-dc");
  if (!dc) return null;
  const scriptEl = doc.querySelector("script[data-dc-script]");
  const rawProps = scriptEl?.getAttribute("data-props") ?? null;
  const { props, preview } = parseDataProps(rawProps);

  return {
    template: dc.innerHTML,
    js: scriptEl ? scriptEl.textContent || "" : "",
    props,
    preview,
  };
}

export function parseDataProps(raw: string | null): {
  props: Record<string, unknown> | null;
  preview: Record<string, unknown> | null;
} {
  if (!raw) return { props: null, preview: null };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { props: null, preview: null };
    }
    const preview =
      parsed.$preview && typeof parsed.$preview === "object"
        ? (parsed.$preview as Record<string, unknown>)
        : null;
    const props: Record<string, unknown> = {};
    for (const key of Object.keys(parsed)) {
      if (key[0] !== "$") props[key] = parsed[key];
    }
    return { props: Object.keys(props).length ? props : null, preview };
  } catch {
    /* ignore malformed JSON */
  }
  return { props: null, preview: null };
}

export function dcNameFromPath(
  pathname: string = typeof window !== "undefined"
    ? window.location.pathname
    : "",
): string {
  let p = pathname || "";
  try {
    p = decodeURIComponent(p);
  } catch {
    /* ignore decode error */
  }
  const base = p.split("/").pop() || "Root";
  return base.replace(/\.dc\.html$/, "").replace(/\.html?$/, "") || "Root";
}

export const KTHEME_SUPPORT_VERSION = "1.0.0";
