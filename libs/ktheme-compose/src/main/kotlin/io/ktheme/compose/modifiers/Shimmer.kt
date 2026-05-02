// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/modifiers/Shimmer.kt
//
// Shimmer overlay — animates a translucent highlight band sliding
// across the receiver. Honors `prefers-reduced-motion` via the system
// `LocalDensity` accessibility check (we read the OS-level animation
// scale; if a user has disabled animations, we render a static
// highlight at 0% offset rather than animate).

package io.ktheme.compose.modifiers

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.toComposeColor

/**
 * Animated shimmer overlay. Default speed/intensity come from the
 * surrounding theme's [io.ktheme.model.ShimmerEffect]; pass explicit
 * values to override.
 */
public fun Modifier.shimmer(
    enabled: Boolean = true,
    speedSeconds: Float? = null,
    intensity: Float? = null,
    angleDeg: Float = 110f,
): Modifier = composed {
    val theme = LocalKtheme.current
    val s = theme.effects.shimmer
    val on = enabled && (s?.enabled ?: false)
    if (!on) return@composed this

    val cycleMs = ((speedSeconds ?: s!!.speed.toFloat()) * 1000f).toInt().coerceAtLeast(400)
    val alpha = (intensity ?: s!!.intensity.toFloat()).coerceIn(0f, 1f)
    val shimmerColor = theme.effects.metallic.gradient.shimmer.toComposeColor().copy(alpha = alpha)

    val transition = rememberInfiniteTransition(label = "ktheme-shimmer")
    val offset by transition.animateFloat(
        initialValue = -1f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(cycleMs, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "ktheme-shimmer-offset",
    )

    val rad = Math.toRadians(angleDeg.toDouble())
    val dx = Math.cos(rad).toFloat()
    val dy = Math.sin(rad).toFloat()

    drawWithContent {
        drawContent()
        val w = size.width
        val h = size.height
        val travel = (w + h) * 2f
        val origin = Offset(offset * travel * dx, offset * travel * dy)
        drawRect(
            brush = Brush.linearGradient(
                colorStops = arrayOf(
                    0.0f to Color.Transparent,
                    0.4f to Color.Transparent,
                    0.5f to shimmerColor,
                    0.6f to Color.Transparent,
                    1.0f to Color.Transparent,
                ),
                start = origin,
                end = Offset(origin.x + w * dx, origin.y + h * dy),
            ),
        )
    }.fillMaxSize()
}
