import { NormalizedThemeTokens } from '../ir/tokenIR';
import { TokenRenderer } from './TokenRenderer';
import { WebExporterOptions } from '../web/types';

export interface CssVarsExport {
  vars: Record<string, string>;
  cssText: string;
}

export class CssVarsRenderer implements TokenRenderer<CssVarsExport> {
  readonly id = 'css-vars';
  readonly name = 'CSS Variables Exporter';

  render(tokens: NormalizedThemeTokens, options?: WebExporterOptions): CssVarsExport {
    const resolvedOptions: WebExporterOptions = {
      includeEffects: true,
      includeTypography: true,
      includeCorners: true,
      ...options
    };

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
      '--ktheme-semantic-critical': tokens.color.semantic.critical
    };

    if (resolvedOptions.includeTypography) {
      vars['--ktheme-typography-font-family'] = tokens.typography.fontFamily;
      vars['--ktheme-typography-font-size-small'] = `${tokens.typography.fontSize.small}px`;
      vars['--ktheme-typography-font-size-medium'] = `${tokens.typography.fontSize.medium}px`;
      vars['--ktheme-typography-font-size-large'] = `${tokens.typography.fontSize.large}px`;
      vars['--ktheme-typography-font-size-xlarge'] = `${tokens.typography.fontSize.xlarge}px`;
      vars['--ktheme-typography-font-weight-light'] = `${tokens.typography.fontWeight.light}`;
      vars['--ktheme-typography-font-weight-regular'] = `${tokens.typography.fontWeight.regular}`;
      vars['--ktheme-typography-font-weight-medium'] = `${tokens.typography.fontWeight.medium}`;
      vars['--ktheme-typography-font-weight-bold'] = `${tokens.typography.fontWeight.bold}`;
      vars['--ktheme-typography-line-height'] = `${tokens.typography.lineHeight}`;
      vars['--ktheme-typography-letter-spacing'] = `${tokens.typography.letterSpacing}em`;

      vars['--ktheme-font-family'] = tokens.typography.fontFamily;
      vars['--ktheme-font-size-small'] = `${tokens.typography.fontSize.small}px`;
      vars['--ktheme-font-size-medium'] = `${tokens.typography.fontSize.medium}px`;
      vars['--ktheme-font-size-large'] = `${tokens.typography.fontSize.large}px`;
      vars['--ktheme-font-size-xlarge'] = `${tokens.typography.fontSize.xlarge}px`;
      vars['--ktheme-font-weight-light'] = `${tokens.typography.fontWeight.light}`;
      vars['--ktheme-font-weight-regular'] = `${tokens.typography.fontWeight.regular}`;
      vars['--ktheme-font-weight-medium'] = `${tokens.typography.fontWeight.medium}`;
      vars['--ktheme-font-weight-bold'] = `${tokens.typography.fontWeight.bold}`;
      vars['--ktheme-font-line-height'] = `${tokens.typography.lineHeight}`;
      vars['--ktheme-font-letter-spacing'] = `${tokens.typography.letterSpacing}em`;
    }

    if (resolvedOptions.includeEffects) {
      // Glass
      vars['--ktheme-glass-blur'] = tokens.effects.blur.enabled ? `${tokens.effects.blur.radius}px` : '0px';

      // Metallic
      vars['--ktheme-metallic-variant'] = tokens.effects.metallic.enabled ? String(tokens.effects.metallic.variant) : 'SILVER';
      vars['--ktheme-metallic-intensity'] = tokens.effects.metallic.enabled ? `${tokens.effects.metallic.intensity}` : '0';
      vars['--ktheme-metallic-base'] = tokens.effects.metallic.enabled ? tokens.effects.metallic.gradient.base : '#C0C0C0';
      vars['--ktheme-metallic-highlight'] = tokens.effects.metallic.enabled ? tokens.effects.metallic.gradient.highlight : '#FFFFFF';
      vars['--ktheme-metallic-shadow'] = tokens.effects.metallic.enabled ? tokens.effects.metallic.gradient.shadow : '#808080';
      vars['--ktheme-metallic-shimmer'] = tokens.effects.metallic.enabled ? tokens.effects.metallic.gradient.shimmer : '#E0E0E0';

      // Glow / Shadows
      vars['--ktheme-glow-intensity'] = tokens.effects.shadows.enabled ? `${tokens.effects.shadows.elevation}` : '0';
      vars['--ktheme-glow-blur'] = tokens.effects.shadows.enabled ? `${tokens.effects.shadows.blur}px` : '0px';
      vars['--ktheme-glow-color'] = tokens.effects.shadows.enabled ? tokens.effects.shadows.color : '#000000';

      // Shimmer
      vars['--ktheme-shimmer-speed'] = tokens.effects.shimmer.enabled ? `${tokens.effects.shimmer.speed}s` : '0s';
      vars['--ktheme-shimmer-intensity'] = tokens.effects.shimmer.enabled ? `${tokens.effects.shimmer.intensity}` : '0';
      vars['--ktheme-shimmer-angle'] = tokens.effects.shimmer.enabled ? `${tokens.effects.shimmer.angle}deg` : '0deg';

      // Web Exporter domain build variables
      vars['--ktheme-effect-metallic-variant'] = String(tokens.effects.metallic.variant);
      vars['--ktheme-effect-metallic-base'] = tokens.effects.metallic.gradient.base;
      vars['--ktheme-effect-metallic-highlight'] = tokens.effects.metallic.gradient.highlight;
      vars['--ktheme-effect-metallic-shadow'] = tokens.effects.metallic.gradient.shadow;
      vars['--ktheme-effect-metallic-shimmer'] = tokens.effects.metallic.gradient.shimmer;
      vars['--ktheme-effect-metallic-intensity'] = String(tokens.effects.metallic.intensity);

      vars['--ktheme-effect-shimmer-speed'] = tokens.effects.shimmer.enabled ? `${tokens.effects.shimmer.speed}s` : '2s';
      vars['--ktheme-effect-shimmer-intensity'] = String(tokens.effects.shimmer.intensity);
      vars['--ktheme-effect-shimmer-angle'] = `${tokens.effects.shimmer.angle}deg`;
      vars['--ktheme-effect-shimmer-color'] = tokens.effects.metallic.gradient.shimmer;

      vars['--ktheme-effect-glass-blur'] = tokens.effects.blur.enabled ? `${tokens.effects.blur.radius}px` : '10px';
      vars['--ktheme-effect-glass-opacity'] = '0.8';
      vars['--ktheme-effect-glass-bg'] = tokens.color.surface;

      vars['--ktheme-effect-glow-color'] = tokens.effects.focusRing.color;
      vars['--ktheme-effect-glow-spread'] = `${tokens.effects.focusRing.width}px`;

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
    }

    if (resolvedOptions.includeCorners) {
      vars['--ktheme-corner-small'] = `${tokens.layout.corners.small}px`;
      vars['--ktheme-corner-medium'] = `${tokens.layout.corners.medium}px`;
      vars['--ktheme-corner-large'] = `${tokens.layout.corners.large}px`;
      vars['--ktheme-corner-xlarge'] = `${tokens.layout.corners.xlarge}px`;
    }

    const isMinimal = resolvedOptions.includeTypography === false &&
                      resolvedOptions.includeEffects === false &&
                      resolvedOptions.includeCorners === false;

    if (!isMinimal) {
      vars['--ktheme-adaptation-layout-density'] = String(tokens.layout.density);
      vars['--ktheme-adaptation-layout-corner-style'] = String(tokens.layout.cornerStyle);
      vars['--ktheme-adaptation-layout-spacing-scale'] = `${String(tokens.layout.spacingScale)}`;

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

