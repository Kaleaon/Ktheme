package com.ktheme.library

import com.ktheme.core.ThemeEngine
import com.ktheme.models.Theme
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.security.MessageDigest

/**
 * Theme Library - Central repository for managing and sharing themes across applications
 *
 * This library provides:
 * - Theme discovery and loading from multiple sources
 * - Cross-application theme sharing
 * - Theme export/import capabilities
 * - Theme provider pattern for app integration
 */
class ThemeLibrary(
    private val homeDirectory: File = File(System.getProperty("user.home")),
    private val sharedThemesDirectory: File = File(homeDirectory, ".ktheme/shared"),
    private val userThemesDirectory: File = File(homeDirectory, ".ktheme/user"),
    private val catalogFile: File = File(homeDirectory, ".ktheme/catalog.json")
) {
    private val engine = ThemeEngine()
    private val listeners = mutableListOf<ThemeLibraryListener>()
    private val loadedThemeIds = mutableSetOf<String>()

    private val indexJson = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
    }

    init {
        sharedThemesDirectory.mkdirs()
        userThemesDirectory.mkdirs()
        catalogFile.parentFile?.mkdirs()
    }

    /**
     * Load all available themes from various sources
     */
    fun loadAllThemes(bundledThemesDir: File? = null) {
        clearPreviouslyLoadedThemes()

        val sourceDirectories = resolveSourceDirectories(bundledThemesDir)
        val catalog = loadCatalogIndexOrEmpty()
        val catalogByPath = catalog.entries.associateBy { it.filePath }.toMutableMap()
        val activeFilePaths = mutableSetOf<String>()

        for ((source, _) in sourceDirectories) {
            val sourceEntries = catalog.entries.filter { it.source == source }
            for (entry in sourceEntries) {
                val file = File(entry.filePath)
                if (!file.exists() || !file.isFile) {
                    catalogByPath.remove(entry.filePath)
                    continue
                }

                val theme = runCatching { engine.loadThemeFromFile(file) }
                    .onFailure { error ->
                        println("✗ Failed to load ${file.name}: ${error.message}")
                        catalogByPath.remove(entry.filePath)
                    }
                    .getOrNull() ?: continue

                loadedThemeIds.add(theme.metadata.id)
                activeFilePaths.add(entry.filePath)

                val refreshedEntry = createCatalogEntry(theme, file, source)
                if (refreshedEntry != entry) {
                    catalogByPath[entry.filePath] = refreshedEntry
                }
            }
        }

        for ((source, directory) in sourceDirectories) {
            if (!directory.exists() || !directory.isDirectory) {
                continue
            }

            directory.listFiles()
                ?.asSequence()
                ?.filter { it.isFile && it.extension == "json" }
                ?.forEach { file ->
                    val filePath = file.absolutePath
                    if (filePath in activeFilePaths) {
                        return@forEach
                    }

                    val theme = runCatching { engine.loadThemeFromFile(file) }.getOrElse { error ->
                        println("✗ Failed to load ${file.name}: ${error.message}")
                        return@forEach
                    }

                    println("✓ Loaded theme: ${theme.metadata.name} from $source")
                    loadedThemeIds.add(theme.metadata.id)
                    activeFilePaths.add(filePath)
                    catalogByPath[filePath] = createCatalogEntry(theme, file, source)
                }
        }

        val activeSources = sourceDirectories.keys
        val reconciledEntries = catalogByPath.values
            .filter { it.source in activeSources && File(it.filePath).exists() }
            .sortedBy { it.filePath }

        saveCatalogIndex(ThemeCatalogIndex(reconciledEntries))
        notifyThemesLoaded()
    }

    /**
     * Rebuild catalog index from the filesystem.
     */
    fun rebuildCatalogIndex(bundledThemesDir: File? = null): List<ThemeCatalogEntry> {
        val entries = mutableListOf<ThemeCatalogEntry>()

        resolveSourceDirectories(bundledThemesDir).forEach { (source, directory) ->
            if (!directory.exists() || !directory.isDirectory) {
                return@forEach
            }

            directory.listFiles()
                ?.asSequence()
                ?.filter { it.isFile && it.extension == "json" }
                ?.forEach { file ->
                    runCatching {
                        val rebuildEngine = ThemeEngine()
                        val theme = rebuildEngine.loadThemeFromFile(file)
                        createCatalogEntry(theme, file, source)
                    }.onSuccess { entry ->
                        entries.add(entry)
                    }.onFailure { error ->
                        println("✗ Failed to index ${file.name}: ${error.message}")
                    }
                }
        }

        val sortedEntries = entries.sortedBy { it.filePath }
        saveCatalogIndex(ThemeCatalogIndex(sortedEntries))
        return sortedEntries
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
            val sharedFile = File(sharedThemesDirectory, "${theme.metadata.id}.json")
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
            val userFile = File(userThemesDirectory, file.name)
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
    fun getSharedThemesDirectory(): File = sharedThemesDirectory

    /**
     * Get the user themes directory
     */
    fun getUserThemesDirectory(): File = userThemesDirectory

    /**
     * Get the catalog file path.
     */
    fun getCatalogFile(): File = catalogFile

    private fun resolveSourceDirectories(bundledThemesDir: File?): LinkedHashMap<String, File> {
        val directories = linkedMapOf<String, File>()
        bundledThemesDir?.let { directories["bundled"] = it }
        directories["shared"] = sharedThemesDirectory
        directories["user"] = userThemesDirectory
        return directories
    }

    private fun loadCatalogIndexOrEmpty(): ThemeCatalogIndex {
        if (!catalogFile.exists()) {
            return ThemeCatalogIndex()
        }

        return runCatching {
            indexJson.decodeFromString<ThemeCatalogIndex>(catalogFile.readText())
        }.getOrElse {
            println("✗ Failed to read catalog index: ${it.message}; rebuilding")
            ThemeCatalogIndex(rebuildCatalogIndex())
        }
    }

    private fun saveCatalogIndex(index: ThemeCatalogIndex) {
        catalogFile.parentFile?.mkdirs()
        catalogFile.writeText(indexJson.encodeToString(index))
    }

    private fun clearPreviouslyLoadedThemes() {
        loadedThemeIds.forEach { engine.removeTheme(it) }
        loadedThemeIds.clear()
    }

    private fun createCatalogEntry(theme: Theme, file: File, source: String): ThemeCatalogEntry {
        return ThemeCatalogEntry(
            id = theme.metadata.id,
            name = theme.metadata.name,
            tags = theme.metadata.tags,
            filePath = file.absolutePath,
            updatedAt = file.lastModified(),
            source = source,
            checksum = calculateChecksum(file)
        )
    }

    private fun calculateChecksum(file: File): String {
        val digest = MessageDigest.getInstance("SHA-256")
        file.inputStream().use { input ->
            val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
            while (true) {
                val bytesRead = input.read(buffer)
                if (bytesRead <= 0) {
                    break
                }
                digest.update(buffer, 0, bytesRead)
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }
}

@Serializable
data class ThemeCatalogIndex(
    val entries: List<ThemeCatalogEntry> = emptyList()
)

@Serializable
data class ThemeCatalogEntry(
    val id: String,
    val name: String,
    val tags: List<String>,
    val filePath: String,
    val updatedAt: Long,
    val source: String,
    val checksum: String
)

/**
 * Listener interface for theme library events
 */
interface ThemeLibraryListener {
    fun onThemesLoaded(themes: List<Theme>)
    fun onThemeImported(theme: Theme)
}
