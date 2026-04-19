package com.ktheme.library

import com.ktheme.models.ColorScheme
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.nio.file.Files
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class FileBasedThemeProviderTest {
    private val json = Json { prettyPrint = true }

    @Test
    fun `create event triggers onThemeAdded`() {
        val tempDir = Files.createTempDirectory("ktheme-provider-create").toFile()
        val provider = FileBasedThemeProvider(tempDir)
        val addedThemes = CopyOnWriteArrayList<String>()
        val addedLatch = CountDownLatch(1)

        val listener = object : ThemeChangeListener {
            override fun onThemeAdded(theme: Theme) {
                addedThemes.add(theme.metadata.id)
                addedLatch.countDown()
            }

            override fun onThemeRemoved(themeId: String) = Unit

            override fun onThemeUpdated(theme: Theme) = Unit
        }

        provider.subscribeToChanges(listener)

        val createdTheme = createTheme("created-theme", "Created Theme", "1.0.0")
        writeTheme(tempDir, createdTheme)

        assertTrue("Expected onThemeAdded callback", addedLatch.await(5, TimeUnit.SECONDS))
        assertTrue(addedThemes.contains("created-theme"))

        provider.unsubscribe(listener)
    }

    @Test
    fun `modify event triggers onThemeUpdated`() {
        val tempDir = Files.createTempDirectory("ktheme-provider-update").toFile()
        val provider = FileBasedThemeProvider(tempDir)
        val updatedThemes = CopyOnWriteArrayList<String>()
        val updatedLatch = CountDownLatch(1)

        val listener = object : ThemeChangeListener {
            override fun onThemeAdded(theme: Theme) = Unit

            override fun onThemeRemoved(themeId: String) = Unit

            override fun onThemeUpdated(theme: Theme) {
                updatedThemes.add(theme.metadata.version)
                updatedLatch.countDown()
            }
        }

        provider.subscribeToChanges(listener)

        val themeId = "updated-theme"
        writeTheme(tempDir, createTheme(themeId, "Updated Theme", "1.0.0"))
        writeTheme(tempDir, createTheme(themeId, "Updated Theme", "2.0.0"))

        assertTrue("Expected onThemeUpdated callback", updatedLatch.await(5, TimeUnit.SECONDS))
        assertTrue(updatedThemes.contains("2.0.0"))

        provider.unsubscribe(listener)
    }

    @Test
    fun `delete event triggers onThemeRemoved`() {
        val tempDir = Files.createTempDirectory("ktheme-provider-delete").toFile()
        val provider = FileBasedThemeProvider(tempDir)
        val removedThemes = CopyOnWriteArrayList<String>()
        val removedLatch = CountDownLatch(1)

        val listener = object : ThemeChangeListener {
            override fun onThemeAdded(theme: Theme) = Unit

            override fun onThemeRemoved(themeId: String) {
                removedThemes.add(themeId)
                removedLatch.countDown()
            }

            override fun onThemeUpdated(theme: Theme) = Unit
        }

        provider.subscribeToChanges(listener)

        val removedTheme = createTheme("removed-theme", "Removed Theme", "1.0.0")
        val removedFile = writeTheme(tempDir, removedTheme)
        assertTrue(removedFile.delete())

        assertTrue("Expected onThemeRemoved callback", removedLatch.await(5, TimeUnit.SECONDS))
        assertEquals(listOf("removed-theme"), removedThemes.toList())

        provider.unsubscribe(listener)
    }

    @Test
    fun `publishTheme writes checksum metadata envelope`() {
        val tempDir = Files.createTempDirectory("ktheme-provider-publish").toFile()
        val provider = FileBasedThemeProvider(tempDir)
        val theme = createTheme("published-theme", "Published Theme", "1.0.0")

        assertTrue(provider.publishTheme(theme))

        val file = java.io.File(tempDir, "published-theme.json")
        assertTrue(file.exists())
        val payload = file.readText()
        assertTrue(payload.contains("\"fileMetadata\""))
        assertTrue(payload.contains("\"checksum\""))
    }

    @Test
    fun `invalid checksum file is quarantined during read`() {
        val oldHome = System.getProperty("user.home")
        val fakeHome = Files.createTempDirectory("ktheme-home").toFile()
        System.setProperty("user.home", fakeHome.absolutePath)
        try {
            val sharedDir = Files.createTempDirectory("ktheme-provider-invalid").toFile()
            val provider = FileBasedThemeProvider(sharedDir)
            val theme = createTheme("tampered-theme", "Tampered Theme", "1.0.0")
            assertTrue(provider.publishTheme(theme))

            val themeFile = java.io.File(sharedDir, "tampered-theme.json")
            val tamperedPayload = themeFile.readText().replace("#111111", "#121212")
            themeFile.writeText(tamperedPayload)

            val read = provider.getSharedTheme("tampered-theme")
            assertEquals(null, read)
            assertFalse(themeFile.exists())

            val quarantineDir = java.io.File(fakeHome, ".ktheme/quarantine")
            val quarantinedFiles = quarantineDir.listFiles()?.filter { it.name.contains("tampered-theme") }.orEmpty()
            assertTrue(quarantinedFiles.isNotEmpty())
            assertNotNull(quarantinedFiles.firstOrNull())
        } finally {
            System.setProperty("user.home", oldHome)
        }
    }

    @Test
    fun `unsupported checksum algorithm file is quarantined during read`() {
        val oldHome = System.getProperty("user.home")
        val fakeHome = Files.createTempDirectory("ktheme-home").toFile()
        System.setProperty("user.home", fakeHome.absolutePath)
        try {
            val sharedDir = Files.createTempDirectory("ktheme-provider-algorithm").toFile()
            val provider = FileBasedThemeProvider(sharedDir)
            val theme = createTheme("algorithm-theme", "Algorithm Theme", "1.0.0")
            assertTrue(provider.publishTheme(theme))

            val themeFile = java.io.File(sharedDir, "algorithm-theme.json")
            val tamperedPayload = themeFile.readText().replace("\"checksumAlgorithm\": \"SHA-256\"", "\"checksumAlgorithm\": \"SHA-1\"")
            themeFile.writeText(tamperedPayload)

            val read = provider.getSharedTheme("algorithm-theme")
            assertEquals(null, read)
            assertFalse(themeFile.exists())

            val quarantineDir = java.io.File(fakeHome, ".ktheme/quarantine")
            val quarantinedFiles = quarantineDir.listFiles()?.filter { it.name.contains("algorithm-theme") }.orEmpty()
            assertTrue(quarantinedFiles.isNotEmpty())
        } finally {
            System.setProperty("user.home", oldHome)
        }
    }

    @Test
    fun `malformed json file is not quarantined during read`() {
        val oldHome = System.getProperty("user.home")
        val fakeHome = Files.createTempDirectory("ktheme-home").toFile()
        System.setProperty("user.home", fakeHome.absolutePath)
        try {
            val sharedDir = Files.createTempDirectory("ktheme-provider-malformed").toFile()
            val provider = FileBasedThemeProvider(sharedDir)

            val malformedFile = java.io.File(sharedDir, "malformed-theme.json")
            malformedFile.writeText("{\"theme\":")

            val read = provider.getSharedTheme("malformed-theme")
            assertEquals(null, read)
            assertTrue(malformedFile.exists())

            val quarantineDir = java.io.File(fakeHome, ".ktheme/quarantine")
            val quarantinedFiles = quarantineDir.listFiles()?.filter { it.name.contains("malformed-theme") }.orEmpty()
            assertTrue(quarantinedFiles.isEmpty())
        } finally {
            System.setProperty("user.home", oldHome)
        }
    }

    private fun writeTheme(directory: java.io.File, theme: Theme): java.io.File {
        val file = java.io.File(directory, "${theme.metadata.id}.json")
        file.writeText(json.encodeToString(theme))
        return file
    }

    private fun createTheme(id: String, name: String, version: String): Theme {
        return Theme(
            metadata = ThemeMetadata(
                id = id,
                name = name,
                description = "Test theme",
                author = "test",
                version = version,
                tags = listOf("test"),
                createdAt = "2026-01-01T00:00:00Z",
                updatedAt = "2026-01-01T00:00:00Z"
            ),
            darkMode = true,
            colorScheme = ColorScheme(
                primary = "#111111",
                onPrimary = "#FFFFFF",
                primaryContainer = "#222222",
                onPrimaryContainer = "#FFFFFF",
                secondary = "#333333",
                onSecondary = "#FFFFFF",
                secondaryContainer = "#444444",
                onSecondaryContainer = "#FFFFFF",
                tertiary = "#555555",
                onTertiary = "#FFFFFF",
                tertiaryContainer = "#666666",
                onTertiaryContainer = "#FFFFFF",
                error = "#FF0000",
                onError = "#FFFFFF",
                errorContainer = "#550000",
                onErrorContainer = "#FFFFFF",
                background = "#000000",
                onBackground = "#FFFFFF",
                surface = "#121212",
                onSurface = "#FFFFFF",
                surfaceVariant = "#1E1E1E",
                onSurfaceVariant = "#FFFFFF",
                outline = "#888888",
                outlineVariant = "#666666",
                scrim = "#000000",
                inverseSurface = "#FFFFFF",
                inverseOnSurface = "#000000",
                inversePrimary = "#AAAAAA"
            )
        )
    }
}
