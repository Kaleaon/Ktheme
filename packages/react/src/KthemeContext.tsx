import { createContext } from "react";

export interface KthemeTokens {
  primary: string;
  onPrimary: string;
  primaryContainer?: string;
  onPrimaryContainer?: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer?: string;
  onSecondaryContainer?: string;
  tertiary?: string;
  onTertiary?: string;
  surface: string;
  onSurface: string;
  surfaceVariant?: string;
  background: string;
  onBackground: string;
  outline: string;
  error: string;
  warning?: string;
  success?: string;
  // Shorthands & additional tokens
  surf2?: string;
  ink?: string;
  ink2?: string;
  outv?: string;
  ok?: string;
  warn?: string;
  err?: string;
  sky1?: string;
  sky2?: string;
  gnd?: string;
  gnd2?: string;
  pad?: string;
  rs?: string;
  rl?: string;
  rp?: string;
  navr?: string;
  font?: string;
  dfont?: string;
  tls?: string;
  [key: string]: string | undefined;
}

export interface KthemeContextValue {
  themeId: string;
  tokens: KthemeTokens;
  setThemeId: (id: string) => void;
  setToken: (key: string, value: string) => void;
  setTokens: (tokens: Partial<KthemeTokens>) => void;
  isDark: boolean;
  toggleThemeMode: () => void;
  resetTheme: () => void;
}

export const KthemeContext = createContext<KthemeContextValue | null>(null);
