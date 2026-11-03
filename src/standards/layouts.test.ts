import Ajv2020 from 'ajv/dist/2020';
import schema from './layouts.schema.json';
import { getLayoutStandard, lcarsFrameGeometry, LAYOUT_STANDARDS, resolveLayoutStandard } from './layouts';

describe('Universal layout standards v1', () => {
  const validate = new Ajv2020({ strict: true }).compile(schema);
  it('validates the portable contract and rejects missing layouts, mismatched IDs, and undersized targets', () => {
    expect(validate(LAYOUT_STANDARDS)).toBe(true);
    const invalid = JSON.parse(JSON.stringify(LAYOUT_STANDARDS));
    delete invalid.layouts.press;
    expect(validate(invalid)).toBe(false);
    const mismatched = JSON.parse(JSON.stringify(LAYOUT_STANDARDS));
    mismatched.layouts.sweep.id = 'compose';
    expect(validate(mismatched)).toBe(false);
    const inaccessible = JSON.parse(JSON.stringify(LAYOUT_STANDARDS));
    inaccessible.common.minimumTarget = 24;
    expect(validate(inaccessible)).toBe(false);
  });
  it('registers seven independent layouts and accessible interaction requirements', () => {
    expect(Object.keys(LAYOUT_STANDARDS.layouts)).toEqual(['compose', 'terminal', 'sweep', 'tiles', 'glass', 'rules', 'press']);
    expect(LAYOUT_STANDARDS.common.minimumTarget).toBeGreaterThanOrEqual(48);
    expect(LAYOUT_STANDARDS.common.bodyContrast).toBeGreaterThanOrEqual(4.5);
    expect(LAYOUT_STANDARDS.common.themeLayers).toEqual(['layout', 'palette', 'effect']);
  });
  it('gives both opposing LCARS sweeps coincident inner/outer curve centers', () => {
    const f = lcarsFrameGeometry();
    expect(f.outerX).toBe(f.rail + f.inner);
    expect(f.headerBottom - f.outerY).toBe(f.headerBottom - f.bar - f.inner);
    expect(f.contentTop + f.outerY).toBe(f.shellTop + f.inner);
    expect(f.contentTop - f.headerBottom).toBe(f.gap);
    expect(f.field).toBe('#000000');
  });
  it('preserves media identity in Metro and consistent corners in Terminal', () => {
    expect(getLayoutStandard('tiles').typography.contentCase).toBe('preserve');
    expect(getLayoutStandard('tiles').typography.navigationCase).toBe('lowercase');
    expect(getLayoutStandard('tiles').maximumQuickActionHeight).toBe(160);
    expect(Object.values(getLayoutStandard('terminal').corners).every(radius => radius === 4)).toBe(true);
  });
  it('documents the flat LCARS reference and quieter editorial actions', () => {
    expect(getLayoutStandard('sweep').referenceEffect).toBe('flat');
    expect(getLayoutStandard('sweep').player).toBe('docked-text');
    expect(getLayoutStandard('press').actions).toBe('quiet-solid');
    expect(getLayoutStandard('press').shadow).toBe('none');
  });
  it('resolves layout standards correctly based on theme metadata or layout ID string', () => {
    expect(resolveLayoutStandard('terminal').id).toBe('terminal');
    expect(resolveLayoutStandard('lcars-2400').id).toBe('sweep');
    expect(resolveLayoutStandard('metro-lumia').id).toBe('tiles');
    expect(resolveLayoutStandard('frutiger-aero').id).toBe('glass');
    expect(resolveLayoutStandard({ metadata: { id: 'press-paper' } }).id).toBe('press');
    expect(resolveLayoutStandard(null).id).toBe('compose');
  });
});
