import * as fs from "fs";
import * as path from "path";
import { migrateTheme, SCHEMA_VERSION } from "../../../src/core/migrations";
import { ThemeEngine } from "../../../src/core/ThemeEngine";

export interface SyncOptions {
  targets?: string[];
  check?: boolean;
  apply?: boolean;
}

export interface SyncResult {
  processed: number;
  migrated: number;
  errors: number;
  warnings: number;
}

function isIgnoredFile(fileName: string): boolean {
  return (
    fileName.endsWith("package.json") ||
    fileName.endsWith("package-lock.json") ||
    fileName.endsWith("tsconfig.json") ||
    fileName.endsWith(".schema.json") ||
    fileName.endsWith(".eslintrc.json")
  );
}

function findJsonFiles(targetPath: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(targetPath)) return results;

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    if (targetPath.endsWith(".json") && !isIgnoredFile(targetPath)) {
      return [targetPath];
    }
    return [];
  }

  const list = fs.readdirSync(targetPath, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name !== "node_modules" &&
        entry.name !== ".git" &&
        entry.name !== "dist" &&
        entry.name !== "build" &&
        entry.name !== ".gradle"
      ) {
        results = results.concat(findJsonFiles(fullPath));
      }
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      !isIgnoredFile(entry.name)
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function isLikelyTheme(json: Record<string, unknown>): boolean {
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return false;
  }
  if (
    typeof json.$schema === "string" &&
    json.$schema.includes("json-schema.org")
  ) {
    return false;
  }
  if (json.colorScheme && typeof json.colorScheme === "object") {
    return true;
  }
  if (json.palette && typeof json.palette === "object") {
    return true;
  }
  if (
    json.metadata &&
    typeof json.metadata === "object" &&
    !Array.isArray(json.metadata) &&
    Boolean(
      (json.metadata as Record<string, unknown>).id ||
        (json.metadata as Record<string, unknown>).name,
    )
  ) {
    return true;
  }
  return false;
}

export function syncSchemas(options?: SyncOptions): SyncResult {
  const engine = new ThemeEngine();
  const cwd = process.cwd();

  let targetDirs: string[] = [];
  if (options?.targets && options.targets.length > 0) {
    targetDirs = options.targets.map((t) => path.resolve(cwd, t));
  } else {
    const candidateDirs = [
      path.join(cwd, "themes"),
      path.join(cwd, "docs"),
      path.join(cwd, "ktheme-pr"),
      path.join(cwd, "libs/ktheme-runtime/src/main/resources/themes"),
    ];
    targetDirs = candidateDirs.filter((d) => fs.existsSync(d));
    if (targetDirs.length === 0) {
      targetDirs = [cwd];
    }
  }

  let allFiles: string[] = [];
  for (const target of targetDirs) {
    allFiles = allFiles.concat(findJsonFiles(target));
  }

  allFiles = Array.from(new Set(allFiles));

  let processed = 0;
  let migratedCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  const isCheck = options?.check === true;
  console.log(
    `[ktheme-schema] Processing ${allFiles.length} candidate files in mode: ${
      isCheck ? "CHECK" : "APPLY"
    }...`,
  );

  for (const filePath of allFiles) {
    try {
      const rawText = fs.readFileSync(filePath, "utf8");
      let json: Record<string, unknown>;
      try {
        json = JSON.parse(rawText);
      } catch (err) {
        console.error(
          `[ERR] ${filePath}: Invalid JSON syntax: ${(err as Error).message}`,
        );
        errorCount += 1;
        continue;
      }

      if (!isLikelyTheme(json)) {
        continue;
      }

      processed += 1;
      const initialVersion = (json.schemaVersion as number) ?? 0;
      const migrated = migrateTheme(json, initialVersion, SCHEMA_VERSION);
      const needsMigration =
        initialVersion !== SCHEMA_VERSION ||
        JSON.stringify(json) !== JSON.stringify(migrated);

      if (needsMigration) {
        migratedCount += 1;
      }

      const validation = engine.validateTheme(migrated);
      if (!validation.valid) {
        errorCount += validation.errors.length;
        console.error(`[ERR] ${filePath}: ${validation.errors.join("; ")}`);
      }

      if (validation.warnings.length > 0) {
        warningCount += validation.warnings.length;
        console.warn(`[WARN] ${filePath}: ${validation.warnings.join("; ")}`);
      }

      if (isCheck) {
        if (needsMigration) {
          errorCount += 1;
          console.error(
            `[ERR] ${filePath}: Schema drift detected (current: v${initialVersion}, expected: v${SCHEMA_VERSION}). Run 'ktheme-schema sync --apply' to migrate.`,
          );
        }
      } else {
        const formatted = JSON.stringify(migrated, null, 2) + "\n";
        fs.writeFileSync(filePath, formatted, "utf8");
      }
    } catch (err) {
      console.error(`[ERR] Failed to process ${filePath}:`, err);
      errorCount += 1;
    }
  }

  console.log(
    `[ktheme-schema] Completed! Processed: ${processed}, Migrated: ${migratedCount}, Warnings: ${warningCount}, Errors: ${errorCount}`,
  );
  return {
    processed,
    migrated: migratedCount,
    errors: errorCount,
    warnings: warningCount,
  };
}
