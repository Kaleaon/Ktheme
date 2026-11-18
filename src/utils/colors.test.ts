import {
  adjustHue,
  adjustSaturation,
  analogousPalette,
  complementaryColor,
  contrastRatio,
  generatePaletteFromSeed,
  hexToRgb,
  hexToHsl,
  hslToHex,
  hslToRgb,
  isValidHex,
  normalizeColor,
  relativeLuminance,
  rgbToHsl,
  splitComplementaryPalette,
  triadicPalette,
} from "./colors";

describe("HSL color utilities", () => {
  it("supports RGB/HSL round trips", () => {
    const rgb = { r: 31, g: 147, b: 203 };
    const hsl = rgbToHsl(rgb);
    const back = hslToRgb(hsl);

    expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(1);
  });

  it("supports Hex/HSL round trips", () => {
    const hex = "#4F6BED";
    const hsl = hexToHsl(hex);
    const back = hslToHex(hsl);

    expect(back).toMatch(/^#[0-9a-f]{6}$/i);
    expect(back.toLowerCase()).toBe("#4f6bed");
  });

  it("builds analogous, triadic and split-complementary palettes", () => {
    expect(analogousPalette("#2E7D32", 5, 40)).toHaveLength(5);
    expect(triadicPalette("#2E7D32")).toHaveLength(3);
    expect(splitComplementaryPalette("#2E7D32")).toHaveLength(3);
  });

  it("computes complementary and adjustment helpers", () => {
    expect(complementaryColor("#FF0000").toLowerCase()).toBe("#00ffff");

    const shifted = adjustHue("#336699", 180);
    expect(shifted).toMatch(/^#[0-9a-f]{6}$/i);

    const desaturated = adjustSaturation("#336699", -30);
    expect(desaturated).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("generates coherent palette values from a seed", () => {
    const palette = generatePaletteFromSeed("#6750A4");

    expect(palette.primary).toBeDefined();
    expect(palette.secondary).toBeDefined();
    expect(palette.tertiary).toBeDefined();
    expect(palette.surface).toBeDefined();
    expect(palette.background).toBeDefined();
    expect(palette.outline).toBeDefined();
  });

  it("validates and normalizes mixed supported color formats", () => {
    expect(isValidHex("#abcd")).toBe(true);
    expect(isValidHex("#11223344")).toBe(true);
    expect(isValidHex("#12")).toBe(false);

    expect(hexToRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
    expect(normalizeColor("rgb(12, 34, 56)")).toEqual({
      r: 12,
      g: 34,
      b: 56,
      a: 1,
    });
    expect(normalizeColor("rgba(12,34,56,0.5)")).toEqual({
      r: 12,
      g: 34,
      b: 56,
      a: 0.5,
    });
    expect(normalizeColor("hsl(0, 100%, 50%)")).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });
  });

  it("throws on invalid color string formats and channel ranges", () => {
    expect(() => normalizeColor("invalid-color-string")).toThrow(
      "Invalid color string format",
    );
    expect(() => normalizeColor("rgba(1, 2, 3, 1.2)")).toThrow(
      "Invalid color string format",
    );
    expect(() => normalizeColor({ r: -1, g: 0, b: 0 })).toThrow(
      "Invalid RGB channels",
    );
    expect(() => normalizeColor({ r: 0, g: 0, b: 0, a: -0.1 })).toThrow(
      "Invalid alpha channel",
    );
  });

  describe("WCAG Relative Luminance & Contrast Ratio", () => {
    it("computes accurate luminance for standard colors", () => {
      expect(relativeLuminance("#000000")).toBe(0);
      expect(relativeLuminance("#ffffff")).toBe(1);
      expect(relativeLuminance("#fff")).toBe(1);
      expect(relativeLuminance("#000")).toBe(0);
    });

    it("computes contrast ratio accurately according to WCAG 2.1/2.2", () => {
      // Black vs White is 21:1
      expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
      expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 1);

      // Identical colors have contrast ratio 1:1
      expect(contrastRatio("#D4AF37", "#D4AF37")).toBe(1);

      // Navy background (#0A1630) vs Gold primary (#D4AF37)
      const ratio = contrastRatio("#D4AF37", "#0A1630");
      expect(ratio).toBeGreaterThan(4.5);
    });
  });
});
