/**
 * App-wide adaptation presets for layout and icon transformation.
 */

import { ThemeAdaptation } from '../core/types';

export const FrutigerAeroAdaptation: ThemeAdaptation = {
  layout: {
    density: 'comfortable',
    cornerStyle: 'rounded',
    spacingScale: 1.1,
    panelStyle: 'glass',
    navigationStyle: 'tabs'
  },
  icons: {
    family: 'custom',
    style: 'duotone',
    sizeScale: 1.1,
    strokeWidth: 1.4,
    cornerStyle: 'rounded'
  },
  componentOverrides: [
    {
      selector: '.app-shell',
      styles: {
        'backdrop-filter': 'blur(12px) saturate(140%)',
        'border-radius': 18,
        'box-shadow': '0 10px 28px rgba(0, 0, 0, 0.22)'
      }
    },
    {
      selector: '.app-toolbar',
      styles: {
        'min-height': 68,
        'padding-inline': 20
      }
    }
  ]
};

export const WindowsPhoneMetroAdaptation: ThemeAdaptation = {
  layout: {
    density: 'spacious',
    cornerStyle: 'sharp',
    spacingScale: 1.25,
    panelStyle: 'flat',
    navigationStyle: 'pivot'
  },
  icons: {
    family: 'fluent',
    style: 'line',
    sizeScale: 1,
    strokeWidth: 1.6,
    cornerStyle: 'sharp'
  },
  componentOverrides: [
    {
      selector: '.tile-grid',
      styles: {
        gap: 14,
        'grid-auto-rows': 92
      }
    },
    {
      selector: '.tile',
      styles: {
        'border-radius': 0,
        'text-transform': 'uppercase'
      }
    }
  ]
};

export const LCARSAdaptation: ThemeAdaptation = {
  layout: {
    density: 'compact',
    cornerStyle: 'pill',
    spacingScale: 0.92,
    panelStyle: 'flat',
    navigationStyle: 'rail'
  },
  icons: {
    family: 'custom',
    style: 'filled',
    sizeScale: 0.95,
    strokeWidth: 2,
    cornerStyle: 'rounded'
  },
  componentOverrides: [
    {
      selector: '.lcars-bar',
      styles: {
        'border-top-left-radius': 48,
        'border-bottom-left-radius': 48,
        'padding-inline': 16,
        'letter-spacing': 1.1
      }
    },
    {
      selector: '.lcars-panel',
      styles: {
        display: 'grid',
        'grid-template-columns': '220px 1fr',
        gap: 10
      }
    }
  ]
};

export const AdaptationPresets = {
  frutigerAero: FrutigerAeroAdaptation,
  windowsPhoneMetro: WindowsPhoneMetroAdaptation,
  lcars: LCARSAdaptation
};
