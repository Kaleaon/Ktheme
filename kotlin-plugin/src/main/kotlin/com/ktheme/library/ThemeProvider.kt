package com.ktheme.library

import com.ktheme.core.ThemeEngine
import com.ktheme.core.ThemeFileMetadataSigner
import com.ktheme.core.ThemeFileSignatureVerifier
import com.ktheme.models.Theme
import com.ktheme.utils.ThemeIdCollisionPolicy
import com.ktheme.utils.ThemeIdUtils
import java.io.File
import java.nio.file.ClosedWatchServiceException
import java.nio.file.FileSystems
import java.nio.file.Path
import java.nio.file.StandardWatchEventKinds.ENTRY_CREATE
import java.nio.file.StandardWatchEventKinds.ENTRY_DELETE
import java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY
import java.nio.file.WatchEvent
import java.nio.file.WatchService
import java.util.concurrent.ConcurrentHashMap
import kotlin.concurrent.thread

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
    fun publishTheme(
        theme: Theme,
        signer: ThemeFileMetadataSigner? = null,
        collisionPolicy: ThemeIdCollisionPolicy = ThemeIdCollisionPolicy.OVERWRITE
    ): Boolean

    fun publishTheme(
        theme: Theme,
        collisionPolicy: ThemeIdCollisionPolicy
    ): Boolean = publishTheme(theme, null, collisionPolicy)
    
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
 * Default implementation of ThemeProvider using file-based sharing with an active in-memory cache
 */
class FileBasedThemeProvider(
    private val sharedDir: File = File(System.getProperty("user.home"), ".ktheme/shared"),
    private val signatureVerifier: ThemeFileSignatureVerifier? = null
) : ThemeProvider {
    private val parserEngine = ThemeEngine()
    private val themeCache = ConcurrentHashMap<String, Theme>()
    private val listeners = mutableSetOf<ThemeChangeListener>()
    private val listenersLock = Any()

    @Volatile
    private var watchService: WatchService? = null

    @Volatile
    private var watcherThread: Thread? = null

    init {
        sharedDir.mkdirs()
        populateInitialCache()
        startWatcher()
    }

    private fun populateInitialCache() {
        sharedDir.listFiles()
            ?.asSequence()
            ?.filter { it.isFile && it.extension == "json" }
            ?.forEach { file ->
                val theme = parseThemeFromFile(file)
                if (theme != null) {
                    themeCache[theme.metadata.id] = theme
                }
            }
    }

    override fun getSharedThemes(): List<Theme> {
        return themeCache.values.toList()
    }

    override fun getSharedTheme(id: String): Theme? {
        val file = File(sharedDir, "$id.json")
        if (file.exists()) {
            return try {
                val theme = parserEngine.loadThemeFromFile(file, signatureVerifier)
                themeCache[theme.metadata.id] = theme
                theme
            } catch (e: Exception) {
                themeCache.remove(id)
                null
            }
        }
        return themeCache[id]
    }

    override fun publishTheme(
        theme: Theme,
        signer: ThemeFileMetadataSigner?,
        collisionPolicy: ThemeIdCollisionPolicy
    ): Boolean {
        return try {
            val normalizedTheme = ThemeIdUtils.withNormalizedId(theme)
            val existingIds = sharedDir.listFiles()?.asSequence()
                ?.filter { it.extension == "json" }
                ?.map { it.nameWithoutExtension }
                ?.toSet()
                ?: emptySet()

            val resolvedId = ThemeIdUtils.resolveCollision(
                normalizedTheme.metadata.id,
                existingIds,
                collisionPolicy
            )
            val resolvedTheme = if (resolvedId == normalizedTheme.metadata.id) {
                normalizedTheme
            } else {
                normalizedTheme.copy(metadata = normalizedTheme.metadata.copy(id = resolvedId))
            }

            val file = File(sharedDir, "${resolvedTheme.metadata.id}.json")
            val serialized = parserEngine.serializeThemeWithMetadata(resolvedTheme, signer)
            file.writeText(serialized)
            themeCache[resolvedTheme.metadata.id] = resolvedTheme
            true
        } catch (e: Exception) {
            false
        }
    }

    override fun subscribeToChanges(listener: ThemeChangeListener) {
        synchronized(listenersLock) {
            listeners.add(listener)
        }
    }

    override fun unsubscribe(listener: ThemeChangeListener) {
        synchronized(listenersLock) {
            listeners.remove(listener)
        }
    }

    private fun startWatcher() {
        if (watchService != null) return
        try {
            val service = FileSystems.getDefault().newWatchService()
            sharedDir.toPath().register(service, ENTRY_CREATE, ENTRY_MODIFY, ENTRY_DELETE)
            watchService = service
            watcherThread = thread(start = true, isDaemon = true, name = "ktheme-shared-watcher") {
                watchLoop(service, sharedDir.toPath())
            }
        } catch (e: Exception) {
            println("Warning: Failed to start WatchService: ${e.message}")
        }
    }

    private fun watchLoop(service: WatchService, sharedPath: Path) {
        while (!Thread.currentThread().isInterrupted) {
            val key = try {
                service.take()
            } catch (_: InterruptedException) {
                break
            } catch (_: ClosedWatchServiceException) {
                break
            } catch (e: Exception) {
                println("Warning: WatchService exception in watchLoop: ${e.message}")
                break
            }

            key.pollEvents().forEach { event ->
                handleWatchEvent(event, sharedPath)
            }

            if (!key.reset()) {
                break
            }
        }
    }

    private fun handleWatchEvent(event: WatchEvent<*>, sharedPath: Path) {
        @Suppress("UNCHECKED_CAST")
        val pathEvent = event as? WatchEvent<Path> ?: return
        val relativePath = pathEvent.context()
        if (!relativePath.toString().endsWith(".json")) {
            return
        }

        val fullPath = sharedPath.resolve(relativePath)
        val file = fullPath.toFile()
        val themeIdFromPath = relativePath.fileName.toString().removeSuffix(".json")

        when (event.kind()) {
            ENTRY_CREATE -> {
                val theme = parseThemeFromFile(file)
                if (theme != null) {
                    themeCache[theme.metadata.id] = theme
                    notifyThemeAdded(theme)
                }
            }
            ENTRY_MODIFY -> {
                val theme = parseThemeFromFile(file)
                if (theme != null) {
                    themeCache[theme.metadata.id] = theme
                    notifyThemeUpdated(theme)
                } else {
                    if (themeCache.containsKey(themeIdFromPath)) {
                        themeCache.remove(themeIdFromPath)
                        notifyThemeRemoved(themeIdFromPath)
                    }
                }
            }
            ENTRY_DELETE -> {
                themeCache.remove(themeIdFromPath)
                notifyThemeRemoved(themeIdFromPath)
            }
        }
    }

    private fun parseThemeFromFile(file: File): Theme? {
        return try {
            if (!file.exists()) {
                null
            } else {
                parserEngine.loadThemeFromFile(file, signatureVerifier)
            }
        } catch (_: Exception) {
            null
        }
    }

    private fun notifyThemeAdded(theme: Theme) {
        snapshotListeners().forEach { it.onThemeAdded(theme) }
    }

    private fun notifyThemeUpdated(theme: Theme) {
        snapshotListeners().forEach { it.onThemeUpdated(theme) }
    }

    private fun notifyThemeRemoved(themeId: String) {
        snapshotListeners().forEach { it.onThemeRemoved(themeId) }
    }

    private fun snapshotListeners(): List<ThemeChangeListener> {
        return synchronized(listenersLock) {
            listeners.toList()
        }
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
    fun getTheme(id: String): Theme? = provider.getSharedTheme(ThemeIdUtils.normalize(id))
    
    /**
     * Share a theme with other applications
     */
    fun shareTheme(
        theme: Theme,
        collisionPolicy: ThemeIdCollisionPolicy = ThemeIdCollisionPolicy.SUFFIX
    ): Boolean = provider.publishTheme(theme, null, collisionPolicy)
    
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
