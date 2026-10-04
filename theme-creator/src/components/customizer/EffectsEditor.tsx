import { useTheme } from '../../state/ThemeContext.tsx';
import { METALLIC_PRESETS } from '../../utils/theme-defaults.ts';
import type { MetallicVariant, VisualEffects } from '../../types/theme.ts';
import { DEFAULT_EFFECTS } from '../../utils/theme-defaults.ts';
import type { ReactNode } from 'react';

export function EffectsEditor() {
  const { state, dispatch } = useTheme();
  const effects = { ...DEFAULT_EFFECTS, ...state.currentTheme.effects };

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

  const blur = effects.blur!;
  const gradients = effects.gradients!;
  const animations = effects.animations!;
  const transitions = effects.transitions!;
  const overlays = effects.overlays!;
  const focusRing = effects.focusRing!;
  const noise = effects.noise!;

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

      <EffectToggle label="Surface Gradient" enabled={gradients.enabled} onToggle={(enabled) => updateEffects({ gradients: { ...gradients, enabled } })}>
        <Range label="Angle" value={gradients.angle} min={0} max={360} step={5} suffix="deg" onChange={(angle) => updateEffects({ gradients: { ...gradients, angle } })} />
        {gradients.stops.map((stop, index) => (
          <div className="gradient-stop" key={index}>
            <label className="color-picker"><input type="color" value={stop.color} onChange={(e) => updateEffects({ gradients: { ...gradients, stops: gradients.stops.map((item, i) => i === index ? { ...item, color: e.target.value } : item) } })} /><span className="color-label">Stop {index + 1}</span></label>
            <Range label="Position" value={Math.round(stop.offset * 100)} min={0} max={100} suffix="%" onChange={(offset) => updateEffects({ gradients: { ...gradients, stops: gradients.stops.map((item, i) => i === index ? { ...item, offset: offset / 100 } : item) } })} />
          </div>
        ))}
      </EffectToggle>

      <EffectToggle label="Backdrop Blur" enabled={blur.enabled} onToggle={(enabled) => updateEffects({ blur: { ...blur, enabled } })}>
        <Range label="Radius" value={blur.radius} min={0} max={40} suffix="px" onChange={(radius) => updateEffects({ blur: { ...blur, radius } })} />
      </EffectToggle>

      <EffectToggle label="Color Overlay" enabled={overlays.enabled} onToggle={(enabled) => updateEffects({ overlays: { ...overlays, enabled } })}>
        <label className="color-picker"><input type="color" value={overlays.color} onChange={(e) => updateEffects({ overlays: { ...overlays, color: e.target.value } })} /><span className="color-label">Overlay color</span></label>
        <Range label="Opacity" value={overlays.opacity} min={0} max={1} step={0.01} onChange={(opacity) => updateEffects({ overlays: { ...overlays, opacity } })} />
        <label className="form-field"><span className="field-label">Blend mode</span><select value={overlays.blendMode} onChange={(e) => updateEffects({ overlays: { ...overlays, blendMode: e.target.value as typeof overlays.blendMode } })}>{['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light'].map((mode) => <option key={mode}>{mode}</option>)}</select></label>
      </EffectToggle>

      <EffectToggle label="Noise Texture" enabled={noise.enabled} onToggle={(enabled) => updateEffects({ noise: { ...noise, enabled } })}>
        <Range label="Opacity" value={noise.opacity} min={0} max={0.3} step={0.01} onChange={(opacity) => updateEffects({ noise: { ...noise, opacity } })} />
        <Range label="Scale" value={noise.scale} min={2} max={16} suffix="px" onChange={(scale) => updateEffects({ noise: { ...noise, scale } })} />
      </EffectToggle>

      <EffectToggle label="Focus Ring" enabled={focusRing.enabled} onToggle={(enabled) => updateEffects({ focusRing: { ...focusRing, enabled } })}>
        <label className="color-picker"><input type="color" value={focusRing.color} onChange={(e) => updateEffects({ focusRing: { ...focusRing, color: e.target.value } })} /><span className="color-label">Ring color</span></label>
        <Range label="Width" value={focusRing.width} min={1} max={8} suffix="px" onChange={(width) => updateEffects({ focusRing: { ...focusRing, width } })} />
        <Range label="Offset" value={focusRing.offset} min={0} max={8} suffix="px" onChange={(offset) => updateEffects({ focusRing: { ...focusRing, offset } })} />
      </EffectToggle>

      <EffectToggle label="Animations" enabled={animations.enabled} onToggle={(enabled) => updateEffects({ animations: { ...animations, enabled } })}>
        <Range label="Duration" value={animations.duration} min={50} max={2000} step={50} suffix="ms" onChange={(duration) => updateEffects({ animations: { ...animations, duration } })} />
        <label className="form-field"><span className="field-label">Easing</span><select value={animations.easing} onChange={(e) => updateEffects({ animations: { ...animations, easing: e.target.value as typeof animations.easing } })}>{['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'].map((value) => <option key={value}>{value}</option>)}</select></label>
      </EffectToggle>

      <EffectToggle label="Transitions" enabled={transitions.enabled} onToggle={(enabled) => updateEffects({ transitions: { ...transitions, enabled } })}>
        <Range label="Duration" value={transitions.duration} min={0} max={1000} step={25} suffix="ms" onChange={(duration) => updateEffects({ transitions: { ...transitions, duration } })} />
        <label className="form-field"><span className="field-label">CSS properties</span><input type="text" value={transitions.properties.join(', ')} onChange={(e) => updateEffects({ transitions: { ...transitions, properties: e.target.value.split(',').map((value) => value.trim()).filter(Boolean) } })} /></label>
      </EffectToggle>
    </section>
  );
}

function Range({ label, value, min, max, step = 1, suffix = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return <label className="form-field"><span className="field-label">{label}: {value}{suffix}</span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}

function EffectToggle({ label, enabled, onToggle, children }: { label: string; enabled: boolean; onToggle: (enabled: boolean) => void; children: ReactNode }) {
  return <div className="effect-block"><label className="toggle-row"><input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} /><span className="toggle-label">{label}</span></label>{enabled && <div className="effect-controls">{children}</div>}</div>;
}
