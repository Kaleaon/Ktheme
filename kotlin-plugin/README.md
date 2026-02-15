# Ktheme Kotlin Plugin

Kotlin plugin for Ktheme - Advanced theming and design API for Android and JVM applications with a visual theme library and cross-app theme sharing.

## Features

- 🎨 **Advanced Theme Studio** - Build themes in a polished multi-panel creator UI
- ✨ **Cinematic Visual Effects** - Configure transitions, particles, glow, metallic gradients, and animations
- 🔄 **Cross-App Theme Sharing API** - Share themes between applications system-wide with `KthemeAPI`
- 📱 **Swing UI Components** - Ready-to-use theme selector and preview panels
- 🎯 **Simple Integration API** - Easy integration for any Kotlin/Java app
- 💾 **Import/Export** - Share themes via JSON files
- 🌙 **Dark & Light Themes** - Full support for both modes

## Installation

### Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("com.ktheme:ktheme-kotlin:1.0.0")
}
```

### Gradle (Groovy)

```groovy
dependencies {
    implementation 'com.ktheme:ktheme-kotlin:1.0.0'
}
```

### Maven

```xml
<dependency>
    <groupId>com.ktheme</groupId>
    <artifactId>ktheme-kotlin</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Running the Advanced Theme Studio App

Ktheme now ships with a standalone creator app for designing rich animated themes:

```bash
cd kotlin-plugin
./gradlew run
```

Or build and run the JAR:

```bash
./gradlew jar
java -jar build/libs/ktheme-kotlin-1.0.0.jar
```

### Theme Studio Features

- **Attractive multi-tab UI** - Edit identity, colors, and effects from one workspace
- **Real-time animated preview** - View transitions, glow pulse, and moving particles instantly
- **Theme API sharing** - Publish your generated themes to the system shared directory through `KthemeAPI`
- **Export JSON themes** - Save generated themes for versioning and distribution
- **Compatibility** - Shared themes can be consumed by any app using the Ktheme Kotlin API

## Quick Start

### Basic Usage

```kotlin
import com.ktheme.core.ThemeEngine
import com.ktheme.models.Theme
import java.io.File

// Create a theme engine
val engine = ThemeEngine()

// Load theme from JSON file
val themeFile = File("themes/navy-gold.json")
val theme = engine.loadThemeFromFile(themeFile)

// Set as active theme
engine.setActiveTheme(theme.metadata.id)

// Get the active theme
val activeTheme = engine.getActiveTheme()
activeTheme?.let { theme ->
    // Use the theme colors
    val backgroundColor = theme.colorScheme.background
    val primaryColor = theme.colorScheme.primary
    
    println("Background: $backgroundColor")
    println("Primary: $primaryColor")
}
```

### Loading Multiple Themes

```kotlin
val themesDir = File("themes/examples")
themesDir.listFiles()?.forEach { file ->
    if (file.extension == "json") {
        try {
            engine.loadThemeFromFile(file)
            println("Loaded theme: ${file.nameWithoutExtension}")
        } catch (e: Exception) {
            println("Failed to load ${file.name}: ${e.message}")
        }
    }
}

// List all loaded themes
engine.getAllThemes().forEach { theme ->
    println("${theme.metadata.name} - ${theme.metadata.description}")
}
```

### Searching Themes

```kotlin
// Search by tags
val metallicThemes = engine.searchByTags(listOf("metallic", "elegant"))
metallicThemes.forEach { theme ->
    println("Found: ${theme.metadata.name}")
}

// Search by name
val goldThemes = engine.searchByName("gold")
goldThemes.forEach { theme ->
    println("Found: ${theme.metadata.name}")
}
```

### Color Utilities

```kotlin
import com.ktheme.utils.ColorUtils

// Convert colors
val rgb = ColorUtils.hexToRgb("#D4AF37")
println("RGB: r=${rgb.r}, g=${rgb.g}, b=${rgb.b}")

val hex = ColorUtils.rgbToHex(rgb)
println("Hex: $hex")

// Manipulate colors
val darker = ColorUtils.darken("#D4AF37", 20f)
val lighter = ColorUtils.lighten("#D4AF37", 20f)

// Mix colors
val mixed = ColorUtils.mix("#D4AF37", "#0A1630", 0.5f)

// Get contrast color
val contrast = ColorUtils.getContrastColor("#0A1630")
println("Contrast color: $contrast") // Returns white for dark backgrounds
```

### Creating Custom Themes

```kotlin
import com.ktheme.models.*

val customTheme = Theme(
    metadata = ThemeMetadata(
        id = "my-custom-theme",
        name = "My Custom Theme",
        description = "A beautiful custom theme",
        author = "Your Name",
        version = "1.0.0",
        tags = listOf("custom", "dark"),
        createdAt = System.currentTimeMillis().toString(),
        updatedAt = System.currentTimeMillis().toString()
    ),
    darkMode = true,
    colorScheme = ColorScheme(
        primary = "#D4AF37",
        onPrimary = "#0A1630",
        primaryContainer = "#856D34",
        onPrimaryContainer = "#FFF8DC",
        // ... other required colors
        background = "#0A1630",
        onBackground = "#E8E3D8",
        surface = "#1A2645",
        onSurface = "#E8E3D8",
        // ... complete the color scheme
    ),
    effects = VisualEffects(
        metallic = MetallicEffects(
            enabled = true,
            variant = "GOLD",
            gradient = MetallicGradient(
                base = "#D4AF37",
                highlight = "#FFD700",
                shadow = "#856D34",
                shimmer = "#FFF8DC"
            ),
            intensity = 0.8f
        ),
        shadows = ShadowEffects(
            enabled = true,
            elevation = 4,
            blur = 8,
            color = "#00000066"
        )
    )
)

// Register the theme
engine.registerTheme(customTheme)

// Export to file
val outputFile = File("my-custom-theme.json")
engine.saveThemeToFile(customTheme.metadata.id, outputFile)
```

### Android Integration

```kotlin
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.graphics.Color

@Composable
fun ThemedApp() {
    val engine = remember { ThemeEngine() }
    val themeState = remember { mutableStateOf<Theme?>(null) }
    
    LaunchedEffect(Unit) {
        // Load theme
        val theme = engine.loadThemeFromFile(File("themes/navy-gold.json"))
        engine.setActiveTheme(theme.metadata.id)
        themeState.value = engine.getActiveTheme()
    }
    
    themeState.value?.let { theme ->
        MaterialTheme(
            colorScheme = androidx.compose.material3.darkColorScheme(
                primary = Color(ColorUtils.hexToColorInt(theme.colorScheme.primary)),
                onPrimary = Color(ColorUtils.hexToColorInt(theme.colorScheme.onPrimary)),
                background = Color(ColorUtils.hexToColorInt(theme.colorScheme.background)),
                onBackground = Color(ColorUtils.hexToColorInt(theme.colorScheme.onBackground)),
                // ... map other colors
            )
        ) {
            // Your app content
        }
    }
}
```

## Available Themes

All 14 themes from CleverFerret are available:

1. **Navy Gold** - Elegant navy with gold metallic accents
2. **Emerald Silver** - Rich emerald with silver accents
3. **Rose Gold** - Warm rose gold with burgundy tones
4. **Royal Bronze** - Regal purple with bronze accents
5. **Midnight Amber** - Sophisticated midnight blue with amber
6. **Obsidian Crimson** - Bold black with crimson accents
7. **Slate Cyan** - Cool modern slate with cyan
8. **Royal Silver** - Royal purple with silver accents
9. **Forest Copper** - Deep forest green with copper
10. **Burgundy Rose Gold** - Rich burgundy with rose gold
11. **Charcoal Champagne** - Sophisticated charcoal with champagne
12. **Slate Gunmetal** - Industrial slate with gunmetal
13. **Deep Purple Platinum** - Deep purple with platinum
14. **Paper & Ink** - Minimalist light theme for readers

## Cross-App Theme Sharing

Ktheme provides a powerful system for sharing themes across applications:

### Using the KthemeAPI

```kotlin
import com.ktheme.library.KthemeAPI
import com.ktheme.library.ThemeChangeListener

// Get all shared themes available system-wide
val themes = KthemeAPI.getAvailableThemes()

// Get a specific theme
val theme = KthemeAPI.getTheme("navy-gold")

// Share a theme with other applications
KthemeAPI.shareTheme(myTheme)

// Subscribe to theme changes
KthemeAPI.onThemeChanged(object : ThemeChangeListener {
    override fun onThemeAdded(theme: Theme) {
        println("New theme: ${theme.metadata.name}")
    }
    
    override fun onThemeRemoved(themeId: String) {
        println("Theme removed: $themeId")
    }
    
    override fun onThemeUpdated(theme: Theme) {
        println("Theme updated: ${theme.metadata.name}")
    }
})
```

### Theme Directories

Themes are shared via directories in the user's home:

- **Shared Themes** (cross-app): `~/.ktheme/shared/`
- **User Themes**: `~/.ktheme/user/`

Any application can read from the shared directory to access themes made available by the Theme Library app.

### Integration Example

See `com.ktheme.examples.ExampleApp` for a complete example of:
- Browsing shared themes
- Applying themes to your app
- Subscribing to theme updates

Run the example:
```bash
./gradlew run --args="example"
```

## UI Components

### ThemeScrollWheel

Visual scroll wheel for theme selection:

```kotlin
import com.ktheme.ui.ThemeScrollWheel

val scrollWheel = ThemeScrollWheel(themes).apply {
    addSelectionListener { theme ->
        println("Selected: ${theme.metadata.name}")
        applyTheme(theme)
    }
}
```

### ThemePreviewPanel

Detailed theme preview panel:

```kotlin
import com.ktheme.ui.ThemePreviewPanel

val preview = ThemePreviewPanel()
preview.showTheme(selectedTheme)
```

### ThemeLibrary

Centralized theme management:

```kotlin
import com.ktheme.library.ThemeLibrary

val library = ThemeLibrary()
library.loadAllThemes(bundledThemesDir)

// Get all themes
val themes = library.getAllThemes()

// Search themes
val results = library.searchThemes("metallic")

// Share theme
library.shareTheme("navy-gold")

// Import/Export
library.importTheme(File("theme.json"))
library.exportTheme("navy-gold", File("export.json"))
```

## API Reference

### ThemeEngine

- `registerTheme(theme: Theme)` - Register a new theme
- `getTheme(id: String): Theme?` - Get a theme by ID
- `getAllThemes(): List<Theme>` - Get all registered themes
- `setActiveTheme(id: String)` - Set the active theme
- `getActiveTheme(): Theme?` - Get the current active theme
- `removeTheme(id: String): Boolean` - Remove a theme
- `validateTheme(theme: Theme): ValidationResult` - Validate a theme
- `exportTheme(id: String): String` - Export theme to JSON
- `importTheme(jsonString: String): Theme` - Import theme from JSON
- `loadThemeFromFile(file: File): Theme` - Load theme from file
- `saveThemeToFile(id: String, file: File)` - Save theme to file
- `searchByTags(tags: List<String>): List<Theme>` - Search by tags
- `searchByName(query: String): List<Theme>` - Search by name

### ColorUtils

- `hexToRgb(hex: String): RGBColor` - Convert hex to RGB
- `rgbToHex(rgb: RGBColor): String` - Convert RGB to hex
- `hexToRgba(hex: String, alpha: Float): RGBAColor` - Convert hex to RGBA
- `darken(hex: String, percent: Float): String` - Darken a color
- `lighten(hex: String, percent: Float): String` - Lighten a color
- `mix(color1: String, color2: String, weight: Float): String` - Mix colors
- `getContrastColor(backgroundColor: String): String` - Get contrast color
- `isValidHex(hex: String): Boolean` - Validate hex color
- `colorIntToHex(color: Int): String` - Android color int to hex
- `hexToColorInt(hex: String): Int` - Hex to Android color int

## License

Apache License 2.0 - see the [LICENSE](../LICENSE) file for details.

## Links

- [Main Ktheme Repository](https://github.com/Kaleaon/Ktheme)
- [CleverFerret](https://github.com/Kaleaon/CleverFerret)


### Launching specific apps

```bash
# Advanced creator (default run target)
./gradlew run

# Theme browser/library
./gradlew run --args="com.ktheme.ui.ThemeLibraryWindowKt"
```
