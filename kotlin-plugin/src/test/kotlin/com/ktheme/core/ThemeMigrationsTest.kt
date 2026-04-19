package com.ktheme.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test
import java.nio.file.Files

class ThemeMigrationsTest {
    private fun loadFixture(name: String): String {
        val stream = javaClass.getResourceAsStream("/core/__fixtures__/$name")
            ?: throw IllegalStateException("Missing fixture: $name")
        return stream.bufferedReader().use { it.readText() }
    }

    @Test
    fun `importTheme migrates explicit v0 schema payloads`() {
        val engine = ThemeEngine()

        val imported = engine.importTheme(loadFixture("legacy-theme-v0.json"))

        assertEquals(SCHEMA_VERSION, imported.schemaVersion)
        assertNotNull(engine.getTheme(imported.metadata.id))
        assertEquals("legacy-v0", imported.metadata.id)
    }

    @Test
    fun `importTheme migrates payloads with missing schemaVersion`() {
        val engine = ThemeEngine()

        val imported = engine.importTheme(loadFixture("legacy-theme-no-schema.json"))

        assertEquals(SCHEMA_VERSION, imported.schemaVersion)
        assertNotNull(engine.getTheme(imported.metadata.id))
        assertEquals("legacy-no-schema", imported.metadata.id)
    }

    @Test
    fun `loadThemeFromFile routes through migration flow`() {
        val engine = ThemeEngine()
        val tempFile = Files.createTempFile("ktheme-legacy-import", ".json").toFile()
        tempFile.writeText(loadFixture("legacy-theme-v0.json"))

        val imported = engine.loadThemeFromFile(tempFile)

        assertEquals(SCHEMA_VERSION, imported.schemaVersion)
        assertNotNull(engine.getTheme("legacy-v0"))
    }
}
