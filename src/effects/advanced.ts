/**
 * Advanced visual effects module
 * Additional effects from CleverFerret's theming system
 */

import { Color } from '../core/types';
import { toCssColor } from '../utils/colors';

/**
 * Generate CSS for blur effect
 */
export function generateBlurCSS(radius: number): string {
  return `
    backdrop-filter: blur(${radius}px);
    -webkit-backdrop-filter: blur(${radius}px);
  `;
}

/**
 * Generate CSS for smooth transitions
 */
export function generateTransitionCSS(
  duration: number,
  properties: string[] = ['all'],
  easing: string = 'ease'
): string {
  const props = properties.join(', ');
  return `
    transition: ${props} ${duration}ms ${easing};
    -webkit-transition: ${props} ${duration}ms ${easing};
  `;
}

/**
 * Generate CSS for animations
 */
export function generateAnimationCSS(
  name: string,
  duration: number,
  easing: string = 'ease',
  iterationCount: string | number = '1'
): string {
  return `
    animation: ${name} ${duration}ms ${easing} ${iterationCount};
    -webkit-animation: ${name} ${duration}ms ${easing} ${iterationCount};
  `;
}

/**
 * Generate keyframes for fade in animation
 */
export function generateFadeInKeyframes(name: string = 'fadeIn'): string {
  return `
    @keyframes ${name} {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @-webkit-keyframes ${name} {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
}

/**
 * Generate keyframes for slide in animation
 */
export function generateSlideInKeyframes(
  name: string = 'slideIn',
  from: 'top' | 'right' | 'bottom' | 'left' = 'bottom'
): string {
  const transforms: Record<string, string> = {
    top: 'translateY(-100%)',
    right: 'translateX(100%)',
    bottom: 'translateY(100%)',
    left: 'translateX(-100%)'
  };
  
  return `
    @keyframes ${name} {
      from { transform: ${transforms[from]}; }
      to { transform: translateX(0); }
    }
    @-webkit-keyframes ${name} {
      from { transform: ${transforms[from]}; }
      to { transform: translateX(0); }
    }
  `;
}

/**
 * Generate CSS for elevation/depth effect
 */
export function generateElevationCSS(
  elevation: number,
  color: Color = '#000000'
): string {
  const shadows = [];
  const baseBlur = elevation * 2;
  const baseSpread = elevation * 0.5;
  const cssColor = toCssColor(color);
  
  // Ambient shadow
  shadows.push(`0 ${elevation}px ${baseBlur}px rgba(0,0,0,0.12)`);
  
  // Direct shadow
  shadows.push(`0 ${elevation * 0.5}px ${baseBlur * 1.5}px ${cssColor}`);
  
  return `box-shadow: ${shadows.join(', ')};`;
}

/**
 * Generate CSS for glass morphism effect
 */
export function generateGlassmorphismCSS(
  background: Color,
  blur: number = 10,
  opacity: number = 0.8
): string {
  const cssColor = toCssColor(background);
  return `
    background: ${cssColor};
    opacity: ${opacity};
    backdrop-filter: blur(${blur}px) saturate(180%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(180%);
  `;
}

/**
 * Generate CSS for glow effect
 */
export function generateGlowCSS(
  color: Color,
  intensity: number = 1
): string {
  const cssColor = toCssColor(color);
  const blur = 10 * intensity;
  const spread = 5 * intensity;
  
  return `
    box-shadow: 
      0 0 ${blur}px ${spread}px ${cssColor},
      0 0 ${blur * 1.5}px ${cssColor} inset;
  `;
}

/**
 * Generate CSS for pulse animation
 */
export function generatePulseKeyframes(
  name: string = 'pulse',
  color: Color
): string {
  const cssColor = toCssColor(color);
  return `
    @keyframes ${name} {
      0% { box-shadow: 0 0 0 0 ${cssColor}; }
      70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
      100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); }
    }
  `;
}

/**
 * Generate CSS for gradient border effect
 */
export function generateGradientBorderCSS(
  colors: Color[],
  angle: number = 45,
  borderWidth: number = 2
): string {
  const cssColors = colors.map(c => toCssColor(c)).join(', ');
  return `
    border: ${borderWidth}px solid transparent;
    background: linear-gradient(${angle}deg, ${cssColors}) border-box;
    -webkit-mask: 
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  `;
}

/**
 * Generate CSS for ripple effect
 */
export function generateRippleKeyframes(name: string = 'ripple'): string {
  return `
    @keyframes ${name} {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
}

/**
 * Advanced effect presets
 */
export const AdvancedEffectPresets = {
  smoothTransition: generateTransitionCSS(300, ['all'], 'ease-in-out'),
  fadeIn: generateFadeInKeyframes() + generateAnimationCSS('fadeIn', 300),
  slideIn: generateSlideInKeyframes() + generateAnimationCSS('slideIn', 400),
  glassmorphism: (bg: Color) => generateGlassmorphismCSS(bg, 10, 0.8),
  elevation: (level: number) => generateElevationCSS(level),
  glow: (color: Color) => generateGlowCSS(color, 1)
};
