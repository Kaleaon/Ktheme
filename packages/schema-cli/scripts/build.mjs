import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, "..");
const distDir = path.resolve(packageDir, "dist");

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Bundle CLI executable
await esbuild.build({
  entryPoints: [path.resolve(packageDir, "src/cli.ts")],
  outfile: path.resolve(distDir, "cli.js"),
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
});
fs.chmodSync(path.resolve(distDir, "cli.js"), 0o755);

// 2. Bundle programmatic index
await esbuild.build({
  entryPoints: [path.resolve(packageDir, "src/index.ts")],
  outfile: path.resolve(distDir, "index.js"),
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
});

// 3. Emit type definitions
const dtsContent = `export interface SyncOptions {
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

export declare function syncSchemas(options?: SyncOptions): SyncResult;
export { ThemeEngine } from '../../src/core/ThemeEngine';
export { migrateTheme, SCHEMA_VERSION } from '../../src/core/migrations';
`;
fs.writeFileSync(path.resolve(distDir, "index.d.ts"), dtsContent, "utf-8");
console.log("✓ @kaleaon/ktheme-schema-cli build completed successfully.");
