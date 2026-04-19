package com.ktheme.library

import com.ktheme.core.ThemeEngine
import com.ktheme.core.ThemeFileMetadataSigner
import com.ktheme.core.ThemeFileSignatureVerifier
import com.ktheme.models.Theme
import java.io.File
import java.nio.file.ClosedWatchServiceException
import java.nio.file.FileSystems
import java.nio.file.Path
import java.nio.file.StandardWatchEventKinds.ENTRY_CREATE
import java.nio.file.StandardWatchEventKinds.ENTRY_DELETE
import java.nio.file.StandardWatchEventKinds.ENTRY_MODIFY
import java.nio.file.WatchEvent
import java.nio.file.WatchService
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
    fun publishTheme(theme: Theme, signer: ThemeFileMetadataSigner? = null): Boolean
    
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
class FileBasedThemeProvider(
    private val sharedDir: File = File(System.getProperty("user.home"), ".ktheme/shared"),
    private val signatureVerifier: ThemeFileSignatureVerifier? = null
) : ThemeProvider {
    private val library = ThemeLibrary()
    private val parserEngine = ThemeEngine()
    private val listeners = mutableSetOf<ThemeChangeListener>()
    private val listenersLock = Any()

    @Volatile
    private var watchService: WatchService? = null

    @Volatile
    private var watcherThread: Thread? = null
    
    init {
        sharedDir.mkdirs()
        library.signatureVerifier = signatureVerifier
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
    
    override fun publishTheme(theme: Theme, signer: ThemeFileMetadataSigner?): Boolean {
        return try {
            val file = File(sharedDir, "${theme.metadata.id}.json")
            val payload = parserEngine.serializeThemeWithMetadata(theme, signer)
            file.writeText(payload)
            true
        } catch (e: Exception) {
            false
        }
    }
    
    override fun subscribeToChanges(listener: ThemeChangeListener) {
        synchronized(listenersLock) {
            listeners.add(listener)
            if (listeners.size == 1) {
                startWatcherLocked()
            }
        }
    }
    
    override fun unsubscribe(listener: ThemeChangeListener) {
        synchronized(listenersLock) {
            listeners.remove(listener)
            if (listeners.isEmpty()) {
                stopWatcherLocked()
            }
        }
    }

    private fun startWatcherLocked() {
        if (watchService != null) {
            return
        }

        val service = FileSystems.getDefault().newWatchService()
        sharedDir.toPath().register(service, ENTRY_CREATE, ENTRY_MODIFY, ENTRY_DELETE)
        watchService = service
        watcherThread = thread(start = true, isDaemon = true, name = "ktheme-shared-watcher") {
            watchLoop(service, sharedDir.toPath())
        }
    }

    private fun stopWatcherLocked() {
        watchService?.close()
        watchService = null
        watcherThread?.interrupt()
        watcherThread = null
    }

    private fun watchLoop(service: WatchService, sharedPath: Path) {
        while (!Thread.currentThread().isInterrupted) {
            val key = try {
                service.take()
            } catch (_: InterruptedException) {
                break
            } catch (_: ClosedWatchServiceException) {
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
        when (event.kind()) {
            ENTRY_CREATE -> parseThemeFromFile(fullPath.toFile())?.let { notifyThemeAdded(it) }
            ENTRY_MODIFY -> parseThemeFromFile(fullPath.toFile())?.let { notifyThemeUpdated(it) }
            ENTRY_DELETE -> notifyThemeRemoved(relativePath.fileName.toString().removeSuffix(".json"))
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
