import { PresetThemes, SharedPresetThemeIds } from './presets';

describe('preset parity between engine and theme creator', () => {
  it('ensures every creator preset id exists in engine presets', () => {
    const enginePresetIds = new Set(
      Object.values(PresetThemes).map((theme) => theme.metadata.id)
    );

    for (const creatorPresetId of SharedPresetThemeIds) {
      expect(enginePresetIds.has(creatorPresetId)).toBe(true);
    }
  });
});
