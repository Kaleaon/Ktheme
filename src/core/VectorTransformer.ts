import { Color, IconAdaptation, IconToken, Theme, VectorPath } from './types';
import { toHexColor } from '../exporters/utils';

export interface VectorIRPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin?: "miter" | "round" | "bevel";
  fillRule?: "nonzero" | "evenodd";
  opacity?: number;
}

export interface VectorIRNode {
  id: string;
  name: string;
  width: number;
  height: number;
  viewBox: { x: number; y: number; width: number; height: number };
  paths: VectorIRPath[];
}

// Top-level regular expression constants
const SCRIPT_REGEX = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const FOREIGN_OBJECT_REGEX = /<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi;
const IMAGE_REGEX = /<image[\s\S]*?>/gi;
const ON_EVENT_QUOTED_REGEX = /\s+on[a-z]+\s*=\s*(['"]).*?\1/gi;
const ON_EVENT_UNQUOTED_REGEX = /\s+on[a-z]+\s*=\s*[^\s>]+/gi;
const JAVASCRIPT_URL_REGEX = /(href|xlink:href)\s*=\s*(['"])javascript:.*?\2/gi;

const PATH_REGEX = /<path[^>]*\sd\s*=\s*(['"])(.*?)\1[^>]*\/?>/gi;
const FILL_ATTR_REGEX = /fill\s*=\s*(['"])(.*?)\1/i;
const STROKE_ATTR_REGEX = /stroke\s*=\s*(['"])(.*?)\1/i;
const STROKE_WIDTH_ATTR_REGEX = /stroke-width\s*=\s*(['"])(.*?)\1/i;
const RECT_REGEX = /<rect[^>]*\sx\s*=\s*(['"])(.*?)\1[^>]*\sy\s*=\s*(['"])(.*?)\3[^>]*\swidth\s*=\s*(['"])(.*?)\5[^>]*\sheight\s*=\s*(['"])(.*?)\7[^>]*\/?>/gi;
const CIRCLE_REGEX = /<circle[^>]*\scx\s*=\s*(['"])(.*?)\1[^>]*\scy\s*=\s*(['"])(.*?)\3[^>]*\sr\s*=\s*(['"])(.*?)\5[^>]*\/?>/gi;

const THEME_PREFIX_REGEX = /^theme\.colorScheme\./;

// Bounded LRU cache for SVG parsing results (500 capacity)
const SVG_PATH_CACHE_CAPACITY = 500;
const svgPathCache = new Map<string, VectorPath[]>();

export class VectorTransformer {
  /**
   * Resets the memoized SVG path cache. Useful for test suites and memory cleanup.
   */
  static clearCache(): void {
    svgPathCache.clear();
  }

  /**
   * Sanitizes an SVG string to remove unsafe elements and attributes:
   * script tags, inline event handlers (on*), external image references (<image>, <foreignObject>),
   * href/xlink:href pointing to external URLs.
   */
  static sanitizeSvg(svg: string): string {
    let sanitized = svg;
    SCRIPT_REGEX.lastIndex = 0;
    sanitized = sanitized.replace(SCRIPT_REGEX, "");
    FOREIGN_OBJECT_REGEX.lastIndex = 0;
    sanitized = sanitized.replace(FOREIGN_OBJECT_REGEX, "");
    IMAGE_REGEX.lastIndex = 0;
    sanitized = sanitized.replace(IMAGE_REGEX, "");
    ON_EVENT_QUOTED_REGEX.lastIndex = 0;
    sanitized = sanitized.replace(ON_EVENT_QUOTED_REGEX, "");
    ON_EVENT_UNQUOTED_REGEX.lastIndex = 0;
    sanitized = sanitized.replace(ON_EVENT_UNQUOTED_REGEX, "");
    JAVASCRIPT_URL_REGEX.lastIndex = 0;
    sanitized = sanitized.replace(JAVASCRIPT_URL_REGEX, "");
    return sanitized;
  }

  /**
   * Parse SVG string or IconToken and produce normalized VectorIRNode
   */
  static transformIcon(token: IconToken, theme?: Theme): VectorIRNode {
    let viewBox = { x: 0, y: 0, width: 24, height: 24 };
    if (token.viewBox) {
      const parts = token.viewBox
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      if (parts.length === 4 && parts.every((p) => !isNaN(p))) {
        viewBox = {
          x: parts[0],
          y: parts[1],
          width: parts[2],
          height: parts[3],
        };
      }
    }

    const iconAdaptation: IconAdaptation | undefined = theme?.adaptation?.icons;
    const sizeScale = iconAdaptation?.sizeScale ?? 1.0;
    const targetStrokeWidth = iconAdaptation?.strokeWidth;

    const width = (token.width ?? viewBox.width) * sizeScale;
    const height = (token.height ?? viewBox.height) * sizeScale;

    let rawPaths: VectorPath[] = token.paths ? [...token.paths] : [];

    // If token has SVG string, parse paths if paths array is empty
    if (rawPaths.length === 0 && token.svg) {
      rawPaths = VectorTransformer.parseSvgPaths(token.svg);
    }

    const irPaths: VectorIRPath[] = rawPaths.map(p => {
      let fill = p.fill ? VectorTransformer.resolveColor(p.fill, token.colorBindings, theme) : undefined;
      const stroke = p.stroke ? VectorTransformer.resolveColor(p.stroke, token.colorBindings, theme) : undefined;

      // Default fill to primary or onSurface if neither fill nor stroke is set
      if (!fill && !stroke) {
        fill = theme ? toHexColor(theme.colorScheme.primary) : "#000000";
      }

      let strokeWidth = p.strokeWidth;
      if (targetStrokeWidth !== undefined) {
        strokeWidth = targetStrokeWidth;
      } else if (strokeWidth !== undefined && sizeScale !== 1.0) {
        strokeWidth = strokeWidth * sizeScale;
      }

      return {
        d: p.d,
        fill,
        stroke,
        strokeWidth,
        strokeLinecap: p.strokeLinecap,
        strokeLinejoin: p.strokeLinejoin,
        fillRule: p.fillRule,
        opacity: p.opacity,
      };
    });

    return {
      id: token.id,
      name: token.name,
      width,
      height,
      viewBox,
      paths: irPaths,
    };
  }

  /**
   * Helper to parse SVG path elements from a raw SVG string.
   * Memoized via a bounded 500-entry LRU cache. Returns a shallow clone of path elements.
   */
  static parseSvgPaths(svgString: string): VectorPath[] {
    const cached = svgPathCache.get(svgString);
    if (cached) {
      // Move key to end to mark as most recently used
      svgPathCache.delete(svgString);
      svgPathCache.set(svgString, cached);
      return cached.map(p => ({ ...p }));
    }

    const cleanSvg = VectorTransformer.sanitizeSvg(svgString);
    const paths: VectorPath[] = [];

    // Match path d="..."
    PATH_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = PATH_REGEX.exec(cleanSvg)) !== null) {
      const fullElement = match[0];
      const d = match[2];

      const fillMatch = FILL_ATTR_REGEX.exec(fullElement);
      const strokeMatch = STROKE_ATTR_REGEX.exec(fullElement);
      const strokeWidthMatch = STROKE_WIDTH_ATTR_REGEX.exec(fullElement);

      paths.push({
        d,
        fill: fillMatch ? fillMatch[2] : undefined,
        stroke: strokeMatch ? strokeMatch[2] : undefined,
        strokeWidth: strokeWidthMatch
          ? parseFloat(strokeWidthMatch[2])
          : undefined,
      });
    }

    // Match rect x="..." y="..." width="..." height="..."
    RECT_REGEX.lastIndex = 0;
    while ((match = RECT_REGEX.exec(cleanSvg)) !== null) {
      const x = parseFloat(match[2]);
      const y = parseFloat(match[4]);
      const w = parseFloat(match[6]);
      const h = parseFloat(match[8]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h)) {
        const d = `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;
        paths.push({ d });
      }
    }

    // Match circle cx="..." cy="..." r="..."
    CIRCLE_REGEX.lastIndex = 0;
    while ((match = CIRCLE_REGEX.exec(cleanSvg)) !== null) {
      const cx = parseFloat(match[2]);
      const cy = parseFloat(match[4]);
      const r = parseFloat(match[6]);
      if (!isNaN(cx) && !isNaN(cy) && !isNaN(r)) {
        const d = `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${
          2 * r
        } 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
        paths.push({ d });
      }
    }

    // Evict oldest entry if capacity reached
    if (svgPathCache.size >= SVG_PATH_CACHE_CAPACITY) {
      const oldestKey = svgPathCache.keys().next().value;
      if (oldestKey !== undefined) {
        svgPathCache.delete(oldestKey);
      }
    }
    svgPathCache.set(svgString, paths);

    return paths.map(p => ({ ...p }));
  }

  /**
   * Resolves color references / bindings to explicit Hex colors using Theme ColorScheme
   */
  static resolveColor(
    colorVal: unknown,
    bindings?: Record<string, string>,
    theme?: Theme,
  ): string {
    if (typeof colorVal !== "string") {
      return toHexColor(colorVal as Parameters<typeof toHexColor>[0]);
    }

    if (colorVal === "none" || colorVal === "transparent") {
      return colorVal;
    }

    // Check colorBindings
    let resolvedRole = colorVal;
    if (bindings && bindings[colorVal]) {
      resolvedRole = bindings[colorVal];
    }

    // Strip theme prefix if present (e.g. "theme.colorScheme.primary" -> "primary")
    resolvedRole = resolvedRole.replace(THEME_PREFIX_REGEX, "");

    if (theme && theme.colorScheme) {
      const cs = theme.colorScheme as unknown as Record<string, Color>;
      if (cs[resolvedRole] !== undefined) {
        return toHexColor(cs[resolvedRole] as Parameters<typeof toHexColor>[0]);
      }
      const rawColorScheme = theme.colorScheme as unknown as Record<string, unknown>;
      const semanticRoles = rawColorScheme.semanticRoles as unknown as
        | Record<string, unknown>
        | undefined;
      if (semanticRoles && semanticRoles[resolvedRole] !== undefined) {
        return toHexColor(semanticRoles[resolvedRole] as Parameters<typeof toHexColor>[0]);
      }
    }

    if (colorVal.startsWith("#")) {
      return colorVal;
    }

    return colorVal;
  }
}
