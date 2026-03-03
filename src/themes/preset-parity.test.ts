import { ENGINE_PRESET_IDS } from './presets';
import { SHARED_PRESET_IDS } from './shared-preset-ids';
import { CREATOR_PRESET_IDS } from '../../theme-creator/src/utils/preset-themes';

describe('preset parity', () => {
  it('keeps creator preset IDs aligned with engine preset IDs', () => {
    expect(CREATOR_PRESET_IDS).toEqual(ENGINE_PRESET_IDS);
  });

  it('keeps shared preset artifact aligned with engine preset IDs', () => {
    expect(Array.from(SHARED_PRESET_IDS)).toEqual(ENGINE_PRESET_IDS);
  });
});
