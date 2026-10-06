import Ajv from "ajv";
import fs from "node:fs";
import path from "node:path";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

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
      const item = itemsToValidate[i];
      const valid = validate(item);
      if (!valid && validate.errors) {
        for (const err of validate.errors) {
          const itemPrefix = Array.isArray(catalogData) ? `Item [${i}] ` : "";
          const errObj = err as unknown as Record<string, unknown>;
          const pathStr =
            (errObj.instancePath as string) ||
            (errObj.dataPath as string) ||
            "/";
          errors.push(`${itemPrefix}${pathStr} ${err.message}`);
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
