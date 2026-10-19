import zlib from "node:zlib";
import { Theme } from "../core/types";
import { toAndroidCompose } from "./toAndroidCompose";
import { toSwiftUI } from "./toSwiftUI";
import { toCssVars } from "./toCssVars";
import { toTailwindConfig } from "./toTailwindConfig";
import { toFlutterTheme } from "./toFlutterTheme";
import { toDesignTokensJson } from "./toDesignTokensJson";
import { toBlenderPropertyGroup } from "./toBlenderPropertyGroup";

export interface ValidationResult {
  valid: boolean;
  theme?: Theme;
  errors: string[];
}

export interface ExportFile {
  filename: string;
  content: string;
}

export interface ExportResult {
  target: string;
  singleCode: string;
  files: ExportFile[];
  contentType: string;
  defaultFilename: string;
}

export function validateThemePayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      valid: false,
      errors: ["Payload must be a valid JSON object."],
    };
  }

  const pObj = payload as Record<string, unknown>;
  const themeObj =
    pObj.theme && typeof pObj.theme === "object" ? pObj.theme : payload;
  const theme = themeObj as Record<string, unknown>;

  const errors: string[] = [];
  if (!theme.metadata || typeof theme.metadata !== "object") {
    errors.push("Missing or invalid 'metadata' object.");
  } else {
    const meta = theme.metadata as Record<string, unknown>;
    if (!meta.id || typeof meta.id !== "string") {
      errors.push("Missing required field 'metadata.id'.");
    }
    if (!meta.name || typeof meta.name !== "string") {
      errors.push("Missing required field 'metadata.name'.");
    }
  }

  if (!theme.colorScheme || typeof theme.colorScheme !== "object") {
    errors.push("Missing or invalid 'colorScheme' object.");
  } else {
    const cs = theme.colorScheme as Record<string, unknown>;
    if (!cs.primary || typeof cs.primary !== "string") {
      errors.push("Missing required field 'colorScheme.primary'.");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, theme: theme as unknown as Theme, errors: [] };
}

export function createZipArchive(files: ExportFile[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const file of files) {
    const filenameBuf = Buffer.from(file.filename, "utf-8");
    const dataBuf = Buffer.from(file.content, "utf-8");
    const crc = zlib.crc32 ? zlib.crc32(dataBuf) : 0;
    const uncompressedSize = dataBuf.length;
    const compressedSize = dataBuf.length;

    // Local File Header
    const localHeader = Buffer.alloc(30 + filenameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Signature
    localHeader.writeUInt16LE(20, 4); // Version needed
    localHeader.writeUInt16LE(0x0800, 6); // Flags (UTF-8)
    localHeader.writeUInt16LE(0, 8); // Compression (STORE)
    localHeader.writeUInt16LE(0, 10); // Mod time
    localHeader.writeUInt16LE(0, 12); // Mod date
    localHeader.writeUInt32LE(crc, 14); // CRC32
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(filenameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28); // Extra field len
    filenameBuf.copy(localHeader, 30);

    const localOffset = offset;
    localHeaders.push(localHeader, dataBuf);
    offset += localHeader.length + dataBuf.length;

    // Central Directory File Header
    const centralHeader = Buffer.alloc(46 + filenameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Signature
    centralHeader.writeUInt16LE(20, 4); // Version made by
    centralHeader.writeUInt16LE(20, 6); // Version needed
    centralHeader.writeUInt16LE(0x0800, 8); // Flags
    centralHeader.writeUInt16LE(0, 10); // Compression
    centralHeader.writeUInt16LE(0, 12); // Mod time
    centralHeader.writeUInt16LE(0, 14); // Mod date
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(uncompressedSize, 24);
    centralHeader.writeUInt16LE(filenameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30); // Extra field len
    centralHeader.writeUInt16LE(0, 32); // File comment len
    centralHeader.writeUInt16LE(0, 34); // Disk number start
    centralHeader.writeUInt16LE(0, 36); // Internal file attributes
    centralHeader.writeUInt32LE(0, 38); // External file attributes
    centralHeader.writeUInt32LE(localOffset, 42); // Local header offset
    filenameBuf.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const ch of centralHeaders) centralDirSize += ch.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // Signature
  eocd.writeUInt16LE(0, 4); // Disk num
  eocd.writeUInt16LE(0, 6); // Start disk
  eocd.writeUInt16LE(files.length, 8); // Total entries disk
  eocd.writeUInt16LE(files.length, 10); // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20); // Comment len

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

export function normalizeTarget(rawTarget: string): string | null {
  if (!rawTarget || typeof rawTarget !== "string") return "android";
  const t = rawTarget.toLowerCase().trim();
  if (
    t === "android" ||
    t === "android-compose" ||
    t === "compose" ||
    t === "kotlin"
  )
    return "android";
  if (t === "swiftui" || t === "swift") return "swiftui";
  if (t === "css" || t === "css-vars") return "css";
  if (t === "tailwind") return "tailwind";
  if (t === "flutter" || t === "dart") return "flutter";
  if (
    t === "json" ||
    t === "tokens" ||
    t === "design-tokens" ||
    t === "w3c"
  )
    return "json";
  if (t === "blender" || t === "python") return "blender";
  return null;
}

export async function exportThemeForTarget(
  theme: Theme,
  target: string,
): Promise<ExportResult> {
  const normTarget = normalizeTarget(target);
  if (!normTarget) {
    throw new Error(
      `Unsupported export target '${target}'. Supported targets: android, swiftui, css, tailwind, flutter, json, blender`,
    );
  }

  const themeName = theme.metadata?.name || "Theme";
  const themeId = theme.metadata?.id || "ktheme";

  switch (normTarget) {
    case "android": {
      const res = toAndroidCompose(theme);
      const fullCode = res.kotlin;

      const lines = fullCode.split("\n");
      const colorLines: string[] = [];
      const themeLines: string[] = [];
      const iconLines: string[] = [];

      let currentSection = "color";
      for (const line of lines) {
        if (
          line.includes("object KthemeTypography") ||
          line.includes("object KthemeAdaptation")
        ) {
          currentSection = "theme";
        } else if (line.includes("object KthemeIcons")) {
          currentSection = "icons";
        }
        if (currentSection === "color") colorLines.push(line);
        else if (currentSection === "theme") themeLines.push(line);
        else iconLines.push(line);
      }

      const packageName = "io.ktheme.compose";
      const colorFileContent =
        colorLines.length > 0 ? colorLines.join("\n") : fullCode;
      const themeHeader = `package ${packageName}\n\nimport androidx.compose.ui.unit.dp\nimport androidx.compose.ui.unit.sp\n\n`;
      const themeFileContent = themeHeader + themeLines.join("\n");

      const files: ExportFile[] = [
        { filename: "Color.kt", content: colorFileContent },
        { filename: "Theme.kt", content: themeFileContent },
      ];

      if (iconLines.length > 0) {
        const iconHeader = `package ${packageName}\n\nimport androidx.compose.ui.graphics.SolidColor\nimport androidx.compose.ui.graphics.vector.ImageVector\nimport androidx.compose.ui.graphics.vector.addPathNodes\nimport androidx.compose.ui.graphics.vector.path\nimport androidx.compose.ui.unit.dp\n\n`;
        files.push({
          filename: "Icons.kt",
          content: iconHeader + iconLines.join("\n"),
        });
      }

      files.push({
        filename: "README.md",
        content: `# ${themeName} - Android Jetpack Compose Module\n\nInclude \`Color.kt\` and \`Theme.kt\` in your Android Jetpack Compose source tree under package \`${packageName}\`.\n`,
      });

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "text/plain; charset=utf-8",
        defaultFilename: `${themeId}-compose.kt`,
      };
    }

    case "swiftui": {
      const res = toSwiftUI(theme);
      const fullCode = res.swift;

      const lines = fullCode.split("\n");
      const colorsLines: string[] = [];
      const typeLines: string[] = [];
      const adaptLines: string[] = [];

      let section = "colors";
      for (const line of lines) {
        if (line.includes("struct KthemeTypography")) section = "type";
        else if (line.includes("struct KthemeAdaptation")) section = "adapt";

        if (section === "colors") colorsLines.push(line);
        else if (section === "type") typeLines.push(line);
        else adaptLines.push(line);
      }

      const swiftHeader = "import SwiftUI\n\n";
      const files: ExportFile[] = [
        {
          filename: "Colors.swift",
          content: swiftHeader + colorsLines.join("\n"),
        },
        {
          filename: "Typography.swift",
          content: swiftHeader + typeLines.join("\n"),
        },
        {
          filename: "Theme.swift",
          content: swiftHeader + adaptLines.join("\n"),
        },
        {
          filename: "README.md",
          content: `# ${themeName} - SwiftUI Package\n\nAdd \`Colors.swift\`, \`Typography.swift\`, and \`Theme.swift\` to your SwiftUI project.\n`,
        },
      ];

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "text/plain; charset=utf-8",
        defaultFilename: `${themeId}-theme.swift`,
      };
    }

    case "css": {
      const res = toCssVars(theme);
      const fullCode = res.cssText;

      const files: ExportFile[] = [
        { filename: "tokens.css", content: fullCode },
        {
          filename: "theme.css",
          content: `@import "./tokens.css";\n\n/* Theme utility styles for ${themeName} */\nbody {\n  background-color: var(--ktheme-background);\n  color: var(--ktheme-on-background);\n  font-family: var(--ktheme-font-family);\n}\n`,
        },
        {
          filename: "README.md",
          content: `# ${themeName} - CSS Variables\n\nInclude \`<link rel="stylesheet" href="tokens.css">\` in your HTML document.\n`,
        },
      ];

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "text/css; charset=utf-8",
        defaultFilename: `${themeId}-tokens.css`,
      };
    }

    case "tailwind": {
      const res = toTailwindConfig(theme);
      const fullCode = `module.exports = ${JSON.stringify(res, null, 2)};\n`;

      const files: ExportFile[] = [
        { filename: "tailwind.config.js", content: fullCode },
        {
          filename: "README.md",
          content: `# ${themeName} - Tailwind CSS Configuration\n\nMerge this configuration into your \`tailwind.config.js\` file.\n`,
        },
      ];

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "application/javascript; charset=utf-8",
        defaultFilename: `tailwind.config.js`,
      };
    }

    case "flutter": {
      const res = toFlutterTheme(theme);
      const fullCode = res.dart;

      const lines = fullCode.split("\n");
      const colorLines: string[] = [];
      const themeLines: string[] = [];
      let section = "color";
      for (const line of lines) {
        if (line.includes("class KthemeTypography")) section = "theme";
        if (section === "color") colorLines.push(line);
        else themeLines.push(line);
      }

      const flutterHeader = "import 'package:flutter/material.dart';\n\n";
      const files: ExportFile[] = [
        {
          filename: "color_scheme.dart",
          content: flutterHeader + colorLines.join("\n"),
        },
        {
          filename: "theme.dart",
          content: flutterHeader + themeLines.join("\n"),
        },
        {
          filename: "README.md",
          content: `# ${themeName} - Flutter Theme Package\n\nInclude \`color_scheme.dart\` and \`theme.dart\` in your Flutter project.\n`,
        },
      ];

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "text/plain; charset=utf-8",
        defaultFilename: `${themeId}-theme.dart`,
      };
    }

    case "json": {
      const res = toDesignTokensJson(theme);
      const fullCode = JSON.stringify(res, null, 2);

      const files: ExportFile[] = [
        { filename: "tokens.json", content: fullCode },
        {
          filename: "README.md",
          content: `# ${themeName} - W3C Design Tokens JSON\n\nW3C Design Tokens format file for style dictionary and design token tools.\n`,
        },
      ];

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "application/json; charset=utf-8",
        defaultFilename: `${themeId}-tokens.json`,
      };
    }

    case "blender": {
      const res = toBlenderPropertyGroup(theme);
      const fullCode =
        typeof res === "string"
          ? res
          : (res as { pythonScript?: string }).pythonScript ||
            JSON.stringify(res, null, 2);

      const files: ExportFile[] = [
        { filename: "ktheme_blender.py", content: fullCode },
        {
          filename: "README.md",
          content: `# ${themeName} - Blender Property Group\n\nRun \`ktheme_blender.py\` inside Blender Scripting Editor.\n`,
        },
      ];

      return {
        target: normTarget,
        singleCode: fullCode,
        files,
        contentType: "text/plain; charset=utf-8",
        defaultFilename: `${themeId}-blender.py`,
      };
    }

    default:
      throw new Error(`Unhandled target ${normTarget}`);
  }
}
