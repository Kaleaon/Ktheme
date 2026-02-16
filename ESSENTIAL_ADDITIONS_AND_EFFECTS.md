# Ktheme Research: Essential Additions and Effects

This note captures practical additions that improve Ktheme's usability across product, design-system, and app teams.

## 1) Essential engine additions (implemented)

1. **Theme sets (curated bundles)**
   - Why: teams choose faster from meaningful groups than from long flat lists.
   - Implemented in `src/themes/sets.ts` with starter, metallic showcase, executive dark, creative studio, and readability bundles.

2. **Effect tokens for accessibility and depth**
   - Why: modern UI systems need focus visibility, subtle depth, and layered surfaces.
   - Implemented in `VisualEffects` (`src/core/types.ts`):
     - `focusRing`
     - `overlays`
     - `noise`

3. **Portable CSS generators for essential effects**
   - Why: consumers can apply effects consistently even outside framework-specific style systems.
   - Implemented in `src/effects/advanced.ts`:
     - `generateFocusRingCSS`
     - `generateOverlayCSS`
     - `generateNoiseTextureCSS`

4. **Layout and icon adaptation primitives**
   - Why: some themes (Frutiger Aero, Windows Phone, LCARS) require structural UI changes, not only color swaps.
   - Implemented in `src/core/types.ts`, `src/adaptation/apply.ts`, and `src/themes/adaptationPresets.ts`:
     - layout adaptation tokens
     - icon adaptation tokens
     - component override blocks
     - adaptation presets and CSS generation helpers

5. **State-layer colors**
   - Why: hover/pressed/focused/dragged layers are key for interactive systems.
   - Implemented in `ColorScheme.stateLayers`.

6. **Semantic role aliasing**
   - Why: many product systems think in semantic statuses, not only MD3 role names.
   - Implemented in `ColorScheme.semanticRoles` (`success`, `warning`, `info`, optional `critical` variants).

7. **Dynamic contrast guardrails**
   - Why: low-contrast pairings should be caught early.
   - Implemented in `ThemeEngine.validateTheme` with warnings for key contrast pairs below WCAG-oriented thresholds.

8. **Adaptive motion policy**
   - Why: respect reduced-motion preferences automatically.
   - Implemented via `ThemeEngine.resolveEffectsForRuntime` plus `animations.reducedMotionPolicy`.

9. **Density and corner tokens**
   - Why: complete theme systems need shape/spacing controls beyond color/effects.
   - Implemented in `Theme.tokens` with CSS variable generation in adaptation helpers.

## 2) Effect model guidance for Ktheme engine

- Keep expensive effects optional and composable.
- Prefer explicit per-effect configuration over implicit global toggles.
- Track effect intent in metadata/tags (e.g., `accessibility`, `high-contrast`, `immersive`).
- Consider server/UI runtime differences (e.g., fallbacks when blur and mask support are unavailable).

## 3) Practical usage pattern

- Pick a set from `ThemeSets`.
- Register all themes in the set.
- Optionally derive an adapted theme (`createAdaptedTheme`) for layout/icon paradigms.
- Generate runtime CSS with `generateThemeAdaptationCSS`.
- Resolve effects for user motion preferences with `resolveEffectsForRuntime`.
