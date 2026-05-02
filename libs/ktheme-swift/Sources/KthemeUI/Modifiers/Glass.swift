// libs/ktheme-swift/Sources/KthemeUI/Modifiers/Glass.swift
//
// `.glass(...)` — translucent glassmorphism panel using SwiftUI's
// .ultraThinMaterial backdrop. Falls back to a solid translucent
// fill on platforms / states where Material isn't available.

import SwiftUI
import Ktheme

extension View {
    public func glass(
        tint: Color? = nil,
        opacity: Double = 0.55,
        cornerRadius: CGFloat = 18
    ) -> some View {
        modifier(GlassModifier(overrideTint: tint, opacity: opacity, cornerRadius: cornerRadius))
    }
}

private struct GlassModifier: ViewModifier {
    let overrideTint: Color?
    let opacity: Double
    let cornerRadius: CGFloat

    @Environment(\.ktheme) private var theme

    func body(content: Content) -> some View {
        let tint = overrideTint ?? HexColor.color(theme.colorScheme.surface)
        content
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(.ultraThinMaterial)
                    RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(tint.opacity(opacity))
                }
            )
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
    }
}
