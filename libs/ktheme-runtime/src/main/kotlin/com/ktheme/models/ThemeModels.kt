package com.ktheme.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
public data class ThemeMetadata(
    public val id: String = "",
    public val name: String = "",
    public val description: String = "",
    public val author: String = "",
    public val version: String = "1.0.0",
    public val tags: List<String> = emptyList(),
    public val createdAt: String = "",
    public val updatedAt: String = ""
)

@Serializable
public data class ColorScheme(
    public val primary: String,
    public val onPrimary: String,
    public val primaryContainer: String = primary,
    public val onPrimaryContainer: String = onPrimary,
    public val secondary: String = primary,
    public val onSecondary: String = onPrimary,
    public val secondaryContainer: String = secondary,
    public val onSecondaryContainer: String = onSecondary,
    public val tertiary: String = secondary,
    public val onTertiary: String = onSecondary,
    public val tertiaryContainer: String = tertiary,
    public val onTertiaryContainer: String = onSecondary,
    public val error: String = "#F44336",
    public val onError: String = "#FFFFFF",
    public val errorContainer: String = error,
    public val onErrorContainer: String = onError,
    public val background: String = "#121212",
    public val onBackground: String = "#FFFFFF",
    public val surface: String = "#1E1E1E",
    public val onSurface: String = "#FFFFFF",
    public val surfaceVariant: String = surface,
    public val onSurfaceVariant: String = onSurface,
    public val outline: String = onSurfaceVariant,
    public val outlineVariant: String = outline,
    public val scrim: String = "#000000",
    public val inverseSurface: String = onSurface,
    public val inverseOnSurface: String = surface,
    public val inversePrimary: String = primary
)

@Serializable
public enum class LayoutStructure(
    public val id: String,
    public val displayName: String
) {
    @SerialName("metro") METRO("metro", "Metro"),
    @SerialName("lcars") LCARS("lcars", "LCARS"),
    @SerialName("frutiger_aero") FRUTIGER_AERO("frutiger_aero", "Frutiger Aero"),
    @SerialName("art_deco") ART_DECO("art_deco", "Art Deco"),
    @SerialName("terminal") TERMINAL("terminal", "Terminal"),
    @SerialName("modern_glass") MODERN_GLASS("modern_glass", "Modern Glass"),
    @SerialName("material3") MATERIAL3("material3", "Material3"),
    @SerialName("cyberpunk") CYBERPUNK("cyberpunk", "Cyberpunk");

    public companion object {
        public fun fromId(id: String): LayoutStructure {
            return entries.firstOrNull { it.id.equals(id, ignoreCase = true) || it.name.equals(id, ignoreCase = true) }
                ?: MATERIAL3
        }
    }
}

@Serializable
public data class Theme(
    public val metadata: ThemeMetadata,
    public val darkMode: Boolean = true,
    public val colorScheme: ColorScheme,
    public val layoutStructure: LayoutStructure = LayoutStructure.MATERIAL3
)
