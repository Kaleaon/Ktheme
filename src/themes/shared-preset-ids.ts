/**
 * Shared preset registry consumed by both the engine and the theme creator.
 * Keep this list in sync with `PresetThemes` in `src/themes/presets.ts`.
 */
export type SharedPresetCategory = 'cleverferret-core' | 'official-iconic';
export type SharedPresetStatus = 'stable';

export interface SharedPresetRegistryEntry {
  id: string;
  name: string;
  category: SharedPresetCategory;
  status: SharedPresetStatus;
}

export const SHARED_PRESET_REGISTRY = [
  { id: 'navy-gold', name: 'Navy Gold', category: 'cleverferret-core', status: 'stable' },
  { id: 'emerald-silver', name: 'Emerald Silver', category: 'cleverferret-core', status: 'stable' },
  { id: 'rose-gold', name: 'Rose Gold', category: 'cleverferret-core', status: 'stable' },
  { id: 'royal-bronze', name: 'Royal Bronze', category: 'cleverferret-core', status: 'stable' },
  { id: 'midnight-amber', name: 'Midnight Amber', category: 'cleverferret-core', status: 'stable' },
  { id: 'obsidian-crimson', name: 'Obsidian Crimson', category: 'cleverferret-core', status: 'stable' },
  { id: 'slate-cyan', name: 'Slate Cyan', category: 'cleverferret-core', status: 'stable' },
  { id: 'royal-silver', name: 'Royal Silver', category: 'cleverferret-core', status: 'stable' },
  { id: 'forest-copper', name: 'Forest Copper', category: 'cleverferret-core', status: 'stable' },
  { id: 'burgundy-rose-gold', name: 'Burgundy Rose Gold', category: 'cleverferret-core', status: 'stable' },
  { id: 'charcoal-champagne', name: 'Charcoal Champagne', category: 'cleverferret-core', status: 'stable' },
  { id: 'slate-gunmetal', name: 'Slate Gunmetal', category: 'cleverferret-core', status: 'stable' },
  { id: 'deep-purple-platinum', name: 'Deep Purple Platinum', category: 'cleverferret-core', status: 'stable' },
  { id: 'paper-ink', name: 'Paper & Ink', category: 'cleverferret-core', status: 'stable' },
  { id: 'frutiger-aero', name: 'Frutiger Aero', category: 'official-iconic', status: 'stable' },
  { id: 'solarpunk-civic', name: 'Solarpunk Civic', category: 'official-iconic', status: 'stable' },
  { id: 'neo-noir-neon', name: 'Neo-Noir Neon', category: 'official-iconic', status: 'stable' },
  { id: 'calm-clinical', name: 'Calm Clinical', category: 'official-iconic', status: 'stable' },
  { id: 'ink-terminal-modern', name: 'Ink Terminal Modern', category: 'official-iconic', status: 'stable' },
  { id: 'aurora-glass-night', name: 'Aurora Glass Night', category: 'official-iconic', status: 'stable' },
  { id: 'windows-phone-metro', name: 'Windows Phone Metro', category: 'official-iconic', status: 'stable' },
  { id: 'lcars', name: 'LCARS', category: 'official-iconic', status: 'stable' },
  { id: 'art-nouveau', name: 'Art Nouveau', category: 'official-iconic', status: 'stable' },
  { id: 'art-deco', name: 'Art Deco', category: 'official-iconic', status: 'stable' }
] as const satisfies readonly SharedPresetRegistryEntry[];

export type SharedPresetId = (typeof SHARED_PRESET_REGISTRY)[number]['id'];

export const SHARED_PRESET_IDS: SharedPresetId[] = SHARED_PRESET_REGISTRY.map((preset) => preset.id);
