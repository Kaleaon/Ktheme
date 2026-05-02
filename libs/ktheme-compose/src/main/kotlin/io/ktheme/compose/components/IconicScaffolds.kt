// libs/ktheme-compose/src/main/kotlin/io/ktheme/compose/components/IconicScaffolds.kt
//
// Iconic theme scaffolds — small composables that bake in each
// iconic theme's signature geometry rule so apps can opt into the
// "real" LCARS / Metro / Aero look without re-deriving it.
//
// These are intentionally narrow scaffolds (a top bar, a panel, a
// tile grid) — apps fill the slots. The rules they encode are:
//
//   LCARS  — pill rails on the left, centered rail labels.
//   Metro  — uppercase tile grid, sharp corners, no shadow.
//   Aero   — glass panels with rounded corners + soft shadow.
//   Deco   — uppercase top bar with hairline gold rule.

package io.ktheme.compose.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.ktheme.compose.LocalKtheme
import io.ktheme.compose.modifiers.glass
import io.ktheme.compose.toComposeColor

/**
 * LCARS scaffold. Provides the iconic left rail with stacked pill
 * "bars" and a content slot to the right.
 *
 * Format rule: keep rail/sweep geometry and centered rail labels;
 * vary palette by era.
 */
@Composable
public fun LcarsScaffold(
    railLabels: List<String>,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val theme = LocalKtheme.current
    val accent = theme.colorScheme.primary.toComposeColor()
    val accent2 = theme.colorScheme.tertiary.toComposeColor()
    val bg = theme.colorScheme.background.toComposeColor()

    Row(modifier = modifier.background(bg).fillMaxSize()) {
        Column(
            modifier = Modifier.width(160.dp).padding(end = 8.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            railLabels.forEachIndexed { idx, label ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(if (idx == 0) 92.dp else 38.dp)
                        .clip(RoundedCornerShape(topEnd = 0.dp, bottomEnd = 0.dp, topStart = 24.dp, bottomStart = 24.dp))
                        .background(if (idx % 2 == 0) accent else accent2),
                    contentAlignment = Alignment.CenterEnd,
                ) {
                    Text(
                        text = label.uppercase(),
                        color = Color.Black,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(end = 12.dp),
                    )
                }
            }
        }
        Box(modifier = Modifier.fillMaxSize()) { content() }
    }
}

/**
 * Metro tile grid. Sharp corners, uppercase labels, flat fill.
 *
 * Format rule: tile-first navigation; gap = 14dp; uppercase labels;
 * no shadow, no radius.
 */
@Composable
public fun MetroTileGrid(
    tiles: List<Pair<String, Color>>,
    modifier: Modifier = Modifier,
    columns: Int = 3,
) {
    LazyVerticalGrid(
        columns = GridCells.Fixed(columns),
        modifier = modifier.fillMaxSize().padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        itemsIndexed(tiles) { _, (label, color) ->
            Box(
                modifier = Modifier
                    .height(92.dp)
                    .fillMaxWidth()
                    .background(color),
                contentAlignment = Alignment.BottomStart,
            ) {
                Text(
                    text = label.uppercase(),
                    color = Color.White,
                    fontWeight = FontWeight.Light,
                    modifier = Modifier.padding(10.dp),
                    style = MaterialTheme.typography.titleMedium,
                )
            }
        }
    }
}

/**
 * Frutiger Aero glass panel. Glassmorphism on top of an aurora
 * gradient background.
 */
@Composable
public fun AeroGlassPanel(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Box(modifier = modifier.glass(opacity = 0.45f).padding(20.dp)) { content() }
}
