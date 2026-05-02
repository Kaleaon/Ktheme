// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/Mappings.kt
//
// Theme → Compose primitive mappings. Kept in their own file so each
// integration point (color, shape) is easy to find and unit-test.

package io.ktheme.compose

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ColorScheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import io.ktheme.engine.HexColor
import io.ktheme.model.CornerStyle
import io.ktheme.model.Theme

/** `#RRGGBB` / `#AARRGGBB` -> Compose [Color]. */
public fun String.toComposeColor(): Color =
    Color(HexColor.parseArgb(this).toULong() shl 0)
        .let { /* keep as-is */ Color(HexColor.parseArgb(this)) }

public fun Theme.toComposeColorScheme(): ColorScheme {
    val cs = colorScheme
    val factory = if (darkMode) ::darkColorScheme else ::lightColorScheme
    return factory(
        cs.primary.toComposeColor(),
        cs.onPrimary.toComposeColor(),
        cs.primaryContainer.toComposeColor(),
        cs.onPrimaryContainer.toComposeColor(),
        // inversePrimary
        cs.inversePrimary.toComposeColor(),
        cs.secondary.toComposeColor(),
        cs.onSecondary.toComposeColor(),
        cs.secondaryContainer.toComposeColor(),
        cs.onSecondaryContainer.toComposeColor(),
        cs.tertiary.toComposeColor(),
        cs.onTertiary.toComposeColor(),
        cs.tertiaryContainer.toComposeColor(),
        cs.onTertiaryContainer.toComposeColor(),
        cs.background.toComposeColor(),
        cs.onBackground.toComposeColor(),
        cs.surface.toComposeColor(),
        cs.onSurface.toComposeColor(),
        cs.surfaceVariant.toComposeColor(),
        cs.onSurfaceVariant.toComposeColor(),
        // surfaceTint
        cs.primary.toComposeColor(),
        cs.inverseSurface.toComposeColor(),
        cs.inverseOnSurface.toComposeColor(),
        cs.error.toComposeColor(),
        cs.onError.toComposeColor(),
        cs.errorContainer.toComposeColor(),
        cs.onErrorContainer.toComposeColor(),
        cs.outline.toComposeColor(),
        cs.outlineVariant.toComposeColor(),
        cs.scrim.toComposeColor(),
        // surfaceBright / surfaceDim / surfaceContainer*  -> sensible defaults
        cs.surface.toComposeColor(),
        cs.background.toComposeColor(),
        cs.surfaceVariant.toComposeColor(),
        cs.surfaceVariant.toComposeColor(),
        cs.surface.toComposeColor(),
        cs.surface.toComposeColor(),
        cs.surface.toComposeColor(),
    )
}

public fun Theme.toComposeShapes(): Shapes {
    val style = adaptation?.layout?.cornerStyle ?: CornerStyle.Rounded
    val r = style.radiusDp
    return Shapes(
        extraSmall = RoundedCornerShape((r * 0.25).dp),
        small      = RoundedCornerShape((r * 0.5).dp),
        medium     = RoundedCornerShape(r.dp),
        large      = RoundedCornerShape((r * 1.5).dp),
        extraLarge = RoundedCornerShape((r * 2).dp),
    )
}
