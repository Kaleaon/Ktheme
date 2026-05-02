// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/KthemeTheme.kt
//
// `KthemeTheme { … }` — drop-in replacement for `MaterialTheme { … }`
// that pulls colors, shapes, and typography from a Ktheme `Theme`
// and exposes the original `Theme` via a CompositionLocal so call
// sites that need metallic/effects metadata can read it.
//
// Usage:
//
//   val engine = remember { ThemeEngine.create() }
//   val theme by engine.activeTheme.collectAsState()
//   KthemeTheme(theme) {
//     Scaffold(…) { … }
//   }
//
// Or with a preset id directly:
//
//   KthemeTheme(presetId = "navy-gold") { … }

package io.ktheme.compose

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight as ComposeFontWeight
import androidx.compose.ui.unit.sp
import io.ktheme.model.Theme
import io.ktheme.presets.Presets

/** Read the raw [Theme] anywhere inside a [KthemeTheme]. */
public val LocalKtheme: androidx.compose.runtime.ProvidableCompositionLocal<Theme> =
    staticCompositionLocalOf { error("No KthemeTheme provided. Wrap your UI in KthemeTheme { … }.") }

@Composable
public fun KthemeTheme(
    theme: Theme,
    content: @Composable () -> Unit,
) {
    val colorScheme = theme.toComposeColorScheme()
    val shapes = theme.toComposeShapes()
    val typography = theme.toComposeTypography()

    CompositionLocalProvider(LocalKtheme provides theme) {
        MaterialTheme(
            colorScheme = colorScheme,
            shapes = shapes,
            typography = typography,
            content = content,
        )
    }
}

/** Convenience overload — load a preset by id at composition time. */
@Composable
public fun KthemeTheme(
    presetId: String,
    content: @Composable () -> Unit,
) {
    KthemeTheme(theme = Presets.load(presetId), content = content)
}

private fun Theme.toComposeTypography(): Typography {
    val t = typography ?: return Typography()
    val family = FontFamily.Default // Consumers can override with FontFamily(loadFonts(t.fontFamily))
    val base = TextStyle(
        fontFamily = family,
        fontSize = t.fontSize.medium.sp,
        lineHeight = (t.fontSize.medium * t.lineHeight).sp,
        letterSpacing = t.letterSpacing.sp,
    )
    return Typography(
        displayLarge   = base.copy(fontSize = t.fontSize.xlarge.sp,    fontWeight = ComposeFontWeight(t.fontWeight.bold)),
        displayMedium  = base.copy(fontSize = (t.fontSize.xlarge - 4).sp, fontWeight = ComposeFontWeight(t.fontWeight.bold)),
        displaySmall   = base.copy(fontSize = t.fontSize.large.sp,     fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        headlineLarge  = base.copy(fontSize = t.fontSize.xlarge.sp,    fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        headlineMedium = base.copy(fontSize = t.fontSize.large.sp,     fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        headlineSmall  = base.copy(fontSize = (t.fontSize.large - 2).sp, fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        titleLarge     = base.copy(fontSize = t.fontSize.large.sp,     fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        titleMedium    = base.copy(fontSize = t.fontSize.medium.sp,    fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        titleSmall     = base.copy(fontSize = t.fontSize.small.sp,     fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        bodyLarge      = base.copy(fontSize = t.fontSize.medium.sp,    fontWeight = ComposeFontWeight(t.fontWeight.regular)),
        bodyMedium     = base.copy(fontSize = (t.fontSize.medium - 2).sp, fontWeight = ComposeFontWeight(t.fontWeight.regular)),
        bodySmall      = base.copy(fontSize = t.fontSize.small.sp,     fontWeight = ComposeFontWeight(t.fontWeight.regular)),
        labelLarge     = base.copy(fontSize = t.fontSize.medium.sp,    fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        labelMedium    = base.copy(fontSize = t.fontSize.small.sp,     fontWeight = ComposeFontWeight(t.fontWeight.medium)),
        labelSmall     = base.copy(fontSize = (t.fontSize.small - 1).sp, fontWeight = ComposeFontWeight(t.fontWeight.medium)),
    )
}
