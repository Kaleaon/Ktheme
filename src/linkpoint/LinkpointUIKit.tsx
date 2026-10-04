/**
 * Linkpoint UI Kit
 * 7 screens x layout packs x device sizes with Second Life / custom app preset customization
 */

import React, { useState, useEffect } from 'react';
import { KButton, KCard, KChip, KToggle, KSlider, KInput } from '../components/DCs';

export type DeviceSize = 'desktop' | 'tablet' | 'mobile';
export type LayoutPack = 'standard' | 'compact' | 'hero' | 'grid';
export type ScreenId =
  | 'dashboard'
  | 'media-catalog'
  | 'customizer'
  | 'profile'
  | 'communications'
  | 'settings'
  | 'secondlife-preset-studio';

export interface LinkpointPreset {
  id: string;
  name: string;
  primaryColor: string;
  borderRadius: number;
  layoutPack: LayoutPack;
  customButtons: {
    shape: 'rounded' | 'sharp' | 'pill';
    metallic: boolean;
  };
}

export const DEFAULT_LINKPOINT_PRESET: LinkpointPreset = {
  id: 'lp-default-gold',
  name: 'Linkpoint Metallic Gold',
  primaryColor: '#D4AF37',
  borderRadius: 8,
  layoutPack: 'standard',
  customButtons: {
    shape: 'rounded',
    metallic: true,
  },
};

export const LinkpointUIKit: React.FC = () => {
  const [device, setDevice] = useState<DeviceSize>('desktop');
  const [layoutPack, setLayoutPack] = useState<LayoutPack>('standard');
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [preset, setPreset] = useState<LinkpointPreset>(DEFAULT_LINKPOINT_PRESET);
  const [savedPresets, setSavedPresets] = useState<LinkpointPreset[]>([DEFAULT_LINKPOINT_PRESET]);

  // Load saved presets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ktheme_linkpoint_presets');
      if (stored) {
        setSavedPresets(JSON.parse(stored));
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const saveCurrentPreset = () => {
    const updated = [...savedPresets.filter((p) => p.id !== preset.id), preset];
    setSavedPresets(updated);
    try {
      localStorage.setItem('ktheme_linkpoint_presets', JSON.stringify(updated));
    } catch (e) {
      // fallback
    }
  };

  const getWidth = () => {
    if (device === 'mobile') return '375px';
    if (device === 'tablet') return '768px';
    return '100%';
  };

  const screens: { id: ScreenId; label: string }[] = [
    { id: 'dashboard', label: '1. Dashboard' },
    { id: 'media-catalog', label: '2. Media Catalog' },
    { id: 'customizer', label: '3. Customizer' },
    { id: 'profile', label: '4. Profile' },
    { id: 'communications', label: '5. Mail & Comms' },
    { id: 'settings', label: '6. Settings' },
    { id: 'secondlife-preset-studio', label: '7. Second Life Studio' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        padding: '24px',
        backgroundColor: '#0a0d14',
        color: '#f3f4f6',
        borderRadius: '16px',
      }}
    >
      {/* Control Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid #1f293d',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: preset.primaryColor }}>
            Linkpoint UI Kit
          </h2>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>
            7 screens x layout packs x device sizes
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Device Size Switcher */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#141a29', padding: '4px', borderRadius: '8px' }}>
            {(['desktop', 'tablet', 'mobile'] as DeviceSize[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: device === d ? preset.primaryColor : 'transparent',
                  color: device === d ? '#0a0d14' : '#9ca3af',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                {d.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Layout Pack Switcher */}
          <div style={{ display: 'flex', gap: '4px', backgroundColor: '#141a29', padding: '4px', borderRadius: '8px' }}>
            {(['standard', 'compact', 'hero', 'grid'] as LayoutPack[]).map((p) => (
              <button
                key={p}
                onClick={() => setLayoutPack(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: layoutPack === p ? '#2d3748' : 'transparent',
                  color: layoutPack === p ? '#ffffff' : '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screen Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {screens.map((s) => (
          <KChip
            key={s.id}
            label={s.label}
            active={activeScreen === s.id}
            onClick={() => setActiveScreen(s.id)}
          />
        ))}
      </div>

      {/* Frame Container */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#05070a',
          padding: '24px',
          borderRadius: '12px',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            width: getWidth(),
            minHeight: '600px',
            backgroundColor: '#111827',
            borderRadius: `${preset.borderRadius}px`,
            border: '1px solid #1f293d',
            padding: layoutPack === 'compact' ? '12px' : '24px',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Screen Content Renderers */}
          {activeScreen === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px' }}>Dashboard Overview</h3>
                <KButton variant={preset.customButtons.metallic ? 'metallic' : 'filled'}>+ New Item</KButton>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: layoutPack === 'grid' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '16px' }}>
                <KCard title="Active Session" subtitle="Linkpoint Metallic Engine" variant="elevated">
                  <div style={{ fontSize: '28px', fontWeight: 700, color: preset.primaryColor }}>99.8%</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Uptime & Performance</div>
                </KCard>
                <KCard title="Custom Presets" subtitle="Saved Second Life UI configs" variant="glass">
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>{savedPresets.length}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>Loadable Presets</div>
                </KCard>
              </div>
            </div>
          )}

          {activeScreen === 'media-catalog' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0 }}>Media & Assets Catalog</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {['Gold Shimmer', 'Cobalt Matrix', 'Emerald Glass', 'Art Deco Ornament'].map((item) => (
                  <KCard key={item} title={item} variant="glass">
                    <KButton size="sm" variant="outlined">Inspect</KButton>
                  </KCard>
                ))}
              </div>
            </div>
          )}

          {activeScreen === 'customizer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0 }}>Theme Customizer</h3>
              <KInput
                label="Preset Name"
                value={preset.name}
                onChange={(e) => setPreset({ ...preset, name: e.target.value })}
              />
              <KSlider
                label="Border Radius"
                value={preset.borderRadius}
                min={0}
                max={24}
                onChange={(v) => setPreset({ ...preset, borderRadius: v })}
              />
              <KToggle
                label="Metallic Buttons"
                checked={preset.customButtons.metallic}
                onChange={(val) =>
                  setPreset({
                    ...preset,
                    customButtons: { ...preset.customButtons, metallic: val },
                  })
                }
              />
              <KButton variant="filled" onClick={saveCurrentPreset}>
                Save Preset
              </KButton>
            </div>
          )}

          {activeScreen === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0 }}>User Profile & Identity</h3>
              <KCard title="Designer Profile" subtitle="Kaleaon Architect" variant="elevated">
                <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Managing themes, adaptation rules, and custom Linkpoint layouts.
                </p>
                <KChip label="Admin" active />
              </KCard>
            </div>
          )}

          {activeScreen === 'communications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0 }}>Mail & Communications</h3>
              <KCard title="System Update" subtitle="Preset Engine v1.0 Ready" variant="flat">
                <p style={{ fontSize: '13px' }}>All layout packs and metallic presets have been loaded.</p>
              </KCard>
            </div>
          )}

          {activeScreen === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0 }}>System Settings & Governance</h3>
              <KToggle label="Enable Shimmer Animations" checked={true} onChange={() => {}} />
              <KToggle label="Strict WCAG Contrast Enforcement" checked={true} onChange={() => {}} />
            </div>
          )}

          {activeScreen === 'secondlife-preset-studio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ margin: 0, color: preset.primaryColor }}>
                Second Life Custom Preset Studio
              </h3>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                Customize buttons, layouts, and screens, then export/save as a loadable preset into Second Life apps.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <KCard title="Live Customizer" variant="elevated">
                  <KInput
                    label="Primary Accent Hex"
                    value={preset.primaryColor}
                    onChange={(e) => setPreset({ ...preset, primaryColor: e.target.value })}
                  />
                  <div style={{ marginTop: '12px' }}>
                    <KButton variant={preset.customButtons.metallic ? 'metallic' : 'filled'} onClick={saveCurrentPreset}>
                      Save & Load Preset
                    </KButton>
                  </div>
                </KCard>

                <KCard title="Loadable Presets Gallery" variant="glass">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {savedPresets.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setPreset(p)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: preset.id === p.id ? '#1f293d' : '#141a29',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                        }}
                      >
                        <span>{p.name}</span>
                        <span style={{ color: p.primaryColor, fontWeight: 700 }}>●</span>
                      </div>
                    ))}
                  </div>
                </KCard>
              </div>

              {/* Preset JSON Export */}
              <KCard title="Exported Preset JSON" variant="flat">
                <pre
                  style={{
                    backgroundColor: '#05070a',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#a78bfa',
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(preset, null, 2)}
                </pre>
              </KCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
