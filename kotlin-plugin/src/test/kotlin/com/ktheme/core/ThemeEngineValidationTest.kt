package com.ktheme.core

import com.ktheme.models.AnimationEffects
import com.ktheme.models.BlurEffects
import com.ktheme.models.ColorScheme
import com.ktheme.models.FontSize
import com.ktheme.models.FontWeight
import com.ktheme.models.GlowEffects
import com.ktheme.models.MetallicEffects
import com.ktheme.models.MetallicGradient
import com.ktheme.models.ParticleEffects
import com.ktheme.models.ShadowEffects
import com.ktheme.models.ShimmerEffects
import com.ktheme.models.Theme
import com.ktheme.models.ThemeMetadata
import com.ktheme.models.TransitionEffects
import com.ktheme.models.Typography
import com.ktheme.models.VisualEffects
import kotlin.test.Test
import kotlin.test.assertContains
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class ThemeEngineValidationTest {
    private val engine = ThemeEngine()

    @Test
    fun `validateTheme returns structured errors for invalid hex and range fields`() {
        val invalidTheme = validTheme().copy(
            colorScheme = validColorScheme().copy(primary = "#12"),
            effects = validEffects().copy(
                glow = GlowEffects(enabled = true, radius = 12, intensity = 1.2f, color = "#00FF00"),
                particles = ParticleEffects(enabled = true, count = 20, speed = 2f, size = -1, color = "#123456")
            ),
            typography = validTypography().copy(
                lineHeight = 0.5f,
                fontSize = FontSize(small = 12, medium = 11, large = 16, xlarge = 20)
            )
        )

        val result = engine.validateTheme(invalidTheme)

        assertFalse(result.valid)
        assertContains(result.errors, "colorScheme.primary must be a valid hex color")
        assertContains(result.errors, "effects.glow.intensity must be in range [0.0, 1.0]")
        assertContains(result.errors, "effects.particles.size must be in range [0, 512]")
        assertContains(result.errors, "typography.lineHeight must be in range [0.8, 3.0]")
        assertContains(result.errors, "typography.fontSize values must be non-decreasing (small <= medium <= large <= xlarge)")
    }

    @Test
    fun `validateTheme accepts valid boundary values for effects and typography`() {
        val boundaryTheme = validTheme().copy(
            effects = VisualEffects(
                metallic = MetallicEffects(
                    enabled = true,
                    variant = "GOLD",
                    gradient = MetallicGradient(
                        base = "#000000",
                        highlight = "#FFFFFF",
                        shadow = "#111111",
                        shimmer = "#EEEEEE"
                    ),
                    intensity = 1f
                ),
                shadows = ShadowEffects(enabled = true, elevation = 64, blur = 128, color = "#000000FF"),
                shimmer = ShimmerEffects(enabled = true, speed = 60, intensity = 1f, angle = 360),
                blur = BlurEffects(enabled = true, radius = 100),
                animations = AnimationEffects(enabled = true, duration = 60_000, easing = "ease-in-out"),
                transitions = TransitionEffects(enabled = true, duration = 60_000, properties = listOf("opacity")),
                particles = ParticleEffects(enabled = true, count = 10_000, speed = 1_000f, size = 512, color = "#ABCDEF"),
                glow = GlowEffects(enabled = true, radius = 200, intensity = 1f, color = "#123456")
            ),
            typography = Typography(
                fontFamily = "Inter",
                fontSize = FontSize(small = 1, medium = 64, large = 128, xlarge = 256),
                fontWeight = FontWeight(light = 1, regular = 400, medium = 700, bold = 1000),
                lineHeight = 3f,
                letterSpacing = -0.2f
            )
        )

        val result = engine.validateTheme(boundaryTheme)

        assertTrue(result.valid)
        assertTrue(result.errors.isEmpty())
    }

    private fun validTheme() = Theme(
        metadata = ThemeMetadata(
            id = "validation-theme",
            name = "Validation Theme",
            description = "Theme for validation tests",
            author = "tests",
            version = "1.0.0",
            tags = listOf("test"),
            createdAt = "2026-01-01T00:00:00Z",
            updatedAt = "2026-01-01T00:00:00Z"
        ),
        darkMode = true,
        colorScheme = validColorScheme(),
        effects = validEffects(),
        typography = validTypography()
    )

    private fun validEffects() = VisualEffects(
        metallic = MetallicEffects(
            enabled = true,
            variant = "GOLD",
            gradient = MetallicGradient(
                base = "#1E3A8A",
                highlight = "#3B82F6",
                shadow = "#1D4ED8",
                shimmer = "#93C5FD"
            ),
            intensity = 0.8f
        ),
        shadows = ShadowEffects(enabled = true, elevation = 4, blur = 8, color = "#00000066"),
        shimmer = ShimmerEffects(enabled = true, speed = 4, intensity = 0.5f, angle = 30),
        blur = BlurEffects(enabled = true, radius = 12),
        animations = AnimationEffects(enabled = true, duration = 250, easing = "ease-out"),
        transitions = TransitionEffects(enabled = true, duration = 220, properties = listOf("opacity", "transform")),
        particles = ParticleEffects(enabled = true, count = 120, speed = 2f, size = 3, color = "#A855F7"),
        glow = GlowEffects(enabled = true, radius = 18, intensity = 0.4f, color = "#22C55E")
    )

    private fun validTypography() = Typography(
        fontFamily = "Inter",
        fontSize = FontSize(small = 12, medium = 14, large = 16, xlarge = 20),
        fontWeight = FontWeight(light = 300, regular = 400, medium = 500, bold = 700),
        lineHeight = 1.4f,
        letterSpacing = 0f
    )

    private fun validColorScheme() = ColorScheme(
        primary = "#6750A4",
        onPrimary = "#FFFFFF",
        primaryContainer = "#EADDFF",
        onPrimaryContainer = "#21005D",
        secondary = "#625B71",
        onSecondary = "#FFFFFF",
        secondaryContainer = "#E8DEF8",
        onSecondaryContainer = "#1D192B",
        tertiary = "#7D5260",
        onTertiary = "#FFFFFF",
        tertiaryContainer = "#FFD8E4",
        onTertiaryContainer = "#31111D",
        error = "#B3261E",
        onError = "#FFFFFF",
        errorContainer = "#F9DEDC",
        onErrorContainer = "#410E0B",
        background = "#1C1B1F",
        onBackground = "#E6E1E5",
        surface = "#1C1B1F",
        onSurface = "#E6E1E5",
        surfaceVariant = "#49454F",
        onSurfaceVariant = "#CAC4D0",
        outline = "#938F99",
        outlineVariant = "#49454F",
        scrim = "#000000",
        inverseSurface = "#E6E1E5",
        inverseOnSurface = "#313033",
        inversePrimary = "#D0BCFF"
    )
}
