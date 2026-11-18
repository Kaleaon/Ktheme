import { createRequire } from "node:module";
import path from "node:path";

function resolvePackage(id) {
  const localRequire = createRequire(import.meta.url);
  try {
    return localRequire(id);
  } catch {}

  const candidateDirs = [
    path.resolve(path.dirname(process.execPath), "../lib/node_modules"),
    path.resolve(path.dirname(process.execPath), "node_modules"),
    process.argv[1] ? path.resolve(path.dirname(process.argv[1]), "..") : null,
    process.argv[1]
      ? path.resolve(path.dirname(process.argv[1]), "../..")
      : null,
    ...(process.env.NODE_PATH
      ? process.env.NODE_PATH.split(path.delimiter)
      : []),
  ].filter(Boolean);

  for (const dir of candidateDirs) {
    try {
      const customRequire = createRequire(path.join(dir, "package.json"));
      return customRequire(id);
    } catch {}
  }

  return localRequire(id);
}

const js = resolvePackage("@eslint/js");
const tsParser = resolvePackage("@typescript-eslint/parser");
const tsPlugin = resolvePackage("@typescript-eslint/eslint-plugin");
const globals = resolvePackage("globals");

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/build/**",
    ],
  },
  js.configs.recommended,
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.js",
      "**/*.jsx",
      "**/*.mjs",
      "**/*.cjs",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["eslint-recommended"].overrides[0].rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
