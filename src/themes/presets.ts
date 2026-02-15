/**
 * Preset themes for Ktheme
 * Based on CleverFerret's unified theme system
 */

import { Theme, MetallicVariant } from '../core/types';
import { getMetallicGradient } from '../effects/metallic';

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
 * All preset themes
 */
export const PresetThemes = {
  NavyGold: NavyGoldTheme,
  EmeraldSilver: EmeraldSilverTheme,
  RoseGold: RoseGoldTheme
};
