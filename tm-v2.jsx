// ThemeMakerV2.jsx — Consolidated to consume unified @ktheme/react/studio.
function ThemeMakerV2({
  themeKey = "navy-gold",
  view = "dashboard",
  density = "standard",
  layoutMode = "grid",
  breakpoint = "desktop",
  aiOpen = false,
}) {
  const Surface = typeof window !== "undefined" ? window.ThemedSurface : null;
  if (Surface) {
    return (
      <Surface
        theme={themeKey}
        view={view}
        density={density}
        layoutMode={layoutMode}
        breakpoint={breakpoint}
      />
    );
  }
  return <div>ThemeMakerV2</div>;
}

if (typeof window !== "undefined") {
  window.ThemeMakerV2 = ThemeMakerV2;
}


