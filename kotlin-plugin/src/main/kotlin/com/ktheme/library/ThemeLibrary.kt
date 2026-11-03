package com.ktheme.library

import com.ktheme.core.ThemeEngine
import com.ktheme.core.ThemeFileMetadataSigner
import com.ktheme.core.ThemeFileSignatureVerifier
import com.ktheme.models.Theme
import kotlinx.serialization.Serializable
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.time.Instant
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.security.MessageDigest
import java.util.concurrent.locks.ReentrantReadWriteLock
import com.ktheme.utils.ThemeIdCollisionPolicy

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

    private val indexLock = ReentrantReadWriteLock()
    private val recordsById = mutableMapOf<String, ThemeIndexedRecord>()
    private val invertedIndex = mutableMapOf<String, MutableSet<String>>()

    private val indexJson = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
    }
    private val json = Json { prettyPrint = true }

    companion object {
        // Shared theme directory for cross-app theme sharing
        private val SHARED_THEMES_DIR = File(System.getProperty("user.home"), ".ktheme/shared")
        private val USER_THEMES_DIR = File(System.getProperty("user.home"), ".ktheme/user")

        init {
            SHARED_THEMES_DIR.mkdirs()
            USER_THEMES_DIR.mkdirs()
        }
    }

    var signatureVerifier: ThemeFileSignatureVerifier? = null

    init {
        sharedThemesDirectory.mkdirs()
        userThemesDirectory.mkdirs()
        catalogFile.parentFile?.mkdirs()
    }

    private fun ensureIndexInSync() {
        val currentEngineThemes = engine.getAllThemes()
        indexLock.writeLock().lock()
        try {
            val currentEngineIds = currentEngineThemes.map { it.metadata.id }.toSet()

            val staleIds = recordsById.keys.filter { it !in currentEngineIds }
            for (staleId in staleIds) {
                removeThemeFromIndexInternal(staleId)
            }

            currentEngineThemes.forEachIndexed { index, theme ->
                val existingRecord = recordsById[theme.metadata.id]
                if (existingRecord == null || existingRecord.theme !== theme || existingRecord.originalIndex != index) {
                    indexThemeInternal(theme, index)
                }
            }
        } finally {
            indexLock.writeLock().unlock()
        }
    }

    private fun indexThemeInternal(theme: Theme, originalIndex: Int) {
        val id = theme.metadata.id
        recordsById[id]?.let { oldRecord ->
            for (term in oldRecord.terms) {
                val posting = invertedIndex[term]
                if (posting != null) {
                    posting.remove(id)
                    if (posting.isEmpty()) {
                        invertedIndex.remove(term)
                    }
                }
            }
        }

        val nameLower = theme.metadata.name.lowercase()
        val authorLower = theme.metadata.author.lowercase()
        val darkMode = theme.darkMode
        val tagsSet = theme.metadata.tags.map { it.trim().lowercase() }.filter { it.isNotEmpty() }.toSet()
        val updatedAtInstant = runCatching { Instant.parse(theme.metadata.updatedAt) }.getOrNull()

        val terms = mutableSetOf<String>()
        terms.addAll(tagsSet)

        if (nameLower.isNotEmpty()) {
            val nameLen = nameLower.length
            for (i in 0 until nameLen) {
                for (j in i + 1..nameLen) {
                    terms.add(nameLower.substring(i, j))
                }
            }
        }

        val record = ThemeIndexedRecord(
            theme = theme,
            id = id,
            nameLower = nameLower,
            authorLower = authorLower,
            darkMode = darkMode,
            tagsSet = tagsSet,
            updatedAtInstant = updatedAtInstant,
            originalIndex = originalIndex,
            terms = terms
        )

        recordsById[id] = record
        for (term in terms) {
            invertedIndex.getOrPut(term) { mutableSetOf() }.add(id)
        }
    }

    private fun removeThemeFromIndexInternal(id: String) {
        val record = recordsById.remove(id) ?: return
        for (term in record.terms) {
            val posting = invertedIndex[term]
            if (posting != null) {
                posting.remove(id)
                if (posting.isEmpty()) {
                    invertedIndex.remove(term)
                }
            }
        }
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
        ensureIndexInSync()
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
    fun searchThemes(
        query: String,
        darkMode: Boolean? = null,
        author: String? = null,
        tags: Set<String> = emptySet(),
        updatedAfter: String? = null,
        offset: Int = 0,
        limit: Int = 50
    ): List<ThemeSearchResult> {
        if (limit <= 0) {
            return emptyList()
        }

        val normalizedQueryTerms = query
            .split(',', ' ', '\n', '\t')
            .map { it.trim().lowercase() }
            .filter { it.isNotEmpty() }
            .distinct()

        val normalizedAuthor = author?.trim()?.lowercase()?.takeIf { it.isNotEmpty() }
        val normalizedTags = tags
            .map { it.trim().lowercase() }
            .filter { it.isNotEmpty() }
            .toSet()

        val updatedAfterInstant = updatedAfter
            ?.trim()
            ?.takeIf { it.isNotEmpty() }
            ?.let { runCatching { Instant.parse(it) }.getOrNull() }

        ensureIndexInSync()

        indexLock.readLock().lock()
        try {
            val candidateRecords: Collection<ThemeIndexedRecord> = if (normalizedQueryTerms.isEmpty()) {
                recordsById.values
            } else {
                val candidateIds = mutableSetOf<String>()
                for (term in normalizedQueryTerms) {
                    invertedIndex[term]?.let { candidateIds.addAll(it) }
                }
                if (candidateIds.isEmpty()) {
                    return emptyList()
                }
                candidateIds.mapNotNull { recordsById[it] }
            }

            return candidateRecords
                .mapIndexedNotNull { _, record ->
                    if (darkMode != null && record.darkMode != darkMode) {
                        return@mapIndexedNotNull null
                    }
                    if (normalizedAuthor != null && record.authorLower != normalizedAuthor) {
                        return@mapIndexedNotNull null
                    }
                    if (normalizedTags.isNotEmpty() && !normalizedTags.all { it in record.tagsSet }) {
                        return@mapIndexedNotNull null
                    }
                    if (updatedAfterInstant != null) {
                        val themeUpdatedAt = record.updatedAtInstant ?: return@mapIndexedNotNull null
                        if (themeUpdatedAt.isBefore(updatedAfterInstant)) {
                            return@mapIndexedNotNull null
                        }
                    }

                    val name = record.nameLower
                    val matchedFields = linkedSetOf<String>()
                    var score = 0

                    normalizedQueryTerms.forEach { term ->
                        when {
                            name == term -> {
                                score += 400
                                matchedFields.add(ThemeSearchMatchField.NAME_EXACT.fieldName)
                            }
                            name.startsWith(term) -> {
                                score += 260
                                matchedFields.add(ThemeSearchMatchField.NAME_PREFIX.fieldName)
                            }
                            name.contains(term) -> {
                                score += 160
                                matchedFields.add(ThemeSearchMatchField.NAME_SUBSTRING.fieldName)
                            }
                            term in record.tagsSet -> {
                                score += 80
                                matchedFields.add(ThemeSearchMatchField.TAGS.fieldName)
                            }
                        }
                    }

                    if (normalizedQueryTerms.isNotEmpty() && score == 0) {
                        return@mapIndexedNotNull null
                    }

                    ScoredTheme(record.theme, score, matchedFields.toList(), record.originalIndex)
                }
                .sortedWith(
                    compareByDescending<ScoredTheme> { it.score }
                        .thenBy { it.originalIndex }
                )
                .drop(offset.coerceAtLeast(0))
                .take(limit)
                .map { ThemeSearchResult(it.theme, it.score, it.matchedFields) }
        } finally {
            indexLock.readLock().unlock()
        }
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
    fun shareTheme(themeId: String, signer: ThemeFileMetadataSigner? = null): Boolean {
        return try {
            val theme = engine.getTheme(themeId) ?: return false
            val sharedFile = File(sharedThemesDirectory, "${theme.metadata.id}.json")
            engine.saveThemeToFile(themeId, sharedFile, signer)
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
    fun exportTheme(
        themeId: String,
        targetFile: File,
        signer: ThemeFileMetadataSigner? = null
    ): Boolean {
        return try {
            engine.saveThemeToFile(themeId, targetFile, signer)
            true
        } catch (e: Exception) {
            println("Failed to export theme: ${e.message}")
            false
        }
    }

    /**
     * Import theme from file
     */
    fun importTheme(
        file: File,
        collisionPolicy: ThemeIdCollisionPolicy = ThemeIdCollisionPolicy.SUFFIX
    ): Theme? {
        return try {
            val theme = engine.loadThemeFromFile(file, signatureVerifier)
            val userFile = File(userThemesDirectory, "${theme.metadata.id}.json")
            userFile.parentFile?.mkdirs()
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

data class ThemeSearchResult(
    val theme: Theme,
    val score: Int,
    val matchedFields: List<String>
)

enum class ThemeSearchMatchField(val fieldName: String) {
    NAME_EXACT("nameExact"),
    NAME_PREFIX("namePrefix"),
    NAME_SUBSTRING("nameSubstring"),
    TAGS("tags")
}

private data class ScoredTheme(
    val theme: Theme,
    val score: Int,
    val matchedFields: List<String>,
    val originalIndex: Int
)

private data class ThemeIndexedRecord(
    val theme: Theme,
    val id: String,
    val nameLower: String,
    val authorLower: String,
    val darkMode: Boolean,
    val tagsSet: Set<String>,
    val updatedAtInstant: Instant?,
    val originalIndex: Int,
    val terms: Set<String>
)
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
