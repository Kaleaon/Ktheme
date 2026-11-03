import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, "../dist/cli.js");
const indexPath = path.resolve(__dirname, "../dist/index.js");

test("CLI: prints help with --help", () => {
  const output = execFileSync(process.execPath, [cliPath, "--help"], {
    encoding: "utf-8",
  });
  assert.match(output, /Usage: ktheme-schema <command>/);
  assert.match(output, /sync/);
  assert.match(output, /--check/);
  assert.match(output, /--apply/);
});

test("CLI: fails with unknown command", () => {
  assert.throws(
    () => {
      execFileSync(process.execPath, [cliPath, "unknown-command"], {
        encoding: "utf-8",
        stdio: "pipe",
      });
    },
    (err) => {
      assert.equal(err.status, 1);
      return true;
    }
  );
});

test("CLI: sync --check passes on valid schema v2 theme", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ktheme-test-"));
  try {
    const validTheme = {
      schemaVersion: 2,
      metadata: {
        id: "test-theme",
        name: "Test Theme",
        description: "Valid test theme",
        author: "Tester",
        version: "1.0.0",
        tags: ["dark"],
      },
      darkMode: true,
      adaptation: {},
      colorScheme: {
        error: "#CF6679",
        onError: "#000000",
        errorContainer: "#EF4444",
        onErrorContainer: "#FEF2F2",
        primary: "#6200EE",
        onPrimary: "#FFFFFF",
        secondary: "#03DAC6",
        onSecondary: "#000000",
        background: "#121212",
        onBackground: "#FFFFFF",
        surface: "#121212",
        onSurface: "#FFFFFF",
        outline: "#757575",
      },
    };
    const filePath = path.join(tmpDir, "theme.json");
    fs.writeFileSync(filePath, JSON.stringify(validTheme, null, 2), "utf-8");

    const output = execFileSync(
      process.execPath,
      [cliPath, "sync", "--check", filePath],
      { encoding: "utf-8" }
    );
    assert.match(output, /Errors: 0/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("CLI: sync --check detects drift on unmigrated theme and exits 1", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ktheme-test-"));
  try {
    const unmigratedTheme = {
      schemaVersion: 1,
      metadata: {
        id: "drift-theme",
        name: "Drift Theme",
        description: "Unmigrated test theme",
        author: "Tester",
        version: "1.0.0",
        tags: ["dark"],
      },
      colorScheme: {
        primary: "#6200EE",
        onPrimary: "#FFFFFF",
        secondary: "#03DAC6",
        onSecondary: "#000000",
        background: "#121212",
        onBackground: "#FFFFFF",
        surface: "#121212",
        onSurface: "#FFFFFF",
        outline: "#757575",
        error: "#CF6679",
        onError: "#000000",
      },
      windowChrome: {
        titleBarHeight: 28,
      },
    };
    const filePath = path.join(tmpDir, "theme.json");
    fs.writeFileSync(filePath, JSON.stringify(unmigratedTheme, null, 2), "utf-8");

    assert.throws(
      () => {
        execFileSync(process.execPath, [cliPath, "sync", "--check", filePath], {
          encoding: "utf-8",
          stdio: "pipe",
        });
      },
      (err) => {
        assert.equal(err.status, 1);
        assert.match(err.stderr || err.stdout, /Schema drift detected/);
        return true;
      }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("CLI: sync --apply migrates theme to schemaVersion 2", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "ktheme-test-"));
  try {
    const unmigratedTheme = {
      schemaVersion: 1,
      metadata: {
        id: "apply-theme",
        name: "Apply Theme",
        description: "Theme to migrate",
        author: "Tester",
        version: "1.0.0",
        tags: ["dark"],
      },
      colorScheme: {
        primary: "#6200EE",
        onPrimary: "#FFFFFF",
        secondary: "#03DAC6",
        onSecondary: "#000000",
        background: "#121212",
        onBackground: "#FFFFFF",
        surface: "#121212",
        onSurface: "#FFFFFF",
        outline: "#757575",
        error: "#CF6679",
        onError: "#000000",
      },
      windowChrome: {
        titleBarHeight: 28,
      },
    };
    const filePath = path.join(tmpDir, "theme.json");
    fs.writeFileSync(filePath, JSON.stringify(unmigratedTheme, null, 2), "utf-8");

    const output = execFileSync(
      process.execPath,
      [cliPath, "sync", "--apply", filePath],
      { encoding: "utf-8" }
    );
    assert.match(output, /Migrated: 1/);
    assert.match(output, /Errors: 0/);

    const migrated = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    assert.equal(migrated.schemaVersion, 2);
    assert.ok(migrated.adaptation?.desktopAdaptation?.windowChrome);

    // Now sync --check must pass with 0 errors
    const checkOutput = execFileSync(
      process.execPath,
      [cliPath, "sync", "--check", filePath],
      { encoding: "utf-8" }
    );
    assert.match(checkOutput, /Errors: 0/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("Package exports: exposes programmatic API", async () => {
  const schemaPkg = await import(indexPath);
  assert.equal(typeof schemaPkg.syncSchemas, "function");
  assert.equal(typeof schemaPkg.migrateTheme, "function");
  assert.equal(schemaPkg.SCHEMA_VERSION, 2);
  assert.equal(typeof schemaPkg.ThemeEngine, "function");
});
