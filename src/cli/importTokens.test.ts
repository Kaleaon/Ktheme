import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { importTokensCommand } from "./importTokens";

describe("importTokens CLI command", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ktheme-import-test-"));
  });

  afterEach(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("successfully parses Tokens Studio JSON and generates output code assets", () => {
    const sampleJson = JSON.stringify({
      colors: {
        primary: { value: "#818CF8", type: "color" },
        background: { value: "#0F1117", type: "color" },
      },
    });

    const sourceFile = path.join(tmpDir, "tokens-studio.json");
    fs.writeFileSync(sourceFile, sampleJson, "utf-8");

    const outDir = path.join(tmpDir, "output");
    const result = importTokensCommand({
      source: sourceFile,
      out: outDir,
      format: "all",
      themeName: "Test Imported Theme",
    });

    expect(result.success).toBe(true);
    expect(result.generatedFiles.length).toBe(4);

    // Verify files exist
    const jsonFile = result.generatedFiles.find((f) => f.endsWith(".json"));
    const ktFile = result.generatedFiles.find((f) => f.endsWith(".kt"));
    const swiftFile = result.generatedFiles.find((f) => f.endsWith(".swift"));
    const cssFile = result.generatedFiles.find((f) => f.endsWith(".css"));

    expect(jsonFile).toBeDefined();
    expect(ktFile).toBeDefined();
    expect(swiftFile).toBeDefined();
    expect(cssFile).toBeDefined();

    expect(fs.existsSync(jsonFile!)).toBe(true);
    expect(fs.existsSync(ktFile!)).toBe(true);
    expect(fs.existsSync(swiftFile!)).toBe(true);
    expect(fs.existsSync(cssFile!)).toBe(true);

    const jsonParsed = JSON.parse(fs.readFileSync(jsonFile!, "utf-8"));
    expect(jsonParsed.metadata.name).toBe("Test Imported Theme");
    expect(jsonParsed.colorScheme.primary).toBe("#818CF8");
  });
});
