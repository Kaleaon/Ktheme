#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const PRESETS_FILE = 'src/themes/presets.ts';
const FORCE_FLAG = '--force';

const hasChanges = file => {
  const unstaged = execSync(`git diff --name-only -- ${file}`, { encoding: 'utf8' }).trim();
  const staged = execSync(`git diff --cached --name-only -- ${file}`, { encoding: 'utf8' }).trim();
  return Boolean(unstaged || staged);
};

const shouldForce = process.argv.includes(FORCE_FLAG);

if (!shouldForce && !hasChanges(PRESETS_FILE)) {
  console.log(`No changes detected in ${PRESETS_FILE}; skipping updatedAt bump.`);
  process.exit(0);
}

const timestampArg = process.argv.find(arg => arg.startsWith('--timestamp='));
const nextTimestamp = timestampArg
  ? timestampArg.slice('--timestamp='.length)
  : new Date().toISOString();

if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(nextTimestamp)) {
  console.error('Expected an ISO timestamp like 2026-03-30T00:00:00.000Z.');
  process.exit(1);
}

const source = readFileSync(PRESETS_FILE, 'utf8');
const updated = source.replace(
  /const PRESET_UPDATED_AT = '[^']+';/,
  `const PRESET_UPDATED_AT = '${nextTimestamp}';`
);

if (source === updated) {
  if (!source.includes('const PRESET_UPDATED_AT =')) {
    console.error(`Could not find PRESET_UPDATED_AT in ${PRESETS_FILE}.`);
    process.exit(1);
  }

  console.log(`PRESET_UPDATED_AT already set to ${nextTimestamp}; no changes made.`);
  process.exit(0);
}

writeFileSync(PRESETS_FILE, updated);
console.log(`Updated ${PRESETS_FILE} PRESET_UPDATED_AT to ${nextTimestamp}.`);
