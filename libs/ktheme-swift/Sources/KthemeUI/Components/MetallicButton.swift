// libs/ktheme-swift/Sources/KthemeUI/Components/MetallicButton.swift
//
// Drop-in metallic button for SwiftUI. Wraps a Button with the
// metallic gradient + shimmer modifiers pre-wired, plus a tappable
// hit area meeting Apple's 44pt minimum.

import SwiftUI
import Ktheme

public struct MetallicButton: View {
    public let title: String
    public let variant: MetallicVariant?
    public let intensity: Double?
    public let shimmerEnabled: Bool
    public let action: () -> Void

    @Environment(\.ktheme) private var theme

    public init(
        _ title: String,
        variant: MetallicVariant? = nil,
        intensity: Double? = nil,
        shimmerEnabled: Bool = true,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.intensity = intensity
        self.shimmerEnabled = shimmerEnabled
        self.action = action
    }

    public var body: some View {
        let r = theme.adaptation?.layout.cornerStyle.radius ?? 12
        Button(action: action) {
            Text(title)
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(HexColor.color(theme.colorScheme.onPrimary))
                .frame(minHeight: 44)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.plain)
        .metallic(variant: variant, intensity: intensity, cornerRadius: r)
        .shimmer(enabled: shimmerEnabled)
        .clipShape(RoundedRectangle(cornerRadius: r, style: .continuous))
    }
}
