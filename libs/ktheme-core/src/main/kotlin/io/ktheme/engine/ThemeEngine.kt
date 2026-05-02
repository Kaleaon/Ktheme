// libs/ktheme-core/src/main/kotlin/io/ktheme/engine/ThemeEngine.kt
//
// Active-theme registry + observable change events. Platform glue
// (Compose, SwiftUI, web) subscribes to [ThemeEngine.themes] / the
// `activeTheme` flow to repaint when the active theme changes.
//
// The engine is platform-agnostic — no Android imports, no AppKit. It
// holds Theme objects in memory and exposes them over a Kotlin Flow.

package io.ktheme.engine

import io.ktheme.model.Theme
import io.ktheme.parser.ThemeParser
import io.ktheme.presets.Presets
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

public class ThemeEngine private constructor(
    initial: Map<String, Theme>,
    initialActiveId: String,
) {

    private val _registry = MutableStateFlow(initial)
    public val themes: StateFlow<Map<String, Theme>> = _registry.asStateFlow()

    private val _activeId = MutableStateFlow(initialActiveId)
    public val activeId: StateFlow<String> = _activeId.asStateFlow()

    /** Emits whenever the active theme changes (registry or selection). */
    private val _activeTheme = MutableStateFlow(initial.getValue(initialActiveId))
    public val activeTheme: StateFlow<Theme> = _activeTheme.asStateFlow()

    /** Register or replace a theme. Triggers `activeTheme` if it matches. */
    public fun register(theme: Theme) {
        _registry.value = _registry.value + (theme.metadata.id to theme)
        if (theme.metadata.id == _activeId.value) _activeTheme.value = theme
    }

    /** Register many at once (e.g. a downloaded pack). */
    public fun registerAll(themes: Iterable<Theme>) {
        val merged = _registry.value.toMutableMap()
        themes.forEach { merged[it.metadata.id] = it }
        _registry.value = merged
        _activeTheme.value = merged.getValue(_activeId.value)
    }

    /** Switch active theme. Throws if the id isn't registered. */
    public fun setActive(id: String) {
        val t = _registry.value[id]
            ?: error("Theme '$id' is not registered. Known: ${_registry.value.keys}")
        _activeId.value = id
        _activeTheme.value = t
    }

    /** Convenience: parse and register from raw JSON. */
    public fun registerJson(jsonString: String): Theme {
        val theme = ThemeParser.decode(jsonString)
        register(theme)
        return theme
    }

    public fun get(id: String): Theme? = _registry.value[id]
    public fun all(): List<Theme> = _registry.value.values.toList()

    public companion object {
        /**
         * Default engine seeded with the 24 built-in presets. Active
         * theme defaults to "navy-gold" — the marquee metallic.
         */
        public fun create(activeId: String = "navy-gold"): ThemeEngine {
            val map = Presets.all().associateBy { it.metadata.id }
            require(activeId in map) { "Default active id '$activeId' not in presets" }
            return ThemeEngine(map, activeId)
        }

        /** Empty engine for tests or custom catalogs. */
        public fun empty(active: Theme): ThemeEngine =
            ThemeEngine(mapOf(active.metadata.id to active), active.metadata.id)
    }
}
