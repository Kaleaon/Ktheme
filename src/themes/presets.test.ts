import { ThemeEngine } from '../core/ThemeEngine';
import {
  AuroraGlassNightTheme,
  CalmClinicalTheme,
  FrutigerAeroTheme,
  InkTerminalModernTheme,
  LCARSTheme,
  NeoNoirNeonTheme,
  PresetThemes,
  SolarpunkCivicTheme,
  WindowsPhoneMetroTheme
} from './presets';
import { ThemeSets } from './sets';

describe('preset themes coverage', () => {
  it('includes iconic and next-wave presets in exported map', () => {
    expect(PresetThemes.LCARS.metadata.id).toBe('lcars');
    expect(PresetThemes.WindowsPhoneMetro.metadata.id).toBe('windows-phone-metro');
    expect(PresetThemes.FrutigerAero.metadata.id).toBe('frutiger-aero');
    expect(PresetThemes.SolarpunkCivic.metadata.id).toBe('solarpunk-civic');
    expect(PresetThemes.NeoNoirNeon.metadata.id).toBe('neo-noir-neon');
    expect(PresetThemes.CalmClinical.metadata.id).toBe('calm-clinical');
    expect(PresetThemes.InkTerminalModern.metadata.id).toBe('ink-terminal-modern');
    expect(PresetThemes.AuroraGlassNight.metadata.id).toBe('aurora-glass-night');
  });

  it('keeps iconic and next-wave themes operational for runtime validation', () => {
    const engine = new ThemeEngine();

    expect(engine.validateTheme(LCARSTheme).valid).toBe(true);
    expect(engine.validateTheme(WindowsPhoneMetroTheme).valid).toBe(true);
    expect(engine.validateTheme(FrutigerAeroTheme).valid).toBe(true);
    expect(engine.validateTheme(SolarpunkCivicTheme).valid).toBe(true);
    expect(engine.validateTheme(NeoNoirNeonTheme).valid).toBe(true);
    expect(engine.validateTheme(CalmClinicalTheme).valid).toBe(true);
    expect(engine.validateTheme(InkTerminalModernTheme).valid).toBe(true);
    expect(engine.validateTheme(AuroraGlassNightTheme).valid).toBe(true);
    expect(LCARSTheme.adaptation?.layout?.navigationStyle).toBe('rail');
    expect(WindowsPhoneMetroTheme.adaptation?.layout?.navigationStyle).toBe('pivot');
    expect(FrutigerAeroTheme.adaptation?.layout?.panelStyle).toBe('glass');
    expect(InkTerminalModernTheme.typography?.fontFamily.toLowerCase()).toContain('mono');
  });

  it('exposes iconic and next-wave themes in curated sets for use-case coverage', () => {
    const iconic = ThemeSets.iconicInterfaces;
    const creative = ThemeSets.creativeStudio;
    const nextWave = ThemeSets.nextWave;

    expect(iconic.themes.map(theme => theme.metadata.id)).toEqual(
      expect.arrayContaining(['lcars', 'windows-phone-metro'])
    );
    expect(creative.themes.map(theme => theme.metadata.id)).toContain('frutiger-aero');
    expect(nextWave.themes.map(theme => theme.metadata.id)).toEqual(
      expect.arrayContaining([
        'solarpunk-civic',
        'neo-noir-neon',
        'calm-clinical',
        'ink-terminal-modern',
        'aurora-glass-night'
      ])
    );
  });
});
