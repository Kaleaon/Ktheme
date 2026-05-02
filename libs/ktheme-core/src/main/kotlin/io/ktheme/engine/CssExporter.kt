// libs/ktheme-core/src/main/kotlin/io/ktheme/engine/CssExporter.kt
//
// Render a Theme as CSS custom properties. This is the canonical
// "export to web" path — themes drop into any web app under a single
// :root or scoped class. Mirrors the variable names used by the
// Theme Creator app and `colors_and_type.css`.

package io.ktheme.engine

import io.ktheme.model.Theme

public object CssExporter {

    /**
     * Render [theme] as a CSS rule scoped to [selector]. Use `:root`
     * (default) for whole-document themes or `.kt-{id}` for scoped.
     */
    public fun export(theme: Theme, selector: String = ":root"): String = buildString {
        appendLine("/* ${theme.metadata.name} — ${theme.metadata.description} */")
        appendLine("$selector {")
        with(theme.colorScheme) {
            line("--md-primary",                primary)
            line("--md-on-primary",             onPrimary)
            line("--md-primary-container",      primaryContainer)
            line("--md-on-primary-container",   onPrimaryContainer)
            line("--md-secondary",              secondary)
            line("--md-on-secondary",           onSecondary)
            line("--md-secondary-container",    secondaryContainer)
            line("--md-on-secondary-container", onSecondaryContainer)
            line("--md-tertiary",               tertiary)
            line("--md-on-tertiary",            onTertiary)
            line("--md-tertiary-container",     tertiaryContainer)
            line("--md-on-tertiary-container",  onTertiaryContainer)
            line("--md-error",                  error)
            line("--md-on-error",               onError)
            line("--md-error-container",        errorContainer)
            line("--md-on-error-container",     onErrorContainer)
            line("--md-background",             background)
            line("--md-on-background",          onBackground)
            line("--md-surface",                surface)
            line("--md-on-surface",             onSurface)
            line("--md-surface-variant",        surfaceVariant)
            line("--md-on-surface-variant",     onSurfaceVariant)
            line("--md-outline",                outline)
            line("--md-outline-variant",        outlineVariant)
            line("--md-scrim",                  scrim)
            line("--md-inverse-surface",        inverseSurface)
            line("--md-inverse-on-surface",     inverseOnSurface)
            line("--md-inverse-primary",        inversePrimary)
        }
        theme.typography?.let { t ->
            line("--kt-font-family",   t.fontFamily)
            line("--kt-font-sm",       "${t.fontSize.small}px")
            line("--kt-font-md",       "${t.fontSize.medium}px")
            line("--kt-font-lg",       "${t.fontSize.large}px")
            line("--kt-font-xl",       "${t.fontSize.xlarge}px")
            line("--kt-line-height",   t.lineHeight.toString())
            line("--kt-letter-spacing", "${t.letterSpacing}px")
        }
        if (theme.effects.metallic.enabled) {
            val g = theme.effects.metallic.gradient
            line("--kt-metal-base",   g.base)
            line("--kt-metal-hi",     g.highlight)
            line("--kt-metal-lo",     g.shadow)
            line("--kt-metal-shimmer", g.shimmer)
            line("--kt-metal",
                "linear-gradient(135deg, ${g.shadow} 0%, ${g.base} 25%, ${g.highlight} 50%, ${g.base} 75%, ${g.shadow} 100%)")
        }
        appendLine("}")
    }

    private fun StringBuilder.line(name: String, value: String) {
        append("  ").append(name).append(": ").append(value).append(";\n")
    }
}
