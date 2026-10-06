# Ktheme Agent Skill Manifest

This manifest defines the capabilities, API contracts, design tokens, and components provided by the Ktheme Design Engine & Linkpoint UI Kit.

---

## 🎨 Core Capabilities

1. **Theme Engine Management:**

   - Create and manage themes using `createThemeEngine()`.
   - Dynamic theme switching, validation, contrast checking, and state layers.

2. **Metallic Effects Engine:**

   - 10 metallic gradient variants (Silver, Gold, Gold Royal Blue, Bronze, Copper, Platinum, Rose Gold, Titanium, Chrome, Cobalt).
   - Shimmer animation control with speed, intensity, angle, and reduced-motion policy.

3. **Linkpoint UI Kit:**

   - 7 responsive screens (Dashboard, Media Catalog, Theme Customizer, Profile, Mail/Comms, Settings, Second Life Preset Studio).
   - Multi-device preview support (`desktop`, `tablet`, `mobile`).
   - Layout packs (`standard`, `compact`, `hero`, `grid`).
   - Second Life custom preset studio with JSON import/export and preset saving.

4. **Multi-Target Exporters:**

   - CSS Variables (`toCssVars`).
   - Tailwind Config (`toTailwindConfig`).
   - Android Jetpack Compose (`toAndroidCompose`).
   - iOS SwiftUI (`toSwiftUI`).
   - Flutter Theme (`toFlutterTheme`).
   - Design Tokens JSON (`toDesignTokensJson`).

5. **Iconic Theme Rules:**
   - Pre-packaged adaptation rules for LCARS, Frutiger Aero, Windows Phone Metro, Art Deco, and Art Nouveau.

---

## 📍 Starting Points

- **Engine Entry:** `src/index.ts`
- **Design Components (DCs):** `src/components/DCs.tsx`
- **Linkpoint UI Kit:** `src/linkpoint/LinkpointUIKit.tsx`
- **Preset Catalog:** `src/themes/presets.ts` & `themes/examples/`
