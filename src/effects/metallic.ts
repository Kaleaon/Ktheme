/**
 * Metallic effects module
 * Based on CleverFerret's metallic theming system
 */

import { MetallicGradient, MetallicVariant } from "../core/types";

/**
 * Predefined metallic colors
 */
export const MetallicColors = {
  // Base metallic colors
  Silver: "#C0C0C0",
  Gold: "#D4AF37",
  GoldRoyalBlue: "#0A1630",
  Bronze: "#CD7F32",
  Copper: "#B87333",
  Platinum: "#E5E4E2",
  RoseGold: "#B76E79",
  Titanium: "#878681",
  Chrome: "#E8E8E8",
  Cobalt: "#0047AB",

  // Highlight colors
  SilverHighlight: "#F5F5F5",
  GoldHighlight: "#FFD700",
  BronzeHighlight: "#D99952",
  CopperHighlight: "#E8B4A0",
  PlatinumHighlight: "#F5F5F5",
  RoseGoldHighlight: "#E5BE8A",
  TitaniumHighlight: "#BDBBB8",
  ChromeHighlight: "#FFFFFF",
  CobaltHighlight: "#0066CC",
};

/**
 * Get metallic gradient for a variant
 */
export function getMetallicGradient(
  variant: MetallicVariant,
): MetallicGradient {
  switch (variant) {
    case MetallicVariant.SILVER:
      return {
        base: MetallicColors.Silver,
        highlight: MetallicColors.SilverHighlight,
        shadow: "#505050",
        shimmer: MetallicColors.Platinum,
      };

    case MetallicVariant.GOLD:
      return {
        base: MetallicColors.Gold,
        highlight: MetallicColors.GoldHighlight,
        shadow: "#856D34",
        shimmer: "#FFF8DC",
      };

    case MetallicVariant.GOLD_ROYAL_BLUE:
      return {
        base: MetallicColors.Gold,
        highlight: MetallicColors.GoldHighlight,
        shadow: MetallicColors.GoldRoyalBlue,
        shimmer: "#FFF8DC",
      };

    case MetallicVariant.BRONZE:
      return {
        base: MetallicColors.Bronze,
        highlight: MetallicColors.BronzeHighlight,
        shadow: "#6B4423",
        shimmer: "#F0D9C0",
      };

    case MetallicVariant.COPPER:
      return {
        base: MetallicColors.Copper,
        highlight: MetallicColors.CopperHighlight,
        shadow: "#6B3410",
        shimmer: "#F2D2B0",
      };

    case MetallicVariant.PLATINUM:
      return {
        base: MetallicColors.Platinum,
        highlight: MetallicColors.PlatinumHighlight,
        shadow: "#9E9E9E",
        shimmer: "#FFFFFF",
      };

    case MetallicVariant.ROSE_GOLD:
      return {
        base: MetallicColors.RoseGold,
        highlight: MetallicColors.RoseGoldHighlight,
        shadow: "#7D4A52",
        shimmer: "#F5D5D8",
      };

    case MetallicVariant.TITANIUM:
      return {
        base: MetallicColors.Titanium,
        highlight: MetallicColors.TitaniumHighlight,
        shadow: "#4A4A48",
        shimmer: "#D0CFCC",
      };

    case MetallicVariant.CHROME:
      return {
        base: MetallicColors.Chrome,
        highlight: MetallicColors.ChromeHighlight,
        shadow: "#9E9E9E",
        shimmer: "#FFFFFF",
      };

    case MetallicVariant.COBALT:
      return {
        base: MetallicColors.Cobalt,
        highlight: MetallicColors.CobaltHighlight,
        shadow: "#002A66",
        shimmer: "#66A3D2",
      };

    default:
      return getMetallicGradient(MetallicVariant.SILVER);
  }
}
