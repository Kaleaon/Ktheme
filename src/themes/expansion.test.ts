import { PaperInkTheme } from './presets';
import { ExpansionPackPlans } from './strategy';
import {
  ExpansionPackImplementations,
  applyAllExpansionPacks,
  applyExpansionPack
} from './expansion';

describe('expansion pack implementations', () => {
  it('implements every expansion plan from strategy', () => {
    const planIds = ExpansionPackPlans.map(item => item.id).sort();
    const implIds = ExpansionPackImplementations.map(item => item.id).sort();

    expect(implIds).toEqual(planIds);
  });

  it('applies a single expansion pack without mutating source theme', () => {
    const source = JSON.parse(JSON.stringify(PaperInkTheme));
    const expanded = applyExpansionPack(PaperInkTheme, 'accessibility-pack');

    expect(expanded.metadata.tags).toContain('expansion-pack');
    expect(expanded.metadata.tags).toContain('accessibility-pack');
    expect(expanded.metadata.name).toContain('A11y');
    expect(expanded.effects?.focusRing?.enabled).toBe(true);

    expect(PaperInkTheme).toEqual(source);
  });

  it('applies all expansion packs and returns a keyed map', () => {
    const all = applyAllExpansionPacks(PaperInkTheme);

    expect(Object.keys(all)).toHaveLength(ExpansionPackPlans.length);
    expect(all['motion-pack'].effects?.animations?.reducedMotionPolicy).toBe('reduce');
    expect(all['platform-pack'].adaptation?.assets?.fontFamilyOverride).toContain('Roboto');
  });


  it('does not duplicate pack label when the same pack is applied repeatedly', () => {
    const once = applyExpansionPack(PaperInkTheme, 'motion-pack');
    const twice = applyExpansionPack(once, 'motion-pack');

    expect(once.metadata.name).toMatch(/ · Motion$/);
    expect(twice.metadata.name.match(/ · Motion/g)?.length).toBe(1);
  });

  it('throws for unknown expansion packs', () => {
    expect(() => applyExpansionPack(PaperInkTheme, 'missing-pack')).toThrow('Unknown expansion pack: missing-pack');
  });
});
