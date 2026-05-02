// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/modifiers/Glass.kt
//
// Glassmorphism panel — translucent surface with optional saturation
// boost. Compose has no `backdrop-filter` primitive; we approximate
// with a tinted translucent fill. For real backdrop blur on Android,
// callers can layer a `RenderEffect.createBlurEffect(...)` underneath
// (API 31+); we expose a `glass(useRenderEffect = true)` flag for that.

package io.ktheme.compose.modifiers

import android.os.Build
import androidx.compose.foundation.background
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RenderEffect
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.asComposeRenderEffect
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.toComposeColor

public fun Modifier.glass(
    tint: Color? = null,
    opacity: Float = 0.55f,
    blur: Dp = 14.dp,
    shape: Shape = RoundedCornerShape(18.dp),
    useRenderEffect: Boolean = true,
): Modifier = composed {
    val theme = LocalKtheme.current
    val fill = (tint ?: theme.colorScheme.surface.toComposeColor()).copy(alpha = opacity)

    val base = background(color = fill, shape = shape)
    if (useRenderEffect && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        base.graphicsLayer {
            renderEffect = android.graphics.RenderEffect
                .createBlurEffect(blur.toPx(), blur.toPx(), android.graphics.Shader.TileMode.CLAMP)
                .asComposeRenderEffect()
        }
    } else base
}
