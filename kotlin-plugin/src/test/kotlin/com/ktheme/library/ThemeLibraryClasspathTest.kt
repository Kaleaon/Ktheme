package com.ktheme.library

import io.ktheme.presets.Presets
import java.io.File
import java.nio.file.Files
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class ThemeLibraryClasspathTest {

    @Test
    fun `loadAllThemes loads all 24 canonical theme presets from classpath`() {
        val root = Files.createTempDirectory("ktheme-classpath-test").toFile()
        val sharedDir = File(root, ".ktheme/shared").apply { mkdirs() }
        val userDir = File(root, ".ktheme/user").apply { mkdirs() }
        val catalogFile = File(root, ".ktheme/catalog.json")

        val library = ThemeLibrary(root, sharedDir, userDir, catalogFile)
        library.loadAllThemes()

        val allThemes = library.getAllThemes()
        assertEquals(24, allThemes.size, "Expected exactly 24 canonical theme presets to be loaded from classpath")

        // Verify each canonical preset ID is present
        assertEquals(24, Presets.ALL_IDS.size)
        for (id in Presets.ALL_IDS) {
            val theme = library.getTheme(id)
            assertNotNull(theme, "Expected canonical preset '$id' to be available in ThemeLibrary")
            assertEquals(id, theme.metadata.id)
            assertTrue(theme.metadata.name.isNotBlank(), "Expected non-blank theme name for '$id'")
            assertTrue(theme.colorScheme.primary.isNotBlank(), "Expected primary color for '$id'")
        }
    }

    @Test
    fun `loadAllThemes preserves user and shared directory themes alongside classpath presets`() {
        val root = Files.createTempDirectory("ktheme-classpath-user-test").toFile()
        val sharedDir = File(root, ".ktheme/shared").apply { mkdirs() }
        val userDir = File(root, ".ktheme/user").apply { mkdirs() }
        val catalogFile = File(root, ".ktheme/catalog.json")

        // Write a custom user theme
        val customUserThemeFile = File(userDir, "my-custom-theme.json")
        customUserThemeFile.writeText(
            """
            {
              "schemaVersion": 1,
              "metadata": {
                "id": "my-custom-theme",
                "name": "My Custom Theme",
                "description": "User custom theme",
                "author": "Alice",
                "version": "1.0.0",
                "tags": ["custom"],
                "createdAt": "2026-01-01T00:00:00Z",
                "updatedAt": "2026-01-01T00:00:00Z"
              },
              "darkMode": true,
              "colorScheme": {
                "primary": "#123456",
                "onPrimary": "#FFFFFF",
                "primaryContainer": "#112233",
                "onPrimaryContainer": "#EEEEEE",
                "secondary": "#223344",
                "onSecondary": "#FFFFFF",
                "secondaryContainer": "#334455",
                "onSecondaryContainer": "#EEEEEE",
                "tertiary": "#334455",
                "onTertiary": "#FFFFFF",
                "tertiaryContainer": "#445566",
                "onTertiaryContainer": "#EEEEEE",
                "error": "#B00020",
                "onError": "#FFFFFF",
                "errorContainer": "#FCD8DF",
                "onErrorContainer": "#370617",
                "background": "#000000",
                "onBackground": "#FFFFFF",
                "surface": "#111111",
                "onSurface": "#FFFFFF",
                "surfaceVariant": "#222222",
                "onSurfaceVariant": "#CCCCCC",
                "outline": "#888888",
                "outlineVariant": "#666666",
                "scrim": "#000000",
                "inverseSurface": "#EEEEEE",
                "inverseOnSurface": "#111111",
                "inversePrimary": "#654321"
              }
            }
            """.trimIndent()
        )

        val library = ThemeLibrary(root, sharedDir, userDir, catalogFile)
        library.loadAllThemes()

        val allThemes = library.getAllThemes()
        // 24 canonical presets + 1 user theme = 25 themes
        assertEquals(25, allThemes.size)
        assertNotNull(library.getTheme("my-custom-theme"))
        assertNotNull(library.getTheme("art-deco"))
    }
}
