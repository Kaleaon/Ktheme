// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/modifiers/Glow.kt
//
// Outer + inner glow as a Modifier. Uses two stacked shadows like the
// engine's CSS: outer "0 0 10·I 5·I color" and an inset "0 0 15·I
// color inset" approximated via a border + drawBehind.

package io.ktheme.compose.modifiers

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.toComposeColor

/** Outer glow ring around the receiver. */
public fun Modifier.glow(
    color: Color? = null,
    intensity: Float = 0.6f,
    radius: Dp = 12.dp,
): Modifier = composed {
    val theme = LocalKtheme.current
    val c = color
        ?: theme.effects.glow?.color?.toComposeColor()
        ?: theme.colorScheme.primary.toComposeColor()
    val i = (theme.effects.glow?.intensity?.toFloat() ?: intensity).coerceIn(0f, 1f)

    drawBehind {
        val r = radius.toPx() * (0.5f + i)
        for (step in 1..3) {
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(c.copy(alpha = i / step), Color.Transparent),
                    center = Offset(size.width / 2f, size.height / 2f),
                    radius = (size.minDimension / 2f) + r * step,
                ),
                radius = (size.minDimension / 2f) + r * step,
                center = Offset(size.width / 2f, size.height / 2f),
                blendMode = BlendMode.Plus,
            )
        }
    }
}
