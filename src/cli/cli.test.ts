import fs from "node:fs";
import path from "node:path";
import { validateComponentCatalog } from "./validator";
import {
  extractComposeComponents,
  extractReactComponents,
  extractCleverferretTemplates,
} from "./extract";
import { pullTokens } from "./pull";

describe("Ktheme CLI Engine", () => {
  const tmpDir = path.join(__dirname, "__tmp_test__");

  beforeAll(() => {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  test("validateComponentCatalog validates a valid component catalog item", () => {
    const validItem = {
      id: "morph-slider",
      name: "MorphSlider",
      framework: "jetpack-compose",
      category: "controls",
      props: [
        { name: "morph", type: "MorphState" },
        { name: "onValueChange", type: "(Float) -> Unit" },
      ],
      tokenBindings: {
        sliderTrack: "primary",
        label: "onSurface",
      },
    };

    const schemaPath = path.resolve(
      __dirname,
      "../../ktheme-component-schema.json",
    );
    const result = validateComponentCatalog(validItem, schemaPath);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("validateComponentCatalog rejects an invalid component without required fields", () => {
    const invalidItem = {
      name: "InvalidComponent",
    };

    const schemaPath = path.resolve(
      __dirname,
      "../../ktheme-component-schema.json",
    );
    const result = validateComponentCatalog(invalidItem, schemaPath);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test("validateComponentCatalog rejects invalid token references with descriptive errors", () => {
    const itemWithInvalidToken = {
      id: "test-card",
      name: "TestCard",
      framework: "react",
      props: [{ name: "title", type: "string" }],
      tokenBindings: {
        accent: "unmapped_token_key_xyz",
      },
    };

    const schemaPath = path.resolve(
      __dirname,
      "../../ktheme-component-schema.json",
    );
    const result = validateComponentCatalog(itemWithInvalidToken, schemaPath);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("unmapped_token_key_xyz");
    expect(result.errors[0]).toContain("invalid design token");
  });

  test("extractReactComponents parses JSX component and outputs valid catalog entry", () => {
    const dummyReactFile = path.join(tmpDir, "SampleCard.jsx");
    const dummyContent = `
import React from "react";
import { useThemeTokens } from "../context/ThemeContext.jsx";

export default function SampleCard({ title, disabled = false, onClick }) {
  const { V } = useThemeTokens();
  return (
    <div style={{ background: V.surf, color: V.ink, border: "1px solid " + V.outv }}>
      <span style={{ color: V.pri }}>{title}</span>
    </div>
  );
}
`;
    fs.writeFileSync(dummyReactFile, dummyContent, "utf-8");

    const items = extractReactComponents(dummyReactFile);
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].name).toBe("SampleCard");
    expect(items[0].framework).toBe("react");
    expect(items[0].props.some((p) => p.name === "title")).toBe(true);

    const schemaPath = path.resolve(
      __dirname,
      "../../ktheme-component-schema.json",
    );
    const validation = validateComponentCatalog(items, schemaPath);
    expect(validation.valid).toBe(true);
  });

  test("extractCleverferretTemplates parses .dc.html templates and outputs valid catalog entry", () => {
    const dummyDcFile = path.join(tmpDir, "test-app.dc.html");
    const dummyContent = `
<!DOCTYPE html>
<html>
<body>
<div style="background: var(--appbg); color: var(--ink);">
  <h1>{{ themeName }}</h1>
  <span>{{ screenTitle }}</span>
  <button style="background: var(--pri);">Click</button>
</div>
</body>
</html>
`;
    fs.writeFileSync(dummyDcFile, dummyContent, "utf-8");

    const items = extractCleverferretTemplates(dummyDcFile);
    expect(items.length).toBe(1);
    expect(items[0].framework).toBe("cleverferret");
    expect(items[0].props.some((p) => p.name === "themeName")).toBe(true);
    expect(items[0].tokenBindings?.pri).toBe("primary");

    const schemaPath = path.resolve(
      __dirname,
      "../../ktheme-component-schema.json",
    );
    const validation = validateComponentCatalog(items, schemaPath);
    expect(validation.valid).toBe(true);
  });

  test("extractComposeComponents parses Composable functions from Kotlin source", () => {
    const dummyKotlinFile = path.join(tmpDir, "EditorScreenDummy.kt");
    const dummyContent = `
package com.charmorph.app.ui

@Composable
fun MorphSlider(
    morph: MorphState,
    onValueChange: (Float) -> Unit
) {
}

@Composable
fun BoneControl(
    bone: BoneState,
    onUpdate: (Float, Float, Float) -> Unit
) {
}
`;
    fs.writeFileSync(dummyKotlinFile, dummyContent, "utf-8");

    const items = extractComposeComponents(dummyKotlinFile);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe("MorphSlider");
    expect(items[0].framework).toBe("jetpack-compose");
    expect(items[1].name).toBe("BoneControl");
    expect(items[1].framework).toBe("jetpack-compose");

    // Verify extracted components pass schema validation
    const schemaPath = path.resolve(
      __dirname,
      "../../ktheme-component-schema.json",
    );
    const validation = validateComponentCatalog(items, schemaPath);
    expect(validation.valid).toBe(true);
  });

  test("pullTokens generates Theme.kt with fallback when offline", async () => {
    const testKotlinOut = path.join(tmpDir, "Theme.kt");
    const result = await pullTokens({
      endpoint: "http://localhost:99999/non-existent",
      outKotlin: testKotlinOut,
    });

    expect(result.success).toBe(true);
    expect(result.usedFallback).toBe(true);
    expect(fs.existsSync(testKotlinOut)).toBe(true);
    const generatedContent = fs.readFileSync(testKotlinOut, "utf-8");
    expect(generatedContent).toContain("fun CharMorphTheme");
    expect(generatedContent).toContain("LightColors");
    expect(generatedContent).toContain("DarkColors");
  });
});

