import fs from "node:fs";
import path from "node:path";
import { tokensStudioToKTheme, TokensStudioImporter } from "../importers/tokensStudioImporter";
import { toAndroidCompose } from "../exporters/toAndroidCompose";
import { toSwiftUI } from "../exporters/toSwiftUI";
import { toCssVars } from "../exporters/toCssVars";

export interface ImportTokensOptions {
  source: string;
  out?: string;
  format?: "compose" | "kotlin" | "swift" | "css" | "json" | "all" | string;
  themeName?: string;
  themeId?: string;
}

export interface ImportTokensResult {
  success: boolean;
  message: string;
  themeId: string;
  generatedFiles: string[];
}

export function importTokensCommand(options: ImportTokensOptions): ImportTokensResult {
  if (!options.source) {
    throw new Error("Source JSON file path is required for import command.");
  }

  const sourcePath = path.resolve(options.source);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found at: ${sourcePath}`);
  }

  const jsonContent = fs.readFileSync(sourcePath, "utf-8");
  const theme = tokensStudioToKTheme(jsonContent, {
    themeName: options.themeName || path.basename(sourcePath, path.extname(sourcePath)),
    themeId: options.themeId,
  });

  const outPath = options.out || ".";
  const isOutFile = outPath.endsWith(".json") || outPath.endsWith(".kt") || outPath.endsWith(".swift") || outPath.endsWith(".css");
  const targetDir = isOutFile ? path.dirname(path.resolve(outPath)) : path.resolve(outPath);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const generatedFiles: string[] = [];
  const format = (options.format || "all").toLowerCase();

  // Export Ktheme JSON
  if (format === "json" || format === "all") {
    const jsonFile = isOutFile && outPath.endsWith(".json")
      ? path.resolve(outPath)
      : path.join(targetDir, `${theme.metadata.id}.json`);
    fs.writeFileSync(jsonFile, JSON.stringify(theme, null, 2), "utf-8");
    generatedFiles.push(jsonFile);
  }

  // Export Android Compose / Kotlin
  if (format === "compose" || format === "kotlin" || format === "all") {
    const composeExport = toAndroidCompose(theme);
    const composeFile = isOutFile && outPath.endsWith(".kt")
      ? path.resolve(outPath)
      : path.join(targetDir, "Theme.kt");
    fs.writeFileSync(composeFile, composeExport.kotlin, "utf-8");
    generatedFiles.push(composeFile);
  }

  // Export SwiftUI
  if (format === "swift" || format === "all") {
    const swiftExport = toSwiftUI(theme);
    const swiftFile = isOutFile && outPath.endsWith(".swift")
      ? path.resolve(outPath)
      : path.join(targetDir, "Theme.swift");
    fs.writeFileSync(swiftFile, swiftExport.swift, "utf-8");
    generatedFiles.push(swiftFile);
  }

  // Export CSS Variables
  if (format === "css" || format === "all") {
    const cssVarsExport = toCssVars(theme);
    const cssFile = isOutFile && outPath.endsWith(".css")
      ? path.resolve(outPath)
      : path.join(targetDir, `${theme.metadata.id}.css`);
    fs.writeFileSync(cssFile, cssVarsExport.cssText, "utf-8");
    generatedFiles.push(cssFile);
  }

  return {
    success: true,
    themeId: theme.metadata.id,
    generatedFiles,
    message: `Successfully imported Tokens Studio tokens from ${path.basename(sourcePath)} and generated ${generatedFiles.length} asset(s).`,
  };
}
