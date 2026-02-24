import { useTheme } from '../../state/ThemeContext.tsx';

export function MetadataEditor() {
  const { state, dispatch } = useTheme();
  const meta = state.currentTheme.metadata;

  function update(field: string, value: string | string[]) {
    dispatch({ type: 'UPDATE_METADATA', payload: { [field]: value } });
  }

  return (
    <section className="editor-section">
      <h3 className="section-title">Theme Info</h3>
      <div className="form-grid">
        <label className="form-field">
          <span className="field-label">Name</span>
          <input
            type="text"
            value={meta.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Theme Name"
          />
        </label>
        <label className="form-field">
          <span className="field-label">Author</span>
          <input
            type="text"
            value={meta.author}
            onChange={(e) => update('author', e.target.value)}
            placeholder="Author Name"
          />
        </label>
        <label className="form-field full-width">
          <span className="field-label">Description</span>
          <textarea
            value={meta.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe your theme..."
            rows={2}
          />
        </label>
        <label className="form-field full-width">
          <span className="field-label">Tags</span>
          <input
            type="text"
            value={meta.tags.join(', ')}
            onChange={(e) =>
              update(
                'tags',
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            placeholder="dark, metallic, elegant"
          />
        </label>
      </div>
    </section>
  );
}
