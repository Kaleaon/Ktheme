#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateComponentCatalog } from "../dist/cli/validator.js";
import {
  extractComposeComponents,
  extractBlenderPanels,
} from "../dist/cli/extract.js";
import { pushComponents } from "../dist/cli/push.js";
import { pullTokens } from "../dist/cli/pull.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];

function getArgValue(flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return undefined;
}

async function main() {
  if (!command || command === "--help" || command === "-h") {
    console.log(`
@ktheme/cli - Ktheme Component Catalog & Token Sync CLI

Usage:
  ktheme validate [--schema <schema.json>] <catalog.json|dir>
  ktheme extract --framework <compose|blender> --src <path> [--out <dir>]
  ktheme push [--input <catalog.json|dir>] [--endpoint <url>]
  ktheme pull [--endpoint <url>] [--theme-id <id>] [--out-kotlin <path>]
`);
    process.exit(0);
  }

  if (command === "validate") {
    const schemaPath = getArgValue("--schema");
    const inputPath = args.find((a) => !a.startsWith("-") && a !== "validate");
    if (!inputPath) {
      console.error(
        "Error: Catalog JSON path or directory is required for validate.",
      );
      process.exit(1);
    }
    const fullPath = path.resolve(inputPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`Error: Path not found: ${fullPath}`);
      process.exit(1);
    }

    let data;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".json"));
      data = [];
      for (const f of files) {
        data.push(JSON.parse(fs.readFileSync(path.join(fullPath, f), "utf-8")));
      }
    } else {
      data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    }

    const result = validateComponentCatalog(data, schemaPath);
    if (result.valid) {
      console.log("✓ Catalog schema validation PASSED.");
      process.exit(0);
    } else {
      console.error("✗ Catalog schema validation FAILED:");
      for (const err of result.errors) {
        console.error(`  - ${err}`);
      }
      process.exit(1);
    }
  }

  if (command === "extract") {
    const framework = getArgValue("--framework") || "compose";
    const src = getArgValue("--src");
    const outDir = getArgValue("--out") || ".";

    if (!src) {
      console.error("Error: --src path is required for extract.");
      process.exit(1);
    }

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    if (framework === "compose") {
      const items = extractComposeComponents(src);
      const outFile = path.join(outDir, "compose-components-catalog.json");
      fs.writeFileSync(outFile, JSON.stringify(items, null, 2), "utf-8");
      console.log(
        `✓ Extracted ${items.length} Compose components to ${outFile}`,
      );
    } else if (framework === "blender") {
      const items = extractBlenderPanels(src, outDir);
      console.log(
        `✓ Extracted ${items.length} Blender panels to catalog in ${outDir}`,
      );
    } else {
      console.error(
        `Error: Unsupported framework "${framework}". Use "compose" or "blender".`,
      );
      process.exit(1);
    }
    process.exit(0);
  }

  if (command === "push") {
    const input = getArgValue("--input") || getArgValue("-i") || ".";
    const endpoint = getArgValue("--endpoint");
    const result = await pushComponents({ input, endpoint });
    if (result.success) {
      console.log(`✓ ${result.message}`);
      process.exit(0);
    } else {
      console.error(`✗ ${result.message}`);
      process.exit(1);
    }
  }

  if (command === "pull") {
    const endpoint = getArgValue("--endpoint");
    const themeId = getArgValue("--theme-id");
    const outKotlin = getArgValue("--out-kotlin");
    const outCss = getArgValue("--out-css");

    const result = await pullTokens({ endpoint, themeId, outKotlin, outCss });
    console.log(`✓ ${result.message}`);
    process.exit(0);
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
