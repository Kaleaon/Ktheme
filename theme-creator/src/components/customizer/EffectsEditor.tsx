import { useTheme } from '../../state/ThemeContext.tsx';
import { METALLIC_PRESETS } from '../../utils/theme-defaults.ts';
import type { MetallicVariant, VisualEffects } from '../../types/theme.ts';

export function EffectsEditor() {
  const { state, dispatch } = useTheme();
  const effects = state.currentTheme.effects || {};

  function updateEffects(patch: Partial<VisualEffects>) {
    dispatch({ type: 'UPDATE_EFFECTS', payload: patch });
  }

  const metallic = effects.metallic || {
    enabled: false,
    variant: 'GOLD' as MetallicVariant,
    gradient: METALLIC_PRESETS.GOLD,
    intensity: 0.6,
  };

  const shadows = effects.shadows || {
    enabled: true,
    elevation: 4,
    blur: 8,
    color: '#00000040',
  };

  const shimmer = effects.shimmer || {
    enabled: false,
    speed: 3,
    intensity: 0.5,
    angle: 135,
  };

  return (
    <section className="editor-section">
      <h3 className="section-title">Effects</h3>

      {/* Metallic */}
      <div className="effect-block">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={metallic.enabled}
            onChange={(e) =>
              updateEffects({ metallic: { ...metallic, enabled: e.target.checked } })
            }
          />
          <span className="toggle-label">Metallic Effect</span>
        </label>
        {metallic.enabled && (
          <div className="effect-controls">
            <label className="form-field">
              <span className="field-label">Variant</span>
              <select
                value={metallic.variant}
                onChange={(e) => {
                  const v = e.target.value as MetallicVariant;
                  const preset = METALLIC_PRESETS[v] || METALLIC_PRESETS.GOLD;
                  updateEffects({
                    metallic: { ...metallic, variant: v, gradient: preset },
                  });
                }}
              >
                {Object.keys(METALLIC_PRESETS).map((v) => (
                  <option key={v} value={v}>
                    {v.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span className="field-label">Intensity: {metallic.intensity}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={metallic.intensity}
                onChange={(e) =>
                  updateEffects({
                    metallic: { ...metallic, intensity: parseFloat(e.target.value) },
                  })
                }
              />
            </label>
            <div className="gradient-preview-row">
              {Object.entries(metallic.gradient).map(([key, val]) => (
                <label key={key} className="color-picker mini">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) =>
                      updateEffects({
                        metallic: {
                          ...metallic,
                          gradient: { ...metallic.gradient, [key]: e.target.value },
                        },
                      })
                    }
                  />
                  <span className="color-label">{key}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shadows */}
      <div className="effect-block">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={shadows.enabled}
            onChange={(e) =>
              updateEffects({ shadows: { ...shadows, enabled: e.target.checked } })
            }
          />
          <span className="toggle-label">Shadows</span>
        </label>
        {shadows.enabled && (
          <div className="effect-controls">
            <label className="form-field">
              <span className="field-label">Elevation: {shadows.elevation}</span>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={shadows.elevation}
                onChange={(e) =>
                  updateEffects({
                    shadows: { ...shadows, elevation: parseInt(e.target.value) },
                  })
                }
              />
            </label>
            <label className="form-field">
              <span className="field-label">Blur: {shadows.blur}px</span>
              <input
                type="range"
                min="0"
                max="48"
                step="1"
                value={shadows.blur}
                onChange={(e) =>
                  updateEffects({
                    shadows: { ...shadows, blur: parseInt(e.target.value) },
                  })
                }
              />
            </label>
          </div>
        )}
      </div>

      {/* Shimmer */}
      <div className="effect-block">
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={shimmer.enabled}
            onChange={(e) =>
              updateEffects({ shimmer: { ...shimmer, enabled: e.target.checked } })
            }
          />
          <span className="toggle-label">Shimmer</span>
        </label>
        {shimmer.enabled && (
          <div className="effect-controls">
            <label className="form-field">
              <span className="field-label">Speed: {shimmer.speed}s</span>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={shimmer.speed}
                onChange={(e) =>
                  updateEffects({
                    shimmer: { ...shimmer, speed: parseFloat(e.target.value) },
                  })
                }
              />
            </label>
            <label className="form-field">
              <span className="field-label">Intensity: {shimmer.intensity}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={shimmer.intensity}
                onChange={(e) =>
                  updateEffects({
                    shimmer: { ...shimmer, intensity: parseFloat(e.target.value) },
                  })
                }
              />
            </label>
            <label className="form-field">
              <span className="field-label">Angle: {shimmer.angle}deg</span>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={shimmer.angle}
                onChange={(e) =>
                  updateEffects({
                    shimmer: { ...shimmer, angle: parseInt(e.target.value) },
                  })
                }
              />
            </label>
          </div>
        )}
      </div>
    </section>
  );
}
