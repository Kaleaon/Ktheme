# Ktheme - Advanced Theming and Design API

<div align="center">

**An open-source theme engine for creating and managing beautiful application themes**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

</div>

## 🎨 Overview

Ktheme is a powerful, flexible theming engine inspired by the advanced theming system from [CleverFerret](https://github.com/Kaleaon/CleverFerret). It provides a comprehensive solution for creating, managing, and applying themes to your applications with support for:

- ✨ **Metallic Effects** - Beautiful metallic gradients and shimmer effects (10 variants)
- 🎭 **Advanced Visual Effects** - Shadows, gradients, blur, animations, and transitions
- ♿ **Dynamic Contrast Guardrails** - Validation warnings for low-contrast color pairs
- 🌈 **Rich Color Schemes** - Full Material Design 3 color system support
- 🧠 **Semantic Role Colors** - Success/warning/info aliases beyond MD3 role names
- 📦 **Theme Import/Export** - Easy JSON-based theme sharing
- 🔍 **Theme Discovery** - Search and filter themes by tags and names
- 🎨 **Theme Creator** - Web-based tool for creating custom themes
- 🏗️ **Layout + Icon Adaptation** - Apply theme-specific layout/icon/component overrides
- 🔧 **Kotlin Plugin** - Native Kotlin/JVM support for Android and backend applications
- 📱 **17 Preset Themes** - Includes CleverFerret set plus iconic/interface-focused additions
- 🧩 **Curated Theme Sets** - Ready-to-use bundles for onboarding and product contexts

## 🚀 Installation

### TypeScript/JavaScript

```bash
npm install @ktheme/engine
```

### Kotlin/Android

```kotlin
dependencies {
    implementation("com.ktheme:ktheme-kotlin:1.0.0")
}
```

See [kotlin-plugin/README.md](kotlin-plugin/README.md) for detailed Kotlin usage.

## 📚 Quick Start

```typescript
import { createThemeEngine } from '@ktheme/engine';

// Create a theme engine with preset themes
const engine = createThemeEngine();

// Set an active theme
engine.setActiveTheme('navy-gold');

// Get the active theme
const theme = engine.getActiveTheme();
console.log(theme.metadata.name); // "Navy Gold"
```

## 🎯 Features

### Theme Management

```typescript
import { ThemeEngine, Theme } from '@ktheme/engine';

const engine = new ThemeEngine();

// Register a custom theme
engine.registerTheme(myCustomTheme);

// Get all themes
const allThemes = engine.getAllThemes();

// Search themes
const metallicThemes = engine.searchByTags(['metallic']);
const goldThemes = engine.searchByName('gold');

// Export a theme
const json = engine.exportTheme('navy-gold');

// Import a theme
const theme = engine.importTheme(json);
```

### Metallic Effects

```typescript
import { 
  MetallicVariant, 
  getMetallicGradient,
  generateMetallicGradientCSS 
} from '@ktheme/engine';

// Get a metallic gradient
const goldGradient = getMetallicGradient(MetallicVariant.GOLD);

// Generate CSS for the gradient
const css = generateMetallicGradientCSS(goldGradient, 135);
```

### Color Utilities

```typescript
import { 
  hexToRgb, 
  rgbToHex, 
  darken, 
  lighten,
  getContrastColor 
} from '@ktheme/engine';

// Convert colors
const rgb = hexToRgb('#D4AF37');
const hex = rgbToHex({ r: 212, g: 175, b: 55 });

// Manipulate colors
const darker = darken('#D4AF37', 20);
const lighter = lighten('#D4AF37', 20);

// Get contrast color
const contrast = getContrastColor('#0A1630'); // Returns white
```

## 🎨 Creating Custom Themes

```typescript
import { Theme, MetallicVariant } from '@ktheme/engine';

const myTheme: Theme = {
  metadata: {
    id: 'my-custom-theme',
    name: 'My Custom Theme',
    description: 'A beautiful custom theme',
    author: 'Your Name',
    version: '1.0.0',
    tags: ['custom', 'dark'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#D4AF37',
    onPrimary: '#0A1630',
    background: '#0A1630',
    onBackground: '#E8E3D8',
    // ... other required colors
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.GOLD,
      intensity: 0.8
    },
    shadows: {
      enabled: true,
      elevation: 4,
      blur: 8,
      color: '#00000066'
    }
  }
};
```

## 🌟 Preset Themes

Ktheme includes 14 themes from CleverFerret plus additional iconic interface presets:

1. **Navy Gold** - Elegant navy with gold metallic accents (`navy-gold`)
2. **Emerald Silver** - Rich emerald with silver accents (`emerald-silver`)
3. **Rose Gold** - Warm rose gold with burgundy tones (`rose-gold`)
4. **Royal Bronze** - Regal purple with bronze accents (`royal-bronze`)
5. **Midnight Amber** - Sophisticated midnight blue with amber (`midnight-amber`)
6. **Obsidian Crimson** - Bold black with crimson accents (`obsidian-crimson`)
7. **Slate Cyan** - Cool modern slate with cyan (`slate-cyan`)
8. **Royal Silver** - Royal purple with silver accents (`royal-silver`)
9. **Forest Copper** - Deep forest green with copper (`forest-copper`)
10. **Burgundy Rose Gold** - Rich burgundy with rose gold (`burgundy-rose-gold`)
11. **Charcoal Champagne** - Sophisticated charcoal with champagne (`charcoal-champagne`)
12. **Slate Gunmetal** - Industrial slate with gunmetal (`slate-gunmetal`)
13. **Deep Purple Platinum** - Deep purple with platinum (`deep-purple-platinum`)
14. **Paper & Ink** - Minimalist light theme for readers (`paper-ink`)
15. **Windows Phone Metro** - Flat tile-first Metro language (`windows-phone-metro`)
16. **LCARS** - LCARS-inspired rails and console styling (`lcars`)
17. **Frutiger Aero** - Glossy sky-and-glass nostalgia aesthetic (`frutiger-aero`)

All theme JSON files are available in `themes/examples/`.
For a quick visual reference of the new iconic presets, open `themes/examples/iconic-previews.html`.


## 🧪 Theme Sets

Use curated sets to quickly bootstrap the right style direction:

```typescript
import { ThemeSets } from '@ktheme/engine';

const starter = ThemeSets.starter;
console.log(starter.name);

starter.themes.forEach(theme => engine.registerTheme(theme));
```

Available sets include `starter`, `metallicShowcase`, `executiveDark`, `creativeStudio`, `readability`, and `iconicInterfaces`.

### Aesthetic rulesets (quick guidance)

- **LCARS format rule:** keep rail/sweep geometry and centered rail labels; vary palette by era (e.g. TNG warm vs Picard blue).
- **Frutiger Aero rule:** use airy sky/nature palettes, glass panels, soft rounded corners, and subtle shimmer/blur to preserve readability.
- **Metro rule:** keep flat sharp tiles and high-contrast accent blocks with minimal ornamental effects.

### Themes I’d implement next (shortlist)

- **Solarpunk Civic** — high-trust greens/daylight neutrals for climate and mobility products, with clear rules for optimistic accents, eco-status semantics, and legible outdoor contrast.
- **Neo-Noir Neon** — focused dark palette for media/control-room dashboards, with strict rules that keep neon as sparse emphasis rather than full-surface glow.
- **Calm Clinical** — low-stress healthcare/admin visual language, with explicit rules for high-clarity hierarchy, safe status colors, and touch-target accessibility defaults.
- **Ink Terminal Modern** — retro-terminal personality for developer tools, with modern rules for readable mono typography, restrained bloom, and contrast-safe command surfaces.
- **Aurora Glass Night** — premium glass UI for consumer experiences, with disciplined rules for blur depth, edge highlights, and always-readable foreground text layers.


## 🧱 App Layout + Icon Adaptation

Ktheme now supports app-level adaptation profiles so themes can reshape not just colors, but **layout structure**, **icon style**, and **component composition**.

```typescript
import {
  createThemeEngine,
  AdaptationPresets,
  generateThemeAdaptationCSS
} from '@ktheme/engine';

const engine = createThemeEngine();

// Frutiger Aero style: glassy panels + softer icon language
const adapted = engine.createAdaptedTheme('slate-cyan', AdaptationPresets.frutigerAero);

// Generate CSS variables + component override CSS
const css = generateThemeAdaptationCSS(adapted);
```

### Included adaptation presets

- `frutigerAero` → glass surfaces, rounded layout language, duotone icon style
- `windowsPhoneMetro` → sharp tile layout, pivot navigation rhythm, fluent/line icon style
- `lcars` → rail layout and pill geometry suitable for LCARS-style interfaces

This makes it practical to build themes that require structural restyling (e.g. Frutiger Aero, Windows Phone, LCARS).

## 🛠️ Theme Creator App

Ktheme includes a web-based theme creator app for visually designing themes:

```bash
cd theme-creator
npm install
npm start
```

The theme creator provides:
- 🎨 Visual color picker for all theme colors
- 👁️ Live preview of your theme
- 💾 Export themes to JSON
- 📥 Import existing themes for editing


## ⚙️ Accessibility and Motion Policies

Ktheme supports reduced-motion handling, dynamic contrast checks, and auto-generated accessibility CSS that is included for all themes by default.

```typescript
const validation = engine.validateTheme(theme);
console.log(validation.warnings); // includes low-contrast warnings when applicable

const resolvedEffects = engine.resolveEffectsForRuntime(theme, {
  prefersReducedMotion: true
});

const resolvedAccessibility = engine.resolveAccessibilityForRuntime(theme, {
  prefersReducedMotion: true,
  prefersHighContrast: true,
  userFontScale: 1.2
});

const css = generateThemeAdaptationCSS(theme);
// css now includes accessibility variables/rules by default under [data-ktheme]
```

When reduced motion is preferred, shimmer is disabled and transitions/animations are reduced according to each effect policy. Accessibility utilities also enforce minimum target size, visible focus rings, link underlines, and reduced-motion fallbacks automatically.

If you need to disable auto-inclusion for a specific theme, set `theme.accessibility.autoIncludeInGeneratedCSS = false`.

## 🔬 Essential Additions and Effects Research

See [ESSENTIAL_ADDITIONS_AND_EFFECTS.md](ESSENTIAL_ADDITIONS_AND_EFFECTS.md) for implementation notes and prioritized recommendations for expanding the engine.

## 📖 API Documentation

### ThemeEngine

The main class for managing themes.

#### Methods

- `registerTheme(theme: Theme): void` - Register a new theme
- `getTheme(id: string): Theme | undefined` - Get a theme by ID
- `getAllThemes(): Theme[]` - Get all registered themes
- `setActiveTheme(id: string): void` - Set the active theme
- `getActiveTheme(): Theme | null` - Get the current active theme
- `removeTheme(id: string): boolean` - Remove a theme
- `validateTheme(theme: Theme): ThemeValidationResult` - Validate a theme
- `exportTheme(id: string): string` - Export theme to JSON
- `importTheme(json: string): Theme` - Import theme from JSON
- `searchByTags(tags: string[]): Theme[]` - Search themes by tags
- `searchByName(query: string): Theme[]` - Search themes by name

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. This is an open-source project where anyone can add their custom themes.

### Adding Your Theme

1. Create your theme using the Theme Creator app or manually
2. Export your theme to JSON
3. Submit a PR with your theme in the `themes/community/` directory

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the advanced theming system in [CleverFerret](https://github.com/Kaleaon/CleverFerret)
- Material Design 3 color system
- The open-source community

## 🔗 Links

- [GitHub Repository](https://github.com/Kaleaon/Ktheme)
- [CleverFerret](https://github.com/Kaleaon/CleverFerret)
- [Issue Tracker](https://github.com/Kaleaon/Ktheme/issues)

---

<div align="center">

**Made with ❤️ by the Ktheme community**

</div>
