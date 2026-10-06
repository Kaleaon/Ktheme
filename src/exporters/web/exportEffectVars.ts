import { Theme, MetallicVariant } from "../../core/types";
import { getMetallicGradient } from "../../effects/metallic";
import { toHexColor } from "../utils";
import { EffectVarsExport, WebExporterOptions } from "./types";

export function exportEffectVars(
  theme: Theme,
  options?: WebExporterOptions,
): EffectVarsExport {
  if (options?.includeEffects === false) {
    return { vars: {}, tailwind: {} };
  }

  const vars: Record<string, string> = {};
  const tailwindColors: Record<string, string> = {};
  const tailwindBoxShadow: Record<string, string> = {};
  const tailwindBackgroundImage: Record<string, string> = {};
  const tailwindBackdropBlur: Record<string, string> = {};

  // 1. Metallic Tokens
  const metallicVariant =
    theme.effects?.metallic?.variant ?? MetallicVariant.SILVER;
  const metallicIntensity = theme.effects?.metallic?.intensity ?? 1;
  const metallicGradient =
    theme.effects?.metallic?.gradient ?? getMetallicGradient(metallicVariant);

  const baseColor = toHexColor(metallicGradient.base);
  const highlightColor = toHexColor(metallicGradient.highlight);
  const shadowColor = toHexColor(metallicGradient.shadow);
  const shimmerColor = toHexColor(metallicGradient.shimmer);

  vars["--ktheme-effect-metallic-variant"] = String(metallicVariant);
  vars["--ktheme-effect-metallic-base"] = baseColor;
  vars["--ktheme-effect-metallic-highlight"] = highlightColor;
  vars["--ktheme-effect-metallic-shadow"] = shadowColor;
  vars["--ktheme-effect-metallic-shimmer"] = shimmerColor;
  vars["--ktheme-effect-metallic-intensity"] = String(metallicIntensity);

  tailwindColors["metallic-base"] = baseColor;
  tailwindColors["metallic-highlight"] = highlightColor;
  tailwindColors["metallic-shadow"] = shadowColor;
  tailwindColors["metallic-shimmer"] = shimmerColor;

  tailwindBackgroundImage["metallic"] =
    `linear-gradient(135deg, ${shadowColor} 0%, ${baseColor} 25%, ${highlightColor} 50%, ${baseColor} 75%, ${shadowColor} 100%)`;

  // 2. Shimmer Tokens
  const shimmerSpeed = theme.effects?.shimmer?.speed ?? 2;
  const shimmerIntensity = theme.effects?.shimmer?.intensity ?? 1;
  const shimmerAngle = theme.effects?.shimmer?.angle ?? 90;

  vars["--ktheme-effect-shimmer-speed"] = `${shimmerSpeed}s`;
  vars["--ktheme-effect-shimmer-intensity"] = String(shimmerIntensity);
  vars["--ktheme-effect-shimmer-angle"] = `${shimmerAngle}deg`;
  vars["--ktheme-effect-shimmer-color"] = shimmerColor;

  tailwindColors["shimmer"] = shimmerColor;

  // 3. Glass Tokens
  const glassBlur = theme.effects?.blur?.radius ?? 10;
  const glassOpacity = theme.effects?.overlays?.opacity ?? 0.8;
  const glassBg = toHexColor(theme.colorScheme.surface);

  vars["--ktheme-effect-glass-blur"] = `${glassBlur}px`;
  vars["--ktheme-effect-glass-opacity"] = String(glassOpacity);
  vars["--ktheme-effect-glass-bg"] = glassBg;

  tailwindBackdropBlur["glass"] = `${glassBlur}px`;

  // 4. Glow Tokens
  const glowColor = toHexColor(
    theme.effects?.focusRing?.color ?? theme.colorScheme.primary,
  );
  const glowSpread = theme.effects?.focusRing?.width ?? 10;

  vars["--ktheme-effect-glow-color"] = glowColor;
  vars["--ktheme-effect-glow-spread"] = `${glowSpread}px`;

  tailwindColors["glow"] = glowColor;
  tailwindBoxShadow["glow"] = `0 0 ${glowSpread}px ${glowColor}`;

  return {
    vars,
    tailwind: {
      colors: tailwindColors,
      boxShadow: tailwindBoxShadow,
      backgroundImage: tailwindBackgroundImage,
      backdropBlur: tailwindBackdropBlur,
    },
  };
}
