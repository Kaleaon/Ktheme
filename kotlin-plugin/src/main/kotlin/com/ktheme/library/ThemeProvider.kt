package com.ktheme.library

import com.ktheme.models.Theme
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File

/**
 * Theme Provider - API for applications to integrate with Ktheme Library
 * 
 * This interface allows any application to:
 * - Access shared themes
 * - Subscribe to theme changes
 * - Provide themes to other apps
 */
interface ThemeProvider {
    /**
     * Get all available shared themes
     */
    fun getSharedThemes(): List<Theme>
    
    /**
     * Get a specific theme by ID from shared storage
     */
    fun getSharedTheme(id: String): Theme?
    
    /**
     * Publish a theme to shared storage
     */
    fun publishTheme(theme: Theme): Boolean
    
    /**
     * Subscribe to theme changes
     */
    fun subscribeToChanges(listener: ThemeChangeListener)
    
    /**
     * Unsubscribe from theme changes
     */
    fun unsubscribe(listener: ThemeChangeListener)
}

/**
 * Listener interface for theme changes
 */
interface ThemeChangeListener {
    fun onThemeAdded(theme: Theme)
    fun onThemeRemoved(themeId: String)
    fun onThemeUpdated(theme: Theme)
}

/**
 * Default implementation of ThemeProvider using file-based sharing
 */
class FileBasedThemeProvider : ThemeProvider {
    private val library = ThemeLibrary()
    private val listeners = mutableListOf<ThemeChangeListener>()
    private val sharedDir = File(System.getProperty("user.home"), ".ktheme/shared")
    private val json = Json { prettyPrint = true }
    
    init {
        sharedDir.mkdirs()
    }
    
    override fun getSharedThemes(): List<Theme> {
        library.loadAllThemes()
        return library.getAllThemes().filter { theme ->
            File(sharedDir, "${theme.metadata.id}.json").exists()
        }
    }
    
    override fun getSharedTheme(id: String): Theme? {
        val file = File(sharedDir, "$id.json")
        return if (file.exists()) {
            try {
                library.importTheme(file)
            } catch (e: Exception) {
                null
            }
        } else {
            null
        }
    }
    
    override fun publishTheme(theme: Theme): Boolean {
        return try {
            val file = File(sharedDir, "${theme.metadata.id}.json")
            // Write directly so apps can publish themes without pre-registering in ThemeLibrary
            file.writeText(json.encodeToString(theme))
            notifyThemeAdded(theme)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    override fun subscribeToChanges(listener: ThemeChangeListener) {
        listeners.add(listener)
    }
    
    override fun unsubscribe(listener: ThemeChangeListener) {
        listeners.remove(listener)
    }
    
    private fun notifyThemeAdded(theme: Theme) {
        listeners.forEach { it.onThemeAdded(theme) }
    }
}

/**
 * Simple API for apps to access Ktheme
 */
object KthemeAPI {
    private val provider: ThemeProvider = FileBasedThemeProvider()
    
    /**
     * Get all shared themes available system-wide
     */
    fun getAvailableThemes(): List<Theme> = provider.getSharedThemes()
    
    /**
     * Get a specific theme
     */
    fun getTheme(id: String): Theme? = provider.getSharedTheme(id)
    
    /**
     * Share a theme with other applications
     */
    fun shareTheme(theme: Theme): Boolean = provider.publishTheme(theme)
    
    /**
     * Subscribe to theme updates
     */
    fun onThemeChanged(listener: ThemeChangeListener) {
        provider.subscribeToChanges(listener)
    }
    
    /**
     * Get the shared themes directory
     */
    fun getSharedDirectory(): File {
        return File(System.getProperty("user.home"), ".ktheme/shared")
    }
}
