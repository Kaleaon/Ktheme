# Iconic Activation Packs

Use Iconic Activation Packs when you want one-click theming that combines:

- a **base preset**,
- a **variant** (`light`, `dark`, `high-contrast`),
- a list of **allowed expansion packs**,
- and **adaptation defaults** tuned to an app archetype.

## Available packs

- `windows-activation-pack`
- `lcars-activation-pack`
- `art-nouveau-pack`
- `art-deco-pack`

## Quick usage

```ts
import { applyIconicPack } from '@ktheme/engine';

const theme = applyIconicPack('windows-activation-pack', {
  variant: 'dark',
  appArchetype: 'dashboard',
  expansionPacks: ['platform-pack', 'motion-pack']
});
```

## One-click activation by app type

### Dashboard apps

```ts
const dashboardTheme = applyIconicPack('lcars-activation-pack', {
  variant: 'high-contrast',
  appArchetype: 'dashboard',
  expansionPacks: ['data-viz-pack', 'accessibility-pack']
});
```

### Consumer apps

```ts
const consumerTheme = applyIconicPack('art-nouveau-pack', {
  variant: 'light',
  appArchetype: 'consumer',
  expansionPacks: ['seasonal-pack', 'motion-pack']
});
```

### Developer tools

```ts
const developerTheme = applyIconicPack('lcars-activation-pack', {
  variant: 'dark',
  appArchetype: 'developer',
  expansionPacks: ['ai-ui-pack', 'platform-pack']
});
```

### Content / docs products

```ts
const contentTheme = applyIconicPack('art-deco-pack', {
  variant: 'light',
  appArchetype: 'content',
  expansionPacks: ['email-docs-pack'] // filtered out if not allowed by the selected pack
});
```

## Discovery APIs

```ts
import { getIconicPacks, getIconicPackById } from '@ktheme/engine';

const packs = getIconicPacks();
const artDeco = getIconicPackById('art-deco-pack');
```
