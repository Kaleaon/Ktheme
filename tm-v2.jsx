// ThemeMakerV2.jsx — Consolidated to consume unified @ktheme/react/studio.
import React from "react";
import { ThemeStudio } from "./packages/react/src/studio/ThemeStudio";
import { KthemeProvider } from "./packages/react/src/KthemeProvider";

export function ThemeMakerV2({ themeKey = "navy-gold" }) {
  return (
    <KthemeProvider themeId={themeKey}>
      <ThemeStudio embedded={true} />
    </KthemeProvider>
  );
}

if (typeof window !== "undefined") {
  window.ThemeMakerV2 = ThemeMakerV2;
}

export default ThemeMakerV2;
