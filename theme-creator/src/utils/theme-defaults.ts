import type {
  KTheme,
  ColorScheme,
  VisualEffects,
  Typography,
} from "../types/theme.ts";

export const DEFAULT_COLOR_SCHEME: ColorScheme = {
  primary: "#6750A4",
  onPrimary: "#FFFFFF",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#21005D",
  secondary: "#625B71",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#E8DEF8",
  onSecondaryContainer: "#1D192B",
  tertiary: "#7D5260",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#FFD8E4",
  onTertiaryContainer: "#31111D",
  error: "#B3261E",
  onError: "#FFFFFF",
  errorContainer: "#F9DEDC",
  onErrorContainer: "#410E0B",
  background: "#1C1B1F",
  onBackground: "#E6E1E5",
  surface: "#1C1B1F",
  onSurface: "#E6E1E5",
  surfaceVariant: "#49454F",
  onSurfaceVariant: "#CAC4D0",
  outline: "#938F99",
  outlineVariant: "#49454F",
  scrim: "#000000",
  inverseSurface: "#E6E1E5",
  inverseOnSurface: "#313033",
  inversePrimary: "#6750A4",
  stateLayers: {
    hover: "#FFFFFF14",
    pressed: "#FFFFFF1F",
    focused: "#FFFFFF1F",
    dragged: "#FFFFFF29",
  },
  semanticRoles: {
    success: "#4ADE80",
    onSuccess: "#052E16",
    successContainer: "#14532D",
    onSuccessContainer: "#DCFCE7",
    warning: "#FBBF24",
    onWarning: "#422006",
    warningContainer: "#78350F",
    onWarningContainer: "#FEF3C7",
    info: "#60A5FA",
    onInfo: "#172554",
    infoContainer: "#1E3A8A",
    onInfoContainer: "#DBEAFE",
    critical: "#FB7185",
    onCritical: "#4C0519",
  },
};

export const DEFAULT_EFFECTS: VisualEffects = {
  metallic: {
    enabled: false,
    variant: "GOLD",
    gradient: {
      base: "#D4AF37",
      highlight: "#FFD700",
      shadow: "#0A1630",
      shimmer: "#FFF8DC",
    },
    intensity: 0.6,
  },
  shadows: {
    enabled: true,
    elevation: 4,
    blur: 8,
    color: "#00000040",
  },
  shimmer: {
    enabled: false,
    speed: 3,
    intensity: 0.5,
    angle: 135,
  },
  blur: { enabled: false, radius: 12 },
  gradients: {
    enabled: false,
    angle: 135,
    stops: [
      { offset: 0, color: "#6750A4" },
      { offset: 1, color: "#1C1B1F" },
    ],
  },
  animations: {
    enabled: true,
    duration: 300,
    easing: "ease-in-out",
    reducedMotionPolicy: "reduce",
  },
  transitions: {
    enabled: true,
    duration: 200,
    properties: ["background-color", "color", "box-shadow", "transform"],
  },
  overlays: {
    enabled: false,
    color: "#6750A4",
    opacity: 0.12,
    blendMode: "soft-light",
  },
  focusRing: { enabled: true, color: "#6750A4", width: 2, offset: 2 },
  noise: { enabled: false, opacity: 0.05, scale: 4 },
};

export const DEFAULT_TYPOGRAPHY: Typography = {
  fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontSize: { small: 12, medium: 16, large: 20, xlarge: 28 },
  fontWeight: { light: 300, regular: 400, medium: 500, bold: 700 },
  lineHeight: 1.5,
  letterSpacing: 0,
};

export function createDefaultTheme(): KTheme {
  const now = new Date().toISOString();
  return {
    metadata: {
      id: crypto.randomUUID(),
      name: "Untitled Theme",
      description: "",
      author: "",
      version: "1.0.0",
      tags: [],
      createdAt: now,
      updatedAt: now,
    },
    darkMode: true,
    colorScheme: JSON.parse(JSON.stringify(DEFAULT_COLOR_SCHEME)),
    effects: JSON.parse(JSON.stringify(DEFAULT_EFFECTS)),
    typography: JSON.parse(JSON.stringify(DEFAULT_TYPOGRAPHY)),
  };
}

export const METALLIC_PRESETS: Record<
  string,
  { base: string; highlight: string; shadow: string; shimmer: string }
> = {
  GOLD: {
    base: "#D4AF37",
    highlight: "#FFD700",
    shadow: "#8B6914",
    shimmer: "#FFF8DC",
  },
  SILVER: {
    base: "#C0C0C0",
    highlight: "#E8E8E8",
    shadow: "#808080",
    shimmer: "#F5F5F5",
  },
  BRONZE: {
    base: "#CD7F32",
    highlight: "#E8A84C",
    shadow: "#8B5A2B",
    shimmer: "#FFDEAD",
  },
  COPPER: {
    base: "#B87333",
    highlight: "#DA8A67",
    shadow: "#8B4513",
    shimmer: "#FFE4C4",
  },
  PLATINUM: {
    base: "#E5E4E2",
    highlight: "#F5F5F5",
    shadow: "#A9A9A9",
    shimmer: "#FFFFFF",
  },
  ROSE_GOLD: {
    base: "#B76E79",
    highlight: "#E8A0B0",
    shadow: "#8B5A5A",
    shimmer: "#FFE4E1",
  },
  TITANIUM: {
    base: "#878681",
    highlight: "#A8A8A2",
    shadow: "#5A5A55",
    shimmer: "#D3D3CC",
  },
  CHROME: {
    base: "#DBE4EB",
    highlight: "#F0F5FA",
    shadow: "#8899AA",
    shimmer: "#FFFFFF",
  },
  COBALT: {
    base: "#0047AB",
    highlight: "#4682B4",
    shadow: "#003380",
    shimmer: "#B0C4DE",
  },
  GOLD_ROYAL_BLUE: {
    base: "#D4AF37",
    highlight: "#FFD700",
    shadow: "#0A1630",
    shimmer: "#FFF8DC",
  },
};
