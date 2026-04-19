package com.ktheme.core

import com.ktheme.models.Theme
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonObject
import java.security.MessageDigest
import java.io.File
import java.time.Instant

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

    private val quarantineDir = File(System.getProperty("user.home"), ".ktheme/quarantine").apply {
        mkdirs()
    }
    
    /**
     * Register a new theme
     */
    fun registerTheme(theme: Theme) {
        val validation = validateTheme(theme)
        if (!validation.valid) {
            throw IllegalArgumentException("Invalid theme: ${validation.errors.joinToString(", ")}")
        }
        themes[theme.metadata.id] = theme
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
        
        // Validate metadata
        with(theme.metadata) {
            if (id.isEmpty()) errors.add("Theme ID is required")
            if (name.isEmpty()) errors.add("Theme name is required")
            if (version.isEmpty()) errors.add("Theme version is required")
        }
        
        // Color scheme validation is implicit via data class
        
        // Check for effects warnings
        theme.effects?.metallic?.let {
            if (it.enabled && it.intensity > 1) {
                warnings.add("Metallic intensity should be between 0 and 1")
            }
        }
        
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
            val theme = parseThemeJson(jsonString).theme
            registerTheme(theme)
            theme
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
    fun loadThemeFromFile(
        file: File,
        signatureVerifier: ThemeFileSignatureVerifier? = null
    ): Theme {
        val jsonString = file.readText()
        return try {
            val parsedTheme = parseThemeJson(jsonString, signatureVerifier)
            registerTheme(parsedTheme.theme)
            parsedTheme.theme
        } catch (e: Exception) {
            quarantineFile(file, e.message ?: "verification-failed")
            throw IllegalArgumentException("Failed to load theme from file ${file.name}: ${e.message}", e)
        }
    }
    
    /**
     * Save theme to JSON file
     */
    fun saveThemeToFile(
        id: String,
        file: File,
        signer: ThemeFileMetadataSigner? = null
    ) {
        val jsonString = exportTheme(id)
        val signedThemeJson = wrapThemeWithMetadata(jsonString, signer)
        file.writeText(signedThemeJson)
    }

    fun serializeThemeWithMetadata(
        theme: Theme,
        signer: ThemeFileMetadataSigner? = null
    ): String {
        val rawThemeJson = json.encodeToString(theme)
        return wrapThemeWithMetadata(rawThemeJson, signer)
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

    private fun parseThemeJson(
        jsonString: String,
        signatureVerifier: ThemeFileSignatureVerifier? = null
    ): ParsedTheme {
        val root = json.parseToJsonElement(jsonString)
        val rootObject = root as? JsonObject
        val hasEnvelopeMetadata = rootObject?.containsKey("fileMetadata") == true && rootObject.containsKey("theme")

        return if (hasEnvelopeMetadata) {
            val envelope = json.decodeFromString<ThemeFileEnvelope>(jsonString)
            verifyEnvelope(envelope, signatureVerifier)
            ParsedTheme(envelope.theme)
        } else {
            val legacyTheme = json.decodeFromString<Theme>(jsonString)
            ParsedTheme(legacyTheme)
        }
    }

    private fun verifyEnvelope(
        envelope: ThemeFileEnvelope,
        signatureVerifier: ThemeFileSignatureVerifier?
    ) {
        val payload = json.encodeToString(envelope.theme)
        val expectedChecksum = sha256Hex(payload)
        require(expectedChecksum == envelope.fileMetadata.checksum) {
            "Checksum verification failed"
        }

        val signature = envelope.fileMetadata.signature
        val signerId = envelope.fileMetadata.signerId
        if (!signature.isNullOrBlank() && !signerId.isNullOrBlank()) {
            val verifier = signatureVerifier ?: return
            require(verifier.isTrustedSigner(signerId)) {
                "Untrusted signer: $signerId"
            }
            require(verifier.verify(payload, signature, signerId)) {
                "Signature verification failed for signer: $signerId"
            }
        }
    }

    private fun wrapThemeWithMetadata(
        rawThemeJson: String,
        signer: ThemeFileMetadataSigner?
    ): String {
        val checksum = sha256Hex(rawThemeJson)
        val signature = signer?.sign(rawThemeJson)
        val envelope = ThemeFileEnvelope(
            theme = json.decodeFromString(rawThemeJson),
            fileMetadata = ThemeFileMetadata(
                checksum = checksum,
                generatedAt = Instant.now().toString(),
                signerId = signer?.signerId,
                signature = signature
            )
        )
        return json.encodeToString(envelope)
    }

    private fun quarantineFile(file: File, reason: String) {
        quarantineDir.mkdirs()
        val safeReason = reason
            .lowercase()
            .replace(Regex("[^a-z0-9]+"), "-")
            .trim('-')
            .ifEmpty { "invalid" }
        val quarantinedFile = File(
            quarantineDir,
            "${file.nameWithoutExtension}-${Instant.now().toEpochMilli()}-$safeReason.${file.extension.ifBlank { "json" }}"
        )
        file.copyTo(quarantinedFile, overwrite = true)
        file.delete()
    }

    private fun sha256Hex(value: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(value.toByteArray())
        return digest.joinToString("") { "%02x".format(it) }
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

data class ParsedTheme(
    val theme: Theme
)

@Serializable
data class ThemeFileEnvelope(
    val theme: Theme,
    @SerialName("fileMetadata")
    val fileMetadata: ThemeFileMetadata
)

@Serializable
data class ThemeFileMetadata(
    val checksum: String,
    val checksumAlgorithm: String = "SHA-256",
    val generatedAt: String,
    val signerId: String? = null,
    val signature: String? = null
)

interface ThemeFileMetadataSigner {
    val signerId: String
    fun sign(payload: String): String
}

interface ThemeFileSignatureVerifier {
    fun isTrustedSigner(signerId: String): Boolean
    fun verify(payload: String, signature: String, signerId: String): Boolean
}
