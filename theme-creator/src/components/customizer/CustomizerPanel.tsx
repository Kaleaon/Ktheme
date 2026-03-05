import { MetadataEditor } from './MetadataEditor.tsx';
import { ColorEditor } from './ColorEditor.tsx';
import { EffectsEditor } from './EffectsEditor.tsx';
import { TypographyEditor } from './TypographyEditor.tsx';
import { ExportImport } from './ExportImport.tsx';

export function CustomizerPanel() {
  return (
    <div className="panel customizer-panel">
      <h2 className="section-title">Customize Theme</h2>
      <div className="panel-scroll">
        <MetadataEditor />
        <ColorEditor />
        <EffectsEditor />
        <TypographyEditor />
        <ExportImport />
      </div>
    </div>
  );
}
