package com.ktheme.utils

import com.ktheme.models.Theme

/**
 * Policies for handling theme ID collisions.
 */
enum class ThemeIdCollisionPolicy {
    OVERWRITE,
    REJECT,
    SUFFIX
}

/**
 * Utility helpers for normalizing and validating theme IDs.
 */
object ThemeIdUtils {
    private val invalidCharsRegex = Regex("[^a-z0-9]+")
    private val multiDashRegex = Regex("-{2,}")

    /**
     * Normalize ID into lowercase kebab-case and strip invalid characters.
     */
    fun normalize(id: String): String {
        val normalized = id
            .lowercase()
            .replace(invalidCharsRegex, "-")
            .replace(multiDashRegex, "-")
            .trim('-')

        require(normalized.isNotEmpty()) {
            "Theme ID must contain at least one alphanumeric character after normalization"
        }

        return normalized
    }

    /**
     * Return a theme copy with a normalized metadata ID.
     */
    fun withNormalizedId(theme: Theme): Theme {
        val normalizedId = normalize(theme.metadata.id)
        return if (normalizedId == theme.metadata.id) {
            theme
        } else {
            theme.copy(metadata = theme.metadata.copy(id = normalizedId))
        }
    }

    /**
     * Resolve ID collisions according to policy.
     */
    fun resolveCollision(
        normalizedId: String,
        existingIds: Set<String>,
        policy: ThemeIdCollisionPolicy
    ): String {
        if (normalizedId !in existingIds || policy == ThemeIdCollisionPolicy.OVERWRITE) {
            return normalizedId
        }

        return when (policy) {
            ThemeIdCollisionPolicy.REJECT -> {
                throw IllegalArgumentException("Theme ID collision for '$normalizedId'")
            }

            ThemeIdCollisionPolicy.SUFFIX -> {
                var suffix = 2
                var candidate = "$normalizedId-$suffix"
                while (candidate in existingIds) {
                    suffix++
                    candidate = "$normalizedId-$suffix"
                }
                candidate
            }

            ThemeIdCollisionPolicy.OVERWRITE -> normalizedId
        }
    }
}
