// libs/ktheme-core/src/main/kotlin/io/ktheme/engine/HexColor.kt
//
// Tiny hex-color utility shared by every platform integration. Themes
// store colors as `#RRGGBB` or `#AARRGGBB` strings; consumers need
// 0xAARRGGBB ints (Compose) or RGBA components (SwiftUI). Keeping this
// in core means there's exactly one parser to test.

package io.ktheme.engine

public object HexColor {

    /**
     * Parse `#RGB`, `#RRGGBB`, or `#AARRGGBB` to a 0xAARRGGBB Long.
     * Missing alpha defaults to 0xFF (fully opaque).
     */
    public fun parseArgb(hex: String): Long {
        val s = hex.trim().removePrefix("#")
        return when (s.length) {
            3 -> {
                // #RGB -> #RRGGBB
                val r = s[0].toString().repeat(2)
                val g = s[1].toString().repeat(2)
                val b = s[2].toString().repeat(2)
                0xFF000000L or ("$r$g$b".toLong(16))
            }
            6 -> 0xFF000000L or s.toLong(16)
            8 -> s.toLong(16)
            else -> error("Unsupported hex color: '$hex' (expected #RGB / #RRGGBB / #AARRGGBB)")
        }
    }

    public data class Rgba(val r: Int, val g: Int, val b: Int, val a: Int) {
        public val rFloat: Float get() = r / 255f
        public val gFloat: Float get() = g / 255f
        public val bFloat: Float get() = b / 255f
        public val aFloat: Float get() = a / 255f
    }

    public fun parseRgba(hex: String): Rgba {
        val argb = parseArgb(hex)
        return Rgba(
            r = ((argb shr 16) and 0xFF).toInt(),
            g = ((argb shr 8) and 0xFF).toInt(),
            b = (argb and 0xFF).toInt(),
            a = ((argb shr 24) and 0xFF).toInt(),
        )
    }

    /** Relative luminance per WCAG 2.1, used for contrast checks. */
    public fun luminance(hex: String): Double {
        val (r, g, b) = parseRgba(hex).let { Triple(it.rFloat, it.gFloat, it.bFloat) }
        fun chan(c: Float): Double {
            val cd = c.toDouble()
            return if (cd <= 0.03928) cd / 12.92 else Math.pow((cd + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
    }

    /** WCAG contrast ratio between two hex colors. */
    public fun contrast(a: String, b: String): Double {
        val la = luminance(a)
        val lb = luminance(b)
        val lighter = maxOf(la, lb)
        val darker = minOf(la, lb)
        return (lighter + 0.05) / (darker + 0.05)
    }
}
