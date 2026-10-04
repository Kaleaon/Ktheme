import * as fs from 'fs';
import * as path from 'path';
import { migrateTheme, SCHEMA_VERSION } from '../src/core/migrations';
import { ThemeEngine } from '../src/core/ThemeEngine';

function findJsonFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        results = results.concat(findJsonFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith('.json') && !entry.name.endsWith('package.json') && !entry.name.endsWith('tsconfig.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

export function syncSchemas(customDirs?: string[]): { processed: number; migrated: number; errors: number; warnings: number } {
  const engine = new ThemeEngine();
  const repoRoot = path.resolve(__dirname, '..');
  const workspaceRoot = path.resolve(repoRoot, '..');

  const defaultTargets = [
    path.join(repoRoot, 'themes'),
    path.join(repoRoot, 'libs/ktheme-runtime/src/main/resources/themes'),
    path.join(workspaceRoot, 'linkpoint-design/docs'),
    path.join(workspaceRoot, 'linkpoint-design/ktheme-pr/themes')
  ];

  const targetDirs = customDirs && customDirs.length > 0 ? customDirs : defaultTargets;

  let allFiles: string[] = [];
  for (const target of targetDirs) {
    if (fs.existsSync(target)) {
      const stat = fs.statSync(target);
      if (stat.isDirectory()) {
        allFiles = allFiles.concat(findJsonFiles(target));
      } else if (stat.isFile() && target.endsWith('.json')) {
        allFiles.push(target);
      }
    }
  }

  allFiles = Array.from(new Set(allFiles));

  let processed = 0;
  let migratedCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  console.log(`[sync-schemas] Processing ${allFiles.length} theme files...`);

  for (const filePath of allFiles) {
    try {
      const rawText = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(rawText);

      if (
        typeof json !== 'object' ||
        json === null ||
        Array.isArray(json) ||
        (!json.metadata && !json.colorScheme && !json.layouts && !json.desktopAdaptation && !json.windowChrome)
      ) {
        continue;
      }

      processed += 1;
      const initialVersion = json.schemaVersion ?? 0;
      const migrated = migrateTheme(json, initialVersion, SCHEMA_VERSION);

      if (initialVersion !== SCHEMA_VERSION || JSON.stringify(json) !== JSON.stringify(migrated)) {
        migratedCount += 1;
      }

      const validation = engine.validateTheme(migrated);
      if (!validation.valid) {
        errorCount += validation.errors.length;
        console.error(`[ERR] ${filePath}: ${validation.errors.join('; ')}`);
      }

      if (validation.warnings.length > 0) {
        warningCount += validation.warnings.length;
        console.warn(`[WARN] ${filePath}: ${validation.warnings.join('; ')}`);
      }

      const formatted = JSON.stringify(migrated, null, 2) + '\n';
      fs.writeFileSync(filePath, formatted, 'utf8');
    } catch (err) {
      console.error(`[ERR] Failed to process ${filePath}:`, err);
      errorCount += 1;
    }
  }

  console.log(`[sync-schemas] Completed! Processed: ${processed}, Migrated: ${migratedCount}, Warnings: ${warningCount}, Errors: ${errorCount}`);
  return { processed, migrated: migratedCount, errors: errorCount, warnings: warningCount };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const result = syncSchemas(args);
  if (result.errors > 0) {
    process.exit(1);
  }
}
