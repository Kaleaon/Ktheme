import fs from "fs";
import path from "path";

describe("WCAG 2.2 SC 2.5.8 Target Size (Minimum) Compliance Tests", () => {
  it("enforces 24x24px minimum bounding box on tweaks panel close button (.twk-x)", () => {
    const filePath = path.join(__dirname, "../../tweaks-panel.jsx");
    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toContain(".twk-x");
    expect(content).toContain("min-width:24px");
    expect(content).toContain("min-height:24px");
    expect(content).toContain("display:inline-flex");
    expect(content).toContain("align-items:center");
    expect(content).toContain("justify-content:center");
  });

  it("enforces 24x24px minimum bounding box on design canvas expand button (.dc-expand)", () => {
    const filePath = path.join(__dirname, "../../design-canvas.jsx");
    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toContain(".dc-expand");
    expect(content).toContain("min-width:24px");
    expect(content).toContain("min-height:24px");
    expect(content).toContain("width:24px");
    expect(content).toContain("height:24px");
    expect(content).toContain("display:flex");
  });

  it("defines shared .k-target-min-size utility class in tokens.css", () => {
    const filePath = path.join(__dirname, "../../tokens.css");
    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toContain(".k-target-min-size");
    expect(content).toContain("min-width: 24px");
    expect(content).toContain("min-height: 24px");
  });

  it("enforces at least 24px height on tweaks panel swatches (.twk-swatch)", () => {
    const filePath = path.join(__dirname, "../../tweaks-panel.jsx");
    const content = fs.readFileSync(filePath, "utf8");

    expect(content).toContain(".twk-swatch");
    expect(content).toContain("height:24px");
    expect(content).toContain("min-height:24px");
  });

  it("enforces k-target-min-size class on color inputs in ColorEditor.tsx and EffectsEditor.tsx", () => {
    const colorEditorPath = path.join(__dirname, "../../theme-creator/src/components/customizer/ColorEditor.tsx");
    const colorEditorContent = fs.readFileSync(colorEditorPath, "utf8");
    expect(colorEditorContent).toContain('className="k-target-min-size"');

    const effectsEditorPath = path.join(__dirname, "../../theme-creator/src/components/customizer/EffectsEditor.tsx");
    const effectsEditorContent = fs.readFileSync(effectsEditorPath, "utf8");
    expect(effectsEditorContent).toContain('className="k-target-min-size"');
  });
});
