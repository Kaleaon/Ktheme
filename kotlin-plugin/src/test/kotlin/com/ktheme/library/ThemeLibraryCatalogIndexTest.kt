package com.ktheme.library

import com.ktheme.core.ThemeEngine
import com.ktheme.models.ColorScheme
import com.ktheme.models.FontSize
import com.ktheme.models.FontWeight
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import com.ktheme.models.Typography
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.io.File
import java.nio.file.Files
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class ThemeLibraryCatalogIndexTest {

    private val json = Json { ignoreUnknownKeys = true }

    @Test
    fun `loadAllThemes creates catalog index`() {
        val root = Files.createTempDirectory("ktheme-index-create").toFile()
        val bundledDir = File(root, "bundled").apply { mkdirs() }
        val sharedDir = File(root, ".ktheme/shared").apply { mkdirs() }
        val userDir = File(root, ".ktheme/user").apply { mkdirs() }
        val catalogFile = File(root, ".ktheme/catalog.json")

        writeThemeJson(File(bundledDir, "bundled.json"), theme("bundled-theme", "Bundled Theme"))
        writeThemeJson(File(sharedDir, "shared.json"), theme("shared-theme", "Shared Theme"))
        writeThemeJson(File(userDir, "user.json"), theme("user-theme", "User Theme"))

        val library = ThemeLibrary(root, sharedDir, userDir, catalogFile)
        library.loadAllThemes(bundledDir)

        assertTrue(catalogFile.exists(), "Expected catalog file to be created")

        val index = json.decodeFromString<ThemeCatalogIndex>(catalogFile.readText())
        assertEquals(3, index.entries.size)
        assertEquals(setOf("bundled", "shared", "user"), index.entries.map { it.source }.toSet())

        index.entries.forEach { entry ->
            assertTrue(entry.checksum.isNotBlank(), "Expected checksum for ${entry.filePath}")
            assertTrue(File(entry.filePath).exists(), "Expected indexed file to exist")
        }
    }

    @Test
    fun `loadAllThemes removes stale entries and adds new files incrementally`() {
        val root = Files.createTempDirectory("ktheme-index-stale").toFile()
        val sharedDir = File(root, ".ktheme/shared").apply { mkdirs() }
        val userDir = File(root, ".ktheme/user").apply { mkdirs() }
        val catalogFile = File(root, ".ktheme/catalog.json")

        val staleFile = File(userDir, "stale.json")
        writeThemeJson(staleFile, theme("stale", "Stale"))

        val library = ThemeLibrary(root, sharedDir, userDir, catalogFile)
        library.loadAllThemes()

        assertNotNull(library.getTheme("stale"), "Expected stale theme to be loaded initially")

        assertTrue(staleFile.delete(), "Expected stale file to be deleted")
        writeThemeJson(File(sharedDir, "fresh.json"), theme("fresh", "Fresh"))

        library.loadAllThemes()

        assertEquals(null, library.getTheme("stale"), "Expected stale theme to be removed from engine")
        assertNotNull(library.getTheme("fresh"), "Expected new theme to be loaded")

        val index = json.decodeFromString<ThemeCatalogIndex>(catalogFile.readText())
        val ids = index.entries.map { it.id }.toSet()
        assertFalse("stale" in ids, "Expected stale entry to be removed from catalog")
        assertTrue("fresh" in ids, "Expected fresh entry to be present in catalog")
    }

    @Test
    fun `loadAllThemes recovers from corrupted catalog file`() {
        val root = Files.createTempDirectory("ktheme-index-corrupt").toFile()
        val sharedDir = File(root, ".ktheme/shared").apply { mkdirs() }
        val userDir = File(root, ".ktheme/user").apply { mkdirs() }
        val catalogFile = File(root, ".ktheme/catalog.json")

        val themeFile = File(userDir, "recoverable.json")
        writeThemeJson(themeFile, theme("recover-theme", "Recover Theme"))

        catalogFile.parentFile.mkdirs()
        catalogFile.writeText("{ definitely not valid json")

        val library = ThemeLibrary(root, sharedDir, userDir, catalogFile)
        library.loadAllThemes()

        assertNotNull(library.getTheme("recover-theme"), "Expected theme to load after catalog recovery")

        val recoveredIndex = json.decodeFromString<ThemeCatalogIndex>(catalogFile.readText())
        assertEquals(1, recoveredIndex.entries.size)
        assertEquals("recover-theme", recoveredIndex.entries.single().id)
    }

    private fun writeThemeJson(target: File, theme: Theme) {
        target.parentFile?.mkdirs()
        val engine = ThemeEngine()
        engine.registerTheme(theme)
        engine.saveThemeToFile(theme.metadata.id, target)
    }

    private fun theme(id: String, name: String): Theme {
        return Theme(
            metadata = ThemeMetadata(
                id = id,
                name = name,
                description = "$name description",
                author = "test",
                version = "1.0.0",
                tags = listOf("test", id),
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
