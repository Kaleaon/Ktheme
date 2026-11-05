# Universal layout standards v1

The versioned contract is [layouts.v1.json](../src/standards/layouts.v1.json), exported by the engine
as `LAYOUT_STANDARDS`, `getLayoutStandard` and `lcarsFrameGeometry`. It specifies application-owned
conventions shared by Ktheme, CleverFerret and the Cleverferret-design prototype. References such
as LCARS/Metro inspire these conventions; this is not an official specification of those systems.

Keep layout, palette and effect IDs independent. Existing presets may suggest defaults but changing
color must not silently overwrite a user's layout. Legacy `Lcars` maps to `sweep`, `Metro` to `tiles`,
and `Compose` to `compose`. Unknown persisted IDs should use the host's safe default. Preserve old
theme IDs during migration. Existing theme files remain compatible; this additive contract does
not change the meaning of schemaVersion 2 or require a layout selector in every host.

| ID       | Structure and character                        | Refinement requirements                                                        |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| compose  | MD3 panels, phone bar → wide rail              | Preserve navigation selection during live resize                               |
| terminal | Mono, boxed surfaces, 4-unit corners           | Key metadata at least 12 units; no mixed cover/panel radii                     |
| sweep    | Opposing LCARS frame and segmented rail        | Black reference field, unboxed readouts, filled/text controls and docks        |
| tiles    | Metro pivot and app bar, square accent tiles   | Lowercase navigation, preserved media case, quick actions bounded at 160       |
| glass    | Soft translucent panels and gloss              | Audit actual wash/filter/opacity composition and gradient interpolation        |
| rules    | Persistent rail, sharp corners, hairline rules | Word-safe responsive media titles, reduced tracking where width is constrained |
| press    | Serif content, quiet rows and rules            | Quiet solid actions, restrained weight, no player shadow                       |

Numbers use logical units: CSS pixels on web, dp/sp according to token purpose on Android.
The 720-unit wide breakpoint is a baseline for this family of application layouts; hosts may
adapt it to window size classes while preserving the navigation behavior. Artwork text belongs
to media content and must preserve identity; uppercase content headings are allowed in console,
terminal and deco layouts. Minimum 48-unit interaction targets apply to the clickable region,
not necessarily to decorative visual glyphs. Every icon action needs an accessible name.

## LCARS reference and variants

The reference is `sweep` with LCARS colors and Flat effects. Rail 76, bar 12, gap 4 and inner radius
18 derive outer elliptical radii 94 × 30. Both inner and outer centers coincide; calculate frame
offsets from these values. Do not approximate the frame using two unrelated rounded rectangles.
Titles and readouts sit in black space, labels align inside filled segments, and bars terminate
in a cap or a black gap. Reserve playback and feedback rows so they never cover content.

Other colors/effects remain available as LCARS-inspired variants and must be labeled accordingly.
Content pictograms and platform status bars are recorded deviations, not evidence of exact canon
compliance. This geometry is a portable application convention, not an official LCARS pixel grid.

## Accessibility and adoption gates

Normal text needs 4.5:1, large text and meaningful non-text graphics 3:1. Check sampled gradient
interiors as well as stops; use separate accessible UI brushes while preserving reference swatches.
For glass, composite the actual background washes, backdrop filters and panel alpha first. A
different wallpaper requires a new audit or an opaque text surface. Status must pair color with
an icon/text label. Respect reduced motion and keep media reading canvases free of decorative effects.

Consumers should exercise every screen at phone/wide widths, large text and keyboard/TalkBack
operation, verify title wrapping and target sizes, and verify that playback/feedback do not obscure
content. Compare against the versioned contract in CI; include the contract version in parity reports.
Use human review for visual character—passing geometry tests alone does not prove the design.
