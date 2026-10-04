import type { Theme } from './types';

export const SCHEMA_VERSION = 1;

type ThemeMigration = (theme: Theme) => Theme;

const migrations: Record<number, ThemeMigration> = {};

export function migrateTheme(theme: Theme, fromVersion: number, toVersion: number): Theme {
  if (fromVersion > toVersion) {
    throw new Error(`Cannot migrate theme backwards from schema ${fromVersion} to ${toVersion}`);
  }

  let migratedTheme = { ...theme };

  for (let targetVersion = fromVersion + 1; targetVersion <= toVersion; targetVersion += 1) {
    const migrateToVersion = migrations[targetVersion];
    if (!migrateToVersion) {
      throw new Error(`No migration path for schema version ${targetVersion}`);
    }
    migratedTheme = migrateToVersion(migratedTheme);
  }

  return migratedTheme;
}
