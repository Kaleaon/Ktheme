/**
 * Preset themes for Ktheme
 * Based on CleverFerret's unified theme system
 */

import { Theme, MetallicVariant } from '../core/types';
import { getMetallicGradient } from '../effects/metallic';
import { FrutigerAeroAdaptation, LCARSAdaptation, WindowsPhoneMetroAdaptation } from './adaptationPresets';

/**
 * Navy Gold Theme - Elegant navy background with gold accents
 */
export const NavyGoldTheme: Theme = {
  metadata: {
    id: 'navy-gold',
    name: 'Navy Gold',
    description: 'Elegant navy background with luxurious gold metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'elegant', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#D4AF37',
    onPrimary: '#0A1630',
    primaryContainer: '#856D34',
    onPrimaryContainer: '#FFF8DC',
    
    secondary: '#4A90E2',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#2C5F9E',
    onSecondaryContainer: '#E3F2FD',
    
    tertiary: '#9C8970',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#6B5D4F',
    onTertiaryContainer: '#F5E6D3',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#0A1630',
    onBackground: '#E8E3D8',
    surface: '#1A2645',
    onSurface: '#E8E3D8',
    surfaceVariant: '#2A3655',
    onSurfaceVariant: '#C9C4B9',
    
    outline: '#938F84',
    outlineVariant: '#44483E',
    
    scrim: '#000000',
    inverseSurface: '#E8E3D8',
    inverseOnSurface: '#0A1630',
    inversePrimary: '#6D5D28'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD_ROYAL_BLUE,
      gradient: getMetallicGradient(MetallicVariant.GOLD_ROYAL_BLUE),
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: '#00000066'
    },
    shimmer: {
      enabled: true,
      speed: 3,
      intensity: 0.6,
      angle: 135
    }
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 28
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    lineHeight: 1.5,
    letterSpacing: 0
  }
};

/**
 * Emerald Silver Theme - Rich emerald with silver metallic highlights
 */
export const EmeraldSilverTheme: Theme = {
  metadata: {
    id: 'emerald-silver',
    name: 'Emerald Silver',
    description: 'Rich emerald green with elegant silver metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'nature', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#C0C0C0',
    onPrimary: '#0D3B2E',
    primaryContainer: '#505050',
    onPrimaryContainer: '#F5F5F5',
    
    secondary: '#50C878',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#2E7D5A',
    onSecondaryContainer: '#D5F4E6',
    
    tertiary: '#8BA888',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#5D7A5A',
    onTertiaryContainer: '#E8F5E8',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#0D3B2E',
    onBackground: '#E8F5E8',
    surface: '#1A5544',
    onSurface: '#E8F5E8',
    surfaceVariant: '#2A6554',
    onSurfaceVariant: '#C9E4D9',
    
    outline: '#8A9E94',
    outlineVariant: '#3E4E44',
    
    scrim: '#000000',
    inverseSurface: '#E8F5E8',
    inverseOnSurface: '#0D3B2E',
    inversePrimary: '#6B6B6B'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.SILVER,
      gradient: getMetallicGradient(MetallicVariant.SILVER),
      intensity: 0.7
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: '#00000055'
    }
  }
};

/**
 * Rose Gold Theme - Warm rose gold with burgundy accents
 */
export const RoseGoldTheme: Theme = {
  metadata: {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Warm and elegant rose gold with burgundy undertones',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'warm', 'elegant', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#B76E79',
    onPrimary: '#3D1F2B',
    primaryContainer: '#7D4A52',
    onPrimaryContainer: '#F5D5D8',
    
    secondary: '#D4A5A5',
    onSecondary: '#442929',
    secondaryContainer: '#8C6969',
    onSecondaryContainer: '#F5E5E5',
    
    tertiary: '#C9A9A9',
    onTertiary: '#3D2929',
    tertiaryContainer: '#8A7474',
    onTertiaryContainer: '#F5EAEA',
    
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#3D1F2B',
    onBackground: '#F5E5E8',
    surface: '#4D2F3B',
    onSurface: '#F5E5E8',
    surfaceVariant: '#5D3F4B',
    onSurfaceVariant: '#E5D5D8',
    
    outline: '#9E8A8E',
    outlineVariant: '#4E3A3E',
    
    scrim: '#000000',
    inverseSurface: '#F5E5E8',
    inverseOnSurface: '#3D1F2B',
    inversePrimary: '#8A5A64'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.ROSE_GOLD,
      gradient: getMetallicGradient(MetallicVariant.ROSE_GOLD),
      intensity: 0.75
    },
    shadows: {
      enabled: true,
      elevation: 2,
      blur: 4,
      color: '#00000044'
    },
    shimmer: {
      enabled: true,
      speed: 4,
      intensity: 0.5,
      angle: 120
    }
  }
};

/**
 * Royal Bronze Theme - Regal purple with bronze accents
 */
export const RoyalBronzeTheme: Theme = {
  metadata: {
    id: 'royal-bronze',
    name: 'Royal Bronze',
    description: 'Regal deep purple with luxurious bronze metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'regal', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#CD7F32',
    onPrimary: '#1A0A30',
    primaryContainer: '#A86428',
    onPrimaryContainer: '#D99952',
    
    secondary: '#2D1550',
    onSecondary: '#F0E6FF',
    secondaryContainer: '#220D40',
    onSecondaryContainer: '#F0E6FF',
    
    tertiary: '#9B7A5F',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#775D48',
    onTertiaryContainer: '#F0E6D9',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#1A0A30',
    onBackground: '#F0E6FF',
    surface: '#220D40',
    onSurface: '#F0E6FF',
    surfaceVariant: '#3D1F5C',
    onSurfaceVariant: '#D0B3E6',
    
    outline: '#9B7A99',
    outlineVariant: '#4D2F5C',
    
    scrim: '#000000',
    inverseSurface: '#F0E6FF',
    inverseOnSurface: '#1A0A30',
    inversePrimary: '#8A5F28'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.BRONZE,
      gradient: getMetallicGradient(MetallicVariant.BRONZE),
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: '#00000066'
    }
  }
};

/**
 * Midnight Amber Theme - Sophisticated midnight blue with amber
 */
export const MidnightAmberTheme: Theme = {
  metadata: {
    id: 'midnight-amber',
    name: 'Midnight Amber',
    description: 'Sophisticated midnight blue with warm amber metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'sophisticated', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#FFBF00',
    onPrimary: '#0C1824',
    primaryContainer: '#CC9900',
    onPrimaryContainer: '#FFD14D',
    
    secondary: '#1A2332',
    onSecondary: '#E8EEF5',
    secondaryContainer: '#15202E',
    onSecondaryContainer: '#E8EEF5',
    
    tertiary: '#D4A76A',
    onTertiary: '#0C1824',
    tertiaryContainer: '#A68254',
    onTertiaryContainer: '#F5E6D3',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#0C1824',
    onBackground: '#E8EEF5',
    surface: '#15202E',
    onSurface: '#E8EEF5',
    surfaceVariant: '#253447',
    onSurfaceVariant: '#B8C5D6',
    
    outline: '#8A95A6',
    outlineVariant: '#3D4854',
    
    scrim: '#000000',
    inverseSurface: '#E8EEF5',
    inverseOnSurface: '#0C1824',
    inversePrimary: '#8A6F00'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: getMetallicGradient(MetallicVariant.GOLD),
      intensity: 0.75
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: '#00000055'
    }
  }
};

/**
 * Obsidian Crimson Theme - Bold dramatic black with crimson
 */
export const ObsidianCrimsonTheme: Theme = {
  metadata: {
    id: 'obsidian-crimson',
    name: 'Obsidian Crimson',
    description: 'Bold dramatic obsidian black with vibrant crimson accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'dramatic', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#DC143C',
    onPrimary: '#0A0A0A',
    primaryContainer: '#B00F30',
    onPrimaryContainer: '#E5395F',
    
    secondary: '#262626',
    onSecondary: '#F5F5F5',
    secondaryContainer: '#141414',
    onSecondaryContainer: '#F5F5F5',
    
    tertiary: '#A8505A',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#7D3C45',
    onTertiaryContainer: '#F5D9DC',
    
    error: '#FF6B6B',
    onError: '#0A0A0A',
    errorContainer: '#CC0000',
    onErrorContainer: '#FFD9D9',
    
    background: '#0A0A0A',
    onBackground: '#F5F5F5',
    surface: '#141414',
    onSurface: '#F5F5F5',
    surfaceVariant: '#2D2D2D',
    onSurfaceVariant: '#D0D0D0',
    
    outline: '#8A8A8A',
    outlineVariant: '#3D3D3D',
    
    scrim: '#000000',
    inverseSurface: '#F5F5F5',
    inverseOnSurface: '#0A0A0A',
    inversePrimary: '#8A0F28'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.COPPER,
      gradient: getMetallicGradient(MetallicVariant.COPPER),
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 5,
      blur: 10,
      color: '#00000077'
    }
  }
};

/**
 * Slate Cyan Theme - Cool modern slate with cyan
 */
export const SlateCyanTheme: Theme = {
  metadata: {
    id: 'slate-cyan',
    name: 'Slate Cyan',
    description: 'Cool modern slate gray with vibrant cyan metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'modern', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#00D9FF',
    onPrimary: '#1A1F24',
    primaryContainer: '#00A8CC',
    onPrimaryContainer: '#4DE2FF',
    
    secondary: '#2A333D',
    onSecondary: '#E8F0F5',
    secondaryContainer: '#232930',
    onSecondaryContainer: '#E8F0F5',
    
    tertiary: '#6BA5B8',
    onTertiary: '#1A1F24',
    tertiaryContainer: '#547D8F',
    onTertiaryContainer: '#D9EDF5',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#1A1F24',
    onBackground: '#E8F0F5',
    surface: '#232930',
    onSurface: '#E8F0F5',
    surfaceVariant: '#3D4854',
    onSurfaceVariant: '#B8CAD6',
    
    outline: '#7A8A99',
    outlineVariant: '#4D5A66',
    
    scrim: '#000000',
    inverseSurface: '#E8F0F5',
    inverseOnSurface: '#1A1F24',
    inversePrimary: '#0080A0'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0.7
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: '#00000055'
    }
  }
};

/**
 * Royal Silver Theme - Matching original Android theme
 */
export const RoyalSilverTheme: Theme = {
  metadata: {
    id: 'royal-silver',
    name: 'Royal Silver',
    description: 'Royal purple background with elegant silver metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'royal', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#C0C0C0',
    onPrimary: '#1A1535',
    primaryContainer: '#9A9A9A',
    onPrimaryContainer: '#E0E0E0',
    
    secondary: '#2A1F50',
    onSecondary: '#F0EBFF',
    secondaryContainer: '#211A40',
    onSecondaryContainer: '#F0EBFF',
    
    tertiary: '#A89BC9',
    onTertiary: '#1A1535',
    tertiaryContainer: '#847AA0',
    onTertiaryContainer: '#F0EBFF',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#1A1535',
    onBackground: '#F0EBFF',
    surface: '#211A40',
    onSurface: '#F0EBFF',
    surfaceVariant: '#3D2F5C',
    onSurfaceVariant: '#C8BFE6',
    
    outline: '#9B8AB8',
    outlineVariant: '#4D3F66',
    
    scrim: '#000000',
    inverseSurface: '#F0EBFF',
    inverseOnSurface: '#1A1535',
    inversePrimary: '#7A7A7A'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.SILVER,
      gradient: getMetallicGradient(MetallicVariant.SILVER),
      intensity: 0.75
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: '#00000055'
    }
  }
};

/**
 * Forest Copper Theme - Deep forest green with copper
 */
export const ForestCopperTheme: Theme = {
  metadata: {
    id: 'forest-copper',
    name: 'Forest Copper',
    description: 'Deep forest green with warm copper metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'nature', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#B87333',
    onPrimary: '#0D1F0D',
    primaryContainer: '#935E29',
    onPrimaryContainer: '#D4965A',
    
    secondary: '#1A3D1A',
    onSecondary: '#E8F5E8',
    secondaryContainer: '#152915',
    onSecondaryContainer: '#E8F5E8',
    
    tertiary: '#8FA886',
    onTertiary: '#0D1F0D',
    tertiaryContainer: '#6D7D68',
    onTertiaryContainer: '#E8F5E8',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#0D1F0D',
    onBackground: '#E8F5E8',
    surface: '#152915',
    onSurface: '#E8F5E8',
    surfaceVariant: '#2A4D2A',
    onSurfaceVariant: '#B8D9B8',
    
    outline: '#6A8A6A',
    outlineVariant: '#3D5A3D',
    
    scrim: '#000000',
    inverseSurface: '#E8F5E8',
    inverseOnSurface: '#0D1F0D',
    inversePrimary: '#7A4F28'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.COPPER,
      gradient: getMetallicGradient(MetallicVariant.COPPER),
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: '#00000066'
    }
  }
};

/**
 * Burgundy Rose Gold Theme - Rich burgundy with rose gold
 */
export const BurgundyRoseGoldTheme: Theme = {
  metadata: {
    id: 'burgundy-rose-gold',
    name: 'Burgundy Rose Gold',
    description: 'Rich burgundy with elegant rose gold metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'elegant', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#B76E79',
    onPrimary: '#2D0F1A',
    primaryContainer: '#93575F',
    onPrimaryContainer: '#D4969E',
    
    secondary: '#4D1A2A',
    onSecondary: '#FFE6ED',
    secondaryContainer: '#3D1525',
    onSecondaryContainer: '#FFE6ED',
    
    tertiary: '#C99BA5',
    onTertiary: '#2D0F1A',
    tertiaryContainer: '#9F7A83',
    onTertiaryContainer: '#FFE6ED',
    
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#2D0F1A',
    onBackground: '#FFE6ED',
    surface: '#3D1525',
    onSurface: '#FFE6ED',
    surfaceVariant: '#5C2A3D',
    onSurfaceVariant: '#E6C0CC',
    
    outline: '#B88A94',
    outlineVariant: '#6D3F4D',
    
    scrim: '#000000',
    inverseSurface: '#FFE6ED',
    inverseOnSurface: '#2D0F1A',
    inversePrimary: '#8A575F'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.ROSE_GOLD,
      gradient: getMetallicGradient(MetallicVariant.ROSE_GOLD),
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: '#00000055'
    },
    shimmer: {
      enabled: true,
      speed: 4,
      intensity: 0.6,
      angle: 120
    }
  }
};

/**
 * Charcoal Champagne Theme - Sophisticated charcoal with champagne
 */
export const CharcoalChampagneTheme: Theme = {
  metadata: {
    id: 'charcoal-champagne',
    name: 'Charcoal Champagne',
    description: 'Sophisticated charcoal gray with warm champagne accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'sophisticated', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#F7E7CE',
    onPrimary: '#1F1F1F',
    primaryContainer: '#C5B8A5',
    onPrimaryContainer: '#FFF5E6',
    
    secondary: '#3D3D3D',
    onSecondary: '#F5F5F5',
    secondaryContainer: '#2A2A2A',
    onSecondaryContainer: '#F5F5F5',
    
    tertiary: '#D4C4A8',
    onTertiary: '#1F1F1F',
    tertiaryContainer: '#A89C86',
    onTertiaryContainer: '#FFF5E6',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#1F1F1F',
    onBackground: '#F5F5F5',
    surface: '#2A2A2A',
    onSurface: '#F5F5F5',
    surfaceVariant: '#3D3D3D',
    onSurfaceVariant: '#D0D0D0',
    
    outline: '#9A9A9A',
    outlineVariant: '#4D4D4D',
    
    scrim: '#000000',
    inverseSurface: '#F5F5F5',
    inverseOnSurface: '#1F1F1F',
    inversePrimary: '#9A8970'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      gradient: getMetallicGradient(MetallicVariant.GOLD),
      intensity: 0.65
    },
    shadows: {
      enabled: true,
      elevation: 2,
      blur: 4,
      color: '#00000044'
    }
  }
};

/**
 * Slate Gunmetal Theme - Industrial slate with gunmetal
 */
export const SlateGunmetalTheme: Theme = {
  metadata: {
    id: 'slate-gunmetal',
    name: 'Slate Gunmetal',
    description: 'Industrial slate gray with gunmetal metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'industrial', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#8F9CA8',
    onPrimary: '#1A2029',
    primaryContainer: '#6F7D87',
    onPrimaryContainer: '#B0BDC9',
    
    secondary: '#2D3844',
    onSecondary: '#E6ECF2',
    secondaryContainer: '#232C38',
    onSecondaryContainer: '#E6ECF2',
    
    tertiary: '#9DAAB6',
    onTertiary: '#1A2029',
    tertiaryContainer: '#7A8590',
    onTertiaryContainer: '#D9E3ED',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#1A2029',
    onBackground: '#E6ECF2',
    surface: '#232C38',
    onSurface: '#E6ECF2',
    surfaceVariant: '#3D4854',
    onSurfaceVariant: '#B8C5D6',
    
    outline: '#7A8A99',
    outlineVariant: '#4D5A66',
    
    scrim: '#000000',
    inverseSurface: '#E6ECF2',
    inverseOnSurface: '#1A2029',
    inversePrimary: '#5A6670'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0.7
    },
    shadows: {
      enabled: true,
      elevation: 3,
      blur: 6,
      color: '#00000055'
    }
  }
};

/**
 * Deep Purple Platinum Theme - Deep purple with platinum
 */
export const DeepPurplePlatinumTheme: Theme = {
  metadata: {
    id: 'deep-purple-platinum',
    name: 'Deep Purple Platinum',
    description: 'Deep purple background with luxurious platinum metallic accents',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['metallic', 'luxurious', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#E5E4E2',
    onPrimary: '#1A0F2E',
    primaryContainer: '#B8B7B5',
    onPrimaryContainer: '#F5F4F2',
    
    secondary: '#2E1A50',
    onSecondary: '#F0EBFF',
    secondaryContainer: '#24153D',
    onSecondaryContainer: '#F0EBFF',
    
    tertiary: '#C8BFE0',
    onTertiary: '#1A0F2E',
    tertiaryContainer: '#9F99B3',
    onTertiaryContainer: '#F0EBFF',
    
    error: '#CF6679',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    background: '#1A0F2E',
    onBackground: '#F0EBFF',
    surface: '#24153D',
    onSurface: '#F0EBFF',
    surfaceVariant: '#3D2A5C',
    onSurfaceVariant: '#D0C0E6',
    
    outline: '#9B8AB8',
    outlineVariant: '#4D3F6D',
    
    scrim: '#000000',
    inverseSurface: '#F0EBFF',
    inverseOnSurface: '#1A0F2E',
    inversePrimary: '#9A9998'
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.PLATINUM,
      gradient: getMetallicGradient(MetallicVariant.PLATINUM),
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: '#00000066'
    }
  }
};

/**
 * Paper Ink Theme - Minimalist reader theme (light mode)
 */
export const PaperInkTheme: Theme = {
  metadata: {
    id: 'paper-ink',
    name: 'Paper & Ink',
    description: 'Minimalist light theme for comfortable reading',
    author: 'Ktheme',
    version: '1.0.0',
    tags: ['minimalist', 'light', 'reader'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: false,
  colorScheme: {
    primary: '#2C2C2C',
    onPrimary: '#FAF9F6',
    primaryContainer: '#454545',
    onPrimaryContainer: '#FAF9F6',
    
    secondary: '#595959',
    onSecondary: '#FAF9F6',
    secondaryContainer: '#737373',
    onSecondaryContainer: '#FAF9F6',
    
    tertiary: '#6B6B6B',
    onTertiary: '#FAF9F6',
    tertiaryContainer: '#828282',
    onTertiaryContainer: '#FAF9F6',
    
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    background: '#F0F0EB',
    onBackground: '#2C2C2C',
    surface: '#FAF9F6',
    onSurface: '#2C2C2C',
    surfaceVariant: '#EBEAE4',
    onSurfaceVariant: '#454545',
    
    outline: '#7A7A7A',
    outlineVariant: '#C9C9C9',
    
    scrim: '#000000',
    inverseSurface: '#2C2C2C',
    inverseOnSurface: '#FAF9F6',
    inversePrimary: '#9A9A9A'
  },
  effects: {
    shadows: {
      enabled: true,
      elevation: 1,
      blur: 2,
      color: '#00000011'
    }
  }
};

/**
 * Frutiger Aero Theme - Late 90s / early 2000s glossy glass aesthetic
 */
export const FrutigerAeroTheme: Theme = {
  ...PaperInkTheme,
  metadata: {
    ...PaperInkTheme.metadata,
    id: 'frutiger-aero',
    name: 'Frutiger Aero',
    description: 'Glossy glassy sky-and-nature palette inspired by late 90s/early 2000s UI',
    tags: [...new Set([...(PaperInkTheme.metadata.tags ?? []), 'frutiger-aero', 'glassy', 'nostalgia'])],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: false,
  colorScheme: {
    ...PaperInkTheme.colorScheme,
    primary: '#39B6F0',
    onPrimary: '#022A40',
    primaryContainer: '#A9E6FF',
    onPrimaryContainer: '#00314D',
    secondary: '#79D87E',
    onSecondary: '#07350D',
    secondaryContainer: '#C6F4CC',
    onSecondaryContainer: '#113D17',
    tertiary: '#B9DBFF',
    onTertiary: '#0D2C4F',
    tertiaryContainer: '#DAEEFF',
    onTertiaryContainer: '#123659',
    background: '#EAF7FF',
    onBackground: '#14344A',
    surface: '#F7FCFF',
    onSurface: '#173A52',
    surfaceVariant: '#DDF1FF',
    onSurfaceVariant: '#34566E',
    outline: '#6E93AB',
    outlineVariant: '#A9C7DA',
    inverseSurface: '#173A52',
    inverseOnSurface: '#EAF7FF',
    inversePrimary: '#0A6FA0'
  },
  effects: {
    ...PaperInkTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.SILVER,
      gradient: getMetallicGradient(MetallicVariant.SILVER),
      intensity: 0
    },
    blur: {
      enabled: true,
      radius: 12
    },
    overlays: {
      enabled: true,
      color: '#A9DFFF',
      opacity: 0.22,
      blendMode: 'screen'
    },
    gradients: {
      enabled: true,
      angle: 135,
      stops: [
        { offset: 0, color: '#EAF7FF' },
        { offset: 0.58, color: '#DAF0FF' },
        { offset: 1, color: '#BEEBFF' }
      ]
    },
    shimmer: {
      enabled: true,
      speed: 4,
      intensity: 0.32,
      angle: 120
    }
  },
  adaptation: FrutigerAeroAdaptation
};

/**
 * Windows Phone Metro Theme - Flat, high-contrast tile-oriented theme
 */
export const WindowsPhoneMetroTheme: Theme = {
  ...SlateCyanTheme,
  metadata: {
    ...SlateCyanTheme.metadata,
    id: 'windows-phone-metro',
    name: 'Windows Phone Metro',
    description: 'Flat, tile-first Metro-inspired interface theme',
    tags: [...new Set([...(SlateCyanTheme.metadata.tags ?? []), 'metro', 'windows-phone', 'flat'])],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  colorScheme: {
    ...SlateCyanTheme.colorScheme,
    primary: '#00AEEF',
    onPrimary: '#00151F',
    primaryContainer: '#0078D7',
    onPrimaryContainer: '#E8F7FF',
    secondary: '#005A9E',
    onSecondary: '#EAF4FF',
    tertiary: '#2D89EF',
    onTertiary: '#001021',
    background: '#001A33',
    onBackground: '#F0F8FF',
    surface: '#002448',
    onSurface: '#F0F8FF'
  },
  effects: {
    ...SlateCyanTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.TITANIUM,
      gradient: getMetallicGradient(MetallicVariant.TITANIUM),
      intensity: 0
    }
  },
  adaptation: WindowsPhoneMetroAdaptation
};

/**
 * LCARS Theme - Starship-console inspired color and panel language
 */
export const LCARSTheme: Theme = {
  ...RoyalBronzeTheme,
  metadata: {
    ...RoyalBronzeTheme.metadata,
    id: 'lcars',
    name: 'LCARS',
    description: 'LCARS-inspired interface with warm rails and compact controls',
    tags: [...new Set([...(RoyalBronzeTheme.metadata.tags ?? []), 'lcars', 'sci-fi', 'console'])],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  colorScheme: {
    ...RoyalBronzeTheme.colorScheme,
    primary: '#F2A65A',
    onPrimary: '#1B0E24',
    primaryContainer: '#CC7A2B',
    onPrimaryContainer: '#FFE6CC',
    secondary: '#C5678D',
    onSecondary: '#2B1224',
    tertiary: '#A485F7',
    onTertiary: '#170F2E',
    background: '#120C1C',
    onBackground: '#F3E9FF',
    surface: '#1C132A',
    onSurface: '#F3E9FF'
  },
  effects: {
    ...RoyalBronzeTheme.effects,
    metallic: {
      enabled: false,
      variant: MetallicVariant.BRONZE,
      gradient: getMetallicGradient(MetallicVariant.BRONZE),
      intensity: 0
    }
  },
  adaptation: LCARSAdaptation
};

/**
 * All preset themes
 */
export const PresetThemes = {
  NavyGold: NavyGoldTheme,
  EmeraldSilver: EmeraldSilverTheme,
  RoseGold: RoseGoldTheme,
  RoyalBronze: RoyalBronzeTheme,
  MidnightAmber: MidnightAmberTheme,
  ObsidianCrimson: ObsidianCrimsonTheme,
  SlateCyan: SlateCyanTheme,
  RoyalSilver: RoyalSilverTheme,
  ForestCopper: ForestCopperTheme,
  BurgundyRoseGold: BurgundyRoseGoldTheme,
  CharcoalChampagne: CharcoalChampagneTheme,
  SlateGunmetal: SlateGunmetalTheme,
  DeepPurplePlatinum: DeepPurplePlatinumTheme,
  PaperInk: PaperInkTheme,
  FrutigerAero: FrutigerAeroTheme,
  WindowsPhoneMetro: WindowsPhoneMetroTheme,
  LCARS: LCARSTheme
};
