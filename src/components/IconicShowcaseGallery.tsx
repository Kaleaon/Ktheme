/**
 * Ktheme Iconic Showcase Gallery
 * LCARS, Frutiger Aero, Windows Phone Metro, Art Deco, Art Nouveau
 */

import React, { useState } from 'react';
import { IconicPackRecipes, IconicPackId, applyIconicPack } from '../themes/iconicPacks';

export const IconicShowcaseGallery: React.FC = () => {
  const [selectedPack, setSelectedPack] = useState<IconicPackId>('lcars-activation-pack');
  const [variant, setVariant] = useState<'light' | 'dark' | 'high-contrast'>('dark');

  const packs = Object.values(IconicPackRecipes);
  const activePack = IconicPackRecipes[selectedPack];
  const resolvedTheme = applyIconicPack(selectedPack, { variant });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px',
        backgroundColor: '#0a0d14',
        color: '#f3f4f6',
        borderRadius: '16px',
        border: '1px solid #1f293d',
      }}
    >
      <div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', fontWeight: 700, color: '#a78bfa' }}>
          Iconic Showcase Gallery
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
          Explore LCARS, Metro, Frutiger Aero, Art Deco, and Art Nouveau activation rules side-by-side.
        </p>
      </div>

      {/* Selector Row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {packs.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={selectedPack === p.id}
              onClick={() => setSelectedPack(p.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #2e3140',
                backgroundColor: selectedPack === p.id ? '#818cf8' : '#1a1c25',
                color: selectedPack === p.id ? '#0a0d14' : '#f3f4f6',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Variant Switcher */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: '#141a29', padding: '4px', borderRadius: '8px', marginLeft: 'auto' }}>
          {(['dark', 'light', 'high-contrast'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={variant === v}
              onClick={() => setVariant(v)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: variant === v ? '#2d3748' : 'transparent',
                color: variant === v ? '#ffffff' : '#9ca3af',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Info & Rules Display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ backgroundColor: '#141722', padding: '16px', borderRadius: '12px', border: '1px solid #262b3a' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#818cf8' }}>{activePack.name} Spec</h4>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>{activePack.description}</p>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><strong>Base Preset ID:</strong> <code style={{ color: '#a78bfa' }}>{activePack.basePresetId}</code></div>
            <div><strong>Allowed Expansions:</strong> {activePack.allowedExpansionPacks.join(', ')}</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#141722', padding: '16px', borderRadius: '12px', border: '1px solid #262b3a' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#4ade80' }}>Resolved Scheme</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: resolvedTheme.colorScheme.primary as string, color: resolvedTheme.colorScheme.onPrimary as string, fontWeight: 700, fontSize: '12px' }}>
              Primary
            </div>
            <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: resolvedTheme.colorScheme.surface as string, color: resolvedTheme.colorScheme.onSurface as string, border: '1px solid #2e3140', fontSize: '12px' }}>
              Surface
            </div>
            <div style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: resolvedTheme.colorScheme.background as string, color: resolvedTheme.colorScheme.onBackground as string, border: '1px solid #2e3140', fontSize: '12px' }}>
              Background
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
