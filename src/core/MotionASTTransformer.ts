import {
  DTCGCubicBezierCoordinates,
  DTCGCubicBezierToken,
  DTCGDurationToken,
  DTCGMotionTokenGroup,
} from "../exporters/ir/tokenIR";

export interface CssMotionAST {
  duration: string;
  easing: string;
  durationReduced: string;
  easingReduced: string;
  vars: Record<string, string>;
}

export interface TailwindMotionAST {
  transitionDuration: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
}

export interface ComposeMotionAST {
  durationMillis: number;
  easing: string;
  coordinates: DTCGCubicBezierCoordinates;
  reducedDurationMillis: number;
  kotlinSnippet: string;
}

export interface SwiftUIMotionAST {
  duration: number;
  easing: string;
  coordinates: DTCGCubicBezierCoordinates;
  reducedDuration: number;
  swiftSnippet: string;
}

export interface MotionPlatformAST {
  css: CssMotionAST;
  tailwind: TailwindMotionAST;
  compose: ComposeMotionAST;
  swiftUI: SwiftUIMotionAST;
}

export const STANDARD_EASING_COORDINATES: Record<
  string,
  DTCGCubicBezierCoordinates
> = {
  linear: [0.0, 0.0, 1.0, 1.0],
  ease: [0.25, 0.1, 0.25, 1.0],
  "ease-in": [0.42, 0.0, 1.0, 1.0],
  "ease-out": [0.0, 0.0, 0.58, 1.0],
  "ease-in-out": [0.42, 0.0, 0.58, 1.0],
};

/**
 * Dedicated Motion AST Transformer module converting DTCG motion tokens
 * into target platform AST representations across web, Android, and iOS.
 */
export class MotionASTTransformer {
  /**
   * Resolves easing keyword or coordinate array to valid 4-element coordinates.
   */
  static parseCubicBezier(
    easing: string | DTCGCubicBezierCoordinates | unknown,
  ): DTCGCubicBezierCoordinates {
    if (
      Array.isArray(easing) &&
      easing.length === 4 &&
      easing.every((n) => typeof n === "number" && !Number.isNaN(n))
    ) {
      return [easing[0], easing[1], easing[2], easing[3]];
    }

    if (typeof easing === "string") {
      const normalized = easing.trim().toLowerCase();
      if (STANDARD_EASING_COORDINATES[normalized]) {
        return STANDARD_EASING_COORDINATES[normalized];
      }

      // Check if string is formatted like "cubic-bezier(x1, y1, x2, y2)"
      const match = normalized.match(
        /cubic-bezier\s*\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/,
      );
      if (match) {
        return [
          parseFloat(match[1]),
          parseFloat(match[2]),
          parseFloat(match[3]),
          parseFloat(match[4]),
        ];
      }
    }

    // Default to standard CSS ease curve
    return STANDARD_EASING_COORDINATES["ease"];
  }

  /**
   * Parses duration string or number into numeric milliseconds.
   */
  static parseDuration(value: string | number | unknown): number {
    if (typeof value === "number") {
      return Number.isNaN(value) ? 300 : Math.max(0, value);
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.endsWith("ms")) {
        const parsed = parseFloat(trimmed.slice(0, -2));
        return Number.isNaN(parsed) ? 300 : Math.max(0, parsed);
      }
      if (trimmed.endsWith("s")) {
        const parsed = parseFloat(trimmed.slice(0, -1));
        return Number.isNaN(parsed)
          ? 300
          : Math.max(0, Math.round(parsed * 1000));
      }
      const parsed = parseFloat(trimmed);
      return Number.isNaN(parsed) ? 300 : Math.max(0, parsed);
    }
    return 300;
  }

  /**
   * Formats numeric milliseconds to DTCG duration string ("ms" or "s").
   */
  static formatDuration(ms: number, unit: "ms" | "s" = "ms"): string {
    if (unit === "s") {
      const s = +(ms / 1000).toFixed(3);
      return `${s}s`;
    }
    return `${Math.round(ms)}ms`;
  }

  /**
   * Formats coordinates into standard CSS cubic-bezier string.
   */
  static formatCubicBezier(coords: DTCGCubicBezierCoordinates): string {
    return `cubic-bezier(${coords[0]}, ${coords[1]}, ${coords[2]}, ${coords[3]})`;
  }

  /**
   * Formats coordinates into Jetpack Compose CubicBezierEasing constructor.
   */
  static formatComposeEasing(coords: DTCGCubicBezierCoordinates): string {
    const f = (n: number) => (Number.isInteger(n) ? `${n}.0f` : `${n}f`);
    return `CubicBezierEasing(${f(coords[0])}, ${f(coords[1])}, ${f(
      coords[2],
    )}, ${f(coords[3])})`;
  }

  /**
   * Formats coordinates into SwiftUI Animation.timingCurve constructor.
   */
  static formatSwiftEasing(coords: DTCGCubicBezierCoordinates): string {
    return `Animation.timingCurve(${coords[0]}, ${coords[1]}, ${coords[2]}, ${coords[3]})`;
  }

  /**
   * Creates a normalized DTCGMotionTokenGroup from input options.
   */
  static createMotionTokenGroup(options?: {
    duration?: number | string;
    easing?: string | DTCGCubicBezierCoordinates;
    reducedMotionPolicy?: "none" | "reduce" | "disable";
    description?: string;
  }): DTCGMotionTokenGroup {
    const durationMs = this.parseDuration(options?.duration ?? 300);
    const coords = this.parseCubicBezier(options?.easing ?? "ease");
    const policy = options?.reducedMotionPolicy ?? "disable";

    const reducedMs =
      policy === "disable"
        ? 0
        : policy === "reduce"
          ? Math.max(0, Math.round(durationMs * 0.35))
          : durationMs;

    const durationToken: DTCGDurationToken = {
      $type: "duration",
      $value: `${durationMs}ms`,
      $description: "Default animation duration",
    };

    const easingToken: DTCGCubicBezierToken = {
      $type: "cubicBezier",
      $value: coords,
      $description: "Default animation easing curve",
    };

    const reducedDurationToken: DTCGDurationToken = {
      $type: "duration",
      $value: `${reducedMs}ms`,
      $description: "Reduced motion animation duration",
    };

    const reducedEasingToken: DTCGCubicBezierToken = {
      $type: "cubicBezier",
      $value: STANDARD_EASING_COORDINATES["linear"],
      $description: "Reduced motion animation easing curve",
    };

    return {
      $description: options?.description ?? "DTCG motion token group",
      duration: durationToken,
      easing: easingToken,
      reducedMotion: {
        $description: "Reduced motion token variations",
        duration: reducedDurationToken,
        easing: reducedEasingToken,
      },
    };
  }

  /**
   * Transforms DTCGMotionTokenGroup into CSS variables AST.
   */
  static toCss(motionTokens: DTCGMotionTokenGroup): CssMotionAST {
    const durationMs = this.parseDuration(
      motionTokens.duration?.$value ?? "300ms",
    );
    const durationStr = motionTokens.duration?.$value ?? `${durationMs}ms`;
    const coords = this.parseCubicBezier(
      motionTokens.easing?.$value ?? STANDARD_EASING_COORDINATES["ease"],
    );
    const easingStr = this.formatCubicBezier(coords);

    const reducedDurationMs = this.parseDuration(
      motionTokens.reducedMotion?.duration?.$value ?? "0ms",
    );
    const reducedDurationStr =
      motionTokens.reducedMotion?.duration?.$value ?? `${reducedDurationMs}ms`;
    const reducedCoords = this.parseCubicBezier(
      motionTokens.reducedMotion?.easing?.$value ??
        STANDARD_EASING_COORDINATES["linear"],
    );
    const reducedEasingStr = this.formatCubicBezier(reducedCoords);

    const vars: Record<string, string> = {
      "--ktheme-motion-duration": durationStr,
      "--ktheme-motion-easing": easingStr,
      "--ktheme-motion-duration-reduced": reducedDurationStr,
      "--ktheme-motion-easing-reduced": reducedEasingStr,
      // Deprecated aliases for backwards compatibility
      "--ktheme-animation-duration": durationStr,
      "--ktheme-animation-easing": easingStr,
    };

    return {
      duration: durationStr,
      easing: easingStr,
      durationReduced: reducedDurationStr,
      easingReduced: reducedEasingStr,
      vars,
    };
  }

  /**
   * Transforms DTCGMotionTokenGroup into Tailwind config AST.
   */
  static toTailwind(motionTokens: DTCGMotionTokenGroup): TailwindMotionAST {
    const css = this.toCss(motionTokens);

    return {
      transitionDuration: {
        DEFAULT: css.duration,
        motion: css.duration,
        "motion-reduced": css.durationReduced,
      },
      transitionTimingFunction: {
        DEFAULT: css.easing,
        motion: css.easing,
        "motion-reduced": css.easingReduced,
      },
    };
  }

  /**
   * Transforms DTCGMotionTokenGroup into Jetpack Compose AST.
   */
  static toCompose(motionTokens: DTCGMotionTokenGroup): ComposeMotionAST {
    const durationMillis = this.parseDuration(
      motionTokens.duration?.$value ?? "300ms",
    );
    const coords = this.parseCubicBezier(
      motionTokens.easing?.$value ?? STANDARD_EASING_COORDINATES["ease"],
    );
    const composeEasing = this.formatComposeEasing(coords);
    const reducedDurationMillis = this.parseDuration(
      motionTokens.reducedMotion?.duration?.$value ?? "0ms",
    );

    const kotlinSnippet = `object KthemeMotion {\n    val durationMillis = ${durationMillis}\n    val easing = ${composeEasing}\n    val reducedDurationMillis = ${reducedDurationMillis}\n}`;

    return {
      durationMillis,
      easing: composeEasing,
      coordinates: coords,
      reducedDurationMillis,
      kotlinSnippet,
    };
  }

  /**
   * Transforms DTCGMotionTokenGroup into SwiftUI AST.
   */
  static toSwiftUI(motionTokens: DTCGMotionTokenGroup): SwiftUIMotionAST {
    const durationMillis = this.parseDuration(
      motionTokens.duration?.$value ?? "300ms",
    );
    const durationSeconds = +(durationMillis / 1000).toFixed(3);
    const coords = this.parseCubicBezier(
      motionTokens.easing?.$value ?? STANDARD_EASING_COORDINATES["ease"],
    );
    const swiftEasing = this.formatSwiftEasing(coords);
    const reducedMillis = this.parseDuration(
      motionTokens.reducedMotion?.duration?.$value ?? "0ms",
    );
    const reducedSeconds = +(reducedMillis / 1000).toFixed(3);

    const swiftSnippet = `struct KthemeMotion {\n    let duration: Double = ${durationSeconds}\n    let easing = ${swiftEasing}\n    let reducedDuration: Double = ${reducedSeconds}\n}`;

    return {
      duration: durationSeconds,
      easing: swiftEasing,
      coordinates: coords,
      reducedDuration: reducedSeconds,
      swiftSnippet,
    };
  }

  /**
   * Full multi-platform AST transformation.
   */
  static transform(motionTokens: DTCGMotionTokenGroup): MotionPlatformAST {
    return {
      css: this.toCss(motionTokens),
      tailwind: this.toTailwind(motionTokens),
      compose: this.toCompose(motionTokens),
      swiftUI: this.toSwiftUI(motionTokens),
    };
  }

  // Instance method delegates for class-instance consumers
  transform(motionTokens: DTCGMotionTokenGroup): MotionPlatformAST {
    return MotionASTTransformer.transform(motionTokens);
  }

  toCss(motionTokens: DTCGMotionTokenGroup): CssMotionAST {
    return MotionASTTransformer.toCss(motionTokens);
  }

  toTailwind(motionTokens: DTCGMotionTokenGroup): TailwindMotionAST {
    return MotionASTTransformer.toTailwind(motionTokens);
  }

  toCompose(motionTokens: DTCGMotionTokenGroup): ComposeMotionAST {
    return MotionASTTransformer.toCompose(motionTokens);
  }

  toSwiftUI(motionTokens: DTCGMotionTokenGroup): SwiftUIMotionAST {
    return MotionASTTransformer.toSwiftUI(motionTokens);
  }
}

export const motionASTTransformer = new MotionASTTransformer();
