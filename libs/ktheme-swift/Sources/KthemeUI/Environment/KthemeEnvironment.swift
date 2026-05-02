// libs/ktheme-swift/Sources/KthemeUI/Environment/KthemeEnvironment.swift
//
// SwiftUI Environment plumbing. `KthemeProvider` puts the active
// `Theme` in the environment so any view can read `@Environment(\.ktheme)`
// without taking a dependency on `ThemeEngine`.

import SwiftUI
import Ktheme

private struct KthemeKey: EnvironmentKey {
    static let defaultValue: Theme = Presets.load("navy-gold")
}

extension EnvironmentValues {
    public var ktheme: Theme {
        get { self[KthemeKey.self] }
        set { self[KthemeKey.self] = newValue }
    }
}

/// Top-level provider. Wrap your app's root view in this — every
/// child view gets `@Environment(\.ktheme)` and matching `accentColor`.
///
///     @main struct MyApp: App {
///         @StateObject var engine = ThemeEngine.makeDefault()
///         var body: some Scene {
///             WindowGroup {
///                 KthemeProvider(theme: engine.active) {
///                     ContentView()
///                 }
///             }
///         }
///     }
public struct KthemeProvider<Content: View>: View {
    public let theme: Theme
    public let content: () -> Content

    public init(theme: Theme, @ViewBuilder content: @escaping () -> Content) {
        self.theme = theme; self.content = content
    }

    public var body: some View {
        let cs = theme.colorScheme
        content()
            .environment(\.ktheme, theme)
            .environment(\.colorScheme, theme.darkMode ? .dark : .light)
            .accentColor(HexColor.color(cs.primary))
            .tint(HexColor.color(cs.primary))
            .background(HexColor.color(cs.background).ignoresSafeArea())
            .foregroundStyle(HexColor.color(cs.onBackground))
    }
}
