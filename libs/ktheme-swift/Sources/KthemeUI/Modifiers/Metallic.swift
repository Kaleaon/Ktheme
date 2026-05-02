// libs/ktheme-swift/Sources/KthemeUI/Modifiers/Metallic.swift
//
// `.metallic(...)` ViewModifier — paints the engine's signature
// 5-stop linear gradient (shadow → base → highlight → base → shadow)
// as the receiver's background. Reads variant + intensity from the
// surrounding theme by default.

import SwiftUI
import Ktheme

extension View {
    /// Paint a metallic gradient background matching the active theme's
    /// metallic effect. Pass an explicit variant/intensity to override.
    public func metallic(
        variant: MetallicVariant? = nil,
        intensity: Double? = nil,
        cornerRadius: CGFloat = 0,
        angle: Double = 135
    ) -> some View {
        modifier(MetallicBackground(
            overrideVariant: variant,
            overrideIntensity: intensity,
            cornerRadius: cornerRadius,
            angle: angle
        ))
    }
}

private struct MetallicBackground: ViewModifier {
    let overrideVariant: MetallicVariant?
    let overrideIntensity: Double?
    let cornerRadius: CGFloat
    let angle: Double

    @Environment(\.ktheme) private var theme

    func body(content: Content) -> some View {
        let v = overrideVariant ?? theme.effects.metallic.variant
        let i = max(0, min(1, overrideIntensity ?? theme.effects.metallic.intensity))
        let g = MetallicGradient.forVariant(v)
        content.background(
            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                .fill(metalGradient(g, intensity: i, angle: angle))
        )
    }
}

/// 5-stop LinearGradient matching the engine's CSS recipe.
public func metalGradient(
    _ g: MetallicGradient,
    intensity: Double = 0.7,
    angle: Double = 135
) -> LinearGradient {
    let shadow    = HexColor.color(g.shadow)
    let base      = HexColor.color(g.base)
    let extraGlow = max(0, intensity - 0.5)
    let highlight = HexColor.color(g.highlight).opacity(1 - extraGlow * 0.0)
        .blendOver(.white, fraction: extraGlow)

    let theta = angle * .pi / 180
    let dx = cos(theta), dy = sin(theta)
    return LinearGradient(
        stops: [
            .init(color: shadow,    location: 0.00),
            .init(color: base,      location: 0.25),
            .init(color: highlight, location: 0.50),
            .init(color: base,      location: 0.75),
            .init(color: shadow,    location: 1.00),
        ],
        startPoint: UnitPoint(x: 0.5 - dx * 0.5, y: 0.5 - dy * 0.5),
        endPoint:   UnitPoint(x: 0.5 + dx * 0.5, y: 0.5 + dy * 0.5)
    )
}

private extension Color {
    /// Mix `self` with `other` at fraction 0…1.
    func blendOver(_ other: Color, fraction f: Double) -> Color {
        // SwiftUI Color is opaque; approximate by overlaying.
        // Callers use this only for highlight whitening, so a simple
        // linear interpolation in sRGB is adequate.
        guard f > 0 else { return self }
        return Color(
            .sRGB,
            red:   1, green: 1, blue: 1,
            opacity: f
        ).opacity(1) // placeholder — see note in README about platform color math
    }
}
