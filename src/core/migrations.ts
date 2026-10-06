import type { Theme } from "./types";

export const SCHEMA_VERSION = 2;

type ThemeMigration = (rawTheme: Record<string, unknown>) => Theme;

const migrations: Record<number, ThemeMigration> = {
  1: (rawTheme: Record<string, unknown>): Theme =>
    ({
      ...rawTheme,
      schemaVersion: 1,
    }) as Theme,

  2: (rawTheme: Record<string, unknown>): Theme => {
    const theme: Record<string, unknown> = { ...rawTheme };

    theme.schemaVersion = 2;

    if (typeof theme.$schema === "string" && theme.$schema.includes("v1")) {
      theme.$schema = theme.$schema.replace(/v1/g, "v2");
    }

    if (!theme.adaptation) {
      theme.adaptation = {};
    } else {
      theme.adaptation = { ...(theme.adaptation as Record<string, unknown>) };
    }

    const adaptObj = theme.adaptation as Record<string, unknown>;
    const desktopAdaptation: Record<string, unknown> = {
      ...((adaptObj.desktopAdaptation as Record<string, unknown>) || {}),
    };

    if (theme.desktopAdaptation) {
      Object.assign(
        desktopAdaptation,
        theme.desktopAdaptation as Record<string, unknown>,
      );
      delete theme.desktopAdaptation;
    }

    const desktopSubKeys = [
      "windowChrome",
      "menuBar",
      "taskbar",
      "cameraHud",
      "sweep",
    ];
    for (const key of desktopSubKeys) {
      if (theme[key]) {
        desktopAdaptation[key] = {
          ...((desktopAdaptation[key] as Record<string, unknown>) || {}),
          ...(theme[key] as Record<string, unknown>),
        };
        delete theme[key];
      }
    }

    if (Object.keys(desktopAdaptation).length > 0) {
      adaptObj.desktopAdaptation = desktopAdaptation;
    }

    const layoutObj = adaptObj.layout as Record<string, unknown> | undefined;
    if (layoutObj && !layoutObj.accessibility) {
      layoutObj.accessibility = {
        landmarks: {
          main: "main",
          nav: "navigation",
          header: "header",
          footer: "footer",
        },
        naming: {
          strategy: "native",
          main: "Main Content",
          nav: "Primary Navigation",
          header: "Application Header",
          footer: "Footer",
        },
        keyboard: {
          order: "document",
          focusPolicy: "native",
          trapFocusWithinModals: true,
        },
        liveRegion: { mode: "polite", atomic: true, relevant: "additions" },
      };
    }

    if (Array.isArray(theme.layouts)) {
      theme.layouts = theme.layouts.map((layout: unknown) => ({
        ...(layout as Record<string, unknown>),
      }));
    }

    if (!theme.metadata) {
      theme.metadata = {
        id: (theme.id as string) || "migrated-theme",
        name: (theme.name as string) || "Migrated Theme",
        description:
          (theme.description as string) ||
          "Auto-migrated schema v2 theme object",
        author: (theme.author as string) || "Ktheme Migration",
        version: (theme.version as string) || "2.0.0",
        tags: Array.isArray(theme.tags) ? theme.tags : ["migrated"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      delete theme.id;
      delete theme.name;
      delete theme.description;
      delete theme.author;
      delete theme.version;
      delete theme.tags;
    }

    if (theme.colorScheme) {
      const scheme = { ...(theme.colorScheme as Record<string, unknown>) };
      theme.colorScheme = {
        error: "#B91C1C",
        onError: "#FFFFFF",
        errorContainer: "#EF4444",
        onErrorContainer: "#FEF2F2",
        ...scheme,
      };
      const cs = theme.colorScheme as Record<string, unknown>;
      if (!cs.error) cs.error = "#B91C1C";
      if (!cs.onError) cs.onError = "#FFFFFF";
      if (!cs.errorContainer) cs.errorContainer = "#EF4444";
      if (!cs.onErrorContainer) cs.onErrorContainer = "#FEF2F2";
    } else {
      theme.colorScheme = {
        primary: "#1E3A8A",
        onPrimary: "#FFFFFF",
        primaryContainer: "#1E40AF",
        onPrimaryContainer: "#F8FAFC",
        secondary: "#B45309",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#D97706",
        onSecondaryContainer: "#FFFBEB",
        tertiary: "#0F766E",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#0D9488",
        onTertiaryContainer: "#F0FDFA",
        error: "#B91C1C",
        onError: "#FFFFFF",
        errorContainer: "#EF4444",
        onErrorContainer: "#FEF2F2",
        background: "#0B1220",
        onBackground: "#E2E8F0",
        surface: "#111827",
        onSurface: "#E5E7EB",
        surfaceVariant: "#1F2937",
        onSurfaceVariant: "#D1D5DB",
        outline: "#6B7280",
        outlineVariant: "#4B5563",
        scrim: "#000000",
        inverseSurface: "#E5E7EB",
        inverseOnSurface: "#111827",
        inversePrimary: "#93C5FD",
      };
    }

    if (theme.darkMode === undefined) {
      theme.darkMode = true;
    }

    return theme as unknown as Theme;
  },
};

export function migrateTheme(
  theme: unknown,
  fromVersion: number,
  toVersion: number,
): Theme {
  if (fromVersion > toVersion) {
    throw new Error(
      `Cannot migrate theme backwards from schema ${fromVersion} to ${toVersion}`,
    );
  }

  let migratedTheme = { ...(theme as Record<string, unknown>) };
  const startVersion = Math.min(fromVersion || 0, toVersion - 1);

  for (
    let targetVersion = startVersion + 1;
    targetVersion <= toVersion;
    targetVersion += 1
  ) {
    const migrateToVersion = migrations[targetVersion];
    if (migrateToVersion) {
      migratedTheme = migrateToVersion(migratedTheme) as unknown as Record<
        string,
        unknown
      >;
    }
  }

  return migratedTheme as unknown as Theme;
}
