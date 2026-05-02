// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/modifiers/Metallic.kt
//
// `Modifier.metallic(...)` — applies the engine's signature 5-stop
// linear gradient as a background. Reads the variant + intensity from
// the active theme by default; pass an explicit MetallicGradient to
// override.
//
// The gradient is shadow → base → highlight → base → shadow at 135°,
// matching the CSS engine. Intensity (0–1) lerps the highlight toward
// pure white for extra "polish".

package io.ktheme.compose.modifiers

import androidx.compose.foundation.background
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.lerp
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.toComposeColor
import io.ktheme.model.MetallicGradient
import io.ktheme.model.MetallicVariant

/**
 * Paint a metallic gradient background. By default reads the variant
 * and intensity from the surrounding [io.ktheme.compose.KthemeTheme].
 *
 * @param shape Clip shape (defaults to no clipping).
 * @param angleDeg Gradient angle. 135° matches the engine default.
 */
public fun Modifier.metallic(
    variant: MetallicVariant? = null,
    intensity: Float? = null,
    shape: Shape = RoundedCornerShape(0),
    angleDeg: Float = 135f,
): Modifier = composed {
    val theme = LocalKtheme.current
    val v = variant ?: theme.effects.metallic.variant
    val i = (intensity ?: theme.effects.metallic.intensity.toFloat()).coerceIn(0f, 1f)
    val grad = MetallicGradient.forVariant(v)
    background(brush = metallicBrush(grad, i, angleDeg), shape = shape)
}

/** Build a 5-stop linear-gradient brush for [grad] at [angleDeg]. */
@Composable
@ReadOnlyComposable
public fun metallicBrush(
    grad: MetallicGradient,
    intensity: Float = 0.7f,
    angleDeg: Float = 135f,
): Brush {
    val base = grad.base.toComposeColor()
    val shadow = grad.shadow.toComposeColor()
    val highlight = lerp(grad.highlight.toComposeColor(), Color.White, (intensity - 0.5f).coerceAtLeast(0f))
    val rad = Math.toRadians(angleDeg.toDouble())
    val dx = Math.cos(rad).toFloat()
    val dy = Math.sin(rad).toFloat()
    return Brush.linearGradient(
        colorStops = arrayOf(
            0.00f to shadow,
            0.25f to base,
            0.50f to highlight,
            0.75f to base,
            1.00f to shadow,
        ),
        // Compose normalizes; offsets approximate angle direction.
        start = Offset(0f, 0f),
        end = Offset(1000f * dx, 1000f * dy),
    )
}
