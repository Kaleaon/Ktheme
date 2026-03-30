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
    const iconicActivation = ThemeSets.iconicActivation;
    const creative = ThemeSets.creativeStudio;
    const nextWave = ThemeSets.nextWave;

    expect(iconic.themes.map(theme => theme.metadata.id)).toEqual(
      expect.arrayContaining(['lcars', 'windows-phone-metro'])
    );

    expect(iconicActivation.themes.map(theme => theme.metadata.id)).toEqual(
      expect.arrayContaining(['windows-phone-metro', 'lcars', 'frutiger-aero', 'neo-noir-neon'])
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

  it('locks preset metadata timestamps to stable release values', () => {
    const metadata = Object.values(PresetThemes)
      .map(theme => ({
        id: theme.metadata.id,
        createdAt: theme.metadata.createdAt,
        updatedAt: theme.metadata.updatedAt
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    expect(metadata).toMatchInlineSnapshot(`
[
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "art-deco",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "art-nouveau",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "aurora-glass-night",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "burgundy-rose-gold",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "calm-clinical",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "charcoal-champagne",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "deep-purple-platinum",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "emerald-silver",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "forest-copper",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "frutiger-aero",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "ink-terminal-modern",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "lcars",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "midnight-amber",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "navy-gold",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "neo-noir-neon",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "obsidian-crimson",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "paper-ink",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "rose-gold",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "royal-bronze",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "royal-silver",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "slate-cyan",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "slate-gunmetal",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "solarpunk-civic",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
      Object {
        "createdAt": "2026-03-30T00:00:00.000Z",
        "id": "windows-phone-metro",
        "updatedAt": "2026-03-30T00:00:00.000Z",
      },
]
`);
  });

});
