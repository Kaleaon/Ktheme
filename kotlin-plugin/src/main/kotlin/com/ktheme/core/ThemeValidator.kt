package com.ktheme.core

import com.ktheme.models.ColorScheme
import com.ktheme.models.GlowEffects
import com.ktheme.models.Theme
import com.ktheme.models.VisualEffects
import com.ktheme.utils.ColorUtils

internal object ThemeValidator {
    fun validate(theme: Theme, errors: MutableList<String>, warnings: MutableList<String>) {
        validateMetadata(theme, errors)
        validateColorScheme(theme.colorScheme, errors)
        theme.effects?.let { validateEffects(it, errors) }
        theme.typography?.let { typography ->
            validateTypography(typography, errors)
        }

        // Keep backward-compatible warning behavior.
        theme.effects?.metallic?.let {
            if (it.enabled && it.intensity > 1f) {
                warnings.add("effects.metallic.intensity should be between 0 and 1")
            }
        }
    }

    private fun validateMetadata(theme: Theme, errors: MutableList<String>) {
        with(theme.metadata) {
            if (id.isBlank()) errors.add("metadata.id is required")
            if (name.isBlank()) errors.add("metadata.name is required")
            if (version.isBlank()) errors.add("metadata.version is required")
        }
    }

    private fun validateColorScheme(colorScheme: ColorScheme, errors: MutableList<String>) {
        val colorFields = listOf(
            "primary" to colorScheme.primary,
            "onPrimary" to colorScheme.onPrimary,
            "primaryContainer" to colorScheme.primaryContainer,
            "onPrimaryContainer" to colorScheme.onPrimaryContainer,
            "secondary" to colorScheme.secondary,
            "onSecondary" to colorScheme.onSecondary,
            "secondaryContainer" to colorScheme.secondaryContainer,
            "onSecondaryContainer" to colorScheme.onSecondaryContainer,
            "tertiary" to colorScheme.tertiary,
            "onTertiary" to colorScheme.onTertiary,
            "tertiaryContainer" to colorScheme.tertiaryContainer,
            "onTertiaryContainer" to colorScheme.onTertiaryContainer,
            "error" to colorScheme.error,
            "onError" to colorScheme.onError,
            "errorContainer" to colorScheme.errorContainer,
            "onErrorContainer" to colorScheme.onErrorContainer,
            "background" to colorScheme.background,
            "onBackground" to colorScheme.onBackground,
            "surface" to colorScheme.surface,
            "onSurface" to colorScheme.onSurface,
            "surfaceVariant" to colorScheme.surfaceVariant,
            "onSurfaceVariant" to colorScheme.onSurfaceVariant,
            "outline" to colorScheme.outline,
            "outlineVariant" to colorScheme.outlineVariant,
            "scrim" to colorScheme.scrim,
            "inverseSurface" to colorScheme.inverseSurface,
            "inverseOnSurface" to colorScheme.inverseOnSurface,
            "inversePrimary" to colorScheme.inversePrimary
        )

        colorFields.forEach { (field, value) ->
            validateHex("colorScheme.$field", value, errors)
        }
    }

    private fun validateEffects(effects: VisualEffects, errors: MutableList<String>) {
        effects.metallic?.let { metallic ->
            validateFloatRange("effects.metallic.intensity", metallic.intensity, 0f, 1f, errors)
            if (metallic.variant.isBlank()) {
                errors.add("effects.metallic.variant is required")
            }
            validateHex("effects.metallic.gradient.base", metallic.gradient.base, errors)
            validateHex("effects.metallic.gradient.highlight", metallic.gradient.highlight, errors)
            validateHex("effects.metallic.gradient.shadow", metallic.gradient.shadow, errors)
            validateHex("effects.metallic.gradient.shimmer", metallic.gradient.shimmer, errors)
        }

        effects.shadows?.let { shadows ->
            validateIntRange("effects.shadows.elevation", shadows.elevation, 0, 64, errors)
            validateIntRange("effects.shadows.blur", shadows.blur, 0, 128, errors)
            validateHex("effects.shadows.color", shadows.color, errors)
        }

        effects.shimmer?.let { shimmer ->
            validateIntRange("effects.shimmer.speed", shimmer.speed, 0, 60, errors)
            validateFloatRange("effects.shimmer.intensity", shimmer.intensity, 0f, 1f, errors)
            validateIntRange("effects.shimmer.angle", shimmer.angle, 0, 360, errors)
        }

        effects.blur?.let { blur ->
            validateIntRange("effects.blur.radius", blur.radius, 0, 100, errors)
        }

        effects.animations?.let { animations ->
            validateIntRange("effects.animations.duration", animations.duration, 0, 60_000, errors)
            if (animations.easing.isBlank()) {
                errors.add("effects.animations.easing is required")
            }
        }

        effects.transitions?.let { transitions ->
            validateIntRange("effects.transitions.duration", transitions.duration, 0, 60_000, errors)
            if (transitions.properties.isEmpty()) {
                errors.add("effects.transitions.properties must not be empty")
            } else if (transitions.properties.any { it.isBlank() }) {
                errors.add("effects.transitions.properties must not contain blank values")
            }
        }

        effects.particles?.let { particles ->
            validateIntRange("effects.particles.count", particles.count, 0, 10_000, errors)
            validateFloatRange("effects.particles.speed", particles.speed, 0f, 1_000f, errors)
            validateIntRange("effects.particles.size", particles.size, 0, 512, errors)
            validateHex("effects.particles.color", particles.color, errors)
        }

        effects.glow?.let { glow ->
            validateGlow(glow, errors)
        }
    }

    private fun validateGlow(glow: GlowEffects, errors: MutableList<String>) {
        validateIntRange("effects.glow.radius", glow.radius, 0, 200, errors)
        validateFloatRange("effects.glow.intensity", glow.intensity, 0f, 1f, errors)
        validateHex("effects.glow.color", glow.color, errors)
    }

    private fun validateTypography(typography: com.ktheme.models.Typography, errors: MutableList<String>) {
        if (typography.fontFamily.isBlank()) {
            errors.add("typography.fontFamily is required")
        }

        val sizes = typography.fontSize
        validateIntRange("typography.fontSize.small", sizes.small, 1, 256, errors)
        validateIntRange("typography.fontSize.medium", sizes.medium, 1, 256, errors)
        validateIntRange("typography.fontSize.large", sizes.large, 1, 256, errors)
        validateIntRange("typography.fontSize.xlarge", sizes.xlarge, 1, 256, errors)
        if (!(sizes.small <= sizes.medium && sizes.medium <= sizes.large && sizes.large <= sizes.xlarge)) {
            errors.add("typography.fontSize values must be non-decreasing (small <= medium <= large <= xlarge)")
        }

        val weights = typography.fontWeight
        validateIntRange("typography.fontWeight.light", weights.light, 1, 1000, errors)
        validateIntRange("typography.fontWeight.regular", weights.regular, 1, 1000, errors)
        validateIntRange("typography.fontWeight.medium", weights.medium, 1, 1000, errors)
        validateIntRange("typography.fontWeight.bold", weights.bold, 1, 1000, errors)
        if (!(weights.light <= weights.regular && weights.regular <= weights.medium && weights.medium <= weights.bold)) {
            errors.add("typography.fontWeight values must be non-decreasing (light <= regular <= medium <= bold)")
        }

        validateFloatRange("typography.lineHeight", typography.lineHeight, 0.8f, 3f, errors)
        validateFloatRange("typography.letterSpacing", typography.letterSpacing, -0.2f, 2f, errors)
    }

    private fun validateHex(path: String, value: String, errors: MutableList<String>) {
        if (!ColorUtils.isValidHex(value)) {
            errors.add("$path must be a valid hex color")
        }
    }

    private fun validateIntRange(path: String, value: Int, min: Int, max: Int, errors: MutableList<String>) {
        if (value !in min..max) {
            errors.add("$path must be in range [$min, $max]")
        }
    }

    private fun validateFloatRange(path: String, value: Float, min: Float, max: Float, errors: MutableList<String>) {
        if (value < min || value > max) {
            errors.add("$path must be in range [$min, $max]")
        }
    }
}
