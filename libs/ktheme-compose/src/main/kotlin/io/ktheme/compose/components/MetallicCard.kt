// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/components/MetallicCard.kt
//
// Card with a metallic gradient hairline border + theme-aware
// elevation. The body remains a normal Material surface so contrast
// against the metal frame is preserved.

package io.ktheme.compose.components

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.unit.dp
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.modifiers.metallicBrush
import io.ktheme.model.MetallicGradient
import io.ktheme.model.MetallicVariant

@Composable
public fun MetallicCard(
    modifier: Modifier = Modifier,
    variant: MetallicVariant? = null,
    intensity: Float? = null,
    content: @Composable () -> Unit,
) {
    val theme = LocalKtheme.current
    val v = variant ?: theme.effects.metallic.variant
    val i = (intensity ?: theme.effects.metallic.intensity.toFloat()).coerceIn(0f, 1f)
    val grad = MetallicGradient.forVariant(v)
    val brush = metallicBrush(grad = grad, intensity = i)
    val r = theme.adaptation?.layout?.cornerStyle?.radiusDp?.dp ?: 12.dp

    Surface(
        modifier = modifier.border(width = 1.5.dp, brush = brush, shape = RoundedCornerShape(r)),
        shape = RoundedCornerShape(r),
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = (theme.effects.shadows.elevation).dp,
    ) {
        androidx.compose.foundation.layout.Box(Modifier.padding(16.dp)) { content() }
    }
}
