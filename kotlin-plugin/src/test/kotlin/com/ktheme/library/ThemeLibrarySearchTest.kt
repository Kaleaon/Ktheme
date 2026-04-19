package com.ktheme.library

import com.ktheme.models.ColorScheme
import com.ktheme.models.FontSize
import com.ktheme.models.FontWeight
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import com.ktheme.models.Typography
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ThemeLibrarySearchTest {

    @Test
    fun `searchThemes does not duplicate IDs when a theme matches name and tag`() {
        val library = createLibraryWithThemes()

        val result = library.searchThemes("aurora")
        val ids = result.map { it.metadata.id }

        assertEquals(ids.toSet().size, ids.size, "Expected search result IDs to be unique")
        assertEquals(listOf("aurora-light", "midnight-blue"), ids)
    }

    @Test
    fun `searchThemes ordering is stable for the same input`() {
        val library = createLibraryWithThemes()

        val first = library.searchThemes("aurora")
        val second = library.searchThemes("aurora")

        assertEquals(
            first.map { it.metadata.id },
            second.map { it.metadata.id },
            "Expected deterministic ordering for repeated calls"
        )
    }

    @Test
    fun `searchThemes with mixed name and tag terms returns predictable set`() {
        val library = createLibraryWithThemes()

        val result = library.searchThemes("midnight, cool")
        val ids = result.map { it.metadata.id }

        assertEquals(listOf("midnight-blue", "aurora-light", "cool-breeze"), ids)
        assertTrue("sunset-warm" !in ids, "Expected unmatched themes to be excluded")
    }

    private fun createLibraryWithThemes(): ThemeLibrary {
        val library = ThemeLibrary()

        registerTheme(
            library,
            theme(
                id = "aurora-light",
                name = "Aurora Light",
                description = "Soft aurora gradients",
                tags = listOf("aurora", "cool")
            )
        )

        registerTheme(
            library,
            theme(
                id = "midnight-blue",
                name = "Midnight Blue",
                description = "Deep blue night theme",
                tags = listOf("aurora", "dark")
            )
        )

        registerTheme(
            library,
            theme(
                id = "cool-breeze",
                name = "Cool Breeze",
                description = "Breezy neutral palette",
                tags = listOf("cool", "fresh")
            )
        )

        registerTheme(
            library,
            theme(
                id = "sunset-warm",
                name = "Sunset Warm",
                description = "Warm evening oranges",
                tags = listOf("warm", "orange")
            )
        )

        return library
    }

    private fun registerTheme(library: ThemeLibrary, theme: Theme) {
        val engineField = ThemeLibrary::class.java.getDeclaredField("engine")
        engineField.isAccessible = true
        val engine = engineField.get(library) as com.ktheme.core.ThemeEngine
        engine.registerTheme(theme)
    }

    private fun theme(id: String, name: String, description: String, tags: List<String>): Theme {
        return Theme(
            metadata = ThemeMetadata(
                id = id,
                name = name,
                description = description,
                author = "test",
                version = "1.0.0",
                tags = tags,
                createdAt = "2026-01-01T00:00:00Z",
                updatedAt = "2026-01-01T00:00:00Z"
            ),
            darkMode = true,
            colorScheme = baseColorScheme(),
            typography = Typography(
                fontFamily = "Inter",
                fontSize = FontSize(12, 14, 16, 20),
                fontWeight = FontWeight(300, 400, 500, 700),
                lineHeight = 1.4f,
                letterSpacing = 0f
            )
        )
    }

    private fun baseColorScheme(): ColorScheme = ColorScheme(
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
