# Ktheme Usage Examples

This document provides practical examples of using Ktheme in your projects.

## Installation

```bash
npm install @ktheme/engine
```

## Basic Usage

### Creating a Theme Engine

```javascript
import { createThemeEngine } from '@ktheme/engine';

// Create engine with preset themes
const engine = createThemeEngine();

// Or create without presets
const engine = createThemeEngine(false);
```

### Working with Themes

```javascript
import { ThemeEngine } from '@ktheme/engine';

const engine = new ThemeEngine();

// Register a theme
engine.registerTheme(myTheme);

// Get all themes
const themes = engine.getAllThemes();

// Set active theme
engine.setActiveTheme('navy-gold');

// Get active theme
const activeTheme = engine.getActiveTheme();
```

### Creating Custom Themes

```javascript
import { Theme, MetallicVariant } from '@ktheme/engine';

const myTheme = {
  metadata: {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep blue theme with silver accents',
    author: 'John Doe',
    version: '1.0.0',
    tags: ['dark', 'blue', 'metallic'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  darkMode: true,
  colorScheme: {
    primary: '#1E3A8A',
    onPrimary: '#FFFFFF',
    primaryContainer: '#1E40AF',
    onPrimaryContainer: '#DBEAFE',
    secondary: '#C0C0C0',
    onSecondary: '#1E3A8A',
    // ... other required colors
    background: '#0F172A',
    onBackground: '#F1F5F9',
    surface: '#1E293B',
    onSurface: '#F1F5F9',
    // ... complete the color scheme
  },
  effects: {
    metallic: {
      enabled: true,
      variant: MetallicVariant.SILVER,
      intensity: 0.7
    }
  }
};

engine.registerTheme(myTheme);
```

### Color Utilities

```javascript
import { 
  hexToRgb, 
  rgbToHex, 
  darken, 
  lighten,
  getContrastColor,
  mix
} from '@ktheme/engine';

// Convert colors
const rgb = hexToRgb('#D4AF37');
// Returns: { r: 212, g: 175, b: 55 }

const hex = rgbToHex({ r: 212, g: 175, b: 55 });
// Returns: '#D4AF37'

// Manipulate colors
const darker = darken('#D4AF37', 20);
const lighter = lighten('#D4AF37', 20);

// Get contrast color
const contrast = getContrastColor('#0A1630');
// Returns: '#FFFFFF' (white for dark backgrounds)

// Mix colors
const mixed = mix('#D4AF37', '#0A1630', 0.5);
```

### Metallic Effects

```javascript
import { 
  MetallicVariant,
  getMetallicGradient,
  generateMetallicGradientCSS,
  generateShimmerCSS
} from '@ktheme/engine';

// Get metallic gradient
const goldGradient = getMetallicGradient(MetallicVariant.GOLD);

// Generate CSS
const gradientCSS = generateMetallicGradientCSS(goldGradient, 135);
// Returns CSS linear-gradient string

const shimmerCSS = generateShimmerCSS(goldGradient, 3);
// Returns CSS with shimmer animation
```

### Import/Export Themes

```javascript
// Export a theme
const json = engine.exportTheme('navy-gold');

// Save to file (Node.js)
const fs = require('fs');
fs.writeFileSync('my-theme.json', json);

// Import a theme
const themeJson = fs.readFileSync('my-theme.json', 'utf8');
const importedTheme = engine.importTheme(themeJson);
```

### Searching Themes

```javascript
// Search by tags
const metallicThemes = engine.searchByTags(['metallic', 'elegant']);

// Search by name
const goldThemes = engine.searchByName('gold');
```

### Validation

```javascript
const validation = engine.validateTheme(myTheme);

if (validation.valid) {
  console.log('Theme is valid!');
} else {
  console.log('Errors:', validation.errors);
  console.log('Warnings:', validation.warnings);
}
```

## React Example

```jsx
import React, { useState, useEffect } from 'react';
import { createThemeEngine } from '@ktheme/engine';

function App() {
  const [engine] = useState(() => createThemeEngine());
  const [activeTheme, setActiveTheme] = useState(null);
  
  useEffect(() => {
    engine.setActiveTheme('navy-gold');
    setActiveTheme(engine.getActiveTheme());
  }, [engine]);
  
  const applyTheme = (theme) => {
    const cs = theme.colorScheme;
    document.body.style.background = cs.background;
    document.body.style.color = cs.onBackground;
  };
  
  useEffect(() => {
    if (activeTheme) {
      applyTheme(activeTheme);
    }
  }, [activeTheme]);
  
  return (
    <div>
      <h1>My Themed App</h1>
      <select onChange={(e) => {
        engine.setActiveTheme(e.target.value);
        setActiveTheme(engine.getActiveTheme());
      }}>
        {engine.getAllThemes().map(theme => (
          <option key={theme.metadata.id} value={theme.metadata.id}>
            {theme.metadata.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Node.js CLI Example

```javascript
#!/usr/bin/env node
const { createThemeEngine } = require('@ktheme/engine');
const fs = require('fs');

const engine = createThemeEngine();

// List all themes
console.log('Available themes:');
engine.getAllThemes().forEach(theme => {
  console.log(`- ${theme.metadata.name} (${theme.metadata.id})`);
});

// Export all themes
const allThemesJson = engine.exportAllThemes();
fs.writeFileSync('all-themes.json', allThemesJson);
console.log('Exported all themes to all-themes.json');
```

## Web Application Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Ktheme Demo</title>
</head>
<body>
  <div id="app"></div>
  
  <script type="module">
    import { createThemeEngine } from './node_modules/@ktheme/engine/dist/index.js';
    
    const engine = createThemeEngine();
    engine.setActiveTheme('navy-gold');
    
    const theme = engine.getActiveTheme();
    const cs = theme.colorScheme;
    
    document.body.style.background = cs.background;
    document.body.style.color = cs.onBackground;
  </script>
</body>
</html>
```

## TypeScript Support

Ktheme is written in TypeScript and includes full type definitions:

```typescript
import { 
  Theme, 
  ColorScheme, 
  ThemeEngine,
  MetallicVariant 
} from '@ktheme/engine';

const engine: ThemeEngine = createThemeEngine();
const theme: Theme = engine.getActiveTheme()!;
const colors: ColorScheme = theme.colorScheme;
```

## More Examples

Check out the `themes/examples/` directory for complete theme JSON files you can use as templates.
