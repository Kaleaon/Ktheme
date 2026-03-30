import {
  adjustHue,
  adjustSaturation,
  analogousPalette,
  complementaryColor,
  generatePaletteFromSeed,
  hexToRgb,
  hexToHsl,
  hslToHex,
  hslToRgb,
  isValidHex,
  normalizeColor,
  rgbToHsl,
  splitComplementaryPalette,
  triadicPalette
} from './colors';

describe('HSL color utilities', () => {
  it('supports RGB/HSL round trips', () => {
    const rgb = { r: 31, g: 147, b: 203 };
    const hsl = rgbToHsl(rgb);
    const back = hslToRgb(hsl);

    expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(1);
    expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(1);
  });

  it('supports Hex/HSL round trips', () => {
    const hex = '#4F6BED';
    const hsl = hexToHsl(hex);
    const back = hslToHex(hsl);

    expect(back).toMatch(/^#[0-9a-f]{6}$/i);
    expect(back.toLowerCase()).toBe('#4f6bed');
  });

  it('builds analogous, triadic and split-complementary palettes', () => {
    expect(analogousPalette('#2E7D32', 5, 40)).toHaveLength(5);
    expect(triadicPalette('#2E7D32')).toHaveLength(3);
    expect(splitComplementaryPalette('#2E7D32')).toHaveLength(3);
  });

  it('computes complementary and adjustment helpers', () => {
    expect(complementaryColor('#FF0000').toLowerCase()).toBe('#00ffff');

    const shifted = adjustHue('#336699', 180);
    expect(shifted).toMatch(/^#[0-9a-f]{6}$/i);

    const desaturated = adjustSaturation('#336699', -30);
    expect(desaturated).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('generates coherent palette values from a seed', () => {
    const palette = generatePaletteFromSeed('#6750A4');

    expect(palette.primary).toBeDefined();
    expect(palette.secondary).toBeDefined();
    expect(palette.tertiary).toBeDefined();
    expect(palette.surface).toBeDefined();
    expect(palette.background).toBeDefined();
    expect(palette.outline).toBeDefined();
  });

  it('validates and normalizes mixed supported color formats', () => {
    expect(isValidHex('#abcd')).toBe(true);
    expect(isValidHex('#11223344')).toBe(true);
    expect(isValidHex('#12')).toBe(false);

    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(normalizeColor('rgb(12, 34, 56)')).toEqual({ r: 12, g: 34, b: 56, a: 1 });
    expect(normalizeColor('rgba(12,34,56,0.5)')).toEqual({ r: 12, g: 34, b: 56, a: 0.5 });
  });

  it('throws on invalid color string formats and channel ranges', () => {
    expect(() => normalizeColor('hsl(10, 20%, 30%)')).toThrow('Invalid color string format');
    expect(() => normalizeColor('rgba(1, 2, 3, 1.2)')).toThrow('Invalid color string format');
    expect(() => normalizeColor({ r: -1, g: 0, b: 0 })).toThrow('Invalid RGB channels');
    expect(() => normalizeColor({ r: 0, g: 0, b: 0, a: -0.1 })).toThrow('Invalid alpha channel');
  });
});
