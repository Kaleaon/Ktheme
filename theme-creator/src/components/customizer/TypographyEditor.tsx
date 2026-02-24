import { useTheme } from '../../state/ThemeContext.tsx';
import type { Typography } from '../../types/theme.ts';
import { DEFAULT_TYPOGRAPHY } from '../../utils/theme-defaults.ts';

const FONT_STACKS = [
  "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  "'Inter', system-ui, sans-serif",
  "'Fira Code', 'Cascadia Code', monospace",
  "'Georgia', 'Times New Roman', serif",
  "'JetBrains Mono', monospace",
  "'SF Pro Display', system-ui, sans-serif",
];

export function TypographyEditor() {
  const { state, dispatch } = useTheme();
  const typo = state.currentTheme.typography || DEFAULT_TYPOGRAPHY;

  function update(patch: Partial<Typography>) {
    dispatch({ type: 'UPDATE_TYPOGRAPHY', payload: { ...typo, ...patch } });
  }

  return (
    <section className="editor-section">
      <h3 className="section-title">Typography</h3>

      <label className="form-field full-width">
        <span className="field-label">Font Family</span>
        <select
          value={typo.fontFamily}
          onChange={(e) => update({ fontFamily: e.target.value })}
        >
          {FONT_STACKS.map((f) => (
            <option key={f} value={f}>
              {f.split(',')[0].replace(/'/g, '')}
            </option>
          ))}
        </select>
      </label>

      <div className="form-grid">
        <label className="form-field">
          <span className="field-label">Line Height: {typo.lineHeight}</span>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.05"
            value={typo.lineHeight}
            onChange={(e) => update({ lineHeight: parseFloat(e.target.value) })}
          />
        </label>
        <label className="form-field">
          <span className="field-label">Letter Spacing: {typo.letterSpacing}px</span>
          <input
            type="range"
            min="-2"
            max="5"
            step="0.25"
            value={typo.letterSpacing}
            onChange={(e) => update({ letterSpacing: parseFloat(e.target.value) })}
          />
        </label>
      </div>

      <h4 className="group-label">Font Sizes</h4>
      <div className="form-grid">
        {(Object.keys(typo.fontSize) as Array<keyof Typography['fontSize']>).map((size) => (
          <label key={size} className="form-field">
            <span className="field-label">
              {size}: {typo.fontSize[size]}px
            </span>
            <input
              type="range"
              min="8"
              max="48"
              step="1"
              value={typo.fontSize[size]}
              onChange={(e) =>
                update({
                  fontSize: { ...typo.fontSize, [size]: parseInt(e.target.value) },
                })
              }
            />
          </label>
        ))}
      </div>
    </section>
  );
}
