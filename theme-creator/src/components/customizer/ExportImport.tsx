import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';
import type { KTheme } from '../../types/theme.ts';

export function ExportImport() {
  const { state, dispatch } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = JSON.stringify(state.currentTheme, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentTheme.metadata.id || 'theme'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const theme = JSON.parse(ev.target?.result as string) as KTheme;
        if (theme.metadata?.id && theme.colorScheme?.primary) {
          dispatch({ type: 'SET_THEME', payload: theme });
        } else {
          alert('Invalid theme file: missing required fields');
        }
      } catch {
        alert('Failed to parse theme file');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <section className="editor-section">
      <h3 className="section-title">Import / Export</h3>
      <div className="action-row">
        <button className="btn btn-secondary" onClick={handleExport}>
          <Download size={16} />
          Export JSON
        </button>
        <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
          <Upload size={16} />
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
    </section>
  );
}
