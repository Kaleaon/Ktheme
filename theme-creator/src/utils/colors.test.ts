import {
  contrastRatio as coreContrastRatio,
  hexToRgb as coreHexToRgb,
  mix as coreMix,
  relativeLuminance as coreRelativeLuminance,
  rgbToHex as coreRgbToHex,
} from "../../../src/utils/colors";
import {
  adjustBrightness,
  contrastRatio,
  hexToRgb,
  luminance,
  mixColors,
  rgbToHex,
} from "./colors";

describe("theme-creator color utilities delegation", () => {
  it("delegates hexToRgb to core Ktheme and handles invalid hex inputs gracefully", () => {
    expect(hexToRgb("#D4AF37")).toEqual(coreHexToRgb("#D4AF37"));
    expect(hexToRgb("#abc")).toEqual(coreHexToRgb("#abc"));
    expect(hexToRgb("0A1630")).toEqual(coreHexToRgb("0A1630"));
    expect(hexToRgb("invalid-hex")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("maps positional rgbToHex(r, g, b) arguments to core rgbToHex with byte clamping", () => {
    expect(rgbToHex(212, 175, 55)).toBe(
      coreRgbToHex({ r: 212, g: 175, b: 55 }),
    );
    expect(rgbToHex(-20, 300, 127.6)).toBe("#00ff80");
    expect(rgbToHex(Number.NaN, Number.POSITIVE_INFINITY, 16)).toBe("#000010");
  });

  it("delegates luminance and contrastRatio to core WCAG implementations", () => {
    expect(luminance("#FFFFFF")).toBe(coreRelativeLuminance("#FFFFFF"));
    expect(luminance("#0A1630")).toBe(coreRelativeLuminance("#0A1630"));
    expect(luminance("not-a-color")).toBe(0);

    expect(contrastRatio("#000000", "#FFFFFF")).toBe(
      coreContrastRatio("#000000", "#FFFFFF"),
    );
    expect(contrastRatio("#D4AF37", "#0A1630")).toBe(
      coreContrastRatio("#D4AF37", "#0A1630"),
    );
    expect(contrastRatio("invalid", "#FFFFFF")).toBe(1);
    expect(contrastRatio("#000000", "")).toBe(1);
  });

  it("preserves adjustBrightness and mixColors behavior using core primitives", () => {
    expect(adjustBrightness("#102030", 16)).toBe("#203040");
    expect(adjustBrightness("#050505", -20)).toBe("#000000");
    expect(adjustBrightness("#f5f5f5", 30)).toBe("#ffffff");

    const expectedMix = coreMix("#000000", "#ffffff", 0.5);
    expect(mixColors("#000000", "#ffffff", 0.5)).toBe(
      rgbToHex(expectedMix.r, expectedMix.g, expectedMix.b),
    );
    expect(mixColors("#ff0000", "#0000ff", -1)).toBe("#ff0000");
    expect(mixColors("#ff0000", "#0000ff", 2)).toBe("#0000ff");
    expect(mixColors("invalid", "#ffffff", 0.5)).toBe("#808080");
  });
});
