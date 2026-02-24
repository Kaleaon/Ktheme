import { useTheme } from '../../state/ThemeContext.tsx';
import { contrastRatio } from '../../utils/colors.ts';

const COLOR_GROUPS = [
  {
    label: 'Primary',
    pairs: [
      ['primary', 'onPrimary'],
      ['primaryContainer', 'onPrimaryContainer'],
    ],
  },
  {
    label: 'Secondary',
    pairs: [
      ['secondary', 'onSecondary'],
      ['secondaryContainer', 'onSecondaryContainer'],
    ],
  },
  {
    label: 'Tertiary',
    pairs: [
      ['tertiary', 'onTertiary'],
      ['tertiaryContainer', 'onTertiaryContainer'],
    ],
  },
  {
    label: 'Error',
    pairs: [
      ['error', 'onError'],
      ['errorContainer', 'onErrorContainer'],
    ],
  },
  {
    label: 'Surfaces',
    pairs: [
      ['background', 'onBackground'],
      ['surface', 'onSurface'],
      ['surfaceVariant', 'onSurfaceVariant'],
    ],
  },
  {
    label: 'Other',
    pairs: [
      ['outline', 'outlineVariant'],
      ['inverseSurface', 'inverseOnSurface'],
    ],
  },
];

function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

export function ColorEditor() {
  const { state, dispatch } = useTheme();
  const colors = state.currentTheme.colorScheme;

  function setColor(key: string, value: string) {
    dispatch({ type: 'UPDATE_COLOR', payload: { key, value } });
  }

  return (
    <section className="editor-section">
      <h3 className="section-title">Colors</h3>
      {COLOR_GROUPS.map((group) => (
        <div key={group.label} className="color-group">
          <h4 className="group-label">{group.label}</h4>
          {group.pairs.map(([bg, fg]) => {
            const bgVal = (colors as unknown as Record<string, string>)[bg] || '#000000';
            const fgVal = (colors as unknown as Record<string, string>)[fg] || '#FFFFFF';
            const cr = contrastRatio(bgVal, fgVal);
            const crOk = cr >= 4.5;
            return (
              <div key={`${bg}-${fg}`} className="color-pair">
                <div className="color-picker-row">
                  <label className="color-picker">
                    <input
                      type="color"
                      value={bgVal}
                      onChange={(e) => setColor(bg, e.target.value)}
                    />
                    <span className="color-label">{formatLabel(bg)}</span>
                    <span className="color-hex">{bgVal}</span>
                  </label>
                  <label className="color-picker">
                    <input
                      type="color"
                      value={fgVal}
                      onChange={(e) => setColor(fg, e.target.value)}
                    />
                    <span className="color-label">{formatLabel(fg)}</span>
                    <span className="color-hex">{fgVal}</span>
                  </label>
                </div>
                <div className={`contrast-badge ${crOk ? 'ok' : 'warn'}`}>
                  {cr.toFixed(1)}:1 {crOk ? 'AA' : '!'}
                </div>
                <div
                  className="color-swatch-preview"
                  style={{ background: bgVal, color: fgVal }}
                >
                  Sample Text
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
