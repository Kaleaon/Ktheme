import { useState } from 'react';
import { ThemeProvider } from './state/ThemeContext.tsx';
import { BlueskyProvider } from './state/BlueskyContext.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { CustomizerPanel } from './components/customizer/CustomizerPanel.tsx';
import { ThemePreview } from './components/preview/ThemePreview.tsx';
import { AIDesigner } from './components/ai/AIDesigner.tsx';
import { BlueskyPanel } from './components/bluesky/BlueskyPanel.tsx';
import { PresetsPanel } from './components/presets/PresetsPanel.tsx';

function AppContent() {
  const [activeTab, setActiveTab] = useState('customize');

  function renderPanel() {
    switch (activeTab) {
      case 'customize':
        return <CustomizerPanel />;
      case 'ai':
        return <AIDesigner />;
      case 'bluesky':
        return <BlueskyPanel />;
      case 'presets':
        return <PresetsPanel />;
      default:
        return <CustomizerPanel />;
    }
  }

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-area">
        <div
          className="left-panel"
          id={`main-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`main-tab-${activeTab}`}
        >
          {renderPanel()}
        </div>
        <div className="right-panel">
          <ThemePreview />
        </div>
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
