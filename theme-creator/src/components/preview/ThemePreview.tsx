import { useTheme } from '../../state/ThemeContext.tsx';
import type { KTheme } from '../../types/theme.ts';

function getCSSVars(theme: KTheme): React.CSSProperties {
  const c = theme.colorScheme;
  const effects = theme.effects || {};
  const typo = theme.typography;
  const metallic = effects.metallic;
  const shadows = effects.shadows;

  const vars: Record<string, string> = {
    '--c-primary': c.primary,
    '--c-on-primary': c.onPrimary,
    '--c-primary-container': c.primaryContainer,
    '--c-on-primary-container': c.onPrimaryContainer,
    '--c-secondary': c.secondary,
    '--c-on-secondary': c.onSecondary,
    '--c-secondary-container': c.secondaryContainer,
    '--c-on-secondary-container': c.onSecondaryContainer,
    '--c-tertiary': c.tertiary,
    '--c-on-tertiary': c.onTertiary,
    '--c-background': c.background,
    '--c-on-background': c.onBackground,
    '--c-surface': c.surface,
    '--c-on-surface': c.onSurface,
    '--c-surface-variant': c.surfaceVariant,
    '--c-on-surface-variant': c.onSurfaceVariant,
    '--c-outline': c.outline,
    '--c-error': c.error,
    '--c-on-error': c.onError,
  };

  if (typo) {
    vars['--font-family'] = typo.fontFamily;
    vars['--font-size-sm'] = `${typo.fontSize.small}px`;
    vars['--font-size-md'] = `${typo.fontSize.medium}px`;
    vars['--font-size-lg'] = `${typo.fontSize.large}px`;
    vars['--font-size-xl'] = `${typo.fontSize.xlarge}px`;
    vars['--line-height'] = String(typo.lineHeight);
    vars['--letter-spacing'] = `${typo.letterSpacing}px`;
  }

  if (shadows?.enabled) {
    vars['--shadow'] = `0 ${shadows.elevation}px ${shadows.blur}px ${shadows.color}`;
  } else {
    vars['--shadow'] = 'none';
  }

  if (metallic?.enabled) {
    const g = metallic.gradient;
    vars['--metallic-gradient'] = `linear-gradient(135deg, ${g.shadow}, ${g.base}, ${g.highlight}, ${g.shimmer}, ${g.highlight}, ${g.base})`;
  }

  return vars as React.CSSProperties;
}

export function ThemePreview() {
  const { state } = useTheme();
  const theme = state.currentTheme;
  const effects = theme.effects || {};
  const shimmer = effects.shimmer;
  const metallic = effects.metallic;

  return (
    <div className="preview-wrapper" style={getCSSVars(theme)}>
      <div className="preview-frame" style={{ background: 'var(--c-background)', color: 'var(--c-on-background)', fontFamily: 'var(--font-family, system-ui)' }}>
        {/* App bar */}
        <div className="pv-appbar" style={{ background: 'var(--c-surface)', color: 'var(--c-on-surface)', boxShadow: 'var(--shadow)' }}>
          <span className="pv-appbar-title" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
            {theme.metadata.name || 'Theme Preview'}
          </span>
          <div className="pv-appbar-actions">
            <div className="pv-chip" style={{ background: 'var(--c-primary)', color: 'var(--c-on-primary)' }}>Active</div>
            <div className="pv-chip-outline" style={{ borderColor: 'var(--c-outline)', color: 'var(--c-on-surface-variant)' }}>v{theme.metadata.version}</div>
          </div>
        </div>

        {/* Content cards */}
        <div className="pv-content">
          <div className="pv-card" style={{ background: 'var(--c-primary)', color: 'var(--c-on-primary)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Primary Card</h3>
            <p style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height)' }}>
              This card demonstrates the primary color. Text should be clearly readable against this background.
            </p>
            <button className="pv-btn" style={{ background: 'var(--c-on-primary)', color: 'var(--c-primary)' }}>
              Action
            </button>
          </div>

          <div className="pv-card" style={{ background: 'var(--c-secondary-container)', color: 'var(--c-on-secondary-container)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Secondary Container</h3>
            <p style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height)' }}>
              Container colors provide subtle backgrounds for content grouping.
            </p>
            <div className="pv-row">
              <button className="pv-btn" style={{ background: 'var(--c-secondary)', color: 'var(--c-on-secondary)' }}>Accept</button>
              <button className="pv-btn-outline" style={{ borderColor: 'var(--c-outline)', color: 'var(--c-on-secondary-container)' }}>Cancel</button>
            </div>
          </div>

          <div className="pv-card" style={{ background: 'var(--c-surface)', color: 'var(--c-on-surface)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)' }}>Surface Card</h3>
            <p style={{ fontSize: 'var(--font-size-md)', lineHeight: 'var(--line-height)', color: 'var(--c-on-surface-variant)' }}>
              Surface variant text appears in a slightly muted tone for hierarchy.
            </p>

            {/* Metallic element */}
            {metallic?.enabled && (
              <div
                className={`pv-metallic ${shimmer?.enabled ? 'pv-shimmer' : ''}`}
                style={{
                  background: 'var(--metallic-gradient)',
                  backgroundSize: shimmer?.enabled ? '200% 100%' : undefined,
                  animationDuration: shimmer?.enabled ? `${shimmer.speed}s` : undefined,
                  color: metallic.gradient.shadow,
                  boxShadow: 'var(--shadow)',
                }}
              >
                Metallic Effect
              </div>
            )}

            {/* Input sample */}
            <div className="pv-input-row">
              <div className="pv-input" style={{ borderColor: 'var(--c-outline)', color: 'var(--c-on-surface)', background: 'var(--c-surface-variant)' }}>
                Sample input field
              </div>
            </div>
          </div>

          {/* Error state */}
          <div className="pv-card" style={{ background: 'var(--c-error)', color: 'var(--c-on-error)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)' }}>Error State</h3>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>This is how error states will appear.</p>
          </div>

          {/* Color palette strip */}
          <div className="pv-palette-strip">
            {['primary', 'secondary', 'tertiary', 'error', 'background', 'surface'].map((key) => (
              <div
                key={key}
                className="pv-palette-swatch"
                style={{ background: `var(--c-${key})` }}
                title={key}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
