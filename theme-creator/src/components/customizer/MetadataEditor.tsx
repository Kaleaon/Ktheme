import { useId } from 'react';
import { useTheme } from '../../state/ThemeContext.tsx';

export function MetadataEditor() {
  const { state, dispatch } = useTheme();
  const meta = state.currentTheme.metadata;

  const nameId = useId();
  const authorId = useId();
  const descriptionId = useId();
  const tagsId = useId();

  function update(field: string, value: string | string[]) {
    dispatch({ type: 'UPDATE_METADATA', payload: { [field]: value } });
  }

  return (
    <section className="editor-section">
      <h3 className="section-title">Theme Info</h3>
      <div className="form-grid">
        <label className="form-field" htmlFor={nameId}>
          <span className="field-label">Name</span>
          <input
            id={nameId}
            type="text"
            value={meta.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Theme Name"
          />
        </label>
        <label className="form-field" htmlFor={authorId}>
          <span className="field-label">Author</span>
          <input
            id={authorId}
            type="text"
            value={meta.author}
            onChange={(e) => update('author', e.target.value)}
            placeholder="Author Name"
          />
        </label>
        <label className="form-field full-width" htmlFor={descriptionId}>
          <span className="field-label">Description</span>
          <textarea
            id={descriptionId}
            value={meta.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Describe your theme..."
            rows={2}
          />
        </label>
        <label className="form-field full-width" htmlFor={tagsId}>
          <span className="field-label">Tags</span>
          <input
            id={tagsId}
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
