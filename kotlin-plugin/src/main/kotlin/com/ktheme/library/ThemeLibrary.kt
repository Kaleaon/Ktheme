package com.ktheme.library

import com.ktheme.core.ThemeEngine
import com.ktheme.models.Theme
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

/**
 * Theme Library - Central repository for managing and sharing themes across applications
 * 
 * This library provides:
 * - Theme discovery and loading from multiple sources
 * - Cross-application theme sharing
 * - Theme export/import capabilities
 * - Theme provider pattern for app integration
 */
class ThemeLibrary {
    private val engine = ThemeEngine()
    private val listeners = mutableListOf<ThemeLibraryListener>()
    
    companion object {
        // Shared theme directory for cross-app theme sharing
        private val SHARED_THEMES_DIR = File(System.getProperty("user.home"), ".ktheme/shared")
        private val USER_THEMES_DIR = File(System.getProperty("user.home"), ".ktheme/user")
        
        init {
            SHARED_THEMES_DIR.mkdirs()
            USER_THEMES_DIR.mkdirs()
        }
    }
    
    /**
     * Load all available themes from various sources
     */
    fun loadAllThemes(bundledThemesDir: File? = null) {
        // Load bundled themes if provided
        bundledThemesDir?.let { loadThemesFromDirectory(it, "bundled") }
        
        // Load shared themes
        loadThemesFromDirectory(SHARED_THEMES_DIR, "shared")
        
        // Load user themes
        loadThemesFromDirectory(USER_THEMES_DIR, "user")
        
        notifyThemesLoaded()
    }
    
    /**
     * Load themes from a specific directory
     */
    private fun loadThemesFromDirectory(directory: File, source: String) {
        if (!directory.exists() || !directory.isDirectory) {
            println("Theme directory not found: ${directory.absolutePath}")
            return
        }
        
        directory.listFiles()?.filter { it.extension == "json" }?.forEach { file ->
            try {
                val theme = engine.loadThemeFromFile(file)
                println("✓ Loaded theme: ${theme.metadata.name} from $source")
            } catch (e: Exception) {
                println("✗ Failed to load ${file.name}: ${e.message}")
            }
        }
    }
    
    /**
     * Get all loaded themes
     */
    fun getAllThemes(): List<Theme> = engine.getAllThemes()
    
    /**
     * Get theme by ID
     */
    fun getTheme(id: String): Theme? = engine.getTheme(id)
    
    /**
     * Search themes by various criteria
     */
    fun searchThemes(query: String): List<Theme> {
        val normalizedQueryTerms = query
            .split(',', ' ', '\n', '\t')
            .map { it.trim().lowercase() }
            .filter { it.isNotEmpty() }
            .distinct()

        if (normalizedQueryTerms.isEmpty()) {
            return emptyList()
        }

        val allThemes = engine.getAllThemes()

        val rankedNameMatches = allThemes
            .mapIndexedNotNull { index, theme ->
                val name = theme.metadata.name.lowercase()
                val description = theme.metadata.description.lowercase()

                val score = when {
                    normalizedQueryTerms.any { term -> name == term } -> 300
                    normalizedQueryTerms.any { term -> name.contains(term) } -> 200
                    normalizedQueryTerms.any { term -> description.contains(term) } -> 150
                    else -> null
                }

                score?.let { Triple(theme, it, index) }
            }
            .sortedWith(compareByDescending<Triple<Theme, Int, Int>> { it.second }.thenBy { it.third })
            .map { it.first }

        val nameMatchIds = rankedNameMatches.map { it.metadata.id }.toSet()

        val rankedTagOnlyMatches = allThemes
            .mapIndexedNotNull { index, theme ->
                if (theme.metadata.id in nameMatchIds) {
                    return@mapIndexedNotNull null
                }

                val normalizedThemeTags = theme.metadata.tags.map { it.trim().lowercase() }
                val matchedTagCount = normalizedQueryTerms.count { term -> term in normalizedThemeTags }

                if (matchedTagCount > 0) {
                    Triple(theme, matchedTagCount, index)
                } else {
                    null
                }
            }
            .sortedWith(compareByDescending<Triple<Theme, Int, Int>> { it.second }.thenBy { it.third })
            .map { it.first }

        return rankedNameMatches + rankedTagOnlyMatches
    }
    
    /**
     * Get themes by tag
     */
    fun getThemesByTag(tag: String): List<Theme> {
        return engine.searchByTags(listOf(tag))
    }
    
    /**
     * Share a theme to the shared directory (for cross-app access)
     */
    fun shareTheme(themeId: String): Boolean {
        return try {
            val theme = engine.getTheme(themeId) ?: return false
            val sharedFile = File(SHARED_THEMES_DIR, "${theme.metadata.id}.json")
            engine.saveThemeToFile(themeId, sharedFile)
            println("Theme shared: ${theme.metadata.name}")
            true
        } catch (e: Exception) {
            println("Failed to share theme: ${e.message}")
            false
        }
    }
    
    /**
     * Export theme to a specific file
     */
    fun exportTheme(themeId: String, targetFile: File): Boolean {
        return try {
            engine.saveThemeToFile(themeId, targetFile)
            true
        } catch (e: Exception) {
            println("Failed to export theme: ${e.message}")
            false
        }
    }
    
    /**
     * Import theme from file
     */
    fun importTheme(file: File): Theme? {
        return try {
            val theme = engine.loadThemeFromFile(file)
            // Copy to user themes directory
            val userFile = File(USER_THEMES_DIR, file.name)
            Files.copy(file.toPath(), userFile.toPath(), StandardCopyOption.REPLACE_EXISTING)
            notifyThemeImported(theme)
            theme
        } catch (e: Exception) {
            println("Failed to import theme: ${e.message}")
            null
        }
    }
    
    /**
     * Add a listener for library events
     */
    fun addListener(listener: ThemeLibraryListener) {
        listeners.add(listener)
    }
    
    /**
     * Remove a listener
     */
    fun removeListener(listener: ThemeLibraryListener) {
        listeners.remove(listener)
    }
    
    private fun notifyThemesLoaded() {
        listeners.forEach { it.onThemesLoaded(getAllThemes()) }
    }
    
    private fun notifyThemeImported(theme: Theme) {
        listeners.forEach { it.onThemeImported(theme) }
    }
    
    /**
     * Get the shared themes directory for cross-app access
     */
    fun getSharedThemesDirectory(): File = SHARED_THEMES_DIR
    
    /**
     * Get the user themes directory
     */
    fun getUserThemesDirectory(): File = USER_THEMES_DIR
}

/**
 * Listener interface for theme library events
 */
interface ThemeLibraryListener {
    fun onThemesLoaded(themes: List<Theme>)
    fun onThemeImported(theme: Theme)
}
