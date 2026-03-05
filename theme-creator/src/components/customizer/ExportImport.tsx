import { useId, useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';
import type { KTheme } from '../../types/theme.ts';

export function ExportImport() {
  const { state, dispatch } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const importInputId = useId();
  const [statusMessage, setStatusMessage] = useState('');

  function handleExport() {
    const json = JSON.stringify(state.currentTheme, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.currentTheme.metadata.id || 'theme'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage(`${state.currentTheme.metadata.name} exported as JSON.`);
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
          setStatusMessage(`${theme.metadata.name || 'Theme'} imported.`);
        } else {
          setStatusMessage('Invalid theme file: missing required fields.');
          alert('Invalid theme file: missing required fields');
        }
      } catch {
        setStatusMessage('Failed to parse theme file.');
        alert('Failed to parse theme file');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <section className="editor-section" aria-labelledby="import-export-title">
      <h3 className="section-title" id="import-export-title">Import / Export</h3>
      <div className="action-row">
        <button className="btn btn-secondary" type="button" onClick={handleExport}>
          <Download size={16} aria-hidden="true" focusable="false" />
          Export JSON
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => fileRef.current?.click()}>
          <Upload size={16} aria-hidden="true" focusable="false" />
          Import JSON
        </button>
        <label htmlFor={importInputId} className="sr-only">Import theme JSON file</label>
        <input
          id={importInputId}
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
      <p className="sr-only" role="status" aria-live="polite">{statusMessage}</p>
    </section>
  );
}
