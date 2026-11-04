#!/usr/bin/env ts-node
import { PresetThemes } from "../src/themes/presets";
import { contrastRatio } from "../src/utils/colors";

interface ContrastCheck {
  name: string;
  fg: string;
  bg: string;
  min: number;
}

const checks: ContrastCheck[] = [
  { name: "primary / onPrimary (text)", fg: "primary", bg: "onPrimary", min: 4.5 },
  { name: "onBackground / background (text)", fg: "onBackground", bg: "background", min: 4.5 },
  { name: "onSurface / surface (text)", fg: "onSurface", bg: "surface", min: 4.5 },
  { name: "outline / background (component)", fg: "outline", bg: "background", min: 3.0 },
  { name: "secondary / background (component)", fg: "secondary", bg: "background", min: 3.0 },
  { name: "primary / background (component)", fg: "primary", bg: "background", min: 3.0 },
];

function main() {
  let totalChecks = 0;
  let failures = 0;

  console.log("Auditing all raw preset themes for WCAG AA contrast compliance...");

  for (const [key, theme] of Object.entries(PresetThemes)) {
    const cs = theme.colorScheme;
    for (const check of checks) {
      const fgVal = cs[check.fg as keyof typeof cs];
      const bgVal = cs[check.bg as keyof typeof cs];
      if (typeof fgVal === "string" && typeof bgVal === "string") {
        totalChecks++;
        const ratio = contrastRatio(fgVal, bgVal);
        if (ratio < check.min) {
          console.error(
            `  FAIL: ${key} (${theme.metadata.id}) -> ${check.name}: ${ratio.toFixed(
              2,
            )}:1 < ${check.min}:1 (${fgVal} vs ${bgVal})`,
          );
          failures++;
        }
      }
    }
  }

  if (failures === 0) {
    console.log(`PASS: All ${totalChecks} raw preset theme contrast checks passed!`);
    process.exit(0);
  } else {
    console.error(`FAIL: ${failures} out of ${totalChecks} contrast checks failed.`);
    process.exit(1);
  }
}

main();
