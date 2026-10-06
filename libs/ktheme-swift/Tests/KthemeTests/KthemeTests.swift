import XCTest
@testable import Ktheme

final class KthemeTests: XCTestCase {
    @MainActor
    func testEngineInitializationAndActiveThemeSwitching() async throws {
        let engine = ThemeEngine.makeDefault(activeId: "navy-gold")
        XCTAssertEqual(engine.activeId, "navy-gold")
        XCTAssertEqual(engine.active.metadata.id, "navy-gold")

        engine.setActive("charcoal-champagne")
        XCTAssertEqual(engine.activeId, "charcoal-champagne")
        XCTAssertEqual(engine.active.metadata.id, "charcoal-champagne")
    }

    func testPresetsLoading() throws {
        let presets = Presets.all()
        XCTAssertFalse(presets.isEmpty)
        let navyGold = Presets.load("navy-gold")
        XCTAssertEqual(navyGold.metadata.name, "Navy Gold")
    }

    func testHexColorParsingAndLuminance() throws {
        let white = HexColor.parse("#FFFFFF")
        XCTAssertEqual(white.r, 1.0, accuracy: 0.01)
        XCTAssertEqual(white.g, 1.0, accuracy: 0.01)
        XCTAssertEqual(white.b, 1.0, accuracy: 0.01)

        let blackLuminance = HexColor.luminance("#000000")
        let whiteLuminance = HexColor.luminance("#FFFFFF")
        XCTAssertEqual(blackLuminance, 0.0, accuracy: 0.001)
        XCTAssertEqual(whiteLuminance, 1.0, accuracy: 0.001)
    }

    func testContrastCalculation() throws {
        let contrastRatio = HexColor.contrast("#FFFFFF", "#000000")
        XCTAssertEqual(contrastRatio, 21.0, accuracy: 0.1)
    }
}
