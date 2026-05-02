// libs/ktheme-core/src/main/kotlin/io/ktheme/engine/Contrast.kt
//
// Contrast validation matching the engine's MD3 pair audits. Surfaces
// warnings for foreground/background pairs that fail WCAG AA (4.5:1
// for body, 3.0:1 for large text/UI). Used by tooling and by the
// Theme Creator's live preview.

package io.ktheme.engine

import io.ktheme.model.ColorScheme
import io.ktheme.model.Theme

public object Contrast {

    public data class Pair(
        public val role: String,
        public val foreground: String,
        public val background: String,
        public val ratio: Double,
        public val passesAA: Boolean,
        public val passesAALarge: Boolean,
        public val passesAAA: Boolean,
    )

    /** All MD3 on/container pairs that should meet at least AA. */
    public fun audit(theme: Theme): List<Pair> = with(theme.colorScheme) {
        listOf(
            check("primary",            onPrimary,            primary),
            check("primaryContainer",   onPrimaryContainer,   primaryContainer),
            check("secondary",          onSecondary,          secondary),
            check("secondaryContainer", onSecondaryContainer, secondaryContainer),
            check("tertiary",           onTertiary,           tertiary),
            check("tertiaryContainer",  onTertiaryContainer,  tertiaryContainer),
            check("error",              onError,              error),
            check("errorContainer",     onErrorContainer,     errorContainer),
            check("background",         onBackground,         background),
            check("surface",            onSurface,            surface),
            check("surfaceVariant",     onSurfaceVariant,     surfaceVariant),
        )
    }

    /** Subset that fails WCAG AA — what tooling surfaces as warnings. */
    public fun warnings(theme: Theme): List<Pair> = audit(theme).filterNot { it.passesAA }

    private fun check(role: String, fg: String, bg: String): Pair {
        val ratio = HexColor.contrast(fg, bg)
        return Pair(
            role = role,
            foreground = fg,
            background = bg,
            ratio = ratio,
            passesAA = ratio >= 4.5,
            passesAALarge = ratio >= 3.0,
            passesAAA = ratio >= 7.0,
        )
    }

    @Suppress("unused")
    private fun ColorScheme.unused(): Unit = Unit // anchor for IDE
}
