import { getQuickAccessCardAlphas, MediaColors } from './quickAccess';
import { compositeOver, contrastRatio, opacity } from '../utils/colors';

describe('getQuickAccessCardAlphas', () => {
  it('enforces minimum border/chip contrast on dark surfaces', () => {
    const surface = '#141414';
    const overlay = '#FFFFFF';

    const alphas = getQuickAccessCardAlphas({ surface, overlay });

    const borderComposite = compositeOver(opacity(overlay, alphas.border), surface);
    const chipComposite = compositeOver(opacity(overlay, alphas.chip), surface);

    expect(contrastRatio(borderComposite, surface)).toBeGreaterThanOrEqual(
      MediaColors.QuickAccessCardAlphas.minBorderContrast
    );
    expect(contrastRatio(chipComposite, surface)).toBeGreaterThanOrEqual(
      MediaColors.QuickAccessCardAlphas.minChipContrast
    );
  });

  it('enforces minimum border/chip contrast on light surfaces', () => {
    const surface = '#FAF9F6';
    const overlay = '#000000';

    const alphas = getQuickAccessCardAlphas({ surface, overlay });

    const borderComposite = compositeOver(opacity(overlay, alphas.border), surface);
    const chipComposite = compositeOver(opacity(overlay, alphas.chip), surface);

    expect(contrastRatio(borderComposite, surface)).toBeGreaterThanOrEqual(
      MediaColors.QuickAccessCardAlphas.minBorderContrast
    );
    expect(contrastRatio(chipComposite, surface)).toBeGreaterThanOrEqual(
      MediaColors.QuickAccessCardAlphas.minChipContrast
    );
  });
});
