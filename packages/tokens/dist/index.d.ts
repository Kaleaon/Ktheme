export interface PaletteColorRoles {
  bg: string;
  surf: string;
  surf2: string;
  ink: string;
  ink2: string;
  pri: string;
  onpri: string;
  priC: string;
  onpriC: string;
  sec: string;
  onsec: string;
  sec2: string;
  bdg: string;
  onbdg: string;
  info: string;
  outv: string;
  ok: string;
  err: string;
  warn: string;
  sky1: string;
  sky2: string;
  gnd: string;
  gnd2: string;
}

export interface PaletteEntry {
  name: string;
  note: string;
  light: boolean;
  c: PaletteColorRoles;
}

export declare const PALETTES: Record<string, PaletteEntry>;
export declare const LEGACY_PALETTES: Record<string, any>;
export declare const FAMILIES: Array<{ name: string; keys: string[] }>;
export declare const PK: Record<string, [string, string, number?]>;
export declare const THEME_DESKTOP_CONFIGS: Record<string, any>;
export declare function buildDefaultDesktopConfig(data: any): any;
