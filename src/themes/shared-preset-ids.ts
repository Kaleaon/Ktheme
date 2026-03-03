/**
 * Shared preset IDs consumed by both the engine and the theme creator.
 * Keep this list in sync with `PresetThemes` in `src/themes/presets.ts`.
 */
export const SHARED_PRESET_IDS = [
  'navy-gold',
  'emerald-silver',
  'rose-gold',
  'royal-bronze',
  'midnight-amber',
  'obsidian-crimson',
  'slate-cyan',
  'royal-silver',
  'forest-copper',
  'burgundy-rose-gold',
  'charcoal-champagne',
  'slate-gunmetal',
  'deep-purple-platinum',
  'paper-ink',
  'frutiger-aero',
  'solarpunk-civic',
  'neo-noir-neon',
  'calm-clinical',
  'ink-terminal-modern',
  'aurora-glass-night',
  'windows-phone-metro',
  'lcars'
] as const;

export type SharedPresetId = (typeof SHARED_PRESET_IDS)[number];
