import { applyIconicPack, getIconicPackById, getIconicPacks } from './iconicPacks';

describe('iconic activation packs', () => {
  it('exposes the four curated activation packs', () => {
    expect(getIconicPacks().map(pack => pack.id).sort()).toEqual([
      'art-deco-pack',
      'art-nouveau-pack',
      'lcars-activation-pack',
      'windows-activation-pack'
    ]);
  });

  it('applies a requested variant and app archetype defaults', () => {
    const themed = applyIconicPack('art-nouveau-pack', {
      variant: 'dark',
      appArchetype: 'content'
    });

    expect(themed.metadata.id).toBe('aurora-glass-night');
    expect(themed.metadata.tags).toEqual(expect.arrayContaining(['iconic-pack', 'art-nouveau-pack', 'dark']));
    expect(themed.adaptation?.layout?.panelStyle).toBe('glass');
  });

  it('applies only expansion packs allowed by recipe', () => {
    const themed = applyIconicPack('windows-activation-pack', {
      expansionPacks: ['platform-pack', 'motion-pack', 'domain-pack']
    });

    expect(themed.metadata.tags).toEqual(expect.arrayContaining(['platform-pack', 'motion-pack']));
    expect(themed.metadata.tags).not.toContain('domain-pack');
  });

  it('provides direct lookup for a recipe', () => {
    const recipe = getIconicPackById('lcars-activation-pack');

    expect(recipe.basePresetId).toBe('lcars');
    expect(recipe.variantMatrix?.light).toBe('royal-silver');
  });
});
