// libs/ktheme-swift/Sources/Ktheme/Parser/ThemeParser.swift
//
// Tolerant Theme JSON decode/encode. Lenient enough that older preset
// files (missing `adaptation`, missing `shimmer`) parse cleanly.

import Foundation

public enum ThemeParser {

    public static let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .useDefaultKeys
        return d
    }()

    public static let encoder: JSONEncoder = {
        let e = JSONEncoder()
        e.outputFormatting = [.prettyPrinted, .sortedKeys]
        e.keyEncodingStrategy = .useDefaultKeys
        return e
    }()

    public static func decode(_ json: String) throws -> Theme {
        try decoder.decode(Theme.self, from: Data(json.utf8))
    }
    public static func decode(_ data: Data) throws -> Theme {
        try decoder.decode(Theme.self, from: data)
    }
    public static func encode(_ theme: Theme) throws -> String {
        let data = try encoder.encode(theme)
        return String(data: data, encoding: .utf8) ?? "{}"
    }
}
