import { useState } from "react";
import { ThemeProvider } from "./state/ThemeContext.tsx";
import { BlueskyProvider } from "./state/BlueskyContext.tsx";
import { Sidebar } from "./components/layout/Sidebar.tsx";
import { SkipLink } from "./components/common/SkipLink.tsx";
import { CustomizerPanel } from "./components/customizer/CustomizerPanel.tsx";
import { ThemePreview } from "./components/preview/ThemePreview.tsx";
import { AIDesigner } from "./components/ai/AIDesigner.tsx";
import { BlueskyPanel } from "./components/bluesky/BlueskyPanel.tsx";
import { PresetsPanel } from "./components/presets/PresetsPanel.tsx";
import { CatalogSyncPanel } from "./components/catalog/CatalogSyncPanel.tsx";

function AppContent() {
  const [activeTab, setActiveTab] = useState("customize");

  function renderPanel() {
    switch (activeTab) {
      case "customize":
        return <CustomizerPanel />;
      case "ai":
        return <AIDesigner />;
      case "bluesky":
        return <BlueskyPanel />;
      case "presets":
        return <PresetsPanel />;
      case "catalog":
        return <CatalogSyncPanel />;
      default:
        return <CustomizerPanel />;
    }
  }

  return (
    <div className="app">
      <SkipLink targetId="main-content">Skip to main content</SkipLink>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-area">
        <main
          className="left-panel"
          id="main-content"
          role="main"
          tabIndex={-1}
          aria-labelledby={`main-tab-${activeTab}`}
        >
          {renderPanel()}
        </main>
        <aside className="right-panel" aria-label="Theme preview">
          <ThemePreview />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BlueskyProvider>
        <AppContent />
      </BlueskyProvider>
    </ThemeProvider>
  );
}
