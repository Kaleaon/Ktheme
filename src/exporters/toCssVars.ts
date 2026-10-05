import { DesktopAdaptation, Theme } from '../core/types';
import { normalizeAdaptation, normalizeEffects, normalizeSemanticRoles, normalizeTypography, toHexColor } from './utils';

export interface CssVarsExport {
  vars: Record<string, string>;
  cssText: string;
}

export function toCssVars(theme: Theme): CssVarsExport {
  const semantic = normalizeSemanticRoles(theme);
  const typography = normalizeTypography(theme);
  const effects = normalizeEffects(theme);
  const adaptation = normalizeAdaptation(theme);

  const vars: Record<string, string> = {
    '--ktheme-primary': toHexColor(theme.colorScheme.primary),
    '--ktheme-on-primary': toHexColor(theme.colorScheme.onPrimary),
    '--ktheme-background': toHexColor(theme.colorScheme.background),
    '--ktheme-on-background': toHexColor(theme.colorScheme.onBackground),
    '--ktheme-surface': toHexColor(theme.colorScheme.surface),
    '--ktheme-on-surface': toHexColor(theme.colorScheme.onSurface),
    '--ktheme-error': toHexColor(theme.colorScheme.error),
    '--ktheme-semantic-success': semantic.success,
    '--ktheme-semantic-warning': semantic.warning,
    '--ktheme-semantic-info': semantic.info,
    '--ktheme-semantic-critical': semantic.critical,

    // Typography
    '--ktheme-typography-font-family': typography.fontFamily,
    '--ktheme-typography-font-size-small': `${typography.fontSize.small}px`,
    '--ktheme-typography-font-size-medium': `${typography.fontSize.medium}px`,
    '--ktheme-typography-font-size-large': `${typography.fontSize.large}px`,
    '--ktheme-typography-font-size-xlarge': `${typography.fontSize.xlarge}px`,
    '--ktheme-typography-font-weight-light': `${typography.fontWeight.light}`,
    '--ktheme-typography-font-weight-regular': `${typography.fontWeight.regular}`,
    '--ktheme-typography-font-weight-medium': `${typography.fontWeight.medium}`,
    '--ktheme-typography-font-weight-bold': `${typography.fontWeight.bold}`,
    '--ktheme-typography-line-height': `${typography.lineHeight}`,
    '--ktheme-typography-letter-spacing': `${typography.letterSpacing}em`,

    // Adaptation
    '--ktheme-adaptation-layout-density': String((adaptation.layout as Record<string, unknown>).density),
    '--ktheme-adaptation-layout-corner-style': String((adaptation.layout as Record<string, unknown>).cornerStyle),
    '--ktheme-adaptation-layout-spacing-scale': `${String((adaptation.layout as Record<string, unknown>).spacingScale)}`
  };

  const metallic = effects.metallic as Record<string, unknown> | undefined;
  if (metallic?.enabled) {
    const grad = metallic.gradient as Record<string, string>;
    vars['--ktheme-effects-metallic-enabled'] = 'true';
    vars['--ktheme-effects-metallic-variant'] = String(metallic.variant);
    vars['--ktheme-effects-metallic-intensity'] = `${String(metallic.intensity)}`;
    vars['--ktheme-effects-metallic-base'] = grad.base;
    vars['--ktheme-effects-metallic-highlight'] = grad.highlight;
    vars['--ktheme-effects-metallic-shadow'] = grad.shadow;
    vars['--ktheme-effects-metallic-shimmer'] = grad.shimmer;
  }

  const shadows = effects.shadows as Record<string, unknown> | undefined;
  if (shadows?.enabled) {
    vars['--ktheme-effects-shadow-elevation'] = `${String(shadows.elevation)}px`;
    vars['--ktheme-effects-shadow-blur'] = `${String(shadows.blur)}px`;
    vars['--ktheme-effects-shadow-color'] = String(shadows.color);
  }

  const da = adaptation.desktopAdaptation as DesktopAdaptation | undefined;
  if (da) {
    if (da.windowChrome) {
      if (da.windowChrome.titleBarHeight !== undefined) vars['--ktheme-adaptation-desktop-window-chrome-title-bar-height'] = `${da.windowChrome.titleBarHeight}px`;
      if (da.windowChrome.headerStyle !== undefined) vars['--ktheme-adaptation-desktop-window-chrome-header-style'] = `${da.windowChrome.headerStyle}`;
      if (da.windowChrome.cornerStyle !== undefined) vars['--ktheme-adaptation-desktop-window-chrome-corner-style'] = `${da.windowChrome.cornerStyle}`;
      if (da.windowChrome.panelRadius !== undefined) vars['--ktheme-adaptation-desktop-window-chrome-panel-radius'] = `${da.windowChrome.panelRadius}px`;
      if (da.windowChrome.controlRadius !== undefined) vars['--ktheme-adaptation-desktop-window-chrome-control-radius'] = `${da.windowChrome.controlRadius}px`;
    }
    if (da.menuBar) {
      if (da.menuBar.height !== undefined) vars['--ktheme-adaptation-desktop-menu-bar-height'] = `${da.menuBar.height}px`;
      if (da.menuBar.fontSize !== undefined) vars['--ktheme-adaptation-desktop-menu-bar-font-size'] = `${da.menuBar.fontSize}px`;
    }
    if (da.taskbar) {
      if (da.taskbar.height !== undefined) vars['--ktheme-adaptation-desktop-taskbar-height'] = `${da.taskbar.height}px`;
      if (da.taskbar.buttonRadius !== undefined) vars['--ktheme-adaptation-desktop-taskbar-button-radius'] = `${da.taskbar.buttonRadius}px`;
    }
    if (da.cameraHud) {
      if (da.cameraHud.panelRadius !== undefined) vars['--ktheme-adaptation-desktop-camera-hud-panel-radius'] = `${da.cameraHud.panelRadius}px`;
    }
    if (da.sweep) {
      if (da.sweep.elbowWidth !== undefined) vars['--ktheme-adaptation-desktop-sweep-elbow-width'] = `${da.sweep.elbowWidth}px`;
    }
  }

  const cssBody = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');

  return {
    vars,
    cssText: `:root {\n${cssBody}\n}`
  };
}
