import {
  BestPracticeStandards,
  ExpansionPackPlans,
  KthemeUseCasePlans,
  RecognizableUIDesigns,
  ThemeFamilyPlans,
  createThemeFromFamily
} from './strategy';

describe('Ktheme strategy planning assets', () => {
  it('contains the full best-practices and UI design catalogs', () => {
    expect(BestPracticeStandards).toHaveLength(20);
    expect(RecognizableUIDesigns).toHaveLength(20);
  });

  it('contains roadmap family and expansion definitions', () => {
    expect(ThemeFamilyPlans).toHaveLength(10);
    expect(ExpansionPackPlans).toHaveLength(10);
    expect(KthemeUseCasePlans.length).toBeGreaterThanOrEqual(5);
  });

  it('generates a concept theme from a family id', () => {
    const theme = createThemeFromFamily('neo-minimal');

    expect(theme.metadata.id).toBe('concept-neo-minimal');
    expect(theme.metadata.tags).toContain('concept');
    expect(theme.metadata.description).toContain('Neo-Minimal');
    expect(theme.colorScheme.background).toBe('#FAFAF9');
    expect(theme.effects?.noise?.enabled).toBe(true);
    expect(theme.adaptation?.layout?.density).toBe('spacious');
  });

  it('generates distinct family traits per strategy id', () => {
    const brutalist = createThemeFromFamily('brutalist-ui');
    const glass = createThemeFromFamily('glass-frost');
    const luxury = createThemeFromFamily('luxury-dark');

    expect(brutalist.adaptation?.layout?.cornerStyle).toBe('sharp');
    expect(brutalist.typography?.fontFamily.toLowerCase()).toContain('mono');

    expect(glass.adaptation?.layout?.panelStyle).toBe('glass');
    expect(glass.effects?.blur?.enabled).toBe(true);

    expect(luxury.darkMode).toBe(true);
    expect(luxury.effects?.metallic?.enabled).toBe(true);
    expect(luxury.colorScheme.background).toBe('#080808');
  });

  it('throws for unknown families', () => {
    expect(() => createThemeFromFamily('missing-family')).toThrow('Unknown theme family: missing-family');
  });
});
