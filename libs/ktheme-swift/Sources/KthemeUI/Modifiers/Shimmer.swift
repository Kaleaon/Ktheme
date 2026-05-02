// libs/ktheme-swift/Sources/KthemeUI/Modifiers/Shimmer.swift
//
// `.shimmer()` — animates a translucent highlight band across the
// receiver. Honors `reduceMotion` accessibility — disabled when the
// user has Reduce Motion on.

import SwiftUI
import Ktheme

extension View {
    public func shimmer(
        enabled: Bool = true,
        speed: Double? = nil,
        intensity: Double? = nil,
        angle: Double = 110
    ) -> some View {
        modifier(ShimmerOverlay(
            forcedEnabled: enabled, overrideSpeed: speed,
            overrideIntensity: intensity, angle: angle
        ))
    }
}

private struct ShimmerOverlay: ViewModifier {
    let forcedEnabled: Bool
    let overrideSpeed: Double?
    let overrideIntensity: Double?
    let angle: Double

    @Environment(\.ktheme) private var theme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase: CGFloat = -1

    func body(content: Content) -> some View {
        let s = theme.effects.shimmer
        let on = forcedEnabled && (s?.enabled ?? false) && !reduceMotion
        let cycle = overrideSpeed ?? s?.speed ?? 3
        let alpha = max(0, min(1, overrideIntensity ?? s?.intensity ?? 0.5))
        let shimmerColor = HexColor.color(theme.effects.metallic.gradient.shimmer)
            .opacity(alpha)

        let theta = angle * .pi / 180
        let dx = cos(theta), dy = sin(theta)

        content.overlay(
            GeometryReader { geo in
                let travel = (geo.size.width + geo.size.height) * 2
                LinearGradient(
                    stops: [
                        .init(color: .clear,        location: 0.0),
                        .init(color: .clear,        location: 0.4),
                        .init(color: shimmerColor,  location: 0.5),
                        .init(color: .clear,        location: 0.6),
                        .init(color: .clear,        location: 1.0),
                    ],
                    startPoint: UnitPoint(x: 0.5 - dx * 0.5, y: 0.5 - dy * 0.5),
                    endPoint:   UnitPoint(x: 0.5 + dx * 0.5, y: 0.5 + dy * 0.5)
                )
                .offset(x: phase * travel * dx, y: phase * travel * dy)
                .blendMode(.plusLighter)
                .allowsHitTesting(false)
                .onAppear {
                    guard on else { return }
                    withAnimation(
                        .linear(duration: cycle).repeatForever(autoreverses: false)
                    ) { phase = 1 }
                }
            }
        )
        .clipped()
    }
}
