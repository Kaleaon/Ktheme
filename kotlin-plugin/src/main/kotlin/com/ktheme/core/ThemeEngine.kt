package com.ktheme.core

import com.ktheme.models.Theme
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromJsonElement
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.encodeToString
import java.io.File

/**
 * Ktheme Engine - Core theme management system for Kotlin
 * 
 * Provides functionality to register, validate, export, and import themes
 */
class ThemeEngine {
    private val themes = mutableMapOf<String, Theme>()
    private var activeTheme: Theme? = null
    
    private val json = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
    }
    
    /**
     * Register a new theme
     */
    fun registerTheme(theme: Theme) {
        val normalizedTheme = if (theme.schemaVersion == SCHEMA_VERSION) theme else theme.copy(schemaVersion = SCHEMA_VERSION)
        val validation = validateTheme(normalizedTheme)
        if (!validation.valid) {
            throw IllegalArgumentException("Invalid theme: ${validation.errors.joinToString(", ")}")
        }
        themes[normalizedTheme.metadata.id] = normalizedTheme
    }
    
    /**
     * Get a theme by ID
     */
    fun getTheme(id: String): Theme? {
        return themes[id]
    }
    
    /**
     * Get all registered themes
     */
    fun getAllThemes(): List<Theme> {
        return themes.values.toList()
    }
    
    /**
     * Set active theme
     */
    fun setActiveTheme(id: String) {
        val theme = themes[id] ?: throw IllegalArgumentException("Theme not found: $id")
        activeTheme = theme
    }
    
    /**
     * Get current active theme
     */
    fun getActiveTheme(): Theme? {
        return activeTheme
    }
    
    /**
     * Remove a theme
     */
    fun removeTheme(id: String): Boolean {
        if (activeTheme?.metadata?.id == id) {
            activeTheme = null
        }
        return themes.remove(id) != null
    }
    
    /**
     * Validate a theme
     */
    fun validateTheme(theme: Theme): ValidationResult {
        val errors = mutableListOf<String>()
        val warnings = mutableListOf<String>()

        ThemeValidator.validate(theme, errors, warnings)

        return ValidationResult(
            valid = errors.isEmpty(),
            errors = errors,
            warnings = warnings
        )
    }
    
    /**
     * Export a theme to JSON string
     */
    fun exportTheme(id: String): String {
        val theme = themes[id] ?: throw IllegalArgumentException("Theme not found: $id")
        return json.encodeToString(theme)
    }
    
    /**
     * Import a theme from JSON string
     */
    fun importTheme(jsonString: String): Theme {
        return try {
            val rawTheme = json.parseToJsonElement(jsonString).jsonObject
            val importMetadata = parseThemeImportMetadata(rawTheme, json)
            val migratedPayload = if (importMetadata.schemaVersion == SCHEMA_VERSION) {
                rawTheme
            } else {
                migrateTheme(rawTheme, importMetadata.schemaVersion, SCHEMA_VERSION)
            }
            val migratedTheme = json.decodeFromJsonElement<Theme>(migratedPayload)
            val validation = validateTheme(migratedTheme)
            if (!validation.valid) {
                val fallbackName = importMetadata.metadataName ?: "unknown"
                val fallbackId = importMetadata.metadataId ?: "unknown"
                throw IllegalArgumentException(
                    "Migrated theme '$fallbackName' ($fallbackId) is invalid: ${validation.errors.joinToString(", ")}"
                )
            }
            registerTheme(migratedTheme)
            migratedTheme
        } catch (e: Exception) {
            throw IllegalArgumentException("Failed to import theme: ${e.message}", e)
        }
    }
    
    /**
     * Export all themes to JSON string
     */
    fun exportAllThemes(): String {
        return json.encodeToString(getAllThemes())
    }
    
    /**
     * Load theme from JSON file
     */
    fun loadThemeFromFile(file: File): Theme {
        val jsonString = file.readText()
        return importTheme(jsonString)
    }
    
    /**
     * Save theme to JSON file
     */
    fun saveThemeToFile(id: String, file: File) {
        val jsonString = exportTheme(id)
        file.writeText(jsonString)
    }
    
    /**
     * Search themes by tags
     */
    fun searchByTags(tags: List<String>): List<Theme> {
        return getAllThemes().filter { theme ->
            tags.any { tag -> theme.metadata.tags.contains(tag) }
        }
    }
    
    /**
     * Search themes by name
     */
    fun searchByName(query: String): List<Theme> {
        val lowerQuery = query.lowercase()
        return getAllThemes().filter { theme ->
            theme.metadata.name.lowercase().contains(lowerQuery) ||
            theme.metadata.description.lowercase().contains(lowerQuery)
        }
    }
}

/**
 * Theme validation result
 */
data class ValidationResult(
    val valid: Boolean,
    val errors: List<String>,
    val warnings: List<String>
)
