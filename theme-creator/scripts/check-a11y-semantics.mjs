import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checks = [
  {
    file: 'src/components/layout/Sidebar.tsx',
    rules: [
      { regex: /role="tablist"/, message: 'Sidebar is missing role="tablist".' },
      { regex: /role="tab"/, message: 'Sidebar tabs are missing role="tab".' },
      { regex: /role="status"/, message: 'Sidebar is missing a live status region.' },
    ],
  },
  {
    file: 'src/components/presets/PresetsPanel.tsx',
    rules: [
      { regex: /role="tablist"/, message: 'Presets panel is missing role="tablist".' },
      { regex: /role="tabpanel"/, message: 'Presets panel is missing role="tabpanel".' },
      { regex: /aria-label={`Delete saved theme/, message: 'Preset delete button is missing an accessible name.' },
    ],
  },
  {
    file: 'src/components/ai/AIDesigner.tsx',
    rules: [
      { regex: /role="log"/, message: 'AI messages are missing an aria-live log region.' },
      { regex: /htmlFor={apiKeyInputId}/, message: 'AI key input is missing explicit label wiring.' },
      { regex: /aria-label="Send prompt"/, message: 'AI send button is missing accessible name.' },
    ],
  },
  {
    file: 'src/components/customizer/MetadataEditor.tsx',
    rules: [
      { regex: /htmlFor={nameId}/, message: 'Metadata name field is missing explicit label wiring.' },
      { regex: /htmlFor={authorId}/, message: 'Metadata author field is missing explicit label wiring.' },
      { regex: /htmlFor={descriptionId}/, message: 'Metadata description field is missing explicit label wiring.' },
      { regex: /htmlFor={tagsId}/, message: 'Metadata tags field is missing explicit label wiring.' },
    ],
  },
  {
    file: 'src/components/customizer/TypographyEditor.tsx',
    rules: [
      { regex: /htmlFor={fontFamilyId}/, message: 'Typography font family field is missing explicit label wiring.' },
      { regex: /htmlFor={lineHeightId}/, message: 'Typography line height field is missing explicit label wiring.' },
      { regex: /htmlFor={letterSpacingId}/, message: 'Typography letter spacing field is missing explicit label wiring.' },
      { regex: /htmlFor={inputId}/, message: 'Typography mapped controls are missing explicit label wiring.' },
    ],
  },
  {
    file: 'src/components/customizer/ColorEditor.tsx',
    rules: [
      { regex: /htmlFor={bgId}/, message: 'ColorEditor background color pickers are missing explicit label wiring.' },
      { regex: /htmlFor={fgId}/, message: 'ColorEditor foreground color pickers are missing explicit label wiring.' },
    ],
  },
  {
    file: 'src/components/customizer/EffectsEditor.tsx',
    rules: [
      { regex: /htmlFor={metallicEnabledId}/, message: 'EffectsEditor metallic toggle is missing explicit label wiring.' },
      { regex: /htmlFor={id}/, message: 'EffectsEditor Range/EffectToggle helpers are missing explicit label wiring.' },
    ],
  },
  {
    file: 'src/components/customizer/ExportImport.tsx',
    rules: [
      { regex: /role="status"/, message: 'Import\/Export panel is missing a live status region.' },
      { regex: /FormField/, message: 'Import input is missing an explicit label.' },
    ],
  },
  {
    file: 'src/components/bluesky/BlueskyPanel.tsx',
    rules: [
      { regex: /role="tablist"/, message: 'Bluesky panel is missing role="tablist".' },
      { regex: /role="tabpanel"/, message: 'Bluesky panel is missing role="tabpanel".' },
      { regex: /aria-label="Log out"/, message: 'Log out icon button is missing accessible name.' },
      { regex: /role="alert"/, message: 'Bluesky panel login error is missing role="alert".' },
      { regex: /aria-live="assertive"/, message: 'Bluesky panel login error is missing aria-live="assertive".' },
    ],
  },
];

const failures = [];

for (const check of checks) {
  const fullPath = resolve(check.file);
  const source = readFileSync(fullPath, 'utf8');

  for (const rule of check.rules) {
    if (!rule.regex.test(source)) {
      failures.push(`${check.file}: ${rule.message}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Accessibility semantic regression check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Accessibility semantic regression checks passed.');
