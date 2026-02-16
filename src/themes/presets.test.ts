import { ThemeEngine } from '../core/ThemeEngine';
import { FrutigerAeroTheme, LCARSTheme, PresetThemes, WindowsPhoneMetroTheme } from './presets';
import { ThemeSets } from './sets';

describe('preset themes coverage', () => {
  it('includes LCARS and Windows Phone Metro in exported presets', () => {
    expect(PresetThemes.LCARS.metadata.id).toBe('lcars');
    expect(PresetThemes.WindowsPhoneMetro.metadata.id).toBe('windows-phone-metro');
    expect(PresetThemes.FrutigerAero.metadata.id).toBe('frutiger-aero');
  });

  it('keeps LCARS and Windows Phone Metro operational for runtime validation', () => {
    const engine = new ThemeEngine();

    expect(engine.validateTheme(LCARSTheme).valid).toBe(true);
    expect(engine.validateTheme(WindowsPhoneMetroTheme).valid).toBe(true);
    expect(engine.validateTheme(FrutigerAeroTheme).valid).toBe(true);
    expect(LCARSTheme.adaptation?.layout?.navigationStyle).toBe('rail');
    expect(WindowsPhoneMetroTheme.adaptation?.layout?.navigationStyle).toBe('pivot');
    expect(FrutigerAeroTheme.adaptation?.layout?.panelStyle).toBe('glass');
  });

  it('exposes LCARS and Metro themes in curated sets for use-case coverage', () => {
    const iconic = ThemeSets.iconicInterfaces;
    const creative = ThemeSets.creativeStudio;

    expect(iconic.themes.map(theme => theme.metadata.id)).toEqual(
      expect.arrayContaining(['lcars', 'windows-phone-metro'])
    );
    expect(creative.themes.map(theme => theme.metadata.id)).toContain('frutiger-aero');
  });
});
