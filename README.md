# Ktheme Design System

Ktheme is an **open-source theme engine and design API** for creating, managing, and applying rich application themes. The hallmark of the system is its **metallic effects** language (gold, silver, rose-gold, bronze, copper, platinum, titanium, chrome, cobalt) layered on top of a Material Design 3 color scheme — plus a curated catalog of **24 preset themes** spanning elegant metallic dark themes, an iconic library (LCARS, Frutiger Aero, Windows Phone Metro, Art Deco, Art Nouveau), and product-context themes (Solarpunk Civic, Calm Clinical, Neo-Noir Neon, Aurora Glass Night, Ink Terminal Modern).

Ktheme is **not a single product UI** — it's a *theming substrate* that other apps consume. Themes ship as portable JSON, get exported to CSS variables / Tailwind / Compose / SwiftUI / Flutter, and adapt apps' layout, icon, and component shape — not just their colors.

## Source

- **Repository:** [Kaleaon/Ktheme](https://github.com/Kaleaon/Ktheme) — `main` branch
- **Inspiration / sibling project:** [Kaleaon/CleverFerret](https://github.com/Kaleaon/CleverFerret) (the metallic theming language originated here)
- **Engine entry:** `src/index.ts`, `src/core/ThemeEngine.ts`
- **Preset catalog:** `src/themes/presets.ts`, `themes/examples/*.json` (24 JSON files)
- **Effects:** `src/effects/metallic.ts`, `src/effects/advanced.ts`
- **Adaptation primitives:** `src/adaptation/apply.ts`, `src/themes/adaptationPresets.ts`
- **Theme Creator app:** `theme-creator/` (Vite + React + TS)
- **Kotlin plugin:** `kotlin-plugin/`

## Index

- `colors_and_type.css` — semantic CSS variables for the Ktheme MD3 token system, plus Theme Creator's app shell tokens, plus active-theme defaults.
- `themes/examples/*.json` — full preset catalog (24 themes), copied verbatim from the repo.
- `themes/examples/iconic-previews.html` — original iconic-themes preview gallery.
- `assets/` — logos and brand marks for the design system.
- `preview/` — registered cards visible in the Design System tab.
- `ui_kits/theme-creator/` — interactive recreation of the Theme Creator app (the canonical Ktheme product surface).
- `ui_kits/preset-gallery/` — gallery view recreating the iconic-previews.html and showing all 24 presets.
- `SKILL.md` — agent skill manifest.

## Products represented

Ktheme has **two surfaces** that live in this repo:

1. **Theme Creator** — a web app under `theme-creator/`. Vite + React + TypeScript. Sidebar with Presets / Customizer / AI / Bluesky tabs, a left customizer panel, and a right live-preview pane. Built dark by default with an indigo accent (`#818cf8`). This is the primary visual product.
2. **Iconic Previews** — a static HTML gallery (`themes/examples/iconic-previews.html`) that demonstrates LCARS, Metro, and Frutiger Aero rules side-by-side.

The engine also has a **Kotlin plugin** for Android/JVM consumers, but it has no UI of its own.

## CONTENT FUNDAMENTALS

Ktheme's voice is the voice of an **open-source library README** — declarative, technical, and slightly enthusiastic without being marketing-y. The README and inline docs use sentence-case headings prefixed with **emoji glyphs** (🎨 Overview, 🚀 Installation, 🎯 Features, ✨ Metallic Effects). Section headings are short, two or three words, often a noun phrase.

**Pronouns and stance:** mostly imperative or third-person about the library itself ("Ktheme provides…", "Use curated sets to bootstrap…"). The README addresses the reader as "you" only sparingly. Code comes first; prose explains the code.

**Casing:** Title Case for theme names ("Navy Gold", "Frutiger Aero", "Calm Clinical"), kebab-case for theme IDs (`navy-gold`, `art-nouveau-pack`), camelCase for API symbols (`createThemeEngine`, `setActiveTheme`, `MetallicVariant.GOLD`), CONSTANT_CASE for enum members (`GOLD_ROYAL_BLUE`, `ROSE_GOLD`).

**Tone examples (verbatim from the repo):**
- "An open-source theme engine for creating and managing beautiful application themes"
- "Beautiful metallic gradients and shimmer effects (10 variants)"
- "Validation warnings for low-contrast color pairs"
- "Use curated sets to quickly bootstrap the right style direction"
- "Keep expensive effects optional and composable."
- "LCARS UI rules: keep rail/sweep geometry and centered rail labels; vary palette by era"

**Tag vocabulary** in theme metadata is terse and lowercase: `metallic`, `elegant`, `dark`, `nature`, `warm`, `glassy`, `nostalgia`, `iconic`, `geometric`, `luxury`, `high-contrast`, `flat`, `console`, `sci-fi`. Use these when authoring new themes.

**Theme descriptions** are one-liners, evocative but concrete: *"Elegant navy background with luxurious gold metallic accents"*, *"Glossy glassy sky-and-nature palette inspired by late 90s/early 2000s UI"*, *"Geometric symmetry, stepped motifs, and premium gold-black-ivory contrast"*. Pattern: **adjective adjective noun + with/and + accent description**.

**Emoji** are used heavily as section glyphs in the README and as bullet markers (✨ 🎭 ♿ 🌈 🧠 📦 🔍 🎨 🏗️ 🔧 📱 🧩 🚀). They are *not* used in product UI copy, theme names, or component labels — only in docs.

**Aesthetic rulesets** are a documented voice convention. Each iconic theme gets a one-sentence rule that names what to keep constant and what to vary, e.g. *"LCARS format rule: keep rail/sweep geometry and centered rail labels; vary palette by era."* This is a pattern to follow when adding new iconic themes.

## VISUAL FOUNDATIONS

**Identity.** Ktheme has no single "brand color" — it is a *meta-system* that hosts many palettes. Its baseline product chrome (Theme Creator app) is **dark slate** (`#0f1117` background, `#1a1c25` surface) with an **indigo accent** (`#818cf8`). The marketing/preset-list voice in the README leans into the "metallic accents on rich dark grounds" hero pairings — **Navy + Gold**, **Emerald + Silver**, **Rose Gold + Burgundy**.

**Color system.** All themes follow Material Design 3 roles: `primary / onPrimary / primaryContainer / onPrimaryContainer`, `secondary / onSecondary / …`, `tertiary`, `error`, `background / onBackground`, `surface / onSurface`, `surfaceVariant / onSurfaceVariant`, `outline / outlineVariant`, plus inverse triplet (`inverseSurface`, `inverseOnSurface`, `inversePrimary`) and `scrim`. Optional extensions: `stateLayers` (hover/pressed/focused/dragged) and `semanticRoles` (success/warning/info/critical).

**Type.** No webfont is bundled. The defaults are stack-based — `system-ui, -apple-system, sans-serif` for body, with theme-specific overrides (Art Deco specifies *"Futura", "Avenir Next", "Arial", sans-serif*). The Theme Creator app loads **Inter** as its primary UI font and **JetBrains Mono / Fira Code** for code blocks and hex values. Sizes follow the engine's small/medium/large/xlarge scale (12 / 16 / 20 / 28 px default; Art Deco escalates to 12 / 16 / 22 / 34). Weights: 300 light / 400 regular / 500 medium / 700 bold; Art Deco bumps to 600/800. Line height is 1.4–1.5; letter-spacing is 0 except for iconic themes (Art Deco 0.35, LCARS uses pronounced letter-spacing on bars, Metro uses uppercase tile labels).

**Spacing & shape.** Engine tokens: `density` ∈ `compact | comfortable | spacious`, `spacingScale` 0.92–1.25, `cornerStyle` ∈ `sharp | rounded | pill`. Density mapping: compact ≈ 0.92, spacious ≈ 1.25. Theme Creator's chrome uses `--radius-sm: 6px / --radius: 8px / --radius-lg: 12px` and a 220px sidebar.

**Backgrounds.** Most themes use **flat solid backgrounds** at the lowest layer; the iconic gradient themes (Frutiger Aero, Solarpunk Civic, Aurora Glass Night) define an explicit gradient with stops at 0 / 0.58 / 1.0 and a fixed angle (typically 135deg). No imagery, no full-bleed photography, no hand illustrations — Ktheme is purely tokenized chrome. Optional `overlays` add a tinted color with a blend-mode (typically `screen` or `soft-light`) for atmosphere; optional `noise` produces a subtle grain via repeating radial-gradient dots.

**Effects (the brand).**
- **Metallic gradient** (the signature): a 5-stop linear-gradient `shadow → base → highlight → base → shadow` at 135deg by default. 10 variants (Silver, Gold, Gold-Royal-Blue, Bronze, Copper, Platinum, Rose Gold, Titanium, Chrome, Cobalt). Each variant has `base / highlight / shadow / shimmer` colors.
- **Shimmer**: an animated 3-stop gradient sliding `-200% → 200%` across the element, controlled by `speed` (s) and `intensity` (0–1) and `angle` (deg). Default 2–4s linear infinite. Auto-disabled under `prefers-reduced-motion`.
- **Shadows**: configured per theme via `elevation` + `blur` + `color`. Two stacked shadows (ambient at `0 Y B rgba(0,0,0,0.12)` and a directional one with the theme color). Elevations seen in the catalog: 1 (Paper&Ink, Aero), 2 (Rose Gold), 3 (Emerald, Metro), 4 (Navy Gold, LCARS), 6 (Art Deco).
- **Glassmorphism**: `backdrop-filter: blur(R) saturate(180%)` + tinted `background-color` + `opacity ~0.8`. Used by Frutiger Aero, Aurora Glass Night.
- **Glow**: outer + inner box-shadow at the same color (`0 0 10·I 5·I color, 0 0 15·I color inset`) — used for neon themes.
- **Gradient borders**: linear-gradient `border-box` clipped with mask-composite for hairline rainbow/metallic edges.
- **Noise overlay**: `radial-gradient(rgba(255,255,255,O) 1px, transparent 1px)` at a configurable scale.

**Animation.** Built-in keyframes: `fadeIn` (opacity), `slideIn` (translate from any side), `pulse` (expanding shadow ring), `ripple` (scale 0→4 + opacity 1→0), `shimmer-move` (background-position pan). Default duration **300ms**, easing `ease` or `ease-in-out`. Reduced-motion preferences disable shimmer and shorten/disable transitions automatically.

**Hover/press states.** Theme Creator's reference: hover swaps `--bg-hover` (`#2a2d3a`) and shifts text from `--text-muted` to `--text`. Active = `transform: scale(0.97)` for 100ms. Focus = `outline: 2px solid var(--accent); outline-offset: 2px` (this is the engine's `focusRing` token — also exposed as `generateFocusRingCSS(color, width=2, offset=2)`). Theme-level state layers (`stateLayers.hover/pressed/focused/dragged`) tint surfaces with a low-opacity color overlay.

**Borders & outlines.** MD3-style: `outline` is the primary stroke (mid-tone), `outlineVariant` is the soft hairline (10–15% contrast). Inputs and cards lean on `outlineVariant`; focus moves to `outline` or accent. Iconic themes break this — Art Deco draws a 1px gold rule at 45% alpha; LCARS uses no borders, only filled bars.

**Cards / panels.** In Theme Creator: surface tint (`--bg-elevated #22252f`), 1px `--border #2e3140`, `--radius 8px`, no shadow at rest, hover lifts to `--border-light #3b3f50`. The `panelStyle` adaptation token is one of `flat | glass | elevated`.

**Transparency & blur.** Used selectively: glassmorphism panels in Aero/Aurora, a `scrim` color (always `#000000`) for modal backdrops, accent-muted backgrounds at 20% alpha for selected states (`--accent-muted: #4f46e520`).

**Imagery.** None native. Themes are pure tokens.

## ICONOGRAPHY

Ktheme treats icons as a *theme-adapted* layer, not a fixed asset library. The `IconAdaptation` token system in `src/core/types.ts` configures `family ∈ material | fluent | sf | line | duotone | custom`, `style ∈ line | filled | duotone`, plus `sizeScale`, `strokeWidth`, and `cornerStyle`.

In the Theme Creator app, icons come from **Lucide** (referenced by name throughout the React components — Sparkles, Loader2, Wand2, Save, etc.). We use **Lucide via CDN** in our recreations (`lucide@latest`) to match.

The `iconic-previews.html` reference uses **emoji-free** layouts — no glyph icons at all, only typographic labels and geometric shapes (LCARS bars, Metro tiles). This is a strong rule of the system: **emoji are not used in product UI**, only in README documentation.

**Substitutions flagged:**
- Theme Creator codebase calls `lucide-react`. We render the same icons via Lucide CDN — no visual substitution.
- No webfonts ship in the repo. Body type defaults to `system-ui`. Theme Creator implies Inter via CSS but the file isn't bundled — we load Inter from Google Fonts and JetBrains Mono for code, both as substitution flags.

## Logos & marks

Ktheme has no committed logo asset in the repo. The README header uses an emoji palette (🎨) and the project name in plain text. We've authored a clean wordmark for the design system in `assets/ktheme-mark.svg` and a metallic-gold variant in `assets/ktheme-mark-gold.svg` — flagged as derived, not official.

---

## ⚠️ Substitutions & open questions for the user

- **No official logo / brand mark** in the repo. We made a wordmark; please replace if you have an official one.
- **No font files** in the repo. We use **Inter** + **JetBrains Mono** from Google Fonts as the closest match to the Theme Creator's stated stack. Please ship official `.woff2` if you have a preferred specific font.
- The **CleverFerret** sibling project may contain richer visual context (icon set, iconography reference) — let us know if you want it folded in.
- Ktheme is a *meta-system*. We selected **Navy Gold** as the canonical demo theme for the UI kit's chrome where neutral was needed; tell us if you want a different default.
