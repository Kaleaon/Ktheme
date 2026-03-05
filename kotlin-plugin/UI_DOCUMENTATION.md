# Ktheme Library UI Documentation

## Application Screenshots and UI Overview

### Main Window Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Ktheme Library - Theme Manager                            [_][□][X] │
├─────────────────────────────────────────────────────────────────────┤
│ File    View    Help                                                │
├──────────────────────────┬──────────────────────────────────────────┤
│ Available Themes         │ Theme Preview                            │
│ ┌──────────────────────┐ │ ┌──────────────────────────────────────┐ │
│ │ Search: [_________]🔍│ │ │ Navy Gold                            │ │
│ └──────────────────────┘ │ │ Elegant navy background with         │ │
│                          │ │ luxurious gold metallic accents      │ │
│ ┌──────────────────────┐ │ │ by Ktheme                            │ │
│ │ [🎨][Name] [Tags][🌙]│ │ │ Tags: metallic, elegant, dark        │ │
│ │ ┌────┬────┐          │ │ │                                      │ │
│ │ │████│████│ Navy Gold│ │ ├──────────────────────────────────────┤ │
│ │ │████│████│ Elegant..│ │ │ Color Palette                        │ │
│ │ └────┴────┘ metallic │ │ │ ┌────┐┌────┐┌────┐┌────┐             │ │
│ │──────────────────────│ │ │ │████││████││████││████│             │ │
│ │ [🎨][Name] [Tags][🌙]│ │ │ │Prim││Sec ││Back││Surf│             │ │
│ │ ┌────┬────┐          │ │ │ └────┘└────┘└────┘└────┘             │ │
│ │ │████│████│ Emerald  │ │ │ ┌────┐┌────┐┌────┐┌────┐             │ │
│ │ │████│████│ Silver   │ │ │ │████││████││████││████│             │ │
│ │ └────┴────┘ nature..│ │ │ │OnPr││OnSe││OnBa││OnSu│             │ │
│ │──────────────────────│ │ │ └────┘└────┘└────┘└────┘             │ │
│ │ [🎨][Name] [Tags][☀️]│ │ ├──────────────────────────────────────┤ │
│ │ ┌────┬────┐          │ │ │ Theme Preview                        │ │
│ │ │████│████│ Paper &  │ │ │ ┌──────────────────────────────────┐ │ │
│ │ │████│████│ Ink      │ │ │ │ Sample Button                    │ │ │
│ │ └────┴────┘ minimal..│ │ │ │ Sample text in this theme        │ │ │
│ │──────────────────────│ │ │ │ ┌──────────────────────────────┐ │ │ │
│ │ [More themes...]     │ │ │ │ │ Surface element              │ │ │ │
│ │                      │ │ │ │ └──────────────────────────────┘ │ │ │
│ │                      │ │ │ └──────────────────────────────────┘ │ │
│ │                      │ │ ├──────────────────────────────────────┤ │
│ │                      │ │ │ [Apply] [Share] [Export] [Import]    │ │
│ └──────────────────────┘ │ └──────────────────────────────────────┘ │
├──────────────────────────┴──────────────────────────────────────────┤
│ Ready                                                                │
└─────────────────────────────────────────────────────────────────────┘
```

## UI Components

### 1. Theme Scroll Wheel (Left Panel)

**Features:**
- Visual scroll list showing all available themes
- Each theme card displays:
  - 2x2 color grid preview (Primary, Secondary, Background, Surface)
  - Theme name in bold
  - Short description
  - Tags (up to 3 shown)
  - Mode indicator (🌙 for dark, ☀️ for light)
- Smooth scrolling with mouse wheel
- Click to select and preview

**Example Theme Card:**
```
┌────────────────────────────────────┐
│ ┌────┬────┐                        │
│ │ 🟨 │ 🔵 │  Navy Gold          🌙 │
│ │ 🟦 │ 🟪 │                        │
│ └────┴────┘  Elegant navy back... │
│               🏷️ metallic, elegant │
└────────────────────────────────────┘
```

### 2. Theme Preview Panel (Right Panel)

**Header Section:**
- Large theme name
- Full description
- Author attribution
- Complete tag list

**Color Palette Section:**
- Grid of 8 color swatches
- Each swatch shows:
  - Color preview box
  - Color name
  - Hex value

**Visual Preview Section:**
- Live preview showing:
  - Sample button with primary color
  - Sample text with theme colors
  - Sample surface panel
- Background uses theme background color
- Text uses theme text colors

**Action Buttons:**
- **Apply Theme** - Apply to current app (demo)
- **Share Theme** - Copy to shared directory (~/.ktheme/shared)
- **Export Theme** - Save to custom location
- **Import Theme** - Load from file

### 3. Menu Bar

**File Menu:**
- Import Theme...
- Export Theme...
- Reload Themes
- Exit

**View Menu:**
- Show All Themes
- Show Dark Themes
- Show Light Themes

**Help Menu:**
- About
- Theme Directory (shows paths)

## Cross-App Integration

### Shared Theme Directory

All themes shared via the "Share Theme" button are copied to:
```
~/.ktheme/shared/
```

Other applications can:
1. Read themes from this directory
2. Monitor for new themes
3. Add their own themes

### Integration API

Any Kotlin/Java application can integrate themes using:

```kotlin
import com.ktheme.library.KthemeAPI

// Get all shared themes
val themes = KthemeAPI.getAvailableThemes()

// Get specific theme
val theme = KthemeAPI.getTheme("navy-gold")

// Apply to your app
applyThemeToUI(theme)
```

### Example Integration

The `ExampleApp.kt` demonstrates a complete integration showing:
- Browsing available shared themes
- Applying themes to Swing components
- Subscribing to theme changes
- Dynamic theme switching

## User Workflow

### Browsing Themes
1. Launch Ktheme Library application
2. Scroll through theme list on the left
3. Click any theme to see full preview
4. View color palette and visual preview

### Sharing Themes
1. Select desired theme
2. Click "Share Theme" button
3. Theme is copied to `~/.ktheme/shared/`
4. Other apps can now access it

### Importing Custom Themes
1. Click "Import Theme" button
2. Select JSON theme file
3. Theme appears in library
4. Can be shared or exported

### Using in Other Apps
1. Run Ktheme Library and share themes
2. Run your application
3. Use KthemeAPI to get shared themes
4. Apply theme colors to your UI

## Technical Details

### Theme Card Rendering
- Custom JList cell renderer
- Painted color swatches using Graphics2D
- Hover effect for selection
- Fixed cell height for consistent scrolling

### Theme Preview
- Dynamic color application
- Real-time UI component updates
- Material Design color mapping
- Sample UI elements for preview

### Cross-App Communication
- File-based sharing (simple, reliable)
- JSON format for portability
- No IPC complexity
- Works across different JVM processes

### Performance
- Lazy loading of themes
- Efficient list rendering
- Minimal memory footprint
- Fast theme switching

## Accessibility and Keyboard Navigation Defaults

Ktheme's Swing-based Kotlin plugin uses accessibility defaults designed for TalkBack/screen-reader parity and predictable keyboard usage.

### Control metadata defaults

All key interactive controls include:
- **Explicit content descriptions** (`accessibleName`, `accessibleDescription`).
- **Role/type hints** embedded in labels/descriptions (for example: button, list, status).
- **Action hints** where relevant (for example: arrow keys for list movement).

These defaults are centralized in:
- `src/main/kotlin/com/ktheme/utils/AccessibilityUtils.kt`

### State announcements

The UI emits explicit state announcements on:
- Theme selection changes in the theme list.
- Theme preview updates.
- Apply/share/import/export/search/filter actions.

Announcements are routed through the status label and `ACCESSIBLE_VISIBLE_DATA_PROPERTY` updates.

### Focus order policy

Focus traversal is deterministic and matches visual order:
1. Search field
2. Search button
3. Theme list
4. Apply Theme
5. Share Theme
6. Export Theme
7. Import Theme

This is enforced with a custom ordered `FocusTraversalPolicy` from `AccessibilityUtils.applyDeterministicFocusOrder(...)`.

### Verification flow

For a manual validation run with screen readers/TalkBack-style navigation, run:
- `com.ktheme.examples.AccessibilityVerificationFlow`

The flow prints a checklist and launches `ThemeLibraryWindow` for step-by-step validation.
