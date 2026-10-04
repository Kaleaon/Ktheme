package com.ktheme

import com.ktheme.library.KthemeAPI
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class KthemeRuntimeTest {

    @Test
    fun testEmbeddedThemesLoaded() {
        val themes = KthemeAPI.getAvailableThemes()
        assertEquals(32, themes.size, "Expected 32 embedded themes to be loaded in KthemeAPI")
    }

    @Test
    fun testDefaultThemePresent() {
        val themes = KthemeAPI.getAvailableThemes()
        val defaultTheme = themes.firstOrNull { it.metadata.id == "linkpoint_default" }
        assertNotNull(defaultTheme, "Expected linkpoint_default theme to exist")
        assertEquals("Linkpoint Blue", defaultTheme.metadata.name)
    }

    @Test
    fun testLayoutStructures() {
        val themes = KthemeAPI.getAvailableThemes()
        val lcars = themes.firstOrNull { it.metadata.id == "lcars" }
        assertNotNull(lcars)
        assertTrue(lcars.colorScheme.primary.isNotBlank())
    }
}
