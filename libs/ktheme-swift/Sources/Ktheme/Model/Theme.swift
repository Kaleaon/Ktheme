// libs/ktheme-swift/Sources/Ktheme/Model/Theme.swift
//
// Top-level Theme type — Codable, mirrors `themes/examples/*.json` 1:1.
// Field names match the JSON exactly so default Codable just works.

import Foundation

public struct Theme: Codable, Hashable, Sendable {
    public let metadata: ThemeMetadata
    public let darkMode: Bool
    public let colorScheme: ColorScheme
    public let effects: Effects
    public let typography: Typography?
    public let adaptation: Adaptation?

    public init(
        metadata: ThemeMetadata,
        darkMode: Bool = true,
        colorScheme: ColorScheme,
        effects: Effects = Effects(),
        typography: Typography? = nil,
        adaptation: Adaptation? = nil
    ) {
        self.metadata = metadata
        self.darkMode = darkMode
        self.colorScheme = colorScheme
        self.effects = effects
        self.typography = typography
        self.adaptation = adaptation
    }
}

public struct ThemeMetadata: Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let description: String
    public let author: String
    public let version: String
    public let tags: [String]
    public let createdAt: String?
    public let updatedAt: String?

    public init(id: String, name: String, description: String = "",
                author: String = "Ktheme", version: String = "1.0.0",
                tags: [String] = [], createdAt: String? = nil, updatedAt: String? = nil) {
        self.id = id; self.name = name; self.description = description
        self.author = author; self.version = version; self.tags = tags
        self.createdAt = createdAt; self.updatedAt = updatedAt
    }
}

/// Material Design 3 color roles. Hex strings (#RRGGBB or #AARRGGBB).
public struct ColorScheme: Codable, Hashable, Sendable {
    public let primary, onPrimary, primaryContainer, onPrimaryContainer: String
    public let secondary, onSecondary, secondaryContainer, onSecondaryContainer: String
    public let tertiary, onTertiary, tertiaryContainer, onTertiaryContainer: String
    public let error, onError, errorContainer, onErrorContainer: String
    public let background, onBackground: String
    public let surface, onSurface, surfaceVariant, onSurfaceVariant: String
    public let outline, outlineVariant: String
    public let scrim: String
    public let inverseSurface, inverseOnSurface, inversePrimary: String
    public let stateLayers: StateLayers?
    public let semanticRoles: SemanticRoles?
}

public struct StateLayers: Codable, Hashable, Sendable {
    public let hover, pressed, focused, dragged: String
}

public struct SemanticRoles: Codable, Hashable, Sendable {
    public let success, warning, info, critical: String
}

public struct Typography: Codable, Hashable, Sendable {
    public let fontFamily: String
    public let fontSize: FontSize
    public let fontWeight: FontWeight
    public let lineHeight: Double
    public let letterSpacing: Double
}
public struct FontSize: Codable, Hashable, Sendable {
    public let small, medium, large, xlarge: Int
}
public struct FontWeight: Codable, Hashable, Sendable {
    public let light, regular, medium, bold: Int
}

public struct Adaptation: Codable, Hashable, Sendable {
    public let layout: LayoutAdaptation?
    public let icons: IconAdaptation?
    public let componentOverrides: [ComponentOverride]?
}

public struct LayoutAdaptation: Codable, Hashable, Sendable {
    public let density: Density
    public let cornerStyle: CornerStyle
    public let spacingScale: Double
    public let panelStyle: PanelStyle
    public let navigationStyle: NavigationStyle
}

public enum Density: String, Codable, Hashable, Sendable {
    case compact, comfortable, spacious
    public var scale: Double {
        switch self { case .compact: 0.92; case .comfortable: 1.0; case .spacious: 1.25 }
    }
}

public enum CornerStyle: String, Codable, Hashable, Sendable {
    case sharp, rounded, pill
    public var radius: CGFloat {
        switch self { case .sharp: 0; case .rounded: 12; case .pill: 24 }
    }
}

public enum PanelStyle: String, Codable, Hashable, Sendable {
    case flat, glass, elevated
}

public enum NavigationStyle: String, Codable, Hashable, Sendable {
    case tabs, rail, drawer, pivot, bottom
}

public struct IconAdaptation: Codable, Hashable, Sendable {
    public let family: IconFamily
    public let style: IconStyle
    public let sizeScale: Double
    public let strokeWidth: Double
    public let cornerStyle: CornerStyle
}
public enum IconFamily: String, Codable, Hashable, Sendable {
    case material, fluent, sf, line, duotone, custom
}
public enum IconStyle: String, Codable, Hashable, Sendable {
    case line, filled, duotone
}

/// Component-level CSS-style override targeted at a selector. Carried
/// across as raw values (string or number); SwiftUI consumers map the
/// subset they care about (border-radius, padding, text-transform).
public struct ComponentOverride: Codable, Hashable, Sendable {
    public let selector: String
    public let styles: [String: StyleValue]
}

/// Either a string ("uppercase") or a number (16) inside a styles map.
public enum StyleValue: Codable, Hashable, Sendable {
    case string(String)
    case number(Double)

    public init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if let s = try? c.decode(String.self) { self = .string(s); return }
        if let d = try? c.decode(Double.self) { self = .number(d); return }
        throw DecodingError.dataCorruptedError(in: c,
            debugDescription: "Expected string or number for StyleValue")
    }
    public func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        switch self {
        case .string(let s): try c.encode(s)
        case .number(let d): try c.encode(d)
        }
    }
    public var stringValue: String? { if case .string(let s) = self { s } else { nil } }
    public var numberValue: Double? { if case .number(let d) = self { d } else { nil } }
}
