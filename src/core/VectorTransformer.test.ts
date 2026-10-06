import { VectorTransformer } from "./VectorTransformer";
import { IconToken, Theme } from "./types";

describe("VectorTransformer", () => {
  const sampleTheme: Theme = {
    metadata: {
      id: "vector-test-theme",
      name: "Vector Test Theme",
      description: "Theme for vector transformer testing",
      author: "Test",
      version: "1.0.0",
      tags: ["test"],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    darkMode: true,
    colorScheme: {
      primary: "#112233",
      onPrimary: "#FFFFFF",
      primaryContainer: "#223344",
      onPrimaryContainer: "#FFFFFF",
      secondary: "#445566",
      onSecondary: "#FFFFFF",
      secondaryContainer: "#556677",
      onSecondaryContainer: "#FFFFFF",
      tertiary: "#778899",
      onTertiary: "#FFFFFF",
      tertiaryContainer: "#8899AA",
      onTertiaryContainer: "#FFFFFF",
      error: "#FF0000",
      onError: "#FFFFFF",
      errorContainer: "#FFCCCC",
      onErrorContainer: "#000000",
      background: "#000000",
      onBackground: "#FFFFFF",
      surface: "#111111",
      onSurface: "#FFFFFF",
      surfaceVariant: "#222222",
      onSurfaceVariant: "#EEEEEE",
      outline: "#888888",
      outlineVariant: "#444444",
      scrim: "#000000",
      inverseSurface: "#FFFFFF",
      inverseOnSurface: "#000000",
      inversePrimary: "#112233",
    },
    adaptation: {
      icons: {
        family: "custom",
        style: "outlined",
        sizeScale: 1.5,
        strokeWidth: 2.0,
      },
    },
  };

  it("sanitizes SVG inputs to remove script tags, event handlers, and unsafe elements", () => {
    const dangerousSvg = `<svg viewBox="0 0 24 24"><script>alert('xss')</script><path d="M0 0h24v24H0z" onclick="doEvil()" /><image href="http://malicious.site/pic.png"/><foreignObject>eval()</foreignObject></svg>`;
    const sanitized = VectorTransformer.sanitizeSvg(dangerousSvg);

    expect(sanitized).not.toContain("<script");
    expect(sanitized).not.toContain("onclick");
    expect(sanitized).not.toContain("<image");
    expect(sanitized).not.toContain("<foreignObject");
  });

  it("transforms IconToken into normalized VectorIRNode with color bindings and stroke scaling", () => {
    const iconToken: IconToken = {
      id: "settings",
      name: "Settings",
      viewBox: "0 0 24 24",
      paths: [
        {
          d: "M12 15a3 3 0 100-6 3 3 0 000 6z",
          fill: "primary",
          stroke: "onPrimary",
          strokeWidth: 1.0,
        },
      ],
      colorBindings: {
        primary: "primary",
        onPrimary: "onPrimary",
      },
    };

    const ir = VectorTransformer.transformIcon(iconToken, sampleTheme);

    expect(ir.id).toBe("settings");
    expect(ir.name).toBe("Settings");
    expect(ir.width).toBe(36); // 24 * 1.5 sizeScale
    expect(ir.height).toBe(36);
    expect(ir.paths).toHaveLength(1);
    expect(ir.paths[0].fill).toBe("#112233");
    expect(ir.paths[0].stroke).toBe("#FFFFFF");
    expect(ir.paths[0].strokeWidth).toBe(2.0); // adapted strokeWidth
  });

  it("parses raw SVG string when paths array is empty", () => {
    const iconToken: IconToken = {
      id: "add",
      name: "Add",
      paths: [],
      svg: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="primary" /></svg>`,
      colorBindings: {
        primary: "primary",
      },
    };

    const ir = VectorTransformer.transformIcon(iconToken, sampleTheme);

    expect(ir.paths).toHaveLength(1);
    expect(ir.paths[0].d).toBe("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
    expect(ir.paths[0].fill).toBe("#112233");
  });

  beforeEach(() => {
    VectorTransformer.clearCache();
  });

  it("memoizes SVG parsing results and returns shallow cloned arrays", () => {
    const svg = `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" fill="#FF0000" /></svg>`;

    const res1 = VectorTransformer.parseSvgPaths(svg);
    const res2 = VectorTransformer.parseSvgPaths(svg);

    // Deep equality of contents
    expect(res1).toEqual(res2);
    // Array reference should be distinct due to cloning
    expect(res1).not.toBe(res2);
    // Object elements inside array should also be cloned
    expect(res1[0]).not.toBe(res2[0]);
  });

  it("prevents array and path object mutation side effects on cached results", () => {
    const svg = `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" fill="#FF0000" /></svg>`;

    const res1 = VectorTransformer.parseSvgPaths(svg);
    res1[0].d = "M0 0h10v10H0z";
    res1.push({ d: "M5 5h5v5H5z" });

    const res2 = VectorTransformer.parseSvgPaths(svg);
    expect(res2).toHaveLength(1);
    expect(res2[0].d).toBe("M12 2L2 22h20L12 2z");
  });

  it("flushes cache when clearCache is called", () => {
    const svg = `<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" fill="#FF0000" /></svg>`;
    const sanitizeSpy = jest.spyOn(VectorTransformer, "sanitizeSvg");

    VectorTransformer.parseSvgPaths(svg);
    expect(sanitizeSpy).toHaveBeenCalledTimes(1);

    VectorTransformer.parseSvgPaths(svg);
    expect(sanitizeSpy).toHaveBeenCalledTimes(1); // Cache hit, sanitizeSvg not called again

    VectorTransformer.clearCache();

    VectorTransformer.parseSvgPaths(svg);
    expect(sanitizeSpy).toHaveBeenCalledTimes(2); // Re-parsed after cache clear

    sanitizeSpy.mockRestore();
  });

  it("evicts least recently used entry when capacity of 500 is exceeded", () => {
    const sanitizeSpy = jest.spyOn(VectorTransformer, "sanitizeSvg");

    // Fill cache to capacity (500 entries)
    for (let i = 0; i < 500; i++) {
      VectorTransformer.parseSvgPaths(`<svg viewBox="0 0 24 24"><path d="M${i} 0h1v1H${i}z" /></svg>`);
    }
    expect(sanitizeSpy).toHaveBeenCalledTimes(500);

    // Re-access item 0 so item 1 becomes the LRU item
    VectorTransformer.parseSvgPaths(`<svg viewBox="0 0 24 24"><path d="M0 0h1v1H0z" /></svg>`);
    expect(sanitizeSpy).toHaveBeenCalledTimes(500); // hit

    // Insert 501st entry (forces eviction of LRU entry, item 1)
    VectorTransformer.parseSvgPaths(`<svg viewBox="0 0 24 24"><path d="M999 0h1v1H999z" /></svg>`);
    expect(sanitizeSpy).toHaveBeenCalledTimes(501);

    // Item 0 should still be cached (hit)
    VectorTransformer.parseSvgPaths(`<svg viewBox="0 0 24 24"><path d="M0 0h1v1H0z" /></svg>`);
    expect(sanitizeSpy).toHaveBeenCalledTimes(501);

    // Item 1 was evicted, so accessing it should trigger a re-parse (miss)
    VectorTransformer.parseSvgPaths(`<svg viewBox="0 0 24 24"><path d="M1 0h1v1H1z" /></svg>`);
    expect(sanitizeSpy).toHaveBeenCalledTimes(502);

    sanitizeSpy.mockRestore();
  });
});
