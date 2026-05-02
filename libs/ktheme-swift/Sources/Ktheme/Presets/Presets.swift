// libs/ktheme-swift/Sources/Ktheme/Presets/Presets.swift
//
// Preset registry. The 24 canonical theme JSON files are bundled as
// resources in `Sources/Ktheme/Resources/themes/`. SwiftPM copies them
// into the module bundle.

import Foundation

public enum Presets {

    /// All 24 preset ids in the README's order.
    public static let allIds: [String] = [
        "navy-gold", "rose-gold", "burgundy-rose-gold", "emerald-silver",
        "midnight-amber", "deep-purple-platinum", "obsidian-crimson",
        "charcoal-champagne", "royal-silver", "royal-bronze",
        "slate-gunmetal", "slate-cyan", "forest-copper",
        "lcars", "windows-phone-metro", "frutiger-aero", "art-deco",
        "art-nouveau", "paper-ink",
        "solarpunk-civic", "calm-clinical", "neo-noir-neon",
        "aurora-glass-night", "ink-terminal-modern",
    ]

    private static var cache: [String: Theme] = [:]

    /// Load a single preset by id.
    public static func load(_ id: String) -> Theme {
        if let cached = cache[id] { return cached }
        guard let url = Bundle.module.url(
            forResource: id, withExtension: "json", subdirectory: "themes"
        ) else { preconditionFailure("Preset '\(id)' not bundled.") }
        do {
            let data = try Data(contentsOf: url)
            let theme = try ThemeParser.decode(data)
            cache[id] = theme
            return theme
        } catch {
            preconditionFailure("Failed to load preset '\(id)': \(error)")
        }
    }

    public static func all() -> [Theme] { allIds.map(load) }

    public static func byTag(_ tags: String...) -> [Theme] {
        let want = Set(tags)
        return all().filter { theme in !want.isDisjoint(with: Set(theme.metadata.tags)) }
    }
}
