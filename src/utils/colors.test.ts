import {
  adjustHue,
  adjustSaturation,
  analogousPalette,
  complementaryColor,
  generatePaletteFromSeed,
  hexToHsl,
  hslToHex,
  hslToRgb,
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
});
