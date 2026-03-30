#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';

const README_PATH = path.resolve('README.md');
const REGISTRY_PATH = path.resolve('src/themes/shared-preset-ids.ts');

const SUMMARY_MARKER_START = '<!-- GENERATED_PRESET_SUMMARY_START -->';
const SUMMARY_MARKER_END = '<!-- GENERATED_PRESET_SUMMARY_END -->';
const LIST_MARKER_START = '<!-- GENERATED_PRESET_LIST_START -->';
const LIST_MARKER_END = '<!-- GENERATED_PRESET_LIST_END -->';

function readRegistry() {
  const sourceText = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const sourceFile = ts.createSourceFile(
    REGISTRY_PATH,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  let registryNode = null;

  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) {
      return;
    }

    for (const declaration of node.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === 'SHARED_PRESET_REGISTRY' &&
        declaration.initializer
      ) {
        registryNode = declaration.initializer;
      }
    }
  });

  if (!registryNode) {
    throw new Error('Unable to locate SHARED_PRESET_REGISTRY in shared-preset-ids.ts');
  }

  let arrayNode = registryNode;
  while (ts.isAsExpression(arrayNode) || ts.isSatisfiesExpression(arrayNode)) {
    arrayNode = arrayNode.expression;
  }

  if (!ts.isArrayLiteralExpression(arrayNode)) {
    throw new Error('SHARED_PRESET_REGISTRY must be an array literal');
  }

  return arrayNode.elements.map((element, index) => {
    if (!ts.isObjectLiteralExpression(element)) {
      throw new Error(`Registry entry at index ${index} is not an object literal`);
    }

    const record = {};

    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property)) {
        continue;
      }

      const key = ts.isIdentifier(property.name)
        ? property.name.text
        : ts.isStringLiteral(property.name)
          ? property.name.text
          : null;

      if (!key) {
        continue;
      }

      if (!ts.isStringLiteral(property.initializer)) {
        throw new Error(`Property "${key}" in registry entry ${index} must be a string literal`);
      }

      record[key] = property.initializer.text;
    }

    const required = ['id', 'name', 'category', 'status'];
    for (const key of required) {
      if (!record[key]) {
        throw new Error(`Missing required key "${key}" in registry entry ${index}`);
      }
    }

    return record;
  });
}

function buildGeneratedMarkdown(registry) {
  const totalCount = registry.length;
  const stableCount = registry.filter((preset) => preset.status === 'stable').length;
  const summary = `- 📱 **${totalCount} Preset Themes** - Generated from the shared preset registry (${stableCount} stable).`;

  const listHeader = `Ktheme includes **${totalCount} preset themes** defined in the shared catalog:`;
  const list = registry
    .map((preset, idx) => {
      const category = preset.category.replaceAll('-', ' ');
      return `${idx + 1}. **${preset.name}** (${preset.id}) — Category: ${category}; Status: ${preset.status}`;
    })
    .join('\n');

  return {
    summary,
    list: `${listHeader}\n\n${list}`
  };
}

function replaceSection(content, startMarker, endMarker, generated) {
  const pattern = new RegExp(`(${startMarker}\\n)([\\s\\S]*?)(\\n${endMarker})`);
  if (!pattern.test(content)) {
    throw new Error(`Missing marker section: ${startMarker} ... ${endMarker}`);
  }

  return content.replace(pattern, `$1${generated}$3`);
}

function generateReadmeContent() {
  const registry = readRegistry();
  const generated = buildGeneratedMarkdown(registry);
  let readme = fs.readFileSync(README_PATH, 'utf8');

  readme = replaceSection(readme, SUMMARY_MARKER_START, SUMMARY_MARKER_END, generated.summary);
  readme = replaceSection(readme, LIST_MARKER_START, LIST_MARKER_END, generated.list);

  return readme;
}

function main() {
  const mode = process.argv.includes('--check') ? 'check' : 'write';
  const nextReadme = generateReadmeContent();
  const currentReadme = fs.readFileSync(README_PATH, 'utf8');

  if (mode === 'check') {
    if (currentReadme !== nextReadme) {
      console.error('README.md is out of sync with SHARED_PRESET_REGISTRY. Run: npm run generate:theme-catalog');
      process.exit(1);
    }

    console.log('README.md preset catalog is up to date.');
    return;
  }

  fs.writeFileSync(README_PATH, nextReadme);
  console.log('Updated README.md from SHARED_PRESET_REGISTRY.');
}

main();
