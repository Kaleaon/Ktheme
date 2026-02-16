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
  });

  it('throws for unknown families', () => {
    expect(() => createThemeFromFamily('missing-family')).toThrow('Unknown theme family: missing-family');
  });
});
