import { type KeyboardEvent, useId, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';
import { PRESET_THEMES } from '../../utils/preset-themes.ts';
import type { KTheme } from '../../types/theme.ts';

type SubTab = 'built-in' | 'saved';

export function PresetsPanel() {
  const { state, dispatch } = useTheme();
  const [subTab, setSubTab] = useState<SubTab>('built-in');
  const [statusMessage, setStatusMessage] = useState('');
  const builtInPanelId = useId();
  const savedPanelId = useId();

  function loadTheme(theme: KTheme) {
    dispatch({ type: 'SET_THEME', payload: JSON.parse(JSON.stringify(theme)) });
    setStatusMessage(`${theme.metadata.name} loaded.`);
  }

  function deleteTheme(id: string) {
    dispatch({ type: 'DELETE_SAVED', payload: id });
    setStatusMessage('Saved theme deleted.');
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = subTab === 'built-in' ? 'saved' : 'built-in';
    setSubTab(next);
  }

  return (
    <div className="panel presets-panel">
      <h2 className="section-title">Presets</h2>
      <div className="presets-tabs" role="tablist" aria-label="Preset source">
        <button
          id="presets-tab-built-in"
          type="button"
          role="tab"
          aria-controls={builtInPanelId}
          aria-selected={subTab === 'built-in'}
          tabIndex={subTab === 'built-in' ? 0 : -1}
          className={`bsky-tab ${subTab === 'built-in' ? 'active' : ''}`}
          onClick={() => setSubTab('built-in')}
          onKeyDown={handleTabKeyDown}
        >
          Built-in ({PRESET_THEMES.length})
        </button>
        <button
          id="presets-tab-saved"
          type="button"
          role="tab"
          aria-controls={savedPanelId}
          aria-selected={subTab === 'saved'}
          tabIndex={subTab === 'saved' ? 0 : -1}
          className={`bsky-tab ${subTab === 'saved' ? 'active' : ''}`}
          onClick={() => setSubTab('saved')}
          onKeyDown={handleTabKeyDown}
        >
          Saved ({state.savedThemes.length})
        </button>
      </div>

      <div
        className="presets-grid"
        id={subTab === 'built-in' ? builtInPanelId : savedPanelId}
        role="tabpanel"
        aria-labelledby={subTab === 'built-in' ? 'presets-tab-built-in' : 'presets-tab-saved'}
      >
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

      <p className="sr-only" role="status" aria-live="polite">{statusMessage}</p>
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
    <article className="preset-card" aria-label={`${theme.metadata.name} preset`}>
      <div
        className="preset-preview"
        aria-hidden="true"
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
        <button className="btn btn-primary btn-sm" type="button" onClick={() => onLoad(theme)}>
          <Download size={14} aria-hidden="true" focusable="false" /> Load
        </button>
        {onDelete && (
          <button
            className="btn btn-danger btn-sm"
            type="button"
            onClick={() => onDelete(theme.metadata.id)}
            aria-label={`Delete saved theme ${theme.metadata.name}`}
          >
            <Trash2 size={14} aria-hidden="true" focusable="false" />
          </button>
        )}
      </div>
    </article>
  );
}
