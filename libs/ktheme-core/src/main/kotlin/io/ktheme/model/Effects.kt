// libs/ktheme-core/src/main/kotlin/io/ktheme/model/Effects.kt
//
// Effects block — the visual personality of a Ktheme. Each sub-effect
// is independently `enabled` so themes can opt into just the metallic
// gradient without forcing shimmer, blur, or glow on consumers that
// don't want them.

package io.ktheme.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
public data class Effects(
    public val metallic: MetallicEffect = MetallicEffect(),
    public val shadows: ShadowEffect = ShadowEffect(),
    public val shimmer: ShimmerEffect? = null,
    public val blur: BlurEffect? = null,
    public val overlays: OverlayEffect? = null,
    public val gradients: GradientEffect? = null,
    public val glow: GlowEffect? = null,
    public val noise: NoiseEffect? = null,
)

@Serializable
public data class MetallicEffect(
    public val enabled: Boolean = false,
    public val variant: MetallicVariant = MetallicVariant.SILVER,
    public val gradient: MetallicGradient = MetallicGradient.SILVER,
    /** 0–1. Multiplied into highlight saturation and shimmer alpha. */
    public val intensity: Double = 0.0,
)

@Serializable
public enum class MetallicVariant {
    GOLD,
    SILVER,
    GOLD_ROYAL_BLUE,
    BRONZE,
    COPPER,
    PLATINUM,
    ROSE_GOLD,
    TITANIUM,
    CHROME,
    COBALT,
}

/**
 * Four-stop palette feeding the engine's 5-stop linear gradient
 * (shadow → base → highlight → base → shadow). `shimmer` is the
 * highlight band color used by the animated shimmer overlay.
 */
@Serializable
public data class MetallicGradient(
    public val base: String,
    public val highlight: String,
    public val shadow: String,
    public val shimmer: String,
) {
    public companion object {
        public val GOLD: MetallicGradient = MetallicGradient("#D4AF37", "#FFD700", "#B8860B", "#FFF8DC")
        public val SILVER: MetallicGradient = MetallicGradient("#C0C0C0", "#E8E8E8", "#808080", "#FFFFFF")
        public val ROSE_GOLD: MetallicGradient = MetallicGradient("#B76E79", "#E5BE8A", "#7D4A52", "#F5D5D8")
        public val BRONZE: MetallicGradient = MetallicGradient("#CD7F32", "#D99952", "#6B4423", "#F0D9C0")
        public val COPPER: MetallicGradient = MetallicGradient("#B87333", "#D49A63", "#6D421E", "#F2D8C2")
        public val PLATINUM: MetallicGradient = MetallicGradient("#E5E4E2", "#FFFFFF", "#9C9A98", "#FFFFFF")
        public val TITANIUM: MetallicGradient = MetallicGradient("#878681", "#BDBBB8", "#4A4A48", "#D0CFCC")
        public val CHROME: MetallicGradient = MetallicGradient("#DBE2E9", "#FFFFFF", "#4A5C6E", "#FFFFFF")
        public val COBALT: MetallicGradient = MetallicGradient("#3A6BD9", "#7FA5F0", "#1A3A8A", "#D6E4FF")
        public val GOLD_ROYAL_BLUE: MetallicGradient = MetallicGradient("#D4AF37", "#FFD700", "#0A1630", "#FFF8DC")

        public fun forVariant(variant: MetallicVariant): MetallicGradient = when (variant) {
            MetallicVariant.GOLD -> GOLD
            MetallicVariant.SILVER -> SILVER
            MetallicVariant.ROSE_GOLD -> ROSE_GOLD
            MetallicVariant.BRONZE -> BRONZE
            MetallicVariant.COPPER -> COPPER
            MetallicVariant.PLATINUM -> PLATINUM
            MetallicVariant.TITANIUM -> TITANIUM
            MetallicVariant.CHROME -> CHROME
            MetallicVariant.COBALT -> COBALT
            MetallicVariant.GOLD_ROYAL_BLUE -> GOLD_ROYAL_BLUE
        }
    }
}

@Serializable
public data class ShadowEffect(
    public val enabled: Boolean = true,
    public val elevation: Int = 2,
    public val blur: Int = 4,
    public val color: String = "#00000044",
)

@Serializable
public data class ShimmerEffect(
    public val enabled: Boolean = true,
    /** seconds per cycle */
    public val speed: Double = 3.0,
    /** 0–1 */
    public val intensity: Double = 0.5,
    /** degrees */
    public val angle: Int = 135,
)

@Serializable
public data class BlurEffect(
    public val enabled: Boolean = true,
    public val radius: Int = 12,
)

@Serializable
public data class OverlayEffect(
    public val enabled: Boolean = true,
    public val color: String,
    public val opacity: Double = 0.18,
    @SerialName("blendMode")
    public val blendMode: String = "screen",
)

@Serializable
public data class GradientEffect(
    public val enabled: Boolean = true,
    public val angle: Int = 135,
    public val stops: List<GradientStop> = emptyList(),
)

@Serializable
public data class GradientStop(
    public val offset: Double,
    public val color: String,
)

@Serializable
public data class GlowEffect(
    public val enabled: Boolean = false,
    public val color: String = "#FFFFFF",
    public val intensity: Double = 0.5,
)

@Serializable
public data class NoiseEffect(
    public val enabled: Boolean = false,
    public val opacity: Double = 0.04,
    public val scale: Double = 1.0,
)
