import { autoRedesign } from './autoRedesign';

describe('autoRedesign', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('produces deterministic output for the same input', () => {
    const input = {
      appArchetype: 'chat',
      targetAestheticFamily: 'lcars',
      constraints: {
        mode: 'dark' as const,
        minimumContrast: 4.5,
        reducedMotion: true
      }
    };

    const first = autoRedesign(input);
    const second = autoRedesign(input);

    expect(second).toEqual(first);
    expect(first.report.selectedFamily).toBe('lcars');
    expect(first.report.baseSelection).toBe('preset');
    expect(first.report.packsApplied).toEqual(['ai-ui-pack', 'motion-pack']);
    expect(first.report.assistiveCompliance.passed).toBe(true);
    expect(first.report.assistiveCompliance.missingFields).toEqual([]);
  });

  it('falls back cleanly when input is partial or unknown', () => {
    const result = autoRedesign({
      appArchetype: 'unknown-archetype',
      targetAestheticFamily: 'unknown-family'
    });

    expect(result.theme?.metadata.id).toBe('paper-ink');
    expect(result.report.baseSelection).toBe('fallback');
    expect(result.report.packsApplied).toEqual([]);
    expect(result.report.fallbackDecisions).toEqual(
      expect.arrayContaining([expect.stringContaining('Fell back to PaperInk preset')])
    );
    expect(result.report.validation.valid).toBe(true);
    expect(result.report.assistiveCompliance.passed).toBe(true);
  });

  it('returns assistive-compliant themes for all default archetypes', () => {
    const archetypes = ['dashboard', 'chat', 'storefront'];

    archetypes.forEach(archetype => {
      const result = autoRedesign({ appArchetype: archetype });

      expect(result.error).toBeUndefined();
      expect(result.theme).toBeDefined();
      expect(result.report.assistiveCompliance.passed).toBe(true);
      expect(result.report.assistiveCompliance.missingFields).toEqual([]);
      expect(result.theme?.accessibility?.enabled).toBe(true);
      expect(result.theme?.accessibility?.interaction?.minimumTargetSize).toBeGreaterThanOrEqual(44);
      expect(result.theme?.adaptation?.layout?.navigationStyle).toBeDefined();
      expect(result.theme?.effects?.focusRing?.enabled).toBe(true);
    });
  });

  it('returns a structured assistive compliance error when constraints are impossible', () => {
    const result = autoRedesign({
      appArchetype: 'dashboard',
      constraints: {
        minimumTargetSize: 20
      }
    });

    expect(result.theme).toBeUndefined();
    expect(result.error).toEqual(
      expect.objectContaining({
        code: 'assistive-compliance-failed'
      })
    );
    expect(result.report.assistiveCompliance.passed).toBe(false);
    expect(result.report.assistiveCompliance.missingFields).toEqual(
      expect.arrayContaining(['constraints.minimumTargetSize (must be >= 24)'])
    );
  });
});
