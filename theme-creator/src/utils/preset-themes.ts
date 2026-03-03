import { PresetThemes } from '../../../src/themes/presets';
import { SHARED_PRESET_IDS } from '../../../src/themes/shared-preset-ids';
import type { KTheme } from '../types/theme';

const presetsById = new Map(
  Object.values(PresetThemes).map((theme) => [theme.metadata.id, theme])
);

export const PRESET_THEMES: KTheme[] = SHARED_PRESET_IDS.map((presetId) => {
  const presetTheme = presetsById.get(presetId);

  if (!presetTheme) {
    throw new Error(`Missing engine preset for shared preset id "${presetId}".`);
  }

  return presetTheme as unknown as KTheme;
});

export const CREATOR_PRESET_IDS = PRESET_THEMES.map((theme) => theme.metadata.id);
