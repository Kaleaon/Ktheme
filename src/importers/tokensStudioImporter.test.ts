import {
  TokensStudioImporter,
  parseTokensStudio,
  tokensStudioToKTheme,
} from "./tokensStudioImporter";

describe("TokensStudioImporter", () => {
  it("resolves multi-hop token references correctly", () => {
    const input = {
      colors: {
        brand: {
          500: { $value: "#6750A4", $type: "color" },
        },
        primary: { $value: "{colors.brand.500}", $type: "color" },
        buttonBg: { $value: "{colors.primary}", $type: "color" },
      },
    };

    const result = parseTokensStudio(input);
    expect(result.flatValues["colors.buttonBg"]).toBe("#6750A4");
    expect(result.tokens["colors.buttonBg"].value).toBe("#6750A4");
  });

  it("handles circular token reference loops gracefully", () => {
    const input = {
      a: { $value: "{b}" },
      b: { $value: "{c}" },
      c: { $value: "{a}" },
    };

    const result = parseTokensStudio(input);
    expect(result.warnings.some((w) => w.includes("Circular token alias detected"))).toBe(true);
  });

  it("converts HEX, RGB, RGBA, HSL, and HSLA colors to standard Ktheme HEX strings", () => {
    const input = {
      colors: {
        hexShort: { $value: "#0f0", $type: "color" },
        hexFull: { $value: "#6750a4", $type: "color" },
        rgb: { $value: "rgb(255, 87, 51)", $type: "color" },
        rgba: { $value: "rgba(255, 87, 51, 0.5)", $type: "color" },
        hsl: { $value: "hsl(210, 100%, 50%)", $type: "color" },
      },
    };

    const result = parseTokensStudio(input);
    expect(result.flatValues["colors.hexShort"]).toBe("#00FF00");
    expect(result.flatValues["colors.hexFull"]).toBe("#6750A4");
    expect(result.flatValues["colors.rgb"]).toBe("#FF5733");
    expect(result.flatValues["colors.rgba"]).toBe("#FF573380");
    expect(result.flatValues["colors.hsl"]).toBe("#0080FF");
  });

  it("parses DTCG draft specification format ($value, $type, $description)", () => {
    const input = {
      color: {
        primary: {
          $value: "#0055FF",
          $type: "color",
          $description: "DTCG primary accent color",
        },
      },
    };

    const result = parseTokensStudio(input);
    expect(result.tokens["color.primary"].value).toBe("#0055FF");
    expect(result.tokens["color.primary"].description).toBe("DTCG primary accent color");
  });

  it("parses multi-set Tokens Studio JSON structures", () => {
    const input = {
      global: {
        colors: {
          brand: { value: "#123456", type: "color" },
        },
      },
      dark: {
        colors: {
          primary: { value: "{colors.brand}", type: "color" },
        },
      },
      $themes: [
        {
          id: "dark",
          name: "Dark Theme",
          selectedTokenSets: { global: "enabled", dark: "enabled" },
        },
      ],
    };

    const result = parseTokensStudio(input);
    expect(result.flatValues["colors.primary"]).toBe("#123456");
    expect(result.metadata.sets).toContain("global");
    expect(result.metadata.sets).toContain("dark");
  });

  it("parses composite typography tokens", () => {
    const input = {
      font: {
        family: { value: "Roboto", type: "fontFamilies" },
      },
      typography: {
        heading: {
          value: {
            fontFamily: "{font.family}",
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "1.2",
          },
          type: "typography",
        },
      },
    };

    const result = parseTokensStudio(input);
    const heading = result.flatValues["typography.heading"];
    expect(heading).toEqual({
      fontFamily: "Roboto",
      fontSize: "24px",
      fontWeight: "700",
      lineHeight: "1.2",
      letterSpacing: 0,
    });
  });

  it("parses shadow/boxShadow effect tokens", () => {
    const input = {
      shadows: {
        card: {
          value: {
            color: "rgba(0, 0, 0, 0.25)",
            x: "0",
            y: "4px",
            blur: "12px",
            spread: "0",
          },
          type: "boxShadow",
        },
      },
    };

    const result = parseTokensStudio(input);
    expect(result.flatValues["shadows.card"]).toEqual({
      color: "#00000040",
      x: "0",
      y: "4px",
      blur: "12px",
      spread: "0",
    });
  });

  it("converts Tokens Studio JSON directly into a valid Ktheme Theme object", () => {
    const input = {
      colors: {
        primary: { value: "#6750A4", type: "color" },
        background: { value: "#141218", type: "color" },
        surface: { value: "#141218", type: "color" },
      },
      spacing: {
        md: { value: 16, type: "spacing" },
      },
      borderRadius: {
        md: { value: 8, type: "borderRadius" },
      },
    };

    const theme = tokensStudioToKTheme(input, {
      themeName: "Custom Tokens Studio Theme",
      themeId: "custom-ts-theme",
      darkMode: true,
    });

    expect(theme.metadata.id).toBe("custom-ts-theme");
    expect(theme.metadata.name).toBe("Custom Tokens Studio Theme");
    expect(theme.darkMode).toBe(true);
    expect(theme.colorScheme.primary).toBe("#6750A4");
    expect(theme.colorScheme.background).toBe("#141218");
    expect(theme.tokens?.corners?.medium).toBe(8);
  });
});
