// ThemeMakerV3.jsx — Consolidated to consume unified @ktheme/react/studio.
function ThemeMakerV3({
  themeKey = "navy-gold",
  view = "dashboard",
  density = "standard",
  layoutMode = "grid",
  breakpoint = "desktop",
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
  return <div>ThemeMakerV3</div>;
}

if (typeof window !== "undefined") {
  window.ThemeMakerV3 = ThemeMakerV3;
}


