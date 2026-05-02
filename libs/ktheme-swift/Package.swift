// libs/ktheme-swift/Package.swift
// swift-tools-version:5.9
//
// Two-product Swift package:
//   - Ktheme   — pure Swift model + parser + engine (no UI deps).
//   - KthemeUI — SwiftUI integration: Environment, ViewModifiers,
//                drop-in metallic Button / Card / iconic scaffolds.

import PackageDescription

let package = Package(
    name: "Ktheme",
    platforms: [.iOS(.v16), .macOS(.v13), .tvOS(.v16), .watchOS(.v9)],
    products: [
        .library(name: "Ktheme",   targets: ["Ktheme"]),
        .library(name: "KthemeUI", targets: ["KthemeUI"]),
    ],
    targets: [
        .target(
            name: "Ktheme",
            resources: [.copy("Resources/themes")]
        ),
        .target(
            name: "KthemeUI",
            dependencies: ["Ktheme"]
        ),
        .testTarget(name: "KthemeTests", dependencies: ["Ktheme"]),
    ]
)
