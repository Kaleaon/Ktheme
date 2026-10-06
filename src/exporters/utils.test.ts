import { MetallicVariant, Theme } from "../core/types";
import {
  normalizeAdaptation,
  normalizeAnimations,
  normalizeBlur,
  normalizeColorTokens,
  normalizeCorners,
  normalizeEffects,
  normalizeFocusRing,
  normalizeLayout,
  normalizeMetallic,
  normalizeSemanticRoles,
  normalizeShadows,
  normalizeShimmer,
  normalizeTypography,
  toHexColor,
} from "./utils";

describe("Exporters Normalization Utilities (src/exporters/utils.ts)", () => {
  const minimalTheme: Theme = {
    metadata: {
      id: "test-theme",
      name: "Test Theme",
      description: "",
      author: "",
      version: "1.0.0",
      tags: [],
      createdAt: "",
      updatedAt: "",
    },
    darkMode: false,
    colorScheme: {
      primary: "#112233",
      onPrimary: "#FFFFFF",
      primaryContainer: "#001122",
      onPrimaryContainer: "#FFFFFF",
      secondary: "#445566",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#223344",
      onSecondaryContainer: "#FFFFFF",
      tertiary: "#778899",
      onTertiary: "#FFFFFF",
      tertiaryContainer: "#556677",
      onTertiaryContainer: "#FFFFFF",
      error: "#FF1111",
      onError: "#FFFFFF",
      errorContainer: "#AA0000",
      onErrorContainer: "#FFFFFF",
      background: "#FFFFFF",
      onBackground: "#000000",
      surface: "#F0F0F0",
      onSurface: "#000000",
      surfaceVariant: "#E0E0E0",
      onSurfaceVariant: "#000000",
      outline: "#CCCCCC",
      outlineVariant: "#DDDDDD",
      scrim: "#000000",
      inverseSurface: "#000000",
      inverseOnSurface: "#FFFFFF",
      inversePrimary: "#88BBFF",
    },
  };

  describe("toHexColor", () => {
    it("converts hex strings to uppercase hex", () => {
      expect(toHexColor("#ff5733")).toBe("#FF5733");
    });

    it("converts RGBA/RGB objects to upper hex", () => {
      expect(toHexColor({ r: 255, g: 87, b: 51 })).toBe("#FF5733");
    });
  });

  describe("normalizeSemanticRoles & normalizeColorTokens", () => {
    it("fallbacks semantic roles to secondary, tertiary, primaryContainer, error when missing", () => {
      const semantic = normalizeSemanticRoles(minimalTheme);
      expect(semantic.success).toBe("#445566");
      expect(semantic.warning).toBe("#778899");
      expect(semantic.info).toBe("#001122");
      expect(semantic.critical).toBe("#FF1111");
    });

    it("uses provided semantic roles when present", () => {
      const themeWithSemantic: Theme = {
        ...minimalTheme,
        colorScheme: {
          ...minimalTheme.colorScheme,
          semanticRoles: {
            success: "#00FF00",
            onSuccess: "#000000",
            warning: "#FFFF00",
            onWarning: "#000000",
            info: "#00FFFF",
            onInfo: "#000000",
            critical: "#FF00FF",
            onCritical: "#FFFFFF",
          },
        },
      };

      const colorTokens = normalizeColorTokens(themeWithSemantic);
      expect(colorTokens.semantic.success).toBe("#00FF00");
      expect(colorTokens.semantic.onSuccess).toBe("#000000");
      expect(colorTokens.semantic.critical).toBe("#FF00FF");
    });
  });

  describe("normalizeCorners & normalizeLayout", () => {
    it("returns default corner values for minimal theme", () => {
      expect(normalizeCorners(minimalTheme)).toEqual({
        small: 4,
        medium: 8,
        large: 12,
        xlarge: 16,
      });
    });

    it("normalizes layout tokens with fallbacks", () => {
      const layout = normalizeLayout(minimalTheme);
      expect(layout.density).toBe("comfortable");
      expect(layout.cornerStyle).toBe("rounded");
      expect(layout.spacingScale).toBe(1.0);
      expect(layout.panelStyle).toBe("flat");
      expect(layout.navigationStyle).toBe("tabs");
      expect(layout.breakpoints).toEqual({
        compact: 600,
        medium: 840,
        expanded: 1200,
      });
    });
  });

  describe("normalizeTypography", () => {
    it("normalizes typography with default values when undefined", () => {
      const typo = normalizeTypography(minimalTheme);
      expect(typo.fontFamily).toBe("system-ui, -apple-system, sans-serif");
      expect(typo.fontSize).toEqual({ small: 12, medium: 16, large: 20, xlarge: 28 });
      expect(typo.fontWeight).toEqual({ light: 300, regular: 400, medium: 500, bold: 700 });
      expect(typo.lineHeight).toBe(1.5);
      expect(typo.letterSpacing).toBe(0);
    });

    it("respects custom typography values", () => {
      const customTheme: Theme = {
        ...minimalTheme,
        typography: {
          fontFamily: "Roboto",
          fontSize: { small: 10, medium: 14, large: 18, xlarge: 24 },
          fontWeight: { light: 300, regular: 400, medium: 500, bold: 700 },
          lineHeight: 1.4,
          letterSpacing: 0.2,
        },
      };

      const typo = normalizeTypography(customTheme);
      expect(typo.fontFamily).toBe("Roboto");
      expect(typo.fontSize.medium).toBe(14);
      expect(typo.lineHeight).toBe(1.4);
      expect(typo.letterSpacing).toBe(0.2);
    });
  });

  describe("Effect Normalization Utilities", () => {
    it("normalizeBlur returns defaults for missing blur effect", () => {
      expect(normalizeBlur(minimalTheme)).toEqual({
        enabled: false,
        radius: 8,
      });
    });

    it("normalizeMetallic resolves variant gradients and intensity defaults", () => {
      const metallic = normalizeMetallic(minimalTheme);
      expect(metallic.enabled).toBe(false);
      expect(metallic.variant).toBe(MetallicVariant.SILVER);
      expect(metallic.intensity).toBe(0.5);
      expect(metallic.gradient.base).toBe("#C0C0C0");
      expect(metallic.gradient.highlight).toBe("#F5F5F5");
      expect(metallic.gradient.shadow).toBe("#505050");
      expect(metallic.gradient.shimmer).toBe("#E5E4E2");
    });

    it("normalizeShadows returns defaults for missing shadows effect", () => {
      expect(normalizeShadows(minimalTheme)).toEqual({
        enabled: false,
        elevation: 2,
        blur: 4,
        color: "#000000",
      });
    });

    it("normalizeShimmer returns defaults for missing shimmer effect", () => {
      expect(normalizeShimmer(minimalTheme)).toEqual({
        enabled: false,
        speed: 2000,
        intensity: 0.5,
        angle: 45,
      });
    });

    it("normalizeAnimations & normalizeFocusRing return correct defaults", () => {
      expect(normalizeAnimations(minimalTheme)).toEqual({
        enabled: true,
        duration: 300,
        easing: "ease-in-out",
      });

      expect(normalizeFocusRing(minimalTheme)).toEqual({
        enabled: true,
        color: "#112233",
        width: 2,
        offset: 2,
      });
    });

    it("normalizeEffects aggregates all normalized effects sub-structures", () => {
      const effects = normalizeEffects(minimalTheme);
      expect(effects.metallic.enabled).toBe(false);
      expect(effects.shadows.elevation).toBe(2);
      expect(effects.shimmer.speed).toBe(2000);
      expect(effects.blur.radius).toBe(8);
      expect(effects.animations.enabled).toBe(true);
      expect(effects.focusRing.color).toBe("#112233");
    });
  });

  describe("normalizeAdaptation", () => {
    it("normalizes adaptation tokens with fallbacks", () => {
      const adapt = normalizeAdaptation(minimalTheme);
      expect(adapt.layout).toEqual({
        density: "comfortable",
        cornerStyle: "rounded",
        spacingScale: 1.0,
        panelStyle: "flat",
        navigationStyle: "tabs",
      });
      expect(adapt.icons).toEqual({
        family: "material",
        style: "outlined",
        sizeScale: 1.0,
        strokeWidth: 2,
        cornerStyle: "rounded",
      });
      expect(adapt.desktopAdaptation).toBeUndefined();
    });
  });
});
