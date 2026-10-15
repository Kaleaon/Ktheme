/**
 * Core Tokens Studio and W3C DTCG Format Importer SDK
 *
 * Implements token ingestion, multi-hop alias resolution, color normalization,
 * composite typography & shadow token conversion, and mapping to Ktheme Theme specs.
 */

import { Theme, ColorScheme, Typography, VisualEffects, DesignTokens } from "../core/types";
import { parseColorToHex, generatePaletteFromSeed, getContrastColor } from "../utils/colors";

/**
 * Standard token node structure following W3C DTCG draft & Tokens Studio specs.
 */
export interface StudioTokenNode {
  $value?: any;
  value?: any;
  $type?: string;
  type?: string;
  $description?: string;
  description?: string;
  $extensions?: Record<string, any>;
  [key: string]: any;
}

export interface ResolvedToken {
  path: string;
  type: string;
  value: any;
  rawValue: any;
  description?: string;
}

export interface TokensStudioImporterOptions {
  /**
   * Specific token set names to activate/merge (e.g. ["global", "dark"]).
   * If omitted, all non-metadata sets or $themes active sets will be merged.
   */
  activeSets?: string[];
  /**
   * Name/ID for the output theme
   */
  themeName?: string;
}

export interface TokensStudioParseResult {
  tokens: Record<string, ResolvedToken>;
  flatValues: Record<string, any>;
  metadata: {
    name: string;
    sets: string[];
    tokenCount: number;
  };
  warnings: string[];
}

export interface ConvertOptions extends TokensStudioImporterOptions {
  themeId?: string;
  author?: string;
  darkMode?: boolean;
}

/**
 * Check if a JS object represents a leaf token node (has value or $value property)
 */
function isTokenNode(obj: any): boolean {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return false;
  }
  return "$value" in obj || "value" in obj;
}

/**
 * Extract token value from token node
 */
function getTokenRawValue(node: StudioTokenNode): any {
  if ("$value" in node) return node.$value;
  if ("value" in node) return node.value;
  return node;
}

/**
 * Extract token type from token node
 */
function getTokenType(node: StudioTokenNode): string {
  if ("$type" in node) return String(node.$type);
  if ("type" in node) return String(node.type);
  return "unknown";
}

export class TokensStudioImporter {
  private options: TokensStudioImporterOptions;

  constructor(options: TokensStudioImporterOptions = {}) {
    this.options = options;
  }

  /**
   * Parses Tokens Studio or DTCG JSON into resolved tokens with multi-hop alias resolution.
   */
  public parse(jsonInput: string | Record<string, any>): TokensStudioParseResult {
    let rawObj: Record<string, any>;
    if (typeof jsonInput === "string") {
      try {
        rawObj = JSON.parse(jsonInput);
      } catch (err: any) {
        throw new Error(`Invalid JSON provided to TokensStudioImporter: ${err.message}`);
      }
    } else {
      rawObj = jsonInput;
    }

    const warnings: string[] = [];
    const rawTokensByPath: Record<string, { value: any; type: string; description?: string }> = {};
    const availableSets: string[] = [];

    // Determine top-level sets or root structure
    const isMultiSetFormat =
      !isTokenNode(rawObj) &&
      Object.keys(rawObj).some(
        (key) =>
          !key.startsWith("$") &&
          typeof rawObj[key] === "object" &&
          rawObj[key] !== null &&
          !isTokenNode(rawObj[key])
      );

    if (isMultiSetFormat) {
      const activeSets = this.options.activeSets;
      let targetSets: string[] = [];

      if (activeSets && activeSets.length > 0) {
        targetSets = activeSets;
      } else if (Array.isArray(rawObj.$themes) && rawObj.$themes.length > 0) {
        // Look for default active sets from $themes metadata
        const activeTheme = rawObj.$themes.find((t: any) => t.group || t.selectedTokenSets) || rawObj.$themes[0];
        if (activeTheme && activeTheme.selectedTokenSets) {
          targetSets = Object.keys(activeTheme.selectedTokenSets).filter(
            (setName) => activeTheme.selectedTokenSets[setName] !== "disabled"
          );
        }
      }

      if (targetSets.length === 0) {
        // Collect all top-level set keys except $ metadata
        targetSets = Object.keys(rawObj).filter((k) => !k.startsWith("$"));
      }

      for (const setName of targetSets) {
        if (rawObj[setName] && typeof rawObj[setName] === "object") {
          availableSets.push(setName);
          this.traverseTokenTree(rawObj[setName], setName, rawTokensByPath, warnings, undefined, setName);
        }
      }
    } else {
      availableSets.push("root");
      this.traverseTokenTree(rawObj, "", rawTokensByPath, warnings);
    }

    // Resolve aliases across rawTokensByPath
    const resolvedTokens: Record<string, ResolvedToken> = {};
    const flatValues: Record<string, any> = {};

    for (const [path, rawToken] of Object.entries(rawTokensByPath)) {
      const resolvedValue = this.resolveValue(rawToken.value, rawTokensByPath, new Set([path]), warnings);
      let normalizedType = rawToken.type;

      // Infer type if unknown
      if (normalizedType === "unknown") {
        if (typeof resolvedValue === "string" && (resolvedValue.startsWith("#") || resolvedValue.startsWith("rgb") || resolvedValue.startsWith("hsl"))) {
          normalizedType = "color";
        } else if (typeof resolvedValue === "object" && resolvedValue !== null && ("fontFamily" in resolvedValue || "fontSize" in resolvedValue)) {
          normalizedType = "typography";
        }
      }

      let finalValue = resolvedValue;

      // Process type-specific transformations
      if (normalizedType === "color" || path.includes("color")) {
        if (typeof resolvedValue === "string") {
          finalValue = parseColorToHex(resolvedValue);
        }
      } else if (normalizedType === "typography" && typeof resolvedValue === "object" && resolvedValue !== null) {
        finalValue = this.processCompositeTypography(resolvedValue, rawTokensByPath, warnings);
      } else if ((normalizedType === "boxShadow" || normalizedType === "shadow") && resolvedValue) {
        finalValue = this.processShadowToken(resolvedValue, rawTokensByPath, warnings);
      }

      resolvedTokens[path] = {
        path,
        type: normalizedType,
        value: finalValue,
        rawValue: rawToken.value,
        description: rawToken.description,
      };

      flatValues[path] = finalValue;

      // Also set shorthand path (e.g. "primary" alongside "colors.primary" or "global.colors.primary")
      const pathParts = path.split(".");
      const shorthand = pathParts[pathParts.length - 1];
      if (!(shorthand in flatValues)) {
        flatValues[shorthand] = finalValue;
      }
    }

    return {
      tokens: resolvedTokens,
      flatValues,
      metadata: {
        name: this.options.themeName || "Imported Tokens Studio Theme",
        sets: availableSets,
        tokenCount: Object.keys(resolvedTokens).length,
      },
      warnings,
    };
  }

  /**
   * Converts Tokens Studio / DTCG JSON directly into a Ktheme Theme definition.
   */
  public convertToKTheme(jsonInput: string | Record<string, any>, options: ConvertOptions = {}): Theme {
    const parseResult = this.parse(jsonInput);
    const { flatValues, tokens } = parseResult;

    const themeId = options.themeId || options.themeName?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "imported-tokens-studio";
    const themeName = options.themeName || parseResult.metadata.name;
    const author = options.author || "Tokens Studio Importer";
    const darkMode = options.darkMode ?? false;

    // Build MD3 ColorScheme
    const seedColor = this.findColorToken(flatValues, ["primary", "brand", "primary.500", "brand.500", "colors.primary", "colors.brand.500"]) || "#6750A4";
    const generatedPalette = generatePaletteFromSeed(seedColor);

    const findColor = (keys: string[], defaultColor: string): string => {
      const found = this.findColorToken(flatValues, keys);
      return found ? parseColorToHex(found) : defaultColor;
    };

    const primary = findColor(["primary", "colors.primary", "sys.color.primary"], seedColor);
    const onPrimary = findColor(["onPrimary", "on-primary", "colors.onPrimary", "colors.on-primary"], getContrastColor(primary));
    const secondary = findColor(
      ["secondary", "colors.secondary"],
      generatedPalette.secondary ? parseColorToHex(generatedPalette.secondary) : "#625B71"
    );
    const onSecondary = findColor(["onSecondary", "colors.onSecondary"], getContrastColor(secondary));
    const background = findColor(["background", "bg", "colors.background", "colors.bg"], darkMode ? "#141218" : "#FEF7FF");
    const onBackground = findColor(["onBackground", "text", "colors.onBackground", "colors.text"], darkMode ? "#E6E0E9" : "#1D1B20");
    const surface = findColor(["surface", "colors.surface"], darkMode ? "#141218" : "#FEF7FF");
    const onSurface = findColor(["onSurface", "colors.onSurface"], darkMode ? "#E6E0E9" : "#1D1B20");
    const surfaceVariant = findColor(["surfaceVariant", "colors.surfaceVariant"], darkMode ? "#49454F" : "#E7E0EC");
    const onSurfaceVariant = findColor(["onSurfaceVariant", "colors.onSurfaceVariant"], darkMode ? "#CAC4D0" : "#49454F");
    const outline = findColor(["outline", "colors.outline"], darkMode ? "#938F99" : "#79747E");
    const outlineVariant = findColor(["outlineVariant", "colors.outlineVariant"], darkMode ? "#49454F" : "#CAC4D0");
    const error = findColor(["error", "colors.error"], "#B3261E");
    const onError = findColor(["onError", "colors.onError"], "#FFFFFF");
    const tertiary = findColor(
      ["tertiary", "colors.tertiary"],
      generatedPalette.tertiary ? parseColorToHex(generatedPalette.tertiary) : "#7D5260"
    );
    const onTertiary = findColor(["onTertiary", "colors.onTertiary"], getContrastColor(tertiary));

    const colorScheme: ColorScheme = {
      primary,
      onPrimary,
      primaryContainer: generatedPalette.primaryContainer || primary,
      onPrimaryContainer: generatedPalette.onPrimaryContainer || onPrimary,
      secondary,
      onSecondary,
      secondaryContainer: generatedPalette.secondaryContainer || secondary,
      onSecondaryContainer: generatedPalette.onSecondaryContainer || onSecondary,
      tertiary,
      onTertiary,
      tertiaryContainer: generatedPalette.tertiaryContainer || tertiary,
      onTertiaryContainer: generatedPalette.onTertiaryContainer || onTertiary,
      error,
      onError,
      errorContainer: error,
      onErrorContainer: onError,
      background,
      onBackground,
      surface,
      onSurface,
      surfaceVariant,
      onSurfaceVariant,
      outline,
      outlineVariant,
      scrim: "#000000",
      inverseSurface: onSurface,
      inverseOnSurface: surface,
      inversePrimary: primary,
    };

    // Extract Typography
    const fontFamily = String(flatValues["fontFamily"] || flatValues["fontFamilies.body"] || flatValues["font"] || "system-ui, sans-serif");
    const displayFontFamily = String(flatValues["displayFontFamily"] || flatValues["fontFamilies.heading"] || fontFamily);

    const typography: Typography = {
      fontFamily,
      displayFontFamily,
      fontSize: {
        small: this.parseNumericToken(flatValues, ["fontSize.small", "fontSizes.sm", "fontSize.sm", "small"], 12),
        medium: this.parseNumericToken(flatValues, ["fontSize.medium", "fontSizes.md", "fontSize.md", "medium"], 16),
        large: this.parseNumericToken(flatValues, ["fontSize.large", "fontSizes.lg", "fontSize.lg", "large"], 20),
        xlarge: this.parseNumericToken(flatValues, ["fontSize.xlarge", "fontSizes.xl", "fontSize.xl", "xlarge"], 28),
      },
      fontWeight: {
        light: this.parseNumericToken(flatValues, ["fontWeight.light", "fontWeights.light"], 300),
        regular: this.parseNumericToken(flatValues, ["fontWeight.regular", "fontWeights.regular"], 400),
        medium: this.parseNumericToken(flatValues, ["fontWeight.medium", "fontWeights.medium"], 500),
        bold: this.parseNumericToken(flatValues, ["fontWeight.bold", "fontWeights.bold"], 700),
      },
      lineHeight: this.parseNumericToken(flatValues, ["lineHeight", "lineHeights.normal"], 1.5),
      letterSpacing: this.parseNumericToken(flatValues, ["letterSpacing", "letterSpacings.normal"], 0),
    };

    // Extract Design Tokens & Visual Effects
    const cornerSmall = this.parseNumericToken(flatValues, ["borderRadius.sm", "borderRadius.small"], 4);
    const cornerMedium = this.parseNumericToken(flatValues, ["borderRadius.md", "borderRadius.medium", "borderRadius"], 8);
    const cornerLarge = this.parseNumericToken(flatValues, ["borderRadius.lg", "borderRadius.large"], 16);

    const tokensConfig: DesignTokens = {
      density: {
        scale: 1,
        baseSpacing: this.parseNumericToken(flatValues, ["spacing.md", "spacing.base", "spacing"], 16),
      },
      corners: {
        small: cornerSmall,
        medium: cornerMedium,
        large: cornerLarge,
        xlarge: cornerLarge * 1.5,
      },
    };

    const shadowsToken = this.findShadowToken(tokens);
    const effects: VisualEffects = {
      shadows: {
        enabled: Boolean(shadowsToken),
        elevation: 2,
        blur: shadowsToken?.blur || 8,
        color: shadowsToken?.color || "#00000040",
      },
    };

    const now = new Date().toISOString();
    return {
      schemaVersion: 2,
      metadata: {
        id: themeId,
        name: themeName,
        description: `Theme imported from Tokens Studio / DTCG specifications.`,
        author,
        version: "1.0.0",
        tags: ["imported", "tokens-studio", darkMode ? "dark" : "light"],
        createdAt: now,
        updatedAt: now,
      },
      darkMode,
      colorScheme,
      typography,
      tokens: tokensConfig,
      effects,
    };
  }

  private traverseTokenTree(
    node: any,
    prefix: string,
    out: Record<string, { value: any; type: string; description?: string }>,
    warnings: string[],
    parentType?: string,
    rootSetName?: string
  ): void {
    if (!node || typeof node !== "object") return;

    const recordToken = (path: string, val: any, type: string, desc?: string) => {
      const entry = { value: val, type, description: desc };
      out[path] = entry;
      if (rootSetName && path.startsWith(`${rootSetName}.`)) {
        const setRelativePath = path.slice(rootSetName.length + 1);
        if (setRelativePath) {
          out[setRelativePath] = entry;
        }
      }
    };

    if (isTokenNode(node)) {
      const val = getTokenRawValue(node);
      const type = getTokenType(node) !== "unknown" ? getTokenType(node) : parentType || "unknown";
      const desc = node.$description || node.description;
      if (prefix) {
        recordToken(prefix, val, type, desc);
      }
      return;
    }

    const currentGroupType = node.$type || node.type || parentType;

    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$") && key !== "$value" && key !== "$type" && key !== "$description") continue;
      if (key === "type" && typeof child === "string") continue;

      const path = prefix ? `${prefix}.${key}` : key;

      if (child && typeof child === "object") {
        if (isTokenNode(child)) {
          const childNode = child as any;
          const val = getTokenRawValue(childNode);
          const type = getTokenType(childNode) !== "unknown" ? getTokenType(childNode) : currentGroupType || "unknown";
          const desc = childNode.$description || childNode.description;
          recordToken(path, val, type, desc);
        } else {
          this.traverseTokenTree(child, path, out, warnings, currentGroupType, rootSetName);
        }
      }
    }
  }

  private resolveValue(
    value: any,
    rawTokens: Record<string, { value: any; type: string; description?: string }>,
    visited: Set<string>,
    warnings: string[]
  ): any {
    if (typeof value === "string") {
      // Check if value is a pure reference string e.g. "{colors.brand.500}"
      const directRefMatch = value.trim().match(/^\{([^}]+)\}$/);
      if (directRefMatch) {
        const refPath = directRefMatch[1].trim();
        return this.lookupAndDereference(refPath, rawTokens, visited, warnings);
      }

      // Value may contain multiple embedded references e.g. "1px solid {colors.border}"
      return value.replace(/\{([^}]+)\}/g, (match, refPath) => {
        const deref = this.lookupAndDereference(refPath.trim(), rawTokens, visited, warnings);
        return typeof deref === "string" || typeof deref === "number" ? String(deref) : match;
      });
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.resolveValue(item, rawTokens, new Set(visited), warnings));
    }

    if (value && typeof value === "object") {
      const resolvedObj: Record<string, any> = {};
      for (const [k, v] of Object.entries(value)) {
        resolvedObj[k] = this.resolveValue(v, rawTokens, new Set(visited), warnings);
      }
      return resolvedObj;
    }

    return value;
  }

  private lookupAndDereference(
    refPath: string,
    rawTokens: Record<string, { value: any; type: string; description?: string }>,
    visited: Set<string>,
    warnings: string[]
  ): any {
    // Strip trailing .value or .$value if present in alias reference
    const cleanRef = refPath.replace(/\.(\$)?value$/, "");

    if (visited.has(cleanRef)) {
      const msg = `Circular token alias detected: ${Array.from(visited).join(" -> ")} -> ${cleanRef}`;
      warnings.push(msg);
      return `{${refPath}}`;
    }

    // Try direct match or nested set match
    let matchedToken = rawTokens[cleanRef] || rawTokens[refPath];

    if (!matchedToken) {
      // Try finding path suffix across sets (e.g. searching "colors.brand" in "global.colors.brand")
      const matchedKey = Object.keys(rawTokens).find(
        (k) => k === cleanRef || k.endsWith(`.${cleanRef}`) || k === refPath
      );
      if (matchedKey) {
        matchedToken = rawTokens[matchedKey];
      }
    }

    if (!matchedToken) {
      warnings.push(`Unresolved token reference: {${refPath}}`);
      return `{${refPath}}`;
    }

    const nextVisited = new Set(visited);
    nextVisited.add(cleanRef);
    return this.resolveValue(matchedToken.value, rawTokens, nextVisited, warnings);
  }

  private processCompositeTypography(
    val: any,
    rawTokens: Record<string, any>,
    warnings: string[]
  ): any {
    if (typeof val !== "object" || val === null) return val;
    return {
      fontFamily: val.fontFamily || val.fontFamilies || "sans-serif",
      fontSize: val.fontSize || val.fontSizes || 16,
      fontWeight: val.fontWeight || val.fontWeights || 400,
      lineHeight: val.lineHeight || val.lineHeights || 1.5,
      letterSpacing: val.letterSpacing || val.letterSpacings || 0,
    };
  }

  private processShadowToken(val: any, rawTokens: Record<string, any>, warnings: string[]): any {
    const shadowObj = Array.isArray(val) ? val[0] : val;
    if (!shadowObj || typeof shadowObj !== "object") return val;

    return {
      color: shadowObj.color ? parseColorToHex(String(shadowObj.color)) : "#00000040",
      x: shadowObj.x || shadowObj.offsetX || 0,
      y: shadowObj.y || shadowObj.offsetY || 4,
      blur: shadowObj.blur || 8,
      spread: shadowObj.spread || 0,
    };
  }

  private findColorToken(flatValues: Record<string, any>, keys: string[]): string | undefined {
    for (const k of keys) {
      if (k in flatValues && typeof flatValues[k] === "string") {
        return flatValues[k];
      }
    }
    const foundEntry = Object.entries(flatValues).find(
      ([path, val]) =>
        typeof val === "string" &&
        keys.some((k) => path.toLowerCase().endsWith(k.toLowerCase()))
    );
    return foundEntry ? foundEntry[1] : undefined;
  }

  private findShadowToken(tokens: Record<string, ResolvedToken>): { color?: string; blur?: number } | undefined {
    const shadowToken = Object.values(tokens).find(
      (t) => t.type === "boxShadow" || t.type === "shadow" || t.path.includes("shadow")
    );
    if (!shadowToken || !shadowToken.value) return undefined;

    const shadowVal = Array.isArray(shadowToken.value) ? shadowToken.value[0] : shadowToken.value;
    if (typeof shadowVal === "object" && shadowVal !== null) {
      return {
        color: shadowVal.color,
        blur: typeof shadowVal.blur === "number" ? shadowVal.blur : parseFloat(String(shadowVal.blur)) || 8,
      };
    }
    return undefined;
  }

  private parseNumericToken(flatValues: Record<string, any>, keys: string[], defaultValue: number): number {
    for (const key of keys) {
      if (key in flatValues) {
        const val = flatValues[key];
        if (typeof val === "number") return val;
        if (typeof val === "string") {
          const parsed = parseFloat(val);
          if (!isNaN(parsed)) return parsed;
        }
      }
    }
    return defaultValue;
  }
}

/**
 * Convenience function to parse Tokens Studio JSON string or object
 */
export function parseTokensStudio(
  jsonInput: string | Record<string, any>,
  options?: TokensStudioImporterOptions
): TokensStudioParseResult {
  const importer = new TokensStudioImporter(options);
  return importer.parse(jsonInput);
}

/**
 * Convenience function to convert Tokens Studio JSON directly to Ktheme Theme
 */
export function tokensStudioToKTheme(
  jsonInput: string | Record<string, any>,
  options?: ConvertOptions
): Theme {
  const importer = new TokensStudioImporter(options);
  return importer.convertToKTheme(jsonInput, options);
}
