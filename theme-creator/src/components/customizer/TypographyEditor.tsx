import { useTheme } from '../../state/ThemeContext.tsx';
import type { Typography } from '../../types/theme.ts';
import { DEFAULT_TYPOGRAPHY } from '../../utils/theme-defaults.ts';
import { FormField } from '../common/FormField.tsx';

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

      <FormField label="Font Family" fullWidth>
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
      </FormField>

      <div className="form-grid">
        <FormField label={`Line Height: ${typo.lineHeight}`}>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.05"
            value={typo.lineHeight}
            onChange={(e) => update({ lineHeight: parseFloat(e.target.value) })}
          />
        </FormField>
        <FormField label={`Letter Spacing: ${typo.letterSpacing}px`}>
          <input
            type="range"
            min="-2"
            max="5"
            step="0.25"
            value={typo.letterSpacing}
            onChange={(e) => update({ letterSpacing: parseFloat(e.target.value) })}
          />
        </FormField>
      </div>

      <h4 className="group-label">Font Sizes</h4>
      <div className="form-grid">
        {(Object.keys(typo.fontSize) as Array<keyof Typography['fontSize']>).map((size) => (
          <FormField key={size} label={`${size}: ${typo.fontSize[size]}px`}>
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
          </FormField>
        ))}
      </div>
      <h4 className="group-label">Font Weights</h4>
      <div className="form-grid">
        {(Object.keys(typo.fontWeight) as Array<keyof Typography['fontWeight']>).map((weight) => (
          <FormField key={weight} label={`${weight}: ${typo.fontWeight[weight]}`}>
            <input
              type="range"
              min="100"
              max="900"
              step="100"
              value={typo.fontWeight[weight]}
              onChange={(e) =>
                update({
                  fontWeight: { ...typo.fontWeight, [weight]: Number(e.target.value) },
                })
              }
            />
          </FormField>
        ))}
      </div>
    </section>
  );
}
