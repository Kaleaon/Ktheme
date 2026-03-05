export interface SharedColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
}

export interface SharedPresetTheme {
  metadata: {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  darkMode: boolean;
  colorScheme: SharedColorScheme;
  effects?: {
    metallic?: {
      enabled: boolean;
      variant:
        | 'SILVER'
        | 'GOLD'
        | 'GOLD_ROYAL_BLUE'
        | 'BRONZE'
        | 'COPPER'
        | 'PLATINUM'
        | 'ROSE_GOLD'
        | 'TITANIUM'
        | 'CHROME'
        | 'COBALT';
      gradient: {
        base: string;
        highlight: string;
        shadow: string;
        shimmer: string;
      };
      intensity: number;
    };
    shadows?: {
      enabled: boolean;
      elevation: number;
      blur: number;
      color: string;
    };
    shimmer?: {
      enabled: boolean;
      speed: number;
      intensity: number;
      angle: number;
    };
  };
  typography?: {
    fontFamily: string;
    fontSize: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
    };
    fontWeight: {
      light: number;
      regular: number;
      medium: number;
      bold: number;
    };
    lineHeight: number;
    letterSpacing: number;
  };
}

export const SHARED_PRESET_THEMES: SharedPresetTheme[] = [
  {
    metadata: {
      id: 'navy-gold',
      name: 'Navy Gold',
      description: 'Elegant navy background with luxurious gold metallic accents',
      author: 'Ktheme',
      version: '1.0.0',
      tags: ['metallic', 'elegant', 'dark'],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-02-15T00:00:00.000Z',
    },
    darkMode: true,
    colorScheme: {
      primary: '#D4AF37', onPrimary: '#0A1630',
      primaryContainer: '#856D34', onPrimaryContainer: '#FFF8DC',
      secondary: '#4A90E2', onSecondary: '#FFFFFF',
      secondaryContainer: '#2C5F9E', onSecondaryContainer: '#E3F2FD',
      tertiary: '#9C8970', onTertiary: '#FFFFFF',
      tertiaryContainer: '#6B5D4F', onTertiaryContainer: '#F5E6D3',
      error: '#CF6679', onError: '#FFFFFF',
      errorContainer: '#93000A', onErrorContainer: '#FFDAD6',
      background: '#0A1630', onBackground: '#E8E3D8',
      surface: '#1A2645', onSurface: '#E8E3D8',
      surfaceVariant: '#2A3655', onSurfaceVariant: '#C9C4B9',
      outline: '#938F84', outlineVariant: '#44483E',
      scrim: '#000000',
      inverseSurface: '#E8E3D8', inverseOnSurface: '#0A1630', inversePrimary: '#6D5D28',
    },
    effects: {
      metallic: { enabled: true, variant: 'GOLD_ROYAL_BLUE', gradient: { base: '#D4AF37', highlight: '#FFD700', shadow: '#0A1630', shimmer: '#FFF8DC' }, intensity: 0.8 },
      shadows: { enabled: true, elevation: 4, blur: 8, color: '#00000066' },
      shimmer: { enabled: true, speed: 3, intensity: 0.6, angle: 135 },
    },
  },
  {
    metadata: {
      id: 'rose-gold',
      name: 'Rose Gold',
      description: 'Warm rose gold tones with soft pink accents',
      author: 'Ktheme',
      version: '1.0.0',
      tags: ['metallic', 'warm', 'elegant'],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-02-15T00:00:00.000Z',
    },
    darkMode: true,
    colorScheme: {
      primary: '#B76E79', onPrimary: '#FFFFFF',
      primaryContainer: '#8B4557', onPrimaryContainer: '#FFE4E1',
      secondary: '#E8A0B0', onSecondary: '#3D1520',
      secondaryContainer: '#7A3A4A', onSecondaryContainer: '#FFD5DD',
      tertiary: '#D4A574', onTertiary: '#2D1A0A',
      tertiaryContainer: '#8B6B4A', onTertiaryContainer: '#FFECD2',
      error: '#CF6679', onError: '#FFFFFF',
      errorContainer: '#93000A', onErrorContainer: '#FFDAD6',
      background: '#1A0F12', onBackground: '#F5E6E8',
      surface: '#2A1A1E', onSurface: '#F5E6E8',
      surfaceVariant: '#3D2830', onSurfaceVariant: '#D4B8BE',
      outline: '#9E8A8F', outlineVariant: '#4A3540',
      scrim: '#000000',
      inverseSurface: '#F5E6E8', inverseOnSurface: '#1A0F12', inversePrimary: '#8B4557',
    },
    effects: {
      metallic: { enabled: true, variant: 'ROSE_GOLD', gradient: { base: '#B76E79', highlight: '#E8A0B0', shadow: '#8B5A5A', shimmer: '#FFE4E1' }, intensity: 0.7 },
      shadows: { enabled: true, elevation: 3, blur: 6, color: '#00000055' },
    },
  },
  {
    metadata: {
      id: 'emerald-silver',
      name: 'Emerald Silver',
      description: 'Deep emerald greens with silver accents',
      author: 'Ktheme',
      version: '1.0.0',
      tags: ['metallic', 'nature', 'dark'],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-02-15T00:00:00.000Z',
    },
    darkMode: true,
    colorScheme: {
      primary: '#50C878', onPrimary: '#003319',
      primaryContainer: '#2E7D48', onPrimaryContainer: '#D0FFE0',
      secondary: '#C0C0C0', onSecondary: '#1A1A1A',
      secondaryContainer: '#808080', onSecondaryContainer: '#F0F0F0',
      tertiary: '#7DCEA0', onTertiary: '#003319',
      tertiaryContainer: '#45A06A', onTertiaryContainer: '#E8FFF0',
      error: '#CF6679', onError: '#FFFFFF',
      errorContainer: '#93000A', onErrorContainer: '#FFDAD6',
      background: '#0D1F15', onBackground: '#E0F0E8',
      surface: '#152A1E', onSurface: '#E0F0E8',
      surfaceVariant: '#1E3528', onSurfaceVariant: '#B0D0C0',
      outline: '#6E8E7E', outlineVariant: '#2A4A38',
      scrim: '#000000',
      inverseSurface: '#E0F0E8', inverseOnSurface: '#0D1F15', inversePrimary: '#2E7D48',
    },
    effects: {
      metallic: { enabled: true, variant: 'SILVER', gradient: { base: '#C0C0C0', highlight: '#E8E8E8', shadow: '#0D1F15', shimmer: '#F5F5F5' }, intensity: 0.5 },
      shadows: { enabled: true, elevation: 4, blur: 10, color: '#00000060' },
    },
  },
  {
    metadata: {
      id: 'obsidian-crimson',
      name: 'Obsidian Crimson',
      description: 'Dark obsidian with deep crimson highlights',
      author: 'Ktheme',
      version: '1.0.0',
      tags: ['dark', 'bold', 'dramatic'],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-02-15T00:00:00.000Z',
    },
    darkMode: true,
    colorScheme: {
      primary: '#DC143C', onPrimary: '#FFFFFF',
      primaryContainer: '#8B0A24', onPrimaryContainer: '#FFD5DD',
      secondary: '#FF6B6B', onSecondary: '#1A0000',
      secondaryContainer: '#8B3A3A', onSecondaryContainer: '#FFD5D5',
      tertiary: '#FF8C42', onTertiary: '#1A0800',
      tertiaryContainer: '#8B4A20', onTertiaryContainer: '#FFE0C8',
      error: '#FF4444', onError: '#FFFFFF',
      errorContainer: '#93000A', onErrorContainer: '#FFDAD6',
      background: '#0A0A0F', onBackground: '#E8E0E2',
      surface: '#151518', onSurface: '#E8E0E2',
      surfaceVariant: '#252025', onSurfaceVariant: '#C8B8BE',
      outline: '#888080', outlineVariant: '#3A3035',
      scrim: '#000000',
      inverseSurface: '#E8E0E2', inverseOnSurface: '#0A0A0F', inversePrimary: '#8B0A24',
    },
    effects: {
      shadows: { enabled: true, elevation: 6, blur: 12, color: '#DC143C30' },
    },
  },
  {
    metadata: {
      id: 'paper-ink',
      name: 'Paper & Ink',
      description: 'Clean light theme inspired by paper and ink',
      author: 'Ktheme',
      version: '1.0.0',
      tags: ['light', 'minimal', 'clean'],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-02-15T00:00:00.000Z',
    },
    darkMode: false,
    colorScheme: {
      primary: '#1A1A2E', onPrimary: '#FFFFFF',
      primaryContainer: '#E0E0F0', onPrimaryContainer: '#1A1A2E',
      secondary: '#16213E', onSecondary: '#FFFFFF',
      secondaryContainer: '#D0D8E8', onSecondaryContainer: '#16213E',
      tertiary: '#0F3460', onTertiary: '#FFFFFF',
      tertiaryContainer: '#C8D8F0', onTertiaryContainer: '#0F3460',
      error: '#B3261E', onError: '#FFFFFF',
      errorContainer: '#F9DEDC', onErrorContainer: '#410E0B',
      background: '#FAFAF5', onBackground: '#1A1A1A',
      surface: '#FFFFFF', onSurface: '#1A1A1A',
      surfaceVariant: '#F0F0EB', onSurfaceVariant: '#444444',
      outline: '#999999', outlineVariant: '#DDDDDD',
      scrim: '#000000',
      inverseSurface: '#1A1A1A', inverseOnSurface: '#F0F0F0', inversePrimary: '#9090C0',
    },
    effects: {
      shadows: { enabled: true, elevation: 2, blur: 4, color: '#00000015' },
    },
  },
  {
    metadata: {
      id: 'slate-cyan',
      name: 'Slate Cyan',
      description: 'Cool slate grey with cyan electric accents',
      author: 'Ktheme',
      version: '1.0.0',
      tags: ['dark', 'tech', 'cool'],
      createdAt: '2026-02-15T00:00:00.000Z',
      updatedAt: '2026-02-15T00:00:00.000Z',
    },
    darkMode: true,
    colorScheme: {
      primary: '#00BCD4', onPrimary: '#003840',
      primaryContainer: '#007888', onPrimaryContainer: '#B8F0F8',
      secondary: '#78909C', onSecondary: '#FFFFFF',
      secondaryContainer: '#455A64', onSecondaryContainer: '#CFD8DC',
      tertiary: '#80DEEA', onTertiary: '#004048',
      tertiaryContainer: '#00838F', onTertiaryContainer: '#C8F8FF',
      error: '#CF6679', onError: '#FFFFFF',
      errorContainer: '#93000A', onErrorContainer: '#FFDAD6',
      background: '#121820', onBackground: '#E0E8F0',
      surface: '#1A2430', onSurface: '#E0E8F0',
      surfaceVariant: '#263040', onSurfaceVariant: '#B0C0D0',
      outline: '#607888', outlineVariant: '#304050',
      scrim: '#000000',
      inverseSurface: '#E0E8F0', inverseOnSurface: '#121820', inversePrimary: '#007888',
    },
    effects: {
      shadows: { enabled: true, elevation: 4, blur: 8, color: '#00BCD420' },
      shimmer: { enabled: true, speed: 4, intensity: 0.3, angle: 120 },
    },
  },
];

export const SHARED_PRESET_THEME_IDS = SHARED_PRESET_THEMES.map((theme) => theme.metadata.id);
