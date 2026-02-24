import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';
import { PRESET_THEMES } from '../../utils/preset-themes.ts';
import type { KTheme } from '../../types/theme.ts';

type SubTab = 'built-in' | 'saved';

export function PresetsPanel() {
  const { state, dispatch } = useTheme();
  const [subTab, setSubTab] = useState<SubTab>('built-in');

  function loadTheme(theme: KTheme) {
    dispatch({ type: 'SET_THEME', payload: JSON.parse(JSON.stringify(theme)) });
  }

  function deleteTheme(id: string) {
    dispatch({ type: 'DELETE_SAVED', payload: id });
  }

  return (
    <div className="panel presets-panel">
      <div className="presets-tabs">
        <button
          className={`bsky-tab ${subTab === 'built-in' ? 'active' : ''}`}
          onClick={() => setSubTab('built-in')}
        >
          Built-in ({PRESET_THEMES.length})
        </button>
        <button
          className={`bsky-tab ${subTab === 'saved' ? 'active' : ''}`}
          onClick={() => setSubTab('saved')}
        >
          Saved ({state.savedThemes.length})
        </button>
      </div>

      <div className="presets-grid">
        {subTab === 'built-in' &&
          PRESET_THEMES.map((theme) => (
            <PresetCard key={theme.metadata.id} theme={theme} onLoad={loadTheme} />
          ))}

        {subTab === 'saved' && state.savedThemes.length === 0 && (
          <p className="presets-empty">No saved themes yet. Customize a theme and save it.</p>
        )}

        {subTab === 'saved' &&
          state.savedThemes.map((theme) => (
            <PresetCard
              key={theme.metadata.id}
              theme={theme}
              onLoad={loadTheme}
              onDelete={deleteTheme}
            />
          ))}
      </div>
    </div>
  );
}

function PresetCard({
  theme,
  onLoad,
  onDelete,
}: {
  theme: KTheme;
  onLoad: (t: KTheme) => void;
  onDelete?: (id: string) => void;
}) {
  const c = theme.colorScheme;
  const metallic = theme.effects?.metallic;

  return (
    <div className="preset-card">
      <div
        className="preset-preview"
        style={{
          background: c.background,
          color: c.onBackground,
        }}
      >
        <div className="preset-preview-bar" style={{ background: c.surface }}>
          <div className="preset-preview-dot" style={{ background: c.primary }} />
          <div className="preset-preview-dot" style={{ background: c.secondary }} />
          <div className="preset-preview-dot" style={{ background: c.tertiary }} />
        </div>
        <div className="preset-preview-body">
          <div className="preset-preview-card" style={{ background: c.primary, color: c.onPrimary }}>
            Aa
          </div>
          <div className="preset-preview-card" style={{ background: c.surface, color: c.onSurface }}>
            Bb
          </div>
          {metallic?.enabled && (
            <div
              className="preset-preview-card preset-metallic"
              style={{
                background: `linear-gradient(135deg, ${metallic.gradient.base}, ${metallic.gradient.highlight}, ${metallic.gradient.shimmer})`,
                color: metallic.gradient.shadow,
              }}
            >
              M
            </div>
          )}
        </div>
        <div className="preset-swatches-row">
          {[c.primary, c.secondary, c.tertiary, c.error, c.surface, c.surfaceVariant].map(
            (color, i) => (
              <div key={i} className="preset-swatch" style={{ background: color }} />
            )
          )}
        </div>
      </div>
      <div className="preset-info">
        <strong>{theme.metadata.name}</strong>
        <p>{theme.metadata.description}</p>
        <div className="preset-tags">
          {theme.metadata.tags.map((tag) => (
            <span key={tag} className="preset-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="preset-actions">
        <button className="btn btn-primary btn-sm" onClick={() => onLoad(theme)}>
          <Download size={14} /> Load
        </button>
        {onDelete && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(theme.metadata.id)}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
