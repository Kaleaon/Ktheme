import { MetallicVariant, Theme } from '../../core/types';
import { toHexColor } from '../utils';
import { NormalizedThemeTokens } from './tokenIR';

/**
 * Extracts and normalizes tokens from a Theme object into a canonical NormalizedThemeTokens IR tree.
 * Performs unit normalization and fallback resolution for missing/optional tokens.
 *
 * @param theme - The source Theme object (full or partial)
 * @returns A fully normalized NormalizedThemeTokens IR structure
 */
export function extractThemeTokens(theme: Theme): NormalizedThemeTokens {
  const cs = theme.colorScheme;
  const roles = cs.semanticRoles;

  // Resolve color tokens
  const primary = toHexColor(cs.primary ?? '#000000');
  const onPrimary = toHexColor(cs.onPrimary ?? '#FFFFFF');
  const primaryContainer = toHexColor(cs.primaryContainer ?? primary);
  const onPrimaryContainer = toHexColor(cs.onPrimaryContainer ?? onPrimary);

  const secondary = toHexColor(cs.secondary ?? '#666666');
  const onSecondary = toHexColor(cs.onSecondary ?? '#FFFFFF');
  const secondaryContainer = toHexColor(cs.secondaryContainer ?? secondary);
  const onSecondaryContainer = toHexColor(cs.onSecondaryContainer ?? onSecondary);

  const tertiary = toHexColor(cs.tertiary ?? '#888888');
  const onTertiary = toHexColor(cs.onTertiary ?? '#FFFFFF');
  const tertiaryContainer = toHexColor(cs.tertiaryContainer ?? tertiary);
  const onTertiaryContainer = toHexColor(cs.onTertiaryContainer ?? onTertiary);

  const error = toHexColor(cs.error ?? '#D32F2F');
  const onError = toHexColor(cs.onError ?? '#FFFFFF');
  const errorContainer = toHexColor(cs.errorContainer ?? error);
  const onErrorContainer = toHexColor(cs.onErrorContainer ?? onError);

  const background = toHexColor(cs.background ?? '#121212');
  const onBackground = toHexColor(cs.onBackground ?? '#FFFFFF');
  const surface = toHexColor(cs.surface ?? '#1E1E1E');
  const onSurface = toHexColor(cs.onSurface ?? '#FFFFFF');
  const surfaceVariant = toHexColor(cs.surfaceVariant ?? surface);
  const onSurfaceVariant = toHexColor(cs.onSurfaceVariant ?? onSurface);

  const outline = toHexColor(cs.outline ?? '#777777');
  const outlineVariant = toHexColor(cs.outlineVariant ?? outline);

  const scrim = toHexColor(cs.scrim ?? '#000000');
  const inverseSurface = toHexColor(cs.inverseSurface ?? onSurface);
  const inverseOnSurface = toHexColor(cs.inverseOnSurface ?? surface);
  const inversePrimary = toHexColor(cs.inversePrimary ?? primary);

  const success = roles?.success ? toHexColor(roles.success) : secondary;
  const onSuccess = roles?.onSuccess ? toHexColor(roles.onSuccess) : onSecondary;
  const warning = roles?.warning ? toHexColor(roles.warning) : tertiary;
  const onWarning = roles?.onWarning ? toHexColor(roles.onWarning) : onTertiary;
  const info = roles?.info ? toHexColor(roles.info) : primaryContainer;
  const onInfo = roles?.onInfo ? toHexColor(roles.onInfo) : onPrimaryContainer;
  const critical = roles?.critical ? toHexColor(roles.critical) : error;
  const onCritical = roles?.onCritical ? toHexColor(roles.onCritical) : onError;

  // Resolve layout adaptation tokens
  const layoutAdaptation = theme.adaptation?.layout;
  const density = layoutAdaptation?.density ?? 'comfortable';
  const cornerStyle = layoutAdaptation?.cornerStyle ?? 'rounded';
  const spacingScale = layoutAdaptation?.spacingScale ?? 1.0;
  const panelStyle = layoutAdaptation?.panelStyle ?? 'flat';
  const navigationStyle = layoutAdaptation?.navigationStyle ?? 'tabs';

  const breakpoints = {
    compact: layoutAdaptation?.breakpoints?.compact ?? 600,
    medium: layoutAdaptation?.breakpoints?.medium ?? 840,
    expanded: layoutAdaptation?.breakpoints?.expanded ?? 1200
  };

  const corners = {
    small: theme.tokens?.corners?.small ?? 4,
    medium: theme.tokens?.corners?.medium ?? 8,
    large: theme.tokens?.corners?.large ?? 12,
    xlarge: theme.tokens?.corners?.xlarge ?? 16
  };

  // Resolve typography tokens
  const typography = theme.typography;
  const fontFamily = typography?.fontFamily ?? 'system-ui, -apple-system, sans-serif';
  const fontSize = {
    small: typography?.fontSize?.small ?? 12,
    medium: typography?.fontSize?.medium ?? 16,
    large: typography?.fontSize?.large ?? 20,
    xlarge: typography?.fontSize?.xlarge ?? 28
  };
  const fontWeight = {
    light: typography?.fontWeight?.light ?? 300,
    regular: typography?.fontWeight?.regular ?? 400,
    medium: typography?.fontWeight?.medium ?? 500,
    bold: typography?.fontWeight?.bold ?? 700
  };
  const lineHeight = typography?.lineHeight ?? 1.5;
  const letterSpacing = typography?.letterSpacing ?? 0;

  // Resolve visual effects tokens
  const effects = theme.effects;

  const metallic = {
    enabled: effects?.metallic?.enabled ?? false,
    variant: effects?.metallic?.variant ?? MetallicVariant.SILVER,
    intensity: effects?.metallic?.intensity ?? 0.5,
    gradient: {
      base: effects?.metallic?.gradient?.base ? toHexColor(effects.metallic.gradient.base) : '#C0C0C0',
      highlight: effects?.metallic?.gradient?.highlight ? toHexColor(effects.metallic.gradient.highlight) : '#FFFFFF',
      shadow: effects?.metallic?.gradient?.shadow ? toHexColor(effects.metallic.gradient.shadow) : '#808080',
      shimmer: effects?.metallic?.gradient?.shimmer ? toHexColor(effects.metallic.gradient.shimmer) : '#E0E0E0'
    }
  };

  const shadows = {
    enabled: effects?.shadows?.enabled ?? false,
    elevation: effects?.shadows?.elevation ?? 2,
    blur: effects?.shadows?.blur ?? 4,
    color: effects?.shadows?.color ? toHexColor(effects.shadows.color) : '#000000'
  };

  const shimmer = {
    enabled: effects?.shimmer?.enabled ?? false,
    speed: effects?.shimmer?.speed ?? 2000,
    intensity: effects?.shimmer?.intensity ?? 0.5,
    angle: effects?.shimmer?.angle ?? 45
  };

  const blur = {
    enabled: effects?.blur?.enabled ?? false,
    radius: effects?.blur?.radius ?? 8
  };

  const animations = {
    enabled: effects?.animations?.enabled ?? true,
    duration: effects?.animations?.duration ?? 300,
    easing: effects?.animations?.easing ?? ('ease-in-out' as const)
  };

  const focusRing = {
    enabled: effects?.focusRing?.enabled ?? true,
    color: effects?.focusRing?.color ? toHexColor(effects.focusRing.color) : primary,
    width: effects?.focusRing?.width ?? 2,
    offset: effects?.focusRing?.offset ?? 2
  };

  return {
    metadata: {
      id: theme.metadata?.id ?? 'theme',
      name: theme.metadata?.name ?? 'Theme',
      description: theme.metadata?.description,
      author: theme.metadata?.author,
      version: theme.metadata?.version,
      tags: theme.metadata?.tags ? [...theme.metadata.tags] : undefined
    },
    darkMode: theme.darkMode ?? false,
    color: {
      primary,
      onPrimary,
      primaryContainer,
      onPrimaryContainer,
      secondary,
      onSecondary,
      secondaryContainer,
      onSecondaryContainer,
      tertiary,
      onTertiary,
      tertiaryContainer,
      onTertiaryContainer,
      error,
      onError,
      errorContainer,
      onErrorContainer,
      background,
      onBackground,
      surface,
      onSurface,
      surfaceVariant,
      onSurfaceVariant,
      outline,
      outlineVariant,
      scrim,
      inverseSurface,
      inverseOnSurface,
      inversePrimary,
      semantic: {
        success,
        onSuccess,
        warning,
        onWarning,
        info,
        onInfo,
        critical,
        onCritical
      }
    },
    layout: {
      density,
      cornerStyle,
      spacingScale,
      breakpoints,
      corners,
      panelStyle,
      navigationStyle
    },
    typography: {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing
    },
    effects: {
      metallic,
      shadows,
      shimmer,
      blur,
      animations,
      focusRing
    },
    adaptation: {
      layout: {
        density,
        cornerStyle,
        spacingScale,
        panelStyle,
        navigationStyle
      },
      icons: {
        family: theme.adaptation?.icons?.family ?? 'material',
        style: theme.adaptation?.icons?.style ?? 'outlined',
        sizeScale: theme.adaptation?.icons?.sizeScale ?? 1.0,
        strokeWidth: theme.adaptation?.icons?.strokeWidth ?? 2,
        cornerStyle: theme.adaptation?.icons?.cornerStyle ?? 'rounded'
      },
      ...(theme.adaptation?.desktopAdaptation ? { desktopAdaptation: theme.adaptation.desktopAdaptation } : {})
    }
  };
}
