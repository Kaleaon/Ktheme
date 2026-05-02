// libs/ktheme-core/src/main/kotlin/io/ktheme/parser/ThemeParser.kt
//
// Single entry point for reading + writing Theme JSON. Kept lenient so
// older preset files (missing `adaptation`, missing `shimmer`, etc.)
// parse without exceptions.

package io.ktheme.parser

import io.ktheme.model.Theme
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

public object ThemeParser {

    /**
     * Strict-but-tolerant JSON config:
     *  - `ignoreUnknownKeys` — preset files often add experimental fields.
     *  - `coerceInputValues` — null primitives fall back to defaults.
     *  - `prettyPrint` for round-tripping; consumers who want compact
     *     can call [Json] themselves.
     */
    public val Json: Json = Json {
        ignoreUnknownKeys = true
        coerceInputValues = true
        encodeDefaults = false
        prettyPrint = true
        prettyPrintIndent = "  "
    }

    /** Decode a single theme from a JSON string. */
    public fun decode(jsonString: String): Theme =
        Json.decodeFromString(Theme.serializer(), jsonString)

    /** Encode a single theme as a JSON string (pretty-printed). */
    public fun encode(theme: Theme): String =
        Json.encodeToString(Theme.serializer(), theme)

    /** Decode a list of themes (e.g. an exported pack). */
    public fun decodeAll(jsonString: String): List<Theme> =
        Json.decodeFromString(jsonString)
}
