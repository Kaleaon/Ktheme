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
  });

  it('falls back cleanly when input is partial or unknown', () => {
    const result = autoRedesign({
      appArchetype: 'unknown-archetype',
      targetAestheticFamily: 'unknown-family'
    });

    expect(result.theme.metadata.id).toBe('paper-ink');
    expect(result.report.baseSelection).toBe('fallback');
    expect(result.report.packsApplied).toEqual([]);
    expect(result.report.fallbackDecisions).toEqual(
      expect.arrayContaining([expect.stringContaining('Fell back to PaperInk preset')])
    );
    expect(result.report.validation.valid).toBe(true);
  });
});
