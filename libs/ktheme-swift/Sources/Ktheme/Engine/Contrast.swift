// libs/ktheme-swift/Sources/Ktheme/Engine/Contrast.swift
//
// Contrast audit — flags MD3 on/container pairs that fail WCAG AA.

import Foundation

public enum Contrast {

    public struct Pair: Hashable, Sendable {
        public let role: String
        public let foreground: String
        public let background: String
        public let ratio: Double
        public let passesAA: Bool
        public let passesAALarge: Bool
        public let passesAAA: Bool
    }

    public static func audit(_ theme: Theme) -> [Pair] {
        let cs = theme.colorScheme
        return [
            check("primary",            cs.onPrimary,            cs.primary),
            check("primaryContainer",   cs.onPrimaryContainer,   cs.primaryContainer),
            check("secondary",          cs.onSecondary,          cs.secondary),
            check("secondaryContainer", cs.onSecondaryContainer, cs.secondaryContainer),
            check("tertiary",           cs.onTertiary,           cs.tertiary),
            check("tertiaryContainer",  cs.onTertiaryContainer,  cs.tertiaryContainer),
            check("error",              cs.onError,              cs.error),
            check("errorContainer",     cs.onErrorContainer,     cs.errorContainer),
            check("background",         cs.onBackground,         cs.background),
            check("surface",            cs.onSurface,            cs.surface),
            check("surfaceVariant",     cs.onSurfaceVariant,     cs.surfaceVariant),
        ]
    }

    public static func warnings(_ theme: Theme) -> [Pair] {
        audit(theme).filter { !$0.passesAA }
    }

    private static func check(_ role: String, _ fg: String, _ bg: String) -> Pair {
        let r = HexColor.contrast(fg, bg)
        return Pair(role: role, foreground: fg, background: bg, ratio: r,
                    passesAA: r >= 4.5, passesAALarge: r >= 3.0, passesAAA: r >= 7.0)
    }
}
