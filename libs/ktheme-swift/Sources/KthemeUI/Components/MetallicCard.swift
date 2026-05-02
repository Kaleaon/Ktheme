// libs/ktheme-swift/Sources/KthemeUI/Components/MetallicCard.swift
//
// Card with a metallic gradient hairline border + theme-aware
// elevation. Body remains a normal surface so contrast against the
// metal frame is preserved.

import SwiftUI
import Ktheme

public struct MetallicCard<Content: View>: View {
    public let variant: MetallicVariant?
    public let intensity: Double?
    public let content: () -> Content

    @Environment(\.ktheme) private var theme

    public init(
        variant: MetallicVariant? = nil,
        intensity: Double? = nil,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.variant = variant
        self.intensity = intensity
        self.content = content
    }

    public var body: some View {
        let r = theme.adaptation?.layout.cornerStyle.radius ?? 12
        let v = variant ?? theme.effects.metallic.variant
        let i = max(0, min(1, intensity ?? theme.effects.metallic.intensity))
        let g = MetallicGradient.forVariant(v)
        let surface = HexColor.color(theme.colorScheme.surface)

        content()
            .padding(16)
            .background(surface)
            .clipShape(RoundedRectangle(cornerRadius: r, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: r, style: .continuous)
                    .strokeBorder(metalGradient(g, intensity: i), lineWidth: 1.5)
            )
            .shadow(color: HexColor.color(theme.effects.shadows.color),
                    radius: CGFloat(theme.effects.shadows.blur))
    }
}
