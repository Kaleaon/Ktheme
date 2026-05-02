// libs/ktheme-swift/Sources/Ktheme/Engine/ThemeEngine.swift
//
// Active-theme registry. Observable via @Published so SwiftUI views
// can repaint when the active theme changes. Mirrors Kotlin's
// io.ktheme.engine.ThemeEngine.

import Foundation
import Combine

@MainActor
public final class ThemeEngine: ObservableObject {

    @Published public private(set) var registry: [String: Theme] = [:]
    @Published public private(set) var activeId: String
    @Published public private(set) var active: Theme

    public init(themes: [Theme], activeId: String) {
        var map: [String: Theme] = [:]
        for t in themes { map[t.metadata.id] = t }
        guard let t = map[activeId] else {
            preconditionFailure("Active id '\(activeId)' not in registry")
        }
        self.registry = map
        self.activeId = activeId
        self.active = t
    }

    /// Default engine seeded with the 24 built-in presets (loaded
    /// from `Sources/Ktheme/Resources/themes/*.json`). Active theme
    /// defaults to "navy-gold" — the marquee metallic.
    public static func makeDefault(activeId: String = "navy-gold") -> ThemeEngine {
        ThemeEngine(themes: Presets.all(), activeId: activeId)
    }

    public func register(_ theme: Theme) {
        registry[theme.metadata.id] = theme
        if theme.metadata.id == activeId { active = theme }
    }

    public func registerAll(_ themes: [Theme]) {
        for t in themes { registry[t.metadata.id] = t }
        if let t = registry[activeId] { active = t }
    }

    public func setActive(_ id: String) {
        guard let t = registry[id] else {
            preconditionFailure("Theme '\(id)' is not registered. Known: \(registry.keys.sorted())")
        }
        activeId = id
        active = t
    }

    public func get(_ id: String) -> Theme? { registry[id] }
    public var all: [Theme] { Array(registry.values) }
}
