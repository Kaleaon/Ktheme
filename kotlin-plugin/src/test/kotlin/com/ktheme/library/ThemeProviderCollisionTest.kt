package com.ktheme.library

import com.ktheme.models.ColorScheme
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import com.ktheme.utils.ThemeIdCollisionPolicy
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ThemeProviderCollisionTest {
    private val json = Json { ignoreUnknownKeys = true }

    @Test
    fun `publishTheme normalizes id and suffixes collisions`() {
        val sharedDir = kotlin.io.path.createTempDirectory("ktheme-shared-collision").toFile()
        val provider = FileBasedThemeProvider(sharedDir)

        val first = provider.publishTheme(themeWithId("My Shared Theme"), ThemeIdCollisionPolicy.SUFFIX)
        val second = provider.publishTheme(themeWithId("my-shared-theme"), ThemeIdCollisionPolicy.SUFFIX)

        assertTrue(first)
        assertTrue(second)
        assertTrue(java.io.File(sharedDir, "my-shared-theme.json").exists())
        assertTrue(java.io.File(sharedDir, "my-shared-theme-2.json").exists())
    }

    @Test
    fun `publishTheme reject policy prevents overwrite`() {
        val sharedDir = kotlin.io.path.createTempDirectory("ktheme-shared-reject").toFile()
        val provider = FileBasedThemeProvider(sharedDir)

        assertTrue(provider.publishTheme(themeWithId("dup"), ThemeIdCollisionPolicy.OVERWRITE))
        assertFalse(provider.publishTheme(themeWithId("dup"), ThemeIdCollisionPolicy.REJECT))
    }

    @Test
    fun `publishTheme overwrite policy replaces file`() {
        val sharedDir = kotlin.io.path.createTempDirectory("ktheme-shared-overwrite").toFile()
        val provider = FileBasedThemeProvider(sharedDir)

        assertTrue(provider.publishTheme(themeWithId("dup", "First"), ThemeIdCollisionPolicy.OVERWRITE))
        assertTrue(provider.publishTheme(themeWithId("dup", "Second"), ThemeIdCollisionPolicy.OVERWRITE))

        val file = java.io.File(sharedDir, "dup.json")
        val persisted = json.decodeFromString<Theme>(file.readText())
        assertEquals("Second", persisted.metadata.name)
    }

    private fun themeWithId(id: String, name: String = "Shared Theme"): Theme {
        return Theme(
            metadata = ThemeMetadata(
                id = id,
                name = name,
                description = "Shared",
                author = "test",
                version = "1.0.0",
                tags = listOf("shared"),
                createdAt = "2026-01-01T00:00:00Z",
                updatedAt = "2026-01-01T00:00:00Z"
            ),
            darkMode = true,
            colorScheme = colorScheme()
        )
    }

    private fun colorScheme(): ColorScheme = ColorScheme(
        primary = "#000000",
        onPrimary = "#FFFFFF",
        primaryContainer = "#111111",
        onPrimaryContainer = "#EEEEEE",
        secondary = "#222222",
        onSecondary = "#FFFFFF",
        secondaryContainer = "#333333",
        onSecondaryContainer = "#EEEEEE",
        tertiary = "#444444",
        onTertiary = "#FFFFFF",
        tertiaryContainer = "#555555",
        onTertiaryContainer = "#EEEEEE",
        error = "#B00020",
        onError = "#FFFFFF",
        errorContainer = "#FCD8DF",
        onErrorContainer = "#370617",
        background = "#121212",
        onBackground = "#FFFFFF",
        surface = "#1E1E1E",
        onSurface = "#FFFFFF",
        surfaceVariant = "#2A2A2A",
        onSurfaceVariant = "#E0E0E0",
        outline = "#8A8A8A",
        outlineVariant = "#6B6B6B",
        scrim = "#000000",
        inverseSurface = "#F5F5F5",
        inverseOnSurface = "#121212",
        inversePrimary = "#9E9E9E"
    )
}
