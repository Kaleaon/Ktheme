import fs from "fs";
import path from "path";

describe("CSS Token Alias Matrix & Generator Standardization", () => {
  it("tokens.css defines aliases mapping legacy namespaces to --ktheme-* variables", () => {
    const tokensCssPath = path.join(__dirname, "../../tokens.css");
    const content = fs.readFileSync(tokensCssPath, "utf-8");

    expect(content).toContain("--c-primary: var(--ktheme-primary);");
    expect(content).toContain("--md-sys-color-primary: var(--ktheme-primary);");
    expect(content).toContain("--bg-surface: var(--ktheme-surface, var(--ktheme-bg-surface));");
    expect(content).toContain("--kt-font-ui: var(--ktheme-font-ui);");
  });
});
