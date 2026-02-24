import { MetadataEditor } from './MetadataEditor.tsx';
import { ColorEditor } from './ColorEditor.tsx';
import { EffectsEditor } from './EffectsEditor.tsx';
import { TypographyEditor } from './TypographyEditor.tsx';
import { ExportImport } from './ExportImport.tsx';

export function CustomizerPanel() {
  return (
    <div className="panel customizer-panel">
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
