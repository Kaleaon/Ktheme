import {
  AccessibilityRuntimePreferences,
  AccessibilitySettings,
  ResolvedAccessibilitySettings,
  Theme
} from '../core/types';

const DEFAULT_ACCESSIBILITY_CONTROLS: Required<NonNullable<AccessibilitySettings['controls']>> = {
  allowContrastToggle: true,
  allowMotionToggle: true,
  allowFontScaleControl: true,
  allowFocusRingToggle: true
};

const DEFAULT_ACCESSIBILITY: ResolvedAccessibilitySettings = {
  enabled: true,
  highContrast: false,
  reducedMotion: false,
  forcedColors: false,
  minimumContrastRatio: 4.5,
  fontScale: 1,
  lineHeight: 1.5,
  letterSpacing: 0,
  minimumTargetSize: 44,
  focusRingWidth: 2,
  focusRingOffset: 2,
  underlineLinks: true,
  disableParallax: true,
  disableShimmer: true,
  controls: DEFAULT_ACCESSIBILITY_CONTROLS
};

export function resolveAccessibilitySettings(
  theme: Theme,
  preferences?: AccessibilityRuntimePreferences
): ResolvedAccessibilitySettings {
  const settings = theme.accessibility;
  const reduceMotionByDefault = settings?.motion?.reduceMotionByDefault ?? false;

  const reducedMotion = Boolean(preferences?.prefersReducedMotion ?? reduceMotionByDefault);
  const highContrast = Boolean(preferences?.prefersHighContrast ?? false);
  const forcedColors = Boolean(preferences?.prefersForcedColors ?? false);

  return {
    ...DEFAULT_ACCESSIBILITY,
    enabled: settings?.enabled ?? true,
    highContrast,
    reducedMotion,
    forcedColors,
    minimumContrastRatio: settings?.minimumContrastRatio ?? DEFAULT_ACCESSIBILITY.minimumContrastRatio,
    fontScale: Math.max(0.8, preferences?.userFontScale ?? settings?.typography?.fontScale ?? DEFAULT_ACCESSIBILITY.fontScale),
    lineHeight: settings?.typography?.lineHeight ?? DEFAULT_ACCESSIBILITY.lineHeight,
    letterSpacing: settings?.typography?.letterSpacing ?? DEFAULT_ACCESSIBILITY.letterSpacing,
    minimumTargetSize: settings?.interaction?.minimumTargetSize ?? DEFAULT_ACCESSIBILITY.minimumTargetSize,
    focusRingWidth: settings?.interaction?.focusRingWidth ?? DEFAULT_ACCESSIBILITY.focusRingWidth,
    focusRingOffset: settings?.interaction?.focusRingOffset ?? DEFAULT_ACCESSIBILITY.focusRingOffset,
    underlineLinks: settings?.interaction?.underlineLinks ?? DEFAULT_ACCESSIBILITY.underlineLinks,
    disableParallax: settings?.motion?.disableParallax ?? DEFAULT_ACCESSIBILITY.disableParallax,
    disableShimmer: settings?.motion?.disableShimmer ?? DEFAULT_ACCESSIBILITY.disableShimmer,
    controls: {
      allowContrastToggle: settings?.controls?.allowContrastToggle ?? DEFAULT_ACCESSIBILITY_CONTROLS.allowContrastToggle,
      allowMotionToggle: settings?.controls?.allowMotionToggle ?? DEFAULT_ACCESSIBILITY_CONTROLS.allowMotionToggle,
      allowFontScaleControl: settings?.controls?.allowFontScaleControl ?? DEFAULT_ACCESSIBILITY_CONTROLS.allowFontScaleControl,
      allowFocusRingToggle: settings?.controls?.allowFocusRingToggle ?? DEFAULT_ACCESSIBILITY_CONTROLS.allowFocusRingToggle
    }
  };
}

export function shouldAutoIncludeAccessibilityCSS(theme: Theme): boolean {
  return theme.accessibility?.autoIncludeInGeneratedCSS ?? true;
}
