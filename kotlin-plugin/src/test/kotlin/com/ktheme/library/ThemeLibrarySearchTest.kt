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
        val ids = result.map { it.theme.metadata.id }

        assertEquals(ids.toSet().size, ids.size, "Expected search result IDs to be unique")
    }

    @Test
    fun `searchThemes ordering is stable for the same input`() {
        val library = createLibraryWithThemes()

        val first = library.searchThemes("aurora")
        val second = library.searchThemes("aurora")

        assertEquals(
            first.map { it.theme.metadata.id },
            second.map { it.theme.metadata.id },
            "Expected deterministic ordering for repeated calls"
        )
    }

    @Test
    fun `searchThemes with mixed name and tag terms returns predictable set`() {
        val library = createLibraryWithThemes()

        val result = library.searchThemes("midnight, cool")
        val ids = result.map { it.theme.metadata.id }

        assertEquals(listOf("midnight-blue", "cool-breeze", "aurora", "aurora-light"), ids)
        assertTrue("sunset-warm" !in ids, "Expected unmatched themes to be excluded")
    }

    @Test
    fun `searchThemes weighted scoring prefers exact over prefix over substring over tags`() {
        val library = createLibraryWithThemes()

        val result = library.searchThemes("aurora")

        assertEquals(listOf("aurora", "aurora-light", "night-aurora", "midnight-blue"), result.map { it.theme.metadata.id })
        assertEquals(listOf("nameExact"), result[0].matchedFields)
        assertEquals(listOf("namePrefix"), result[1].matchedFields)
        assertEquals(listOf("nameSubstring"), result[2].matchedFields)
        assertEquals(listOf("tags"), result[3].matchedFields)
        assertTrue(result[0].score > result[1].score && result[1].score > result[2].score && result[2].score > result[3].score)
    }

    @Test
    fun `searchThemes supports optional filters and pagination`() {
        val library = createLibraryWithThemes()

        val result = library.searchThemes(
            query = "",
            darkMode = false,
            author = "alice",
            tags = setOf("cool"),
            updatedAfter = "2026-01-06T00:00:00Z",
            offset = 0,
            limit = 10
        )

        assertEquals(listOf("cool-breeze"), result.map { it.theme.metadata.id })

        val paged = library.searchThemes(query = "aurora", offset = 1, limit = 2)
        assertEquals(listOf("aurora-light", "night-aurora"), paged.map { it.theme.metadata.id })
    }

    private fun createLibraryWithThemes(): ThemeLibrary {
        val library = ThemeLibrary()

        registerTheme(
            library,
            theme(
                id = "aurora",
                name = "Aurora",
                description = "Exact match theme",
                tags = listOf("cool"),
                author = "alice",
                darkMode = true,
                updatedAt = "2026-01-04T00:00:00Z"
            )
        )

        registerTheme(
            library,
            theme(
                id = "aurora-light",
                name = "Aurora Light",
                description = "Soft aurora gradients",
                tags = listOf("aurora", "cool"),
                author = "alice",
                darkMode = true,
                updatedAt = "2026-01-05T00:00:00Z"
            )
        )

        registerTheme(
            library,
            theme(
                id = "night-aurora",
                name = "Night Aurora Glow",
                description = "Aurora appears in name as substring",
                tags = listOf("night"),
                author = "bob",
                darkMode = true,
                updatedAt = "2026-01-06T00:00:00Z"
            )
        )

        registerTheme(
            library,
            theme(
                id = "midnight-blue",
                name = "Midnight Blue",
                description = "Deep blue night theme",
                tags = listOf("aurora", "dark"),
                author = "charlie",
                darkMode = true,
                updatedAt = "2026-01-02T00:00:00Z"
            )
        )

        registerTheme(
            library,
            theme(
                id = "cool-breeze",
                name = "Cool Breeze",
                description = "Breezy neutral palette",
                tags = listOf("cool", "fresh"),
                author = "alice",
                darkMode = false,
                updatedAt = "2026-01-07T00:00:00Z"
            )
        )

        registerTheme(
            library,
            theme(
                id = "sunset-warm",
                name = "Sunset Warm",
                description = "Warm evening oranges",
                tags = listOf("warm", "orange"),
                author = "alice",
                darkMode = false,
                updatedAt = "2026-01-03T00:00:00Z"
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

    private fun theme(
        id: String,
        name: String,
        description: String,
        tags: List<String>,
        author: String,
        darkMode: Boolean,
        updatedAt: String
    ): Theme {
        return Theme(
            metadata = ThemeMetadata(
                id = id,
                name = name,
                description = description,
                author = author,
                version = "1.0.0",
                tags = tags,
                createdAt = "2026-01-01T00:00:00Z",
                updatedAt = updatedAt
            ),
            darkMode = darkMode,
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
