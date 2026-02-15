/**
 * Metallic effects module
 * Based on CleverFerret's metallic theming system
 */

import { MetallicGradient, MetallicVariant, Color } from '../core/types';

/**
 * Predefined metallic colors
 */
export const MetallicColors = {
  // Base metallic colors
  Silver: '#C0C0C0',
  Gold: '#D4AF37',
  GoldRoyalBlue: '#0A1630',
  Bronze: '#CD7F32',
  Copper: '#B87333',
  Platinum: '#E5E4E2',
  RoseGold: '#B76E79',
  Titanium: '#878681',
  Chrome: '#E8E8E8',
  Cobalt: '#0047AB',
  
  // Highlight colors
  SilverHighlight: '#F5F5F5',
  GoldHighlight: '#FFD700',
  BronzeHighlight: '#D99952',
  CopperHighlight: '#E8B4A0',
  PlatinumHighlight: '#F5F5F5',
  RoseGoldHighlight: '#E5BE8A',
  TitaniumHighlight: '#BDBBB8',
  ChromeHighlight: '#FFFFFF',
  CobaltHighlight: '#0066CC'
};

/**
 * Get metallic gradient for a variant
 */
export function getMetallicGradient(variant: MetallicVariant): MetallicGradient {
  switch (variant) {
    case MetallicVariant.SILVER:
      return {
        base: MetallicColors.Silver,
        highlight: MetallicColors.SilverHighlight,
        shadow: '#505050',
        shimmer: MetallicColors.Platinum
      };
      
    case MetallicVariant.GOLD:
      return {
        base: MetallicColors.Gold,
        highlight: MetallicColors.GoldHighlight,
        shadow: '#856D34',
        shimmer: '#FFF8DC'
      };
      
    case MetallicVariant.GOLD_ROYAL_BLUE:
      return {
        base: MetallicColors.Gold,
        highlight: MetallicColors.GoldHighlight,
        shadow: MetallicColors.GoldRoyalBlue,
        shimmer: '#FFF8DC'
      };
      
    case MetallicVariant.BRONZE:
      return {
        base: MetallicColors.Bronze,
        highlight: MetallicColors.BronzeHighlight,
        shadow: '#6B4423',
        shimmer: '#F0D9C0'
      };
      
    case MetallicVariant.COPPER:
      return {
        base: MetallicColors.Copper,
        highlight: MetallicColors.CopperHighlight,
        shadow: '#6B3410',
        shimmer: '#F2D2B0'
      };
      
    case MetallicVariant.PLATINUM:
      return {
        base: MetallicColors.Platinum,
        highlight: MetallicColors.PlatinumHighlight,
        shadow: '#9E9E9E',
        shimmer: '#FFFFFF'
      };
      
    case MetallicVariant.ROSE_GOLD:
      return {
        base: MetallicColors.RoseGold,
        highlight: MetallicColors.RoseGoldHighlight,
        shadow: '#7D4A52',
        shimmer: '#F5D5D8'
      };
      
    case MetallicVariant.TITANIUM:
      return {
        base: MetallicColors.Titanium,
        highlight: MetallicColors.TitaniumHighlight,
        shadow: '#4A4A48',
        shimmer: '#D0CFCC'
      };
      
    case MetallicVariant.CHROME:
      return {
        base: MetallicColors.Chrome,
        highlight: MetallicColors.ChromeHighlight,
        shadow: '#9E9E9E',
        shimmer: '#FFFFFF'
      };
      
    case MetallicVariant.COBALT:
      return {
        base: MetallicColors.Cobalt,
        highlight: MetallicColors.CobaltHighlight,
        shadow: '#002A66',
        shimmer: '#66A3D2'
      };
      
    default:
      return getMetallicGradient(MetallicVariant.SILVER);
  }
}

/**
 * Generate CSS for metallic gradient effect
 */
export function generateMetallicGradientCSS(gradient: MetallicGradient, angle: number = 135): string {
  return `linear-gradient(${angle}deg, 
    ${gradient.shadow} 0%, 
    ${gradient.base} 25%, 
    ${gradient.highlight} 50%, 
    ${gradient.base} 75%, 
    ${gradient.shadow} 100%)`;
}

/**
 * Generate CSS for shimmer animation
 */
export function generateShimmerCSS(gradient: MetallicGradient, speed: number = 2): string {
  return `
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    
    background: linear-gradient(
      90deg,
      ${gradient.base} 0%,
      ${gradient.shimmer} 50%,
      ${gradient.base} 100%
    );
    background-size: 200% 100%;
    animation: shimmer ${speed}s linear infinite;
  `;
}

/**
 * Media type colors for consistent UI
 */
export const MediaTypeColors = {
  Book: '#4CAF50',
  Movie: '#2196F3',
  Music: '#9C27B0',
  TVShow: '#FF9800',
  Podcast: '#F44336',
  Audiobook: '#009688',
  Comic: '#FFEB3B',
  Radio: '#00BCD4',
  Magazine: '#3F51B5',
  News: '#FFC107',
  Fanfiction: '#E91E63'
};

/**
 * Get color for a media type
 */
export function getMediaTypeColor(mediaType: string): Color {
  const normalized = mediaType.toLowerCase().replace(/[_-]/g, '');
  
  const mapping: { [key: string]: string } = {
    'book': MediaTypeColors.Book,
    'ebook': MediaTypeColors.Book,
    'movie': MediaTypeColors.Movie,
    'music': MediaTypeColors.Music,
    'musictrack': MediaTypeColors.Music,
    'album': MediaTypeColors.Music,
    'tvshow': MediaTypeColors.TVShow,
    'tv': MediaTypeColors.TVShow,
    'series': MediaTypeColors.TVShow,
    'podcast': MediaTypeColors.Podcast,
    'audiobook': MediaTypeColors.Audiobook,
    'comic': MediaTypeColors.Comic,
    'manga': MediaTypeColors.Comic,
    'radio': MediaTypeColors.Radio,
    'magazine': MediaTypeColors.Magazine,
    'news': MediaTypeColors.News,
    'fanfiction': MediaTypeColors.Fanfiction
  };
  
  return mapping[normalized] || MediaTypeColors.Book;
}
