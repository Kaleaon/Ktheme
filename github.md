# Ktheme Repository & Developer Guide

Welcome to the **Ktheme** open-source repository (`Kaleaon/Ktheme`). This document covers repository structure, workflow conventions, PR checks, and release management.

---

## 🏗️ Repository Architecture

- `src/core/`: Theme engine core (`ThemeEngine.ts`, `types.ts`).
- `src/effects/`: Metallic gradients, shimmer animations, and advanced visual effects (`metallic.ts`, `advanced.ts`).
- `src/themes/`: Presets, adaptation rules, expansion packs, and shared registries (`presets.ts`, `adaptationPresets.ts`, `shared-preset-ids.ts`).
- `src/components/`: Reusable React Design Components (DCs) for buttons, cards, chips, nav rails, dialogs, toggles, sliders, swatches, and forms (`DCs.tsx`).
- `src/linkpoint/`: Linkpoint UI Kit featuring 7 screens, layout packs, device size previews, and Second Life preset customization studio (`LinkpointUIKit.tsx`).
- `src/exporters/`: Native code exporters for CSS Variables, Tailwind Config, Android Compose, iOS SwiftUI, Flutter, and Design Tokens JSON.
- `themes/examples/`: Portable theme JSON files (26 preset themes).
- `theme-creator/`: Interactive Theme Creator web application (Vite + React + TS).
- `scripts/`: Development scripts including `generate-theme-catalog.mjs`.

---

## 🚀 Development Workflow

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Tests:**

   ```bash
   npm test
   ```

3. **Build Engine & Components:**

   ```bash
   npm run build
   ```

4. **Update & Verify Theme Catalog:**
   When adding or updating preset themes in `src/themes/presets.ts` or `src/themes/shared-preset-ids.ts`:
   ```bash
   npm run generate:theme-catalog
   npm run check:theme-catalog
   ```

---

## 📦 PR Requirements

- All tests must pass (`npm test`).
- TypeScript build must complete with zero errors (`npm run build`).
- Theme catalog must be synchronized (`npm run check:theme-catalog`).
- New theme JSON definitions should be saved in `themes/examples/*.json`.
