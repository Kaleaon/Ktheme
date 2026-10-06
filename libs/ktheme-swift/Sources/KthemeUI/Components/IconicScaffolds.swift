// libs/ktheme-swift/Sources/KthemeUI/Components/IconicScaffolds.swift
//
// LCARS / Metro / Aero scaffolds — same idea as the Compose siblings.
// Bake in the iconic-rule geometry so apps can opt into the look
// without re-deriving it.

#if canImport(SwiftUI)
import SwiftUI
import Ktheme

/// LCARS scaffold. Pill rails on the left, content slot on the right.
/// Format rule: keep rail/sweep geometry and centered rail labels.
public struct LcarsScaffold<Content: View>: View {
    public let railLabels: [String]
    public let content: () -> Content

    @Environment(\.ktheme) private var theme

    public init(railLabels: [String], @ViewBuilder content: @escaping () -> Content) {
        self.railLabels = railLabels; self.content = content
    }

    public var body: some View {
        let primary = HexColor.color(theme.colorScheme.primary)
        let tertiary = HexColor.color(theme.colorScheme.tertiary)
        let bg = HexColor.color(theme.colorScheme.background)

        HStack(spacing: 8) {
            VStack(spacing: 6) {
                ForEach(Array(railLabels.enumerated()), id: \.offset) { idx, label in
                    HStack {
                        Spacer()
                        Text(label.uppercased())
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(.black)
                            .padding(.trailing, 12)
                    }
                    .frame(height: idx == 0 ? 92 : 38)
                    .frame(maxWidth: .infinity)
                    .background(idx % 2 == 0 ? primary : tertiary)
                    .clipShape(LeftRoundedRectangle(radius: 24))
                }
            }
            .frame(width: 160)

            content()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .background(bg)
    }
}

private struct LeftRoundedRectangle: Shape {
    let radius: CGFloat
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let r = min(radius, min(rect.width, rect.height) / 2)
        path.move(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.minX + r, y: rect.minY))
        path.addArc(center: CGPoint(x: rect.minX + r, y: rect.minY + r),
                    radius: r, startAngle: .degrees(-90), endAngle: .degrees(180), clockwise: false)
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY - r))
        path.addArc(center: CGPoint(x: rect.minX + r, y: rect.maxY - r),
                    radius: r, startAngle: .degrees(180), endAngle: .degrees(90), clockwise: false)
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// Metro tile grid. Sharp corners, uppercase labels, no shadow.
public struct MetroTileGrid: View {
    public let tiles: [(label: String, color: Color)]
    public let columns: Int

    public init(tiles: [(label: String, color: Color)], columns: Int = 3) {
        self.tiles = tiles; self.columns = columns
    }

    public var body: some View {
        let cols = Array(repeating: GridItem(.flexible(), spacing: 14), count: columns)
        LazyVGrid(columns: cols, spacing: 14) {
            ForEach(Array(tiles.enumerated()), id: \.offset) { _, tile in
                ZStack(alignment: .bottomLeading) {
                    Rectangle().fill(tile.color)
                    Text(tile.label.uppercased())
                        .font(.system(size: 17, weight: .light))
                        .foregroundStyle(.white)
                        .padding(10)
                }
                .frame(height: 92)
            }
        }
        .padding(14)
    }
}

/// Frutiger Aero glass panel.
public struct AeroGlassPanel<Content: View>: View {
    public let content: () -> Content
    public init(@ViewBuilder content: @escaping () -> Content) { self.content = content }
    public var body: some View {
        content().padding(20).glass(opacity: 0.45)
    }
}
#endif
