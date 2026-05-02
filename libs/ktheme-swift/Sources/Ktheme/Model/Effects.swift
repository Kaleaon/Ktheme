// libs/ktheme-swift/Sources/Ktheme/Model/Effects.swift
//
// Effects block — visual personality of a Ktheme. Each sub-effect is
// independently `enabled` so a theme can opt into the metallic
// gradient without forcing shimmer, blur, or glow on consumers that
// don't want them.

import Foundation

public struct Effects: Codable, Hashable, Sendable {
    public var metallic: MetallicEffect = .init()
    public var shadows: ShadowEffect = .init()
    public var shimmer: ShimmerEffect?
    public var blur: BlurEffect?
    public var overlays: OverlayEffect?
    public var gradients: GradientEffect?
    public var glow: GlowEffect?
    public var noise: NoiseEffect?

    public init() {}
}

public struct MetallicEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = false
    public var variant: MetallicVariant = .silver
    public var gradient: MetallicGradient = .silver
    /// 0–1. Multiplied into highlight saturation and shimmer alpha.
    public var intensity: Double = 0
    public init() {}
}

public enum MetallicVariant: String, Codable, Hashable, Sendable {
    case GOLD, SILVER, GOLD_ROYAL_BLUE, BRONZE, COPPER, PLATINUM,
         ROSE_GOLD, TITANIUM, CHROME, COBALT
    public static let gold = MetallicVariant.GOLD
    public static let silver = MetallicVariant.SILVER
}

/// Four-stop palette feeding the engine's 5-stop linear gradient
/// (shadow → base → highlight → base → shadow).
public struct MetallicGradient: Codable, Hashable, Sendable {
    public let base: String
    public let highlight: String
    public let shadow: String
    public let shimmer: String

    public static let gold      = MetallicGradient(base: "#D4AF37", highlight: "#FFD700", shadow: "#B8860B", shimmer: "#FFF8DC")
    public static let silver    = MetallicGradient(base: "#C0C0C0", highlight: "#E8E8E8", shadow: "#808080", shimmer: "#FFFFFF")
    public static let roseGold  = MetallicGradient(base: "#B76E79", highlight: "#E5BE8A", shadow: "#7D4A52", shimmer: "#F5D5D8")
    public static let bronze    = MetallicGradient(base: "#CD7F32", highlight: "#D99952", shadow: "#6B4423", shimmer: "#F0D9C0")
    public static let copper    = MetallicGradient(base: "#B87333", highlight: "#D49A63", shadow: "#6D421E", shimmer: "#F2D8C2")
    public static let platinum  = MetallicGradient(base: "#E5E4E2", highlight: "#FFFFFF", shadow: "#9C9A98", shimmer: "#FFFFFF")
    public static let titanium  = MetallicGradient(base: "#878681", highlight: "#BDBBB8", shadow: "#4A4A48", shimmer: "#D0CFCC")
    public static let chrome    = MetallicGradient(base: "#DBE2E9", highlight: "#FFFFFF", shadow: "#4A5C6E", shimmer: "#FFFFFF")
    public static let cobalt    = MetallicGradient(base: "#3A6BD9", highlight: "#7FA5F0", shadow: "#1A3A8A", shimmer: "#D6E4FF")
    public static let goldRoyalBlue = MetallicGradient(base: "#D4AF37", highlight: "#FFD700", shadow: "#0A1630", shimmer: "#FFF8DC")

    public static func forVariant(_ v: MetallicVariant) -> MetallicGradient {
        switch v {
        case .GOLD: .gold; case .SILVER: .silver; case .ROSE_GOLD: .roseGold
        case .BRONZE: .bronze; case .COPPER: .copper; case .PLATINUM: .platinum
        case .TITANIUM: .titanium; case .CHROME: .chrome; case .COBALT: .cobalt
        case .GOLD_ROYAL_BLUE: .goldRoyalBlue
        }
    }
}

public struct ShadowEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = true
    public var elevation: Int = 2
    public var blur: Int = 4
    public var color: String = "#00000044"
    public init() {}
}

public struct ShimmerEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = true
    public var speed: Double = 3      // seconds per cycle
    public var intensity: Double = 0.5
    public var angle: Int = 135
}

public struct BlurEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = true
    public var radius: Int = 12
}

public struct OverlayEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = true
    public var color: String
    public var opacity: Double
    public var blendMode: String
}

public struct GradientEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = true
    public var angle: Int = 135
    public var stops: [GradientStop] = []
}
public struct GradientStop: Codable, Hashable, Sendable {
    public let offset: Double
    public let color: String
}

public struct GlowEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = false
    public var color: String = "#FFFFFF"
    public var intensity: Double = 0.5
}

public struct NoiseEffect: Codable, Hashable, Sendable {
    public var enabled: Bool = false
    public var opacity: Double = 0.04
    public var scale: Double = 1.0
}
