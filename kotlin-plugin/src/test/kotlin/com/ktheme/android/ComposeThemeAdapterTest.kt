package com.ktheme.android

import androidx.compose.ui.graphics.Color
import com.ktheme.models.ColorScheme
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import com.ktheme.utils.ColorUtils
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class ComposeThemeAdapterTest {
    @Test
    fun `toMaterial3ColorScheme maps representative roles`() {
        val theme = sampleTheme(darkMode = true)

        val material = theme.toMaterial3ColorScheme()

        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.primary)), material.primary)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.onPrimary)), material.onPrimary)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.surfaceVariant)), material.surfaceVariant)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.inversePrimary)), material.inversePrimary)
    }

    @Test
    fun `toMaterial3ColorScheme respects explicit dark override`() {
        val theme = sampleTheme(darkMode = true)

        val material = theme.toMaterial3ColorScheme(isDark = false)

        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.background)), material.background)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.scrim)), material.scrim)
    }

    @Test
    fun `semanticColors maps semantic fields`() {
        val theme = sampleTheme(darkMode = false)

        val semantic = theme.semanticColors()

        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.primary)), semantic.brand)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.onSurface)), semantic.onCardBackground)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.errorContainer)), semantic.dangerContainer)
        assertEquals(Color(ColorUtils.hexToColorInt(theme.colorScheme.inverseOnSurface)), semantic.inverseOnSurface)
    }

    @Test
    fun `toMaterial3ColorScheme throws for invalid hex values`() {
        val invalidHexTheme = sampleTheme(darkMode = true).copy(
            colorScheme = sampleTheme(darkMode = true).colorScheme.copy(primary = "#12")
        )

        assertFailsWith<IllegalArgumentException> {
            invalidHexTheme.toMaterial3ColorScheme()
        }
    }

    @Test
    fun `semanticColors throws for malformed hex characters`() {
        val invalidCharsTheme = sampleTheme(darkMode = false).copy(
            colorScheme = sampleTheme(darkMode = false).colorScheme.copy(error = "#GG0000")
        )

        assertFailsWith<NumberFormatException> {
            invalidCharsTheme.semanticColors()
        }
    }

    private fun sampleTheme(darkMode: Boolean): Theme = Theme(
        metadata = ThemeMetadata(
            id = "sample-theme",
            name = "Sample Theme",
            description = "Theme used for adapter tests",
            author = "tests",
            version = "1.0.0",
            tags = listOf("sample"),
            createdAt = "2026-01-01T00:00:00Z",
            updatedAt = "2026-01-01T00:00:00Z"
        ),
        darkMode = darkMode,
        colorScheme = ColorScheme(
            primary = "#6750A4",
            onPrimary = "#FFFFFF",
            primaryContainer = "#EADDFF",
            onPrimaryContainer = "#21005D",
            secondary = "#625B71",
            onSecondary = "#FFFFFF",
            secondaryContainer = "#E8DEF8",
            onSecondaryContainer = "#1D192B",
            tertiary = "#7D5260",
            onTertiary = "#FFFFFF",
            tertiaryContainer = "#FFD8E4",
            onTertiaryContainer = "#31111D",
            error = "#B3261E",
            onError = "#FFFFFF",
            errorContainer = "#F9DEDC",
            onErrorContainer = "#410E0B",
            background = "#1C1B1F",
            onBackground = "#E6E1E5",
            surface = "#1C1B1F",
            onSurface = "#E6E1E5",
            surfaceVariant = "#49454F",
            onSurfaceVariant = "#CAC4D0",
            outline = "#938F99",
            outlineVariant = "#49454F",
            scrim = "#000000",
            inverseSurface = "#E6E1E5",
            inverseOnSurface = "#313033",
            inversePrimary = "#D0BCFF"
        )
    )
}
