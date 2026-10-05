import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';

export interface CssVarsExport {
  vars: Record<string, string>;
  cssText: string;
}

export class CssVarsRenderer implements TokenRenderer<CssVarsExport> {
  readonly id = 'css-vars';
  readonly name = 'CSS Variables Exporter';

  render(tokens: NormalizedThemeTokens): CssVarsExport {
    const vars: Record<string, string> = {
      '--ktheme-primary': tokens.color.primary,
      '--ktheme-on-primary': tokens.color.onPrimary,
      '--ktheme-background': tokens.color.background,
      '--ktheme-on-background': tokens.color.onBackground,
      '--ktheme-surface': tokens.color.surface,
      '--ktheme-on-surface': tokens.color.onSurface,
      '--ktheme-error': tokens.color.error,
      '--ktheme-semantic-success': tokens.color.semantic.success,
      '--ktheme-semantic-warning': tokens.color.semantic.warning,
      '--ktheme-semantic-info': tokens.color.semantic.info,
      '--ktheme-semantic-critical': tokens.color.semantic.critical,

      // Typography
      '--ktheme-typography-font-family': tokens.typography.fontFamily,
      '--ktheme-typography-font-size-small': `${tokens.typography.fontSize.small}px`,
      '--ktheme-typography-font-size-medium': `${tokens.typography.fontSize.medium}px`,
      '--ktheme-typography-font-size-large': `${tokens.typography.fontSize.large}px`,
      '--ktheme-typography-font-size-xlarge': `${tokens.typography.fontSize.xlarge}px`,
      '--ktheme-typography-font-weight-light': `${tokens.typography.fontWeight.light}`,
      '--ktheme-typography-font-weight-regular': `${tokens.typography.fontWeight.regular}`,
      '--ktheme-typography-font-weight-medium': `${tokens.typography.fontWeight.medium}`,
      '--ktheme-typography-font-weight-bold': `${tokens.typography.fontWeight.bold}`,
      '--ktheme-typography-line-height': `${tokens.typography.lineHeight}`,
      '--ktheme-typography-letter-spacing': `${tokens.typography.letterSpacing}em`,

      // Adaptation
      '--ktheme-adaptation-layout-density': String(tokens.layout.density),
      '--ktheme-adaptation-layout-corner-style': String(tokens.layout.cornerStyle),
      '--ktheme-adaptation-layout-spacing-scale': `${String(tokens.layout.spacingScale)}`
    };

    if (tokens.effects.metallic.enabled) {
      vars['--ktheme-effects-metallic-enabled'] = 'true';
      vars['--ktheme-effects-metallic-variant'] = String(tokens.effects.metallic.variant);
      vars['--ktheme-effects-metallic-intensity'] = `${String(tokens.effects.metallic.intensity)}`;
      vars['--ktheme-effects-metallic-base'] = tokens.effects.metallic.gradient.base;
      vars['--ktheme-effects-metallic-highlight'] = tokens.effects.metallic.gradient.highlight;
      vars['--ktheme-effects-metallic-shadow'] = tokens.effects.metallic.gradient.shadow;
      vars['--ktheme-effects-metallic-shimmer'] = tokens.effects.metallic.gradient.shimmer;
    }

    if (tokens.effects.shadows.enabled) {
      vars['--ktheme-effects-shadow-elevation'] = `${String(tokens.effects.shadows.elevation)}px`;
      vars['--ktheme-effects-shadow-blur'] = `${String(tokens.effects.shadows.blur)}px`;
      vars['--ktheme-effects-shadow-color'] = String(tokens.effects.shadows.color);
    }

    const da = tokens.adaptation.desktopAdaptation;
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
}

export const cssVarsRenderer = new CssVarsRenderer();
