import {
  validateThemePayload,
  createZipArchive,
  exportThemeForTarget,
  normalizeTarget,
} from "./exportEngine";
import zlib from "node:zlib";

describe("Backend Export Service Engine", () => {
  const sampleTheme = {
    metadata: {
      id: "navy-gold",
      name: "Navy Gold",
      description: "Sample test theme",
      author: "Jest Test",
      version: "1.0.0",
      tags: ["test"],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    darkMode: true,
    colorScheme: {
      primary: "#1E3A8A",
      onPrimary: "#FFFFFF",
      primaryContainer: "#203040",
      onPrimaryContainer: "#FFFFFF",
      secondary: "#D97706",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#506070",
      onSecondaryContainer: "#FFFFFF",
      tertiary: "#708090",
      onTertiary: "#FFFFFF",
      tertiaryContainer: "#8090A0",
      onTertiaryContainer: "#FFFFFF",
      error: "#EF4444",
      onError: "#FFFFFF",
      errorContainer: "#FFCDD2",
      onErrorContainer: "#000000",
      background: "#0F172A",
      onBackground: "#FFFFFF",
      surface: "#1E293B",
      onSurface: "#FFFFFF",
      surfaceVariant: "#2A2A2A",
      onSurfaceVariant: "#EEEEEE",
      outline: "#777777",
      outlineVariant: "#888888",
      scrim: "#000000",
      inverseSurface: "#FFFFFF",
      inverseOnSurface: "#000000",
      inversePrimary: "#1E3A8A",
    },
  };

  describe("Schema Validation", () => {
    it("validates valid theme payload", () => {
      const result = validateThemePayload(sampleTheme);
      expect(result.valid).toBe(true);
      expect(result.theme).toBeDefined();
      expect(result.errors).toHaveLength(0);
    });

    it("validates theme nested inside { theme: ... } payload", () => {
      const result = validateThemePayload({ theme: sampleTheme });
      expect(result.valid).toBe(true);
      expect(result.theme?.metadata.id).toBe("navy-gold");
    });

    it("rejects non-object payload", () => {
      const result = validateThemePayload("invalid");
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Payload must be a valid JSON object.");
    });

    it("rejects payload missing required metadata fields", () => {
      const invalidPayload = {
        metadata: { id: "test" }, // missing name
        colorScheme: { primary: "#1E3A8A" },
      };
      const result = validateThemePayload(invalidPayload);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Missing required field 'metadata.name'.");
    });

    it("rejects payload missing required colorScheme fields", () => {
      const invalidPayload = {
        metadata: { id: "test", name: "Test" },
        colorScheme: {}, // missing primary
      };
      const result = validateThemePayload(invalidPayload);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Missing required field 'colorScheme.primary'.",
      );
    });
  });

  describe("Target Normalization", () => {
    it("maps target aliases to standard target names", () => {
      expect(normalizeTarget("android")).toBe("android");
      expect(normalizeTarget("android-compose")).toBe("android");
      expect(normalizeTarget("kotlin")).toBe("android");
      expect(normalizeTarget("swiftui")).toBe("swiftui");
      expect(normalizeTarget("swift")).toBe("swiftui");
      expect(normalizeTarget("css")).toBe("css");
      expect(normalizeTarget("css-vars")).toBe("css");
      expect(normalizeTarget("tailwind")).toBe("tailwind");
      expect(normalizeTarget("flutter")).toBe("flutter");
      expect(normalizeTarget("dart")).toBe("flutter");
      expect(normalizeTarget("json")).toBe("json");
      expect(normalizeTarget("tokens")).toBe("json");
      expect(normalizeTarget("blender")).toBe("blender");
      expect(normalizeTarget("invalid")).toBeNull();
    });
  });

  describe("ZIP Archive Generator", () => {
    it("generates a valid PKZIP binary buffer with correct file headers and CRC32", () => {
      const files = [
        { filename: "Color.kt", content: "val primary = 0xFF1E3A8A" },
        { filename: "Theme.kt", content: "class Theme" },
      ];

      const zipBuf = createZipArchive(files);
      expect(Buffer.isBuffer(zipBuf)).toBe(true);
      expect(zipBuf.length).toBeGreaterThan(0);

      // Check PKZIP Local Header Signature: 0x04034b50 (50 4b 03 04 in little-endian)
      expect(zipBuf.readUInt32LE(0)).toBe(0x04034b50);

      // Verify CRC32 calculation matches zlib
      const expectedCrc = zlib.crc32(Buffer.from("val primary = 0xFF1E3A8A"));
      expect(zipBuf.readUInt32LE(14)).toBe(expectedCrc);
    });
  });

  describe("Multi-Platform Exporter Execution", () => {
    it("exports Android Jetpack Compose multi-file package", async () => {
      const result = await exportThemeForTarget(sampleTheme, "android");
      expect(result.target).toBe("android");
      expect(result.singleCode).toContain("val KthemeColorScheme");
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining(["Color.kt", "Theme.kt", "README.md"]),
      );
    });

    it("exports SwiftUI package", async () => {
      const result = await exportThemeForTarget(sampleTheme, "swiftui");
      expect(result.target).toBe("swiftui");
      expect(result.singleCode).toContain("struct KthemePalette");
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining([
          "Colors.swift",
          "Typography.swift",
          "Theme.swift",
          "README.md",
        ]),
      );
    });

    it("exports CSS variables package", async () => {
      const result = await exportThemeForTarget(sampleTheme, "css");
      expect(result.target).toBe("css");
      expect(result.singleCode).toContain("--ktheme-primary:");
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining(["tokens.css", "theme.css", "README.md"]),
      );
    });

    it("exports Tailwind config package", async () => {
      const result = await exportThemeForTarget(sampleTheme, "tailwind");
      expect(result.target).toBe("tailwind");
      expect(result.singleCode).toContain("module.exports =");
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining(["tailwind.config.js", "README.md"]),
      );
    });

    it("exports Flutter theme package", async () => {
      const result = await exportThemeForTarget(sampleTheme, "flutter");
      expect(result.target).toBe("flutter");
      expect(result.singleCode).toContain("final kthemeColorScheme =");
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining(["color_scheme.dart", "theme.dart", "README.md"]),
      );
    });

    it("exports Design Tokens JSON package", async () => {
      const result = await exportThemeForTarget(sampleTheme, "json");
      expect(result.target).toBe("json");
      expect(result.singleCode).toContain(
        "https://www.designtokens.org/tr/drafts/format/",
      );
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining(["tokens.json", "README.md"]),
      );
    });

    it("exports Blender property group script", async () => {
      const result = await exportThemeForTarget(sampleTheme, "blender");
      expect(result.target).toBe("blender");
      expect(result.singleCode).toContain("import bpy");
      expect(result.files.map((f: { filename: string }) => f.filename)).toEqual(
        expect.arrayContaining(["ktheme_blender.py", "README.md"]),
      );
    });

    it("throws error for unsupported target", async () => {
      await expect(
        exportThemeForTarget(sampleTheme, "unsupported"),
      ).rejects.toThrow("Unsupported export target 'unsupported'");
    });
  });
});
