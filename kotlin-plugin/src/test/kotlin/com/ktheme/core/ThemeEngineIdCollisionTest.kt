package com.ktheme.core

import com.ktheme.models.ColorScheme
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import com.ktheme.utils.ThemeIdCollisionPolicy
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

class ThemeEngineIdCollisionTest {

    @Test
    fun `registerTheme normalizes id to kebab case`() {
        val engine = ThemeEngine()

        val registered = engine.registerTheme(themeWithId("  My COOL__Theme!!!  "))

        assertEquals("my-cool-theme", registered.metadata.id)
        assertEquals("my-cool-theme", engine.getAllThemes().single().metadata.id)
    }

    @Test
    fun `registerTheme rejects empty id after normalization`() {
        val engine = ThemeEngine()

        assertFailsWith<IllegalArgumentException> {
            engine.registerTheme(themeWithId("!!!"))
        }
    }

    @Test
    fun `registerTheme collision overwrite keeps original id`() {
        val engine = ThemeEngine()
        engine.registerTheme(themeWithId("dup"))

        val registered = engine.registerTheme(
            themeWithId("dup"),
            ThemeIdCollisionPolicy.OVERWRITE
        )

        assertEquals("dup", registered.metadata.id)
        assertEquals(1, engine.getAllThemes().size)
    }

    @Test
    fun `registerTheme collision reject throws`() {
        val engine = ThemeEngine()
        engine.registerTheme(themeWithId("dup"))

        assertFailsWith<IllegalArgumentException> {
            engine.registerTheme(themeWithId("dup"), ThemeIdCollisionPolicy.REJECT)
        }
    }

    @Test
    fun `registerTheme collision suffix appends incremental numbers`() {
        val engine = ThemeEngine()
        engine.registerTheme(themeWithId("dup"))
        val second = engine.registerTheme(themeWithId("dup"), ThemeIdCollisionPolicy.SUFFIX)
        val third = engine.registerTheme(themeWithId("dup"), ThemeIdCollisionPolicy.SUFFIX)

        assertEquals("dup-2", second.metadata.id)
        assertEquals("dup-3", third.metadata.id)
    }

    private fun themeWithId(id: String): Theme {
        return Theme(
            metadata = ThemeMetadata(
                id = id,
                name = "Test Theme",
                description = "Testing",
                author = "test",
                version = "1.0.0",
                tags = listOf("test"),
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
