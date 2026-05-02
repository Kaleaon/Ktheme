// libs/ktheme-core/src/main/kotlin/io/ktheme/model/Theme.kt
//
// Top-level Theme data class — 1:1 with the canonical Ktheme JSON shape
// shipped in `themes/examples/*.json`. Field names match the JSON exactly
// so kotlinx.serialization can round-trip without custom serializers.
//
// Anything optional in the JSON is nullable here so older preset files
// (which omit `adaptation`, `typography`, etc.) parse cleanly.

package io.ktheme.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
public data class Theme(
    public val metadata: ThemeMetadata,
    public val darkMode: Boolean = true,
    public val colorScheme: ColorScheme,
    public val effects: Effects = Effects(),
    public val typography: Typography? = null,
    public val adaptation: Adaptation? = null,
)

@Serializable
public data class ThemeMetadata(
    public val id: String,
    public val name: String,
    public val description: String = "",
    public val author: String = "Ktheme",
    public val version: String = "1.0.0",
    public val tags: List<String> = emptyList(),
    public val createdAt: String? = null,
    public val updatedAt: String? = null,
)

/**
 * Material Design 3 color roles. Hex strings (#RRGGBB or #AARRGGBB).
 * Use [Theme.toM3] in the Compose integration to convert to androidx
 * `ColorScheme`.
 */
@Serializable
public data class ColorScheme(
    public val primary: String,
    public val onPrimary: String,
    public val primaryContainer: String,
    public val onPrimaryContainer: String,
    public val secondary: String,
    public val onSecondary: String,
    public val secondaryContainer: String,
    public val onSecondaryContainer: String,
    public val tertiary: String,
    public val onTertiary: String,
    public val tertiaryContainer: String,
    public val onTertiaryContainer: String,
    public val error: String,
    public val onError: String,
    public val errorContainer: String,
    public val onErrorContainer: String,
    public val background: String,
    public val onBackground: String,
    public val surface: String,
    public val onSurface: String,
    public val surfaceVariant: String,
    public val onSurfaceVariant: String,
    public val outline: String,
    public val outlineVariant: String,
    public val scrim: String = "#000000",
    public val inverseSurface: String,
    public val inverseOnSurface: String,
    public val inversePrimary: String,
    /** Optional MD3 state-layer tints. */
    public val stateLayers: StateLayers? = null,
    /** Optional product-semantic roles (success/warning/info/critical). */
    public val semanticRoles: SemanticRoles? = null,
)

@Serializable
public data class StateLayers(
    public val hover: String,
    public val pressed: String,
    public val focused: String,
    public val dragged: String,
)

@Serializable
public data class SemanticRoles(
    public val success: String,
    public val warning: String,
    public val info: String,
    public val critical: String,
)

@Serializable
public data class Typography(
    public val fontFamily: String = "system-ui, -apple-system, sans-serif",
    public val fontSize: FontSize = FontSize(),
    public val fontWeight: FontWeight = FontWeight(),
    public val lineHeight: Double = 1.5,
    public val letterSpacing: Double = 0.0,
)

@Serializable
public data class FontSize(
    public val small: Int = 12,
    public val medium: Int = 16,
    public val large: Int = 20,
    public val xlarge: Int = 28,
)

@Serializable
public data class FontWeight(
    public val light: Int = 300,
    public val regular: Int = 400,
    public val medium: Int = 500,
    public val bold: Int = 700,
)

@Serializable
public data class Adaptation(
    public val layout: LayoutAdaptation? = null,
    public val icons: IconAdaptation? = null,
    public val componentOverrides: List<ComponentOverride> = emptyList(),
)

@Serializable
public data class LayoutAdaptation(
    public val density: Density = Density.Comfortable,
    public val cornerStyle: CornerStyle = CornerStyle.Rounded,
    public val spacingScale: Double = 1.0,
    public val panelStyle: PanelStyle = PanelStyle.Flat,
    public val navigationStyle: NavigationStyle = NavigationStyle.Tabs,
)

@Serializable
public enum class Density {
    @SerialName("compact") Compact,
    @SerialName("comfortable") Comfortable,
    @SerialName("spacious") Spacious;

    public val scale: Double get() = when (this) {
        Compact -> 0.92
        Comfortable -> 1.0
        Spacious -> 1.25
    }
}

@Serializable
public enum class CornerStyle {
    @SerialName("sharp") Sharp,
    @SerialName("rounded") Rounded,
    @SerialName("pill") Pill;

    /** Default corner radius in dp/pt for this style. */
    public val radiusDp: Int get() = when (this) {
        Sharp -> 0
        Rounded -> 12
        Pill -> 24
    }
}

@Serializable
public enum class PanelStyle {
    @SerialName("flat") Flat,
    @SerialName("glass") Glass,
    @SerialName("elevated") Elevated,
}

@Serializable
public enum class NavigationStyle {
    @SerialName("tabs") Tabs,
    @SerialName("rail") Rail,
    @SerialName("drawer") Drawer,
    @SerialName("pivot") Pivot,
    @SerialName("bottom") Bottom,
}

@Serializable
public data class IconAdaptation(
    public val family: IconFamily = IconFamily.Material,
    public val style: IconStyle = IconStyle.Line,
    public val sizeScale: Double = 1.0,
    public val strokeWidth: Double = 1.5,
    public val cornerStyle: CornerStyle = CornerStyle.Rounded,
)

@Serializable
public enum class IconFamily {
    @SerialName("material") Material,
    @SerialName("fluent")   Fluent,
    @SerialName("sf")       Sf,
    @SerialName("line")     Line,
    @SerialName("duotone")  Duotone,
    @SerialName("custom")   Custom,
}

@Serializable
public enum class IconStyle {
    @SerialName("line")    Line,
    @SerialName("filled")  Filled,
    @SerialName("duotone") Duotone,
}

/**
 * A free-form CSS-style override targeted at a selector. Kept as a string
 * map so any platform can interpret a useful subset (Compose ignores
 * web-only props like `backdrop-filter`; SwiftUI maps `border-radius`
 * to corner radius, etc.).
 */
@Serializable
public data class ComponentOverride(
    public val selector: String,
    public val styles: Map<String, JsonStringOrNumber> = emptyMap(),
)

/**
 * Theme JSON freely mixes string and numeric values inside `styles`
 * (e.g. `"padding-inline": 16` and `"text-transform": "uppercase"`).
 * This wrapper keeps them legible without forcing every consumer to
 * parse JsonElement directly.
 */
@Serializable(with = JsonStringOrNumberSerializer::class)
public data class JsonStringOrNumber(public val raw: String) {
    public val asDoubleOrNull: Double? get() = raw.toDoubleOrNull()
    override fun toString(): String = raw
}
