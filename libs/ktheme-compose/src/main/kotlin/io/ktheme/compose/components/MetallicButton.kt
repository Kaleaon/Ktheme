// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/components/MetallicButton.kt
//
// Drop-in metallic button — wraps Material3 Button with the metallic
// gradient and shimmer modifiers pre-wired.

package io.ktheme.compose.components

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.modifiers.metallic
import io.ktheme.compose.modifiers.shimmer
import io.ktheme.compose.toComposeColor
import io.ktheme.model.MetallicVariant
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.defaultMinSize

@Composable
public fun MetallicButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: MetallicVariant? = null,
    intensity: Float? = null,
    shimmerEnabled: Boolean = true,
    contentLabel: String,
) {
    val theme = LocalKtheme.current
    val shape = RoundedCornerShape(theme.adaptation?.layout?.cornerStyle?.radiusDp?.dp ?: 12.dp)
    val onColor = theme.colorScheme.onPrimary.toComposeColor()

    Box(
        modifier = modifier
            .clip(shape)
            .metallic(variant = variant, intensity = intensity, shape = shape)
            .shimmer(enabled = shimmerEnabled)
            .clickable(onClick = onClick)
            .defaultMinSize(minHeight = 44.dp)
            .padding(horizontal = 24.dp, vertical = 12.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = contentLabel,
            style = MaterialTheme.typography.labelLarge,
            color = onColor,
        )
    }
}
