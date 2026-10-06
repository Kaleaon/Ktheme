import { ColorScheme, IconAdaptation, IconToken, Theme, VectorPath } from './types';
import { toHexColor } from '../exporters/utils';

export interface VectorIRPath {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  fillRule?: 'nonzero' | 'evenodd';
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

export class VectorTransformer {
  /**
   * Sanitizes an SVG string to remove unsafe elements and attributes:
   * script tags, inline event handlers (on*), external image references (<image>, <foreignObject>),
   * href/xlink:href pointing to external URLs.
   */
  static sanitizeSvg(svg: string): string {
    let sanitized = svg;
    // Remove <script>...</script>
    sanitized = sanitized.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    // Remove <foreignObject>...</foreignObject>
    sanitized = sanitized.replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '');
    // Remove <image ... />
    sanitized = sanitized.replace(/<image[\s\S]*?>/gi, '');
    // Remove inline event handlers (on*)
    sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, '');
    sanitized = sanitized.replace(/\s+on[a-z]+\s*=\s*[^\s>]+/gi, '');
    // Remove javascript: URLs in href/xlink:href
    sanitized = sanitized.replace(/(href|xlink:href)\s*=\s*(['"])javascript:.*?\2/gi, '');
    return sanitized;
  }

  /**
   * Parse SVG string or IconToken and produce normalized VectorIRNode
   */
  static transformIcon(token: IconToken, theme?: Theme): VectorIRNode {
    let viewBox = { x: 0, y: 0, width: 24, height: 24 };
    if (token.viewBox) {
      const parts = token.viewBox.trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4 && parts.every(p => !isNaN(p))) {
        viewBox = { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
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
      let stroke = p.stroke ? VectorTransformer.resolveColor(p.stroke, token.colorBindings, theme) : undefined;

      // Default fill to primary or onSurface if neither fill nor stroke is set
      if (!fill && !stroke) {
        fill = theme ? toHexColor(theme.colorScheme.primary) : '#000000';
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
        opacity: p.opacity
      };
    });

    return {
      id: token.id,
      name: token.name,
      width,
      height,
      viewBox,
      paths: irPaths
    };
  }

  /**
   * Helper to parse SVG path elements from a raw SVG string
   */
  static parseSvgPaths(svgString: string): VectorPath[] {
    const cleanSvg = VectorTransformer.sanitizeSvg(svgString);
    const paths: VectorPath[] = [];

    // Match path d="..."
    const pathRegex = /<path[^>]*\sd\s*=\s*(['"])(.*?)\1[^>]*\/?>/gi;
    let match: RegExpExecArray | null;
    while ((match = pathRegex.exec(cleanSvg)) !== null) {
      const fullElement = match[0];
      const d = match[2];

      const fillMatch = /fill\s*=\s*(['"])(.*?)\1/i.exec(fullElement);
      const strokeMatch = /stroke\s*=\s*(['"])(.*?)\1/i.exec(fullElement);
      const strokeWidthMatch = /stroke-width\s*=\s*(['"])(.*?)\1/i.exec(fullElement);

      paths.push({
        d,
        fill: fillMatch ? fillMatch[2] : undefined,
        stroke: strokeMatch ? strokeMatch[2] : undefined,
        strokeWidth: strokeWidthMatch ? parseFloat(strokeWidthMatch[2]) : undefined
      });
    }

    // Match rect x="..." y="..." width="..." height="..."
    const rectRegex = /<rect[^>]*\sx\s*=\s*(['"])(.*?)\1[^>]*\sy\s*=\s*(['"])(.*?)\1[^>]*\swidth\s*=\s*(['"])(.*?)\1[^>]*\sheight\s*=\s*(['"])(.*?)\1[^>]*\/?>/gi;
    while ((match = rectRegex.exec(cleanSvg)) !== null) {
      const x = parseFloat(match[2]);
      const y = parseFloat(match[4]);
      const w = parseFloat(match[6]);
      const h = parseFloat(match[8]);
      const d = `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;
      paths.push({ d });
    }

    // Match circle cx="..." cy="..." r="..."
    const circleRegex = /<circle[^>]*\scx\s*=\s*(['"])(.*?)\1[^>]*\scy\s*=\s*(['"])(.*?)\1[^>]*\sr\s*=\s*(['"])(.*?)\1[^>]*\/?>/gi;
    while ((match = circleRegex.exec(cleanSvg)) !== null) {
      const cx = parseFloat(match[2]);
      const cy = parseFloat(match[4]);
      const r = parseFloat(match[6]);
      const d = `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
      paths.push({ d });
    }

    return paths;
  }

  /**
   * Resolves color references / bindings to explicit Hex colors using Theme ColorScheme
   */
  static resolveColor(colorVal: any, bindings?: Record<string, string>, theme?: Theme): string {
    if (typeof colorVal !== 'string') {
      return toHexColor(colorVal);
    }

    if (colorVal === 'none' || colorVal === 'transparent') {
      return colorVal;
    }

    // Check colorBindings
    let resolvedRole = colorVal;
    if (bindings && bindings[colorVal]) {
      resolvedRole = bindings[colorVal];
    }

    // Strip theme prefix if present (e.g. "theme.colorScheme.primary" -> "primary")
    resolvedRole = resolvedRole.replace(/^theme\.colorScheme\./, '');

    if (theme && theme.colorScheme) {
      const cs = theme.colorScheme as any;
      if (cs[resolvedRole] !== undefined) {
        return toHexColor(cs[resolvedRole]);
      }
      if (cs.semanticRoles && cs.semanticRoles[resolvedRole] !== undefined) {
        return toHexColor(cs.semanticRoles[resolvedRole]);
      }
    }

    if (colorVal.startsWith('#')) {
      return colorVal;
    }

    return colorVal;
  }
}
