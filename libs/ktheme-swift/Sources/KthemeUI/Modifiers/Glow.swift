// libs/ktheme-swift/Sources/KthemeUI/Modifiers/Glow.swift
//
// Outer glow ring approximated with three stacked shadows at
// increasing radii — matching the engine's CSS technique
// (0 0 10·I 5·I color + 0 0 15·I color inset).

import SwiftUI
import Ktheme

extension View {
    public func glow(
        color: Color? = nil,
        intensity: Double = 0.6,
        radius: CGFloat = 12
    ) -> some View {
        modifier(GlowModifier(overrideColor: color, intensity: intensity, radius: radius))
    }
}

private struct GlowModifier: ViewModifier {
    let overrideColor: Color?
    let intensity: Double
    let radius: CGFloat

    @Environment(\.ktheme) private var theme

    func body(content: Content) -> some View {
        let c = overrideColor
            ?? theme.effects.glow.map { HexColor.color($0.color) }
            ?? HexColor.color(theme.colorScheme.primary)
        let i = max(0, min(1, theme.effects.glow?.intensity ?? intensity))
        let base = radius * (0.5 + CGFloat(i))
        return content
            .shadow(color: c.opacity(i), radius: base * 0.5)
            .shadow(color: c.opacity(i * 0.6), radius: base)
            .shadow(color: c.opacity(i * 0.3), radius: base * 1.6)
    }
}
