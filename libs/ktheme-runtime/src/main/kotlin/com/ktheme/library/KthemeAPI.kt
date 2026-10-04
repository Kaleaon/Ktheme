package com.ktheme.library

import com.ktheme.models.Theme
import kotlinx.serialization.json.Json
import java.util.concurrent.CopyOnWriteArrayList

public interface ThemeChangeListener {
    public fun onThemeAdded(theme: Theme)
    public fun onThemeRemoved(themeId: String)
    public fun onThemeUpdated(theme: Theme)
}

public object KthemeAPI {
    private val themes = linkedMapOf<String, Theme>()
    private val listeners = CopyOnWriteArrayList<ThemeChangeListener>()
    private val json = Json {
        ignoreUnknownKeys = true
        prettyPrint = true
    }

    init {
        loadEmbeddedThemes()
    }

    private fun loadEmbeddedThemes() {
        try {
            val stream = KthemeAPI::class.java.classLoader.getResourceAsStream("themes/index.txt")
            if (stream != null) {
                val filenames = stream.bufferedReader().use { it.readLines() }
                for (name in filenames) {
                    val trimmed = name.trim()
                    if (trimmed.isNotBlank()) {
                        val fileStream = KthemeAPI::class.java.classLoader.getResourceAsStream("themes/$trimmed")
                        if (fileStream != null) {
                            val text = fileStream.bufferedReader().use { it.readText() }
                            val theme = json.decodeFromString<Theme>(text)
                            if (theme.metadata.id.isNotBlank()) {
                                themes[theme.metadata.id] = theme
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            // Ignore malformed embedded resources
        }
    }

    public fun getAvailableThemes(): List<Theme> = themes.values.toList()

    public fun shareTheme(theme: Theme) {
        val existed = themes.containsKey(theme.metadata.id)
        themes[theme.metadata.id] = theme
        listeners.forEach { listener ->
            if (existed) listener.onThemeUpdated(theme) else listener.onThemeAdded(theme)
        }
    }

    public fun removeTheme(themeId: String) {
        if (themes.remove(themeId) != null) {
            listeners.forEach { it.onThemeRemoved(themeId) }
        }
    }

    public fun onThemeChanged(listener: ThemeChangeListener) {
        listeners.add(listener)
    }
}
