import { cloneTheme } from './clone';
import { PaperInkTheme, NavyGoldTheme } from '../themes/presets';

describe('cloneTheme', () => {
  it('should create a deep clone of a simple object and maintain reference isolation', () => {
    const original = { a: 1, b: { c: 2 }, d: [3, 4, 5] };
    const cloned = cloneTheme(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.d).not.toBe(original.d);

    // Mutate cloned object and verify original remains untouched
    cloned.a = 99;
    cloned.b.c = 88;
    cloned.d.push(6);

    expect(original.a).toBe(1);
    expect(original.b.c).toBe(2);
    expect(original.d).toEqual([3, 4, 5]);
  });

  it('should handle undefined optional fields properly without dropping or throwing', () => {
    interface TestType {
      req: string;
      opt?: string;
      nested?: { value?: number };
    }

    const obj: TestType = { req: 'hello', opt: undefined, nested: { value: undefined } };
    const cloned = cloneTheme(obj);

    expect(cloned).toEqual(obj);
    expect('opt' in cloned).toBe(true);
    expect(cloned.opt).toBeUndefined();
    expect(cloned.nested?.value).toBeUndefined();
  });

  it('should deep clone a full theme preset without mutating original theme', () => {
    const theme = PaperInkTheme;
    const clonedTheme = cloneTheme(theme);

    expect(clonedTheme).toEqual(theme);
    expect(clonedTheme).not.toBe(theme);
    expect(clonedTheme.metadata).not.toBe(theme.metadata);
    expect(clonedTheme.colorScheme).not.toBe(theme.colorScheme);

    // Mutate nested properties in clonedTheme
    clonedTheme.metadata.name = 'Modified Paper & Ink';
    clonedTheme.metadata.tags.push('new-tag');
    clonedTheme.colorScheme.primary = '#123456';

    expect(theme.metadata.name).toBe('Paper & Ink');
    expect(theme.metadata.tags).not.toContain('new-tag');
    expect(theme.colorScheme.primary).not.toBe('#123456');
  });

  it('should preserve theme structure when cloning Navy Gold preset', () => {
    const theme = NavyGoldTheme;
    const cloned = cloneTheme(theme);

    expect(cloned.metadata.id).toBe('navy-gold');
    expect(cloned.colorScheme.primary).toBe(theme.colorScheme.primary);
    expect(cloned.effects).toEqual(theme.effects);
    expect(cloned.effects).not.toBe(theme.effects);
  });
});
