// libs/ktheme-core/src/main/kotlin/io/ktheme/presets/Presets.kt
//
// Presets registry. The 24 canonical theme JSON files ship inside the
// JAR under `themes/examples/*.json`. This object reads them lazily
// and exposes them by id.
//
// Build glue: the `ktheme-core` Gradle module is configured to copy
// the repo's `themes/examples/*.json` into `src/main/resources/
// themes/examples/` so they're packaged with the JAR. See
// `copyPresets` task in `build.gradle.kts`.

package io.ktheme.presets

import io.ktheme.model.Theme
import io.ktheme.parser.ThemeParser

public object Presets {

    /** All 24 preset ids in the order they appear in the README. */
    public val ALL_IDS: List<String> = listOf(
        // Metallic / elegant darks
        "navy-gold",
        "rose-gold",
        "burgundy-rose-gold",
        "emerald-silver",
        "midnight-amber",
        "deep-purple-platinum",
        "obsidian-crimson",
        "charcoal-champagne",
        "royal-silver",
        "royal-bronze",
        "slate-gunmetal",
        "slate-cyan",
        "forest-copper",
        // Iconic
        "lcars",
        "windows-phone-metro",
        "frutiger-aero",
        "art-deco",
        "art-nouveau",
        "paper-ink",
        // Product context
        "solarpunk-civic",
        "calm-clinical",
        "neo-noir-neon",
        "aurora-glass-night",
        "ink-terminal-modern",
    )

    private val cache = mutableMapOf<String, Theme>()

    /** Load a single preset by id. Reads from `themes/examples/{id}.json`. */
    public fun load(id: String): Theme = cache.getOrPut(id) {
        val path = "/themes/examples/$id.json"
        val stream = Presets::class.java.getResourceAsStream(path)
            ?: error("Preset '$id' not bundled. Expected resource at $path")
        ThemeParser.decode(stream.bufferedReader().use { it.readText() })
    }

    /** Load every preset listed in [ALL_IDS]. */
    public fun all(): List<Theme> = ALL_IDS.map(::load)

    /** Load every preset whose tags overlap [tags]. */
    public fun byTag(vararg tags: String): List<Theme> {
        val want = tags.toSet()
        return all().filter { theme -> theme.metadata.tags.any { it in want } }
    }
}
