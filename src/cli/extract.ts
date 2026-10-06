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
