import {
  EMERALD_SILVER_COLOR_SCHEME,
  EMERALD_SILVER_METADATA,
  NAVY_GOLD_COLOR_SCHEME,
  NAVY_GOLD_METADATA,
  OBSIDIAN_CRIMSON_COLOR_SCHEME,
  OBSIDIAN_CRIMSON_METADATA,
  PAPER_INK_COLOR_SCHEME,
  PAPER_INK_METADATA,
  ROSE_GOLD_COLOR_SCHEME,
  ROSE_GOLD_METADATA,
  SHARED_PRESETS_DATA,
  SLATE_CYAN_COLOR_SCHEME,
  SLATE_CYAN_METADATA,
} from "./shared-presets-data";

describe("shared-presets-data module", () => {
  it("exports canonical metadata for all six shared themes", () => {
    expect(NAVY_GOLD_METADATA.id).toBe("navy-gold");
    expect(ROSE_GOLD_METADATA.id).toBe("rose-gold");
    expect(EMERALD_SILVER_METADATA.id).toBe("emerald-silver");
    expect(OBSIDIAN_CRIMSON_METADATA.id).toBe("obsidian-crimson");
    expect(PAPER_INK_METADATA.id).toBe("paper-ink");
    expect(SLATE_CYAN_METADATA.id).toBe("slate-cyan");
  });

  it("exports canonical color schemes for all six shared themes", () => {
    const schemes = [
      NAVY_GOLD_COLOR_SCHEME,
      ROSE_GOLD_COLOR_SCHEME,
      EMERALD_SILVER_COLOR_SCHEME,
      OBSIDIAN_CRIMSON_COLOR_SCHEME,
      PAPER_INK_COLOR_SCHEME,
      SLATE_CYAN_COLOR_SCHEME,
    ];

    for (const scheme of schemes) {
      expect(scheme).toHaveProperty("primary");
      expect(scheme).toHaveProperty("onPrimary");
      expect(scheme).toHaveProperty("background");
      expect(scheme).toHaveProperty("onBackground");
      expect(scheme).toHaveProperty("surface");
      expect(scheme).toHaveProperty("onSurface");
      expect(scheme).toHaveProperty("outline");
      expect(scheme).toHaveProperty("scrim");
    }
  });

  it("contains serializable preset data objects in SHARED_PRESETS_DATA", () => {
    expect(SHARED_PRESETS_DATA).toHaveLength(6);
    const ids = SHARED_PRESETS_DATA.map((theme) => theme.metadata.id);
    expect(ids).toEqual([
      "navy-gold",
      "rose-gold",
      "emerald-silver",
      "obsidian-crimson",
      "paper-ink",
      "slate-cyan",
    ]);

    // Ensure serializability
    const serialized = JSON.stringify(SHARED_PRESETS_DATA);
    expect(JSON.parse(serialized)).toEqual(SHARED_PRESETS_DATA);
  });
});
