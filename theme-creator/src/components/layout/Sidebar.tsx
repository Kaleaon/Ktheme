import {
  Palette,
  Sparkles,
  CloudUpload,
  Library,
  Sun,
  Moon,
  Save,
  FilePlus,
} from 'lucide-react';
import { useTheme } from '../../state/ThemeContext.tsx';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'customize', label: 'Customize', icon: Palette },
  { id: 'ai', label: 'AI Designer', icon: Sparkles },
  { id: 'bluesky', label: 'Bluesky', icon: CloudUpload },
  { id: 'presets', label: 'Presets', icon: Library },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { state, dispatch } = useTheme();

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Ktheme</h1>
        <span className="sidebar-subtitle">Customizer</span>
      </div>

      <div className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-actions">
        <button
          className="sidebar-action-btn"
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          title={state.currentTheme.darkMode ? 'Switch to light' : 'Switch to dark'}
        >
          {state.currentTheme.darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{state.currentTheme.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          className="sidebar-action-btn"
          onClick={() => dispatch({ type: 'SAVE_CURRENT' })}
          title="Save theme"
        >
          <Save size={18} />
          <span>Save{state.isDirty ? ' *' : ''}</span>
        </button>

        <button
          className="sidebar-action-btn"
          onClick={() => dispatch({ type: 'NEW_THEME' })}
          title="New theme"
        >
          <FilePlus size={18} />
          <span>New</span>
        </button>
      </div>

      <div className="sidebar-theme-name">
        {state.currentTheme.metadata.name}
        {state.isDirty && <span className="dirty-dot" />}
      </div>
    </nav>
  );
}
