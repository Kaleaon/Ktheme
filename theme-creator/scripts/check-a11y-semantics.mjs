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
    file: 'src/components/customizer/ExportImport.tsx',
    rules: [
      { regex: /role="status"/, message: 'Import\/Export panel is missing a live status region.' },
      { regex: /htmlFor={importInputId}/, message: 'Import input is missing an explicit label.' },
    ],
  },
  {
    file: 'src/components/bluesky/BlueskyPanel.tsx',
    rules: [
      { regex: /role="tablist"/, message: 'Bluesky panel is missing role="tablist".' },
      { regex: /role="tabpanel"/, message: 'Bluesky panel is missing role="tabpanel".' },
      { regex: /aria-label="Log out"/, message: 'Log out icon button is missing accessible name.' },
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
