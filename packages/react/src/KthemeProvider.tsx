import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  KthemeContext,
  KthemeTokens,
  KthemeContextValue,
} from "./KthemeContext";
import { batchSetCssVariables } from "./batchStyleMutation";

export const DEFAULT_THEMES: Record<string, KthemeTokens> = {
  "navy-gold": {
    primary: "#D4AF37",
    onPrimary: "#0A1630",
    primaryContainer: "#715F33",
    onPrimaryContainer: "#E8E3D8",
    secondary: "#4A90E2",
    onSecondary: "#0A1630",
    surface: "#1A2645",
    onSurface: "#E8E3D8",
    surfaceVariant: "#2A3655",
    background: "#0A1630",
    onBackground: "#E8E3D8",
    outline: "#44483E",
    error: "#CF6679",
    warning: "#E0B84C",
    success: "#D4AF37",
    surf2: "#2A3655",
    ink: "#E8E3D8",
    ink2: "#C9C4B9",
    outv: "#44483E",
    ok: "#D4AF37",
    warn: "#E0B84C",
    err: "#CF6679",
    sky1: "#16305C",
    sky2: "#0E1F3F",
    gnd: "#141F38",
    gnd2: "#0A1630",
    pad: "13px",
    rs: "8px",
    font: '"Jost",system-ui,sans-serif',
  },
  "ink-terminal-modern": {
    primary: "#6CFF9A",
    onPrimary: "#0A1112",
    primaryContainer: "#1F6640",
    onPrimaryContainer: "#D7F5E6",
    secondary: "#3E4E5E",
    onSecondary: "#D7F5E6",
    surface: "#101A1C",
    onSurface: "#D7F5E6",
    surfaceVariant: "#1B2A2D",
    background: "#0A1112",
    onBackground: "#D7F5E6",
    outline: "#365047",
    error: "#CF6679",
    warning: "#FFC98A",
    success: "#6CFF9A",
    surf2: "#1B2A2D",
    ink: "#D7F5E6",
    ink2: "#A7C8BC",
    outv: "#365047",
    ok: "#6CFF9A",
    warn: "#FFC98A",
    err: "#CF6679",
    sky1: "#1c4a5c",
    sky2: "#12333a",
    gnd: "#10241d",
    gnd2: "#0a1112",
    pad: "12px",
    rs: "4px",
    font: '"JetBrains Mono",monospace',
  },
  "frutiger-aero": {
    primary: "#39B6F0",
    onPrimary: "#173A52",
    primaryContainer: "#A9E6FF",
    onPrimaryContainer: "#173A52",
    secondary: "#79D87E",
    onSecondary: "#173A52",
    surface: "#F7FCFF",
    onSurface: "#173A52",
    surfaceVariant: "#DDF1FF",
    background: "#EAF7FF",
    onBackground: "#173A52",
    outline: "#A9C7DA",
    error: "#BA1A1A",
    warning: "#8A5A00",
    success: "#0A6FA0",
    surf2: "#DDF1FF",
    ink: "#173A52",
    ink2: "#34566E",
    outv: "#A9C7DA",
    ok: "#0A6FA0",
    warn: "#8A5A00",
    err: "#BA1A1A",
    sky1: "#BEEBFF",
    sky2: "#DAF0FF",
    gnd: "#79D87E",
    gnd2: "#3f8f57",
    pad: "14px",
    rs: "12px",
    font: '"Nunito Sans",sans-serif',
  },
  lcars: {
    primary: "#F2A65A",
    onPrimary: "#120C1C",
    primaryContainer: "#CC7A2B",
    onPrimaryContainer: "#120C1C",
    secondary: "#A485F7",
    onSecondary: "#120C1C",
    surface: "#1C132A",
    onSurface: "#F3E9FF",
    surfaceVariant: "#3D1F5C",
    background: "#120C1C",
    onBackground: "#F3E9FF",
    outline: "#4D2F5C",
    error: "#CF6679",
    warning: "#FFC46B",
    success: "#F2A65A",
    surf2: "#3D1F5C",
    ink: "#F3E9FF",
    ink2: "#D0B3E6",
    outv: "#4D2F5C",
    ok: "#F2A65A",
    warn: "#FFC46B",
    err: "#CF6679",
    sky1: "#3D1F5C",
    sky2: "#241338",
    gnd: "#1C132A",
    gnd2: "#120C1C",
    pad: "10px",
    rs: "999px",
    font: '"Antonio",sans-serif',
  },
  "windows-phone-metro": {
    primary: "#00AEEF",
    onPrimary: "#001A33",
    primaryContainer: "#0070ca",
    onPrimaryContainer: "#F0F8FF",
    secondary: "#2D89EF",
    onSecondary: "#001A33",
    surface: "#002448",
    onSurface: "#F0F8FF",
    surfaceVariant: "#3D4854",
    background: "#001A33",
    onBackground: "#F0F8FF",
    outline: "#4D5A66",
    error: "#CF6679",
    warning: "#FFC300",
    success: "#00AEEF",
    surf2: "#3D4854",
    ink: "#F0F8FF",
    ink2: "#B8CAD6",
    outv: "#4D5A66",
    ok: "#00AEEF",
    warn: "#FFC300",
    err: "#CF6679",
    sky1: "#0a3a63",
    sky2: "#04263f",
    gnd: "#062033",
    gnd2: "#001a33",
    pad: "14px",
    rs: "0px",
    font: '"Open Sans",sans-serif',
  },
  "paper-ink": {
    primary: "#2C2C2C",
    onPrimary: "#F0F0EB",
    primaryContainer: "#EBEAE4",
    onPrimaryContainer: "#2C2C2C",
    secondary: "#595959",
    onSecondary: "#F0F0EB",
    surface: "#FAF9F6",
    onSurface: "#2C2C2C",
    surfaceVariant: "#EBEAE4",
    background: "#F0F0EB",
    onBackground: "#2C2C2C",
    outline: "#C9C9C9",
    error: "#BA1A1A",
    warning: "#8A5A00",
    success: "#2C6B3F",
    surf2: "#EBEAE4",
    ink: "#2C2C2C",
    ink2: "#454545",
    outv: "#C9C9C9",
    ok: "#2C6B3F",
    warn: "#8A5A00",
    err: "#BA1A1A",
    sky1: "#d9d9d2",
    sky2: "#eceae3",
    gnd: "#cfcec6",
    gnd2: "#bfbeb6",
    pad: "14px",
    rs: "2px",
    font: '"Source Serif 4",Georgia,serif',
  },
  "art-deco": {
    primary: "#D4AF37",
    onPrimary: "#0B0A0A",
    primaryContainer: "#977B2F",
    onPrimaryContainer: "#0B0A0A",
    secondary: "#F4E7CF",
    onSecondary: "#0B0A0A",
    surface: "#141314",
    onSurface: "#F3E8D0",
    surfaceVariant: "#232124",
    background: "#0B0A0A",
    onBackground: "#F3E8D0",
    outline: "#4B4332",
    error: "#FFB4AB",
    warning: "#E0B84C",
    success: "#D4AF37",
    surf2: "#232124",
    ink: "#F3E8D0",
    ink2: "#C9BDA2",
    outv: "#4B4332",
    ok: "#D4AF37",
    warn: "#E0B84C",
    err: "#FFB4AB",
    sky1: "#1d1a14",
    sky2: "#12100c",
    gnd: "#191712",
    gnd2: "#0b0a0a",
    pad: "11px",
    rs: "0px",
    font: '"Jost",sans-serif',
  },
};

export interface KthemeProviderProps {
  themeId?: string;
  initialTokens?: Partial<KthemeTokens>;
  targetElement?: HTMLElement | null;
  children: ReactNode;
}

function tokensToCssVars(tokens: KthemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  // MD3 variable mapping
  if (tokens.primary) vars["--md-sys-color-primary"] = tokens.primary;
  if (tokens.onPrimary) vars["--md-sys-color-on-primary"] = tokens.onPrimary;
  if (tokens.primaryContainer)
    vars["--md-sys-color-primary-container"] = tokens.primaryContainer;
  if (tokens.onPrimaryContainer)
    vars["--md-sys-color-on-primary-container"] = tokens.onPrimaryContainer;
  if (tokens.secondary) vars["--md-sys-color-secondary"] = tokens.secondary;
  if (tokens.onSecondary)
    vars["--md-sys-color-on-secondary"] = tokens.onSecondary;
  if (tokens.surface) vars["--md-sys-color-surface"] = tokens.surface;
  if (tokens.onSurface) vars["--md-sys-color-on-surface"] = tokens.onSurface;
  if (tokens.surfaceVariant)
    vars["--md-sys-color-surface-variant"] = tokens.surfaceVariant;
  if (tokens.background) vars["--md-sys-color-background"] = tokens.background;
  if (tokens.onBackground)
    vars["--md-sys-color-on-background"] = tokens.onBackground;
  if (tokens.outline) vars["--md-sys-color-outline"] = tokens.outline;
  if (tokens.error) vars["--md-sys-color-error"] = tokens.error;
  if (tokens.warning)
    vars["--md-sys-color-warning"] = tokens.warning || tokens.warn || "#FFB020";
  if (tokens.success)
    vars["--md-sys-color-success"] =
      tokens.success || tokens.ok || tokens.primary;

  // Ktheme aliases
  if (tokens.primary) vars["--ktheme-pri"] = tokens.primary;
  if (tokens.onPrimary) vars["--ktheme-onpri"] = tokens.onPrimary;
  if (tokens.surface) vars["--ktheme-surf"] = tokens.surface;
  if (tokens.surf2 || tokens.surfaceVariant)
    vars["--ktheme-surf2"] = tokens.surf2 || tokens.surfaceVariant!;
  if (tokens.background) vars["--ktheme-bg"] = tokens.background;
  if (tokens.onSurface || tokens.ink)
    vars["--ktheme-ink"] = tokens.ink || tokens.onSurface;
  if (tokens.ink2) vars["--ktheme-ink2"] = tokens.ink2;
  if (tokens.outline || tokens.outv)
    vars["--ktheme-outv"] = tokens.outv || tokens.outline;
  if (tokens.error || tokens.err)
    vars["--ktheme-err"] = tokens.err || tokens.error;
  if (tokens.warning || tokens.warn)
    vars["--ktheme-warn"] = tokens.warn || tokens.warning || "#FFB020";
  if (tokens.success || tokens.ok)
    vars["--ktheme-ok"] = tokens.ok || tokens.success || tokens.primary;
  if (tokens.sky1) vars["--ktheme-sky1"] = tokens.sky1;
  if (tokens.sky2) vars["--ktheme-sky2"] = tokens.sky2;
  if (tokens.gnd) vars["--ktheme-gnd1"] = tokens.gnd;
  if (tokens.gnd2) vars["--ktheme-gnd2"] = tokens.gnd2;
  if (tokens.pad) vars["--ktheme-pad"] = tokens.pad;
  if (tokens.rs) vars["--ktheme-rs"] = tokens.rs;
  if (tokens.font) vars["--ktheme-font"] = tokens.font;

  // Additional custom token keys
  Object.keys(tokens).forEach((k) => {
    if (typeof tokens[k] === "string" && !vars[`--ktheme-${k}`]) {
      vars[`--ktheme-${k}`] = tokens[k]!;
    }
  });

  return vars;
}

export function KthemeProvider({
  themeId = "navy-gold",
  initialTokens,
  targetElement,
  children,
}: KthemeProviderProps) {
  const [activeThemeId, setActiveThemeId] = useState<string>(themeId);
  const [tokens, setTokensState] = useState<KthemeTokens>(() => {
    const base = DEFAULT_THEMES[themeId] || DEFAULT_THEMES["navy-gold"];
    return { ...base, ...initialTokens };
  });
  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync theme changes when themeId prop updates
  useEffect(() => {
    if (themeId && DEFAULT_THEMES[themeId]) {
      setActiveThemeId(themeId);
      const base = DEFAULT_THEMES[themeId];
      setTokensState({ ...base, ...initialTokens });
    }
  }, [themeId, initialTokens]);

  // Inject CSS custom properties onto target DOM element (or document.documentElement) with batching
  useEffect(() => {
    const cssVars = tokensToCssVars(tokens);
    batchSetCssVariables(targetElement, cssVars);
  }, [tokens, targetElement]);

  const setThemeId = useCallback((id: string) => {
    const base = DEFAULT_THEMES[id] || DEFAULT_THEMES["navy-gold"];
    setActiveThemeId(id);
    setTokensState({ ...base });
  }, []);

  const setToken = useCallback((key: string, value: string) => {
    setTokensState((prev) => {
      const updated = { ...prev, [key]: value };
      // Keep aliases in sync
      if (key === "primary") updated.pri = value;
      if (key === "onPrimary") updated.onpri = value;
      if (key === "surface") updated.surf = value;
      if (key === "background") updated.bg = value;
      if (key === "outline") updated.outv = value;
      return updated;
    });
  }, []);

  const setTokens = useCallback((newTokens: Partial<KthemeTokens>) => {
    setTokensState((prev) => ({ ...prev, ...newTokens }));
  }, []);

  const toggleThemeMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const resetTheme = useCallback(() => {
    const base = DEFAULT_THEMES[activeThemeId] || DEFAULT_THEMES["navy-gold"];
    setTokensState({ ...base });
  }, [activeThemeId]);

  const contextValue = useMemo<KthemeContextValue>(
    () => ({
      themeId: activeThemeId,
      tokens,
      setThemeId,
      setToken,
      setTokens,
      isDark,
      toggleThemeMode,
      resetTheme,
    }),
    [
      activeThemeId,
      tokens,
      setThemeId,
      setToken,
      setTokens,
      isDark,
      toggleThemeMode,
      resetTheme,
    ],
  );

  return (
    <KthemeContext.Provider value={contextValue}>
      {children}
    </KthemeContext.Provider>
  );
}
