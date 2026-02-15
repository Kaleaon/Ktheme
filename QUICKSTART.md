# Ktheme Quick Start Guide

## Installation

```bash
npm install @ktheme/engine
```

## 5-Minute Quick Start

### 1. Create a Theme Engine

```javascript
import { createThemeEngine } from '@ktheme/engine';

// Create engine with 3 preset themes
const engine = createThemeEngine();
```

### 2. Use a Preset Theme

```javascript
// Set active theme
engine.setActiveTheme('navy-gold');

// Get the theme
const theme = engine.getActiveTheme();

// Use the colors
const colors = theme.colorScheme;
document.body.style.backgroundColor = colors.background;
document.body.style.color = colors.onBackground;
```

### 3. Create Your Own Theme

Use the Theme Creator app:

```bash
cd theme-creator
node server.js
```

Then open http://localhost:3000 in your browser to create themes visually!

### 4. Export and Share

```javascript
// Export your theme
const json = engine.exportTheme('my-theme-id');

// Save it
const fs = require('fs');
fs.writeFileSync('my-theme.json', json);

// Import it later
const imported = engine.importTheme(json);
```

## Available Preset Themes

1. **Navy Gold** - Elegant navy with gold metallic accents
2. **Emerald Silver** - Rich emerald with silver accents  
3. **Rose Gold** - Warm rose gold with burgundy tones

## What's Next?

- Check [EXAMPLES.md](EXAMPLES.md) for more usage examples
- Read [README.md](README.md) for full documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) to add your themes
- Browse `themes/examples/` for theme templates

## Need Help?

Open an issue on GitHub: https://github.com/Kaleaon/Ktheme/issues

Happy theming! 🎨
