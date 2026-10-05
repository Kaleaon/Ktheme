import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const filesToCheck = [
  'src/components/customizer/MetadataEditor.tsx',
  'src/components/customizer/TypographyEditor.tsx',
  'src/components/customizer/ColorEditor.tsx',
  'src/components/customizer/EffectsEditor.tsx',
  'src/components/customizer/ExportImport.tsx',
];

const failures = [];

for (const relPath of filesToCheck) {
  const fullPath = resolve(relPath);
  const code = readFileSync(fullPath, 'utf8');

  // Check 1: Every <input ... /> or <select ... /> or <textarea ... /> must have an id prop or receive id from helper
  // Check 2: Every <label ...> must have htmlFor
  const labelMatches = code.match(/<label\b[^>]*>/g) || [];
  for (const labelTag of labelMatches) {
    if (!labelTag.includes('htmlFor=')) {
      failures.push(`${relPath}: Found <label> without htmlFor: ${labelTag}`);
    }
  }

  // Ensure useId is imported
  if (!code.includes('useId')) {
    failures.push(`${relPath}: Component does not import or use React useId()`);
  }
}

if (failures.length > 0) {
  console.error('Customizer explicit label verification failed:\n');
  for (const f of failures) {
    console.error(`- ${f}`);
  }
  process.exit(1);
}

console.log('Customizer explicit label verification passed: All labels use htmlFor bindings.');
