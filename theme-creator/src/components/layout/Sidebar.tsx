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
import { type KeyboardEvent, useState } from 'react';
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
  const [statusMessage, setStatusMessage] = useState('');

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }

    event.preventDefault();
    const tabButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sidebar-tab="true"]'));
    if (tabButtons.length === 0) return;

    if (event.key === 'Home') {
      tabButtons[0].focus();
      onTabChange(tabs[0].id);
      return;
    }

    if (event.key === 'End') {
      const last = tabButtons.length - 1;
      tabButtons[last].focus();
      onTabChange(tabs[last].id);
      return;
    }

    const nextIndex = event.key === 'ArrowDown'
      ? (index + 1) % tabs.length
      : (index - 1 + tabs.length) % tabs.length;
    tabButtons[nextIndex].focus();
    onTabChange(tabs[nextIndex].id);
  }

  function handleSaveTheme() {
    dispatch({ type: 'SAVE_CURRENT' });
    setStatusMessage('Theme saved to local storage.');
  }

  function handleCreateTheme() {
    dispatch({ type: 'NEW_THEME' });
    setStatusMessage('Started a new theme.');
  }

  function handleToggleDarkMode() {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    setStatusMessage(`Switched to ${state.currentTheme.darkMode ? 'light' : 'dark'} mode.`);
  }

  return (
    <nav className="sidebar" aria-label="Primary panels">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Ktheme</h1>
        <span className="sidebar-subtitle">Customizer</span>
      </div>

      <div className="sidebar-nav" role="tablist" aria-label="Theme creator sections" aria-orientation="vertical">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`main-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`main-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            data-sidebar-tab="true"
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            <tab.icon size={20} aria-hidden="true" focusable="false" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-actions">
        <button
          className="sidebar-action-btn"
          type="button"
          onClick={handleToggleDarkMode}
          title={state.currentTheme.darkMode ? 'Switch to light' : 'Switch to dark'}
        >
          {state.currentTheme.darkMode ? <Sun size={18} aria-hidden="true" focusable="false" /> : <Moon size={18} aria-hidden="true" focusable="false" />}
          <span>{state.currentTheme.darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          className="sidebar-action-btn"
          type="button"
          onClick={handleSaveTheme}
          title="Save theme"
        >
          <Save size={18} aria-hidden="true" focusable="false" />
          <span>Save{state.isDirty ? ' *' : ''}</span>
        </button>

        <button
          className="sidebar-action-btn"
          type="button"
          onClick={handleCreateTheme}
          title="New theme"
        >
          <FilePlus size={18} aria-hidden="true" focusable="false" />
          <span>New</span>
        </button>
      </div>

      <div className="sidebar-theme-name">
        {state.currentTheme.metadata.name}
        {state.isDirty && <span className="dirty-dot" />}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{statusMessage}</p>
    </nav>
  );
}
