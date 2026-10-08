import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

export interface ComponentCatalogItem {
  id: string;
  name: string;
  description?: string;
  framework: string;
  category?: string;
  sourceFile?: string;
  props: Array<{
    name: string;
    type: string;
    defaultValue?: unknown;
    description?: string;
    required?: boolean;
    range?: { min?: number; max?: number };
  }>;
  tokenBindings?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

function findFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== "__tests__" && !entry.name.startsWith(".")) {
        results.push(...findFiles(fullPath, extensions));
      }
    } else if (entry.isFile()) {
      if (extensions.some((ext) => entry.name.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

export function extractReactComponents(
  srcPath: string,
): ComponentCatalogItem[] {
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Path not found: ${srcPath}`);
  }

  const stat = fs.statSync(srcPath);
  const files: string[] = [];

  if (stat.isDirectory()) {
    files.push(...findFiles(srcPath, [".jsx", ".tsx", ".js", ".ts"]));
  } else {
    files.push(srcPath);
  }

  const items: ComponentCatalogItem[] = [];

  for (const file of files) {
    if (file.includes(".test.") || file.includes(".spec.") || file.includes("__tests__")) {
      continue;
    }
    const content = fs.readFileSync(file, "utf-8");

    // Match component functions: function CompName(...) or const CompName = (...) =>
    const fnRegex =
      /(?:export\s+(?:default\s+)?)?function\s+([A-Z]\w*)\s*\(([\s\S]*?)\)/g;
    const arrowRegex =
      /(?:export\s+)?const\s+([A-Z]\w*)\s*=\s*(?:function\s*)?\(([\s\S]*?)\)\s*=>/g;

    const matches: Array<{ name: string; rawParams: string }> = [];
    let m: RegExpExecArray | null;

    while ((m = fnRegex.exec(content)) !== null) {
      matches.push({ name: m[1], rawParams: m[2] });
    }
    while ((m = arrowRegex.exec(content)) !== null) {
      if (!matches.some((existing) => existing.name === m![1])) {
        matches.push({ name: m[1], rawParams: m[2] });
      }
    }

    const hasThemeHook =
      content.includes("useThemeTokens") ||
      content.includes("useTheme") ||
      content.includes("useKthemeToken");

    for (const { name: compName, rawParams } of matches) {
      const props: ComponentCatalogItem["props"] = [];

      if (rawParams.trim()) {
        const cleanParams = rawParams.replace(/[\{\}]/g, "").trim();
        const paramTokens = cleanParams
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        for (const p of paramTokens) {
          if (p.startsWith("...")) {
            props.push({
              name: p.replace("...", "").trim(),
              type: "object",
              required: false,
              description: `Rest props for ${compName}`,
            });
            continue;
          }

          const defaultParts = p.split("=");
          const propNameAndType = defaultParts[0].trim();
          const defaultValueRaw = defaultParts[1]?.trim();

          let propName = propNameAndType;
          let propType = "any";

          if (propNameAndType.includes(":")) {
            const parts = propNameAndType.split(":");
            propName = parts[0].trim();
            const typeStr = parts[1].trim();
            if (typeStr === "string" || typeStr === "number" || typeStr === "boolean" || typeStr === "object" || typeStr === "function") {
              propType = typeStr;
            } else if (typeStr.includes("=>") || typeStr.includes("Function")) {
              propType = "function";
            } else {
              propType = typeStr;
            }
          }

          if (propName.includes(" ")) {
            const aliasParts = propName.split(/\s+/);
            propName = aliasParts[0];
          }

          if (propType === "any") {
            if (propName.startsWith("on") || propName.endsWith("Click") || propName.endsWith("Pick")) {
              propType = "function";
            } else if (propName.startsWith("is") || propName.startsWith("has") || propName === "disabled") {
              propType = "boolean";
            } else if (defaultValueRaw === "true" || defaultValueRaw === "false") {
              propType = "boolean";
            } else if (defaultValueRaw && !isNaN(Number(defaultValueRaw))) {
              propType = "number";
            } else if (defaultValueRaw && (defaultValueRaw.startsWith('"') || defaultValueRaw.startsWith("'"))) {
              propType = "string";
            } else if (propName === "children") {
              propType = "node";
            } else {
              propType = "object";
            }
          }

          props.push({
            name: propName,
            type: propType,
            defaultValue: defaultValueRaw !== undefined ? defaultValueRaw : null,
            required: defaultValueRaw === undefined,
            description: `Property ${propName} of ${compName}`,
          });
        }
      }

      const tokenBindings: Record<string, string> = {};

      if (hasThemeHook || content.includes("V.")) {
        const tokenMap: Record<string, string> = {
          pri: "primary",
          sec: "secondary",
          sec2: "secondaryVariant",
          bg: "background",
          surf: "surface",
          surf2: "surfaceVariant",
          ink: "onSurface",
          ink2: "onSurfaceVariant",
          ok: "ok",
          warn: "warn",
          err: "error",
          bdg: "badge",
          onbdg: "onBadge",
          outv: "outline",
          sbbg: "statusBarBackground",
          track: "track",
          ctash: "ctaShadow",
          rs: "radius",
          tls: "titleLetterSpacing",
        };

        for (const [tokKey, roleName] of Object.entries(tokenMap)) {
          if (content.includes(`V.${tokKey}`) || content.includes(`['${tokKey}']`) || content.includes(`["${tokKey}"]`)) {
            tokenBindings[roleName] = tokKey === "err" ? "error" : tokKey;
          }
        }

        if (Object.keys(tokenBindings).length === 0) {
          tokenBindings.textColor = "onSurface";
          tokenBindings.backgroundColor = "surface";
          tokenBindings.primaryColor = "primary";
        }
      }

      items.push({
        id: compName.toLowerCase().replace(/([a-z])([A-Z])/g, "$1-$2"),
        name: compName,
        description: `React UI Component ${compName}`,
        framework: "react",
        category: "components",
        sourceFile: path.relative(process.cwd(), file),
        props,
        tokenBindings,
        metadata: {
          extractedBy: "@ktheme/cli",
          extractedAt: new Date().toISOString(),
        },
      });
    }
  }

  return items;
}

export function extractCleverferretTemplates(
  srcPath: string,
): ComponentCatalogItem[] {
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Path not found: ${srcPath}`);
  }

  const stat = fs.statSync(srcPath);
  const files: string[] = [];

  if (stat.isDirectory()) {
    files.push(...findFiles(srcPath, [".dc.html", ".html"]));
  } else {
    files.push(srcPath);
  }

  const items: ComponentCatalogItem[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const baseName = path.basename(file).replace(/\./g, "-");
    const compName = path
      .basename(file)
      .replace(/\.(dc\.)?html$/, "")
      .replace(/(^\w|-\w)/g, (s) => s.replace("-", "").toUpperCase());

    // Extract {{ propName }} placeholders
    const propSet = new Set<string>();
    const interpolateRegex = /\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g;
    let m: RegExpExecArray | null;

    while ((m = interpolateRegex.exec(content)) !== null) {
      const fullVar = m[1].trim();
      const rootVar = fullVar.split(".")[0];
      if (rootVar && rootVar !== "true" && rootVar !== "false") {
        propSet.add(rootVar);
      }
    }

    const props: ComponentCatalogItem["props"] = Array.from(propSet).map((p) => ({
      name: p,
      type: p.endsWith("List") || p === "rail" || p === "families" ? "array" : p.startsWith("is") || p.startsWith("has") ? "boolean" : "string",
      required: false,
      description: `Cleverferret template variable ${p}`,
    }));

    // Extract var(--tokenName) CSS variable bindings
    const tokenBindings: Record<string, string> = {};
    const cssVarRegex = /var\(--([a-zA-Z0-9_-]+)(?:,\s*([^)]+))?\)/g;

    const varToTokenMap: Record<string, string> = {
      pri: "primary",
      sec: "secondary",
      sec2: "secondaryContainer",
      bg: "background",
      appbg: "background",
      surf: "surface",
      surf2: "surfaceVariant",
      ink: "onSurface",
      ink2: "onSurfaceVariant",
      outv: "outline",
      sbbg: "surfaceVariant",
      track: "outlineVariant",
      rs: "surface",
      ctash: "primaryContainer",
      lf: "onSurface",
      "focus-ring-color": "primary",
      onpri: "onPrimary",
      onpriL: "onPrimary",
      onsec: "onSecondary",
      onsecL: "onSecondary",
      onsec2: "onSecondaryContainer",
      onsec2L: "onSecondaryContainer",
      pbg: "surface",
      ff: "font",
      dff: "dfont",
      metal: "tertiary",
      sub: "onSurfaceVariant",
      border: "outline",
      panel: "surface",
      cbg: "surface",
      fbg: "surfaceVariant",
      navbg: "surfaceVariant",
      navbt: "outline",
      navbr: "outline",
      rpbg: "surface",
      rpink: "onSurface",
      rff: "onSurface",
      rpmuted: "onSurfaceVariant",
      badgeBg: "secondaryContainer",
      btnBg: "primary",
      btnBorder: "outline",
      toggleLabelColor: "onSurface",
      badgeText: "onSecondaryContainer",
      cardBg: "surface",
      cardBorder: "outline",
      cardShadow: "scrim",
    };

    while ((m = cssVarRegex.exec(content)) !== null) {
      const varName = m[1].trim();

      if (varToTokenMap[varName]) {
        tokenBindings[varName] = varToTokenMap[varName];
      }
    }

    if (Object.keys(tokenBindings).length === 0) {
      tokenBindings.appbg = "background";
      tokenBindings.pri = "primary";
      tokenBindings.ink = "onSurface";
    }

    items.push({
      id: baseName.toLowerCase(),
      name: compName || "Template",
      description: `Cleverferret .dc.html Template ${compName}`,
      framework: "cleverferret",
      category: "template",
      sourceFile: path.relative(process.cwd(), file),
      props,
      tokenBindings,
      metadata: {
        extractedBy: "@ktheme/cli",
        extractedAt: new Date().toISOString(),
      },
    });
  }

  return items;
}

export function extractComposeComponents(
  filePath: string,
): ComponentCatalogItem[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const items: ComponentCatalogItem[] = [];

  // Regex to match @Composable fun FunctionName(params...)
  const composableRegex =
    /@Composable\s+(?:inline\s+)?fun\s+([A-Z]\w*)\s*\(([\s\S]*?)\)\s*\{/g;

  let match: RegExpExecArray | null;
  while ((match = composableRegex.exec(content)) !== null) {
    const compName = match[1];
    const rawParams = match[2].trim();

    // Parse parameters
    const props: ComponentCatalogItem["props"] = [];
    if (rawParams) {
      // Split params cleanly handling nested generics/lambdas
      const paramLines = rawParams
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
      let currentParam = "";
      const combinedParams: string[] = [];

      for (const line of paramLines) {
        currentParam = currentParam ? `${currentParam}, ${line}` : line;
        const openParen = (currentParam.match(/\(/g) || []).length;
        const closeParen = (currentParam.match(/\)/g) || []).length;
        const openAngle = (currentParam.match(/</g) || []).length;
        const closeAngle = (currentParam.match(/>/g) || []).length;

        if (openParen === closeParen && openAngle === closeAngle) {
          combinedParams.push(currentParam);
          currentParam = "";
        }
      }

      for (const p of combinedParams) {
        const parts = p.split(":");
        if (parts.length >= 2) {
          const propName = parts[0].trim();
          const rest = parts.slice(1).join(":").trim();
          const defaultSplit = rest.split("=");
          const propType = defaultSplit[0].trim();
          const defaultValue = defaultSplit[1]?.trim();

          props.push({
            name: propName,
            type: propType,
            defaultValue: defaultValue !== undefined ? defaultValue : null,
            required: defaultValue === undefined,
            description: `Parameter ${propName} of ${compName}`,
          });
        }
      }
    }

    // Default token bindings for Compose components based on component type
    const tokenBindings: Record<string, string> = {
      textColor: "onSurface",
      backgroundColor: "surface",
      activeColor: "primary",
      borderColor: "outline",
    };

    if (compName === "MorphSlider") {
      tokenBindings.sliderTrack = "primary";
      tokenBindings.sliderValue = "onSurfaceVariant";
      tokenBindings.label = "onSurface";
    } else if (compName === "BoneControl") {
      tokenBindings.cardBackground = "surfaceVariant";
      tokenBindings.sliderTrack = "primary";
      tokenBindings.axisLabel = "onSurface";
    }

    items.push({
      id: compName.toLowerCase().replace(/([a-z])([A-Z])/g, "$1-$2"),
      name: compName,
      description: `Compose UI Component ${compName}`,
      framework: "jetpack-compose",
      category: "controls",
      sourceFile: path.relative(process.cwd(), filePath),
      props,
      tokenBindings,
      metadata: {
        extractedBy: "@ktheme/cli",
        extractedAt: new Date().toISOString(),
      },
    });
  }

  return items;
}

export function extractBlenderPanels(
  scriptPath: string,
  targetDir?: string,
): ComponentCatalogItem[] {
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Script not found: ${scriptPath}`);
  }

  const outputDir = targetDir || path.dirname(scriptPath);
  const command = `python3 "${scriptPath}" --output-dir "${outputDir}"`;
  execSync(command, { encoding: "utf-8" });

  const catalogFile = path.join(outputDir, "blender-panels-catalog.json");
  if (fs.existsSync(catalogFile)) {
    const data = JSON.parse(fs.readFileSync(catalogFile, "utf-8"));
    return Array.isArray(data) ? data : [data];
  }
  return [];
}

