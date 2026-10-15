import Ajv from "ajv";
import fs from "node:fs";
import path from "node:path";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const VALID_DESIGN_TOKENS: Set<string> = new Set([
  // MD3 Color Tokens
  "primary",
  "onPrimary",
  "primaryContainer",
  "onPrimaryContainer",
  "secondary",
  "onSecondary",
  "secondaryContainer",
  "onSecondaryContainer",
  "tertiary",
  "onTertiary",
  "tertiaryContainer",
  "onTertiaryContainer",
  "error",
  "onError",
  "errorContainer",
  "onErrorContainer",
  "background",
  "onBackground",
  "surface",
  "onSurface",
  "surfaceVariant",
  "onSurfaceVariant",
  "outline",
  "outlineVariant",
  "scrim",
  "inverseSurface",
  "inverseOnSurface",
  "inversePrimary",

  // Linkpoint & Ktheme Shorthand Token Keys
  "pri",
  "sec",
  "sec2",
  "bg",
  "surf",
  "surf2",
  "ink",
  "ink2",
  "ok",
  "warn",
  "err",
  "bdg",
  "onbdg",
  "outv",
  "sbbg",
  "track",
  "ctash",
  "rs",
  "tls",
  "font",
  "dfont",
  "appbg",
  "onpri",
  "onsec",
  "onsec2",
  "onpriL",
  "onsecL",
  "onsec2L",
  "focus-ring-color",
  "lf",
  "cbg",
  "cbt",
  "cbr",
  "cbb",
  "cbl",
  "csh",
  "bf",
  "rc",
  "ctafg",
  "shimo",
  "shim",
  "htls",
  "tt",
  "pulse",
  "tw",
  "qgap",
  "qalign",
  "qjust",
  "rt",
  "qbg",
  "qbt",
  "qbr",
  "qbb",
  "qbl",
  "qsh",
  "qic",
  "qfg",
  "rp",
  "mpbg",
  "fbg",
  "navbg",
  "navbt",
  "ra",
  "rpbg",
  "rpink",
  "rff",
  "rpmuted",
  "ri",
  "navbr",
  "badgeBg",
  "btnBg",
  "btnBorder",
  "toggleLabelColor",
  "badgeText",
  "bdgText",
  "cardBg",
  "cardBorder",
  "cardShadow",
  "tabBg",
  "tabInk",
  "pillBg",
  "pillInk",
  "headerBg",
  "headerInk",

  // Compose / Android Token Keys
  "sliderTrack",
  "sliderValue",
  "label",
  "cardBackground",
  "axisLabel",
  "textColor",
  "backgroundColor",
  "activeColor",
  "borderColor",

  // Blender / Python Panel Tokens
  "panelBackground",
  "headerText",
]);

export function validateComponentCatalog(
  catalogData: unknown,
  schemaPath?: string,
): ValidationResult {
  const resolvedSchemaPath = schemaPath
    ? path.resolve(schemaPath)
    : path.resolve(__dirname, "../../ktheme-component-schema.json");

  if (!fs.existsSync(resolvedSchemaPath)) {
    return {
      valid: false,
      errors: [`Schema file not found at ${resolvedSchemaPath}`],
    };
  }

  try {
    const schemaContent = JSON.parse(
      fs.readFileSync(resolvedSchemaPath, "utf-8"),
    );
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schemaContent);

    const itemsToValidate = Array.isArray(catalogData)
      ? catalogData
      : [catalogData];
    const errors: string[] = [];

    for (let i = 0; i < itemsToValidate.length; i++) {
      const item = itemsToValidate[i] as Record<string, unknown>;
      const valid = validate(item);
      const itemPrefix = Array.isArray(catalogData) ? `Item [${i}] ` : "";

      if (!valid && validate.errors) {
        for (const err of validate.errors) {
          const errObj = err as unknown as Record<string, unknown>;
          const pathStr =
            (errObj.instancePath as string) ||
            (errObj.dataPath as string) ||
            "/";
          errors.push(`${itemPrefix}${pathStr} ${err.message}`);
        }
      }

      // Check tokenBindings for invalid design token keys
      if (item && typeof item === "object" && item.tokenBindings && typeof item.tokenBindings === "object") {
        const bindings = item.tokenBindings as Record<string, unknown>;
        for (const [bindingKey, tokenValue] of Object.entries(bindings)) {
          if (typeof tokenValue !== "string" || !VALID_DESIGN_TOKENS.has(tokenValue)) {
            const compName = (item.name as string) || (item.id as string) || "Component";
            errors.push(
              `${itemPrefix}(${compName}): tokenBinding '${bindingKey}' references invalid design token '${tokenValue}'. Valid tokens include: primary, secondary, surface, background, pri, sec, bg, surf, ink, error, ok, warn...`,
            );
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [
        `Validation error: ${err instanceof Error ? err.message : String(err)}`,
      ],
    };
  }
}

