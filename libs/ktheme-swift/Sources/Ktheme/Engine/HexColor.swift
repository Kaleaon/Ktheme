// libs/ktheme-swift/Sources/Ktheme/Engine/HexColor.swift
//
// Hex-color utility shared by KthemeUI. Mirrors the Kotlin
// io.ktheme.engine.HexColor object.

import Foundation
#if canImport(SwiftUI)
import SwiftUI
#endif

public enum HexColor {

    public struct RGBA: Hashable, Sendable {
        public let r, g, b, a: Double  // 0–1
    }

    /// Parse `#RGB`, `#RRGGBB`, or `#AARRGGBB` to RGBA components (0–1).
    public static func parse(_ hex: String) -> RGBA {
        var s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.hasPrefix("#") { s.removeFirst() }
        // expand #RGB
        if s.count == 3 {
            s = s.map { "\($0)\($0)" }.joined()
        }
        var v: UInt64 = 0
        Scanner(string: s).scanHexInt64(&v)
        switch s.count {
        case 6:
            let r = Double((v >> 16) & 0xFF) / 255
            let g = Double((v >> 8)  & 0xFF) / 255
            let b = Double(v & 0xFF) / 255
            return RGBA(r: r, g: g, b: b, a: 1)
        case 8:
            let a = Double((v >> 24) & 0xFF) / 255
            let r = Double((v >> 16) & 0xFF) / 255
            let g = Double((v >> 8)  & 0xFF) / 255
            let b = Double(v & 0xFF) / 255
            return RGBA(r: r, g: g, b: b, a: a)
        default:
            return RGBA(r: 0, g: 0, b: 0, a: 1)
        }
    }

    /// WCAG 2.1 relative luminance.
    public static func luminance(_ hex: String) -> Double {
        let p = parse(hex)
        func chan(_ c: Double) -> Double {
            c <= 0.03928 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * chan(p.r) + 0.7152 * chan(p.g) + 0.0722 * chan(p.b)
    }

    /// WCAG contrast ratio between two hex colors.
    public static func contrast(_ a: String, _ b: String) -> Double {
        let la = luminance(a), lb = luminance(b)
        let lighter = max(la, lb), darker = min(la, lb)
        return (lighter + 0.05) / (darker + 0.05)
    }

    #if canImport(SwiftUI)
    /// Convenience: hex → SwiftUI Color.
    public static func color(_ hex: String) -> Color {
        let p = parse(hex)
        return Color(.sRGB, red: p.r, green: p.g, blue: p.b, opacity: p.a)
    }
    #endif
}
