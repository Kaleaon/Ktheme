/**
 * Ktheme Reusable Design Components (DCs) & Specimen Cards
 * Buttons, Cards, Chips, Nav Rail, Dialogs, Toggles, Sliders, Swatches, Forms
 */

import React from 'react';

// ─── Buttons ───
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'metallic';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const KButton: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  children,
  style,
  className = '',
  ...props
}) => {
  const paddingMap = { sm: '4px 10px', md: '8px 16px', lg: '12px 24px' };
  const fontMap = { sm: '12px', md: '14px', lg: '16px' };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: paddingMap[size],
    fontSize: fontMap[size],
    fontWeight: 600,
    fontFamily: 'var(--font-family-sans, system-ui)',
    borderRadius: 'var(--radius-md, 8px)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    ...style
  };

  let variantStyle: React.CSSProperties = {};
  if (variant === 'filled') {
    variantStyle = {
      backgroundColor: 'var(--ktheme-primary, #D4AF37)',
      color: 'var(--ktheme-on-primary, #0A1630)',
    };
  } else if (variant === 'tonal') {
    variantStyle = {
      backgroundColor: 'var(--ktheme-primary-container, #1E293B)',
      color: 'var(--ktheme-on-primary-container, #F1F5F9)',
    };
  } else if (variant === 'outlined') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--ktheme-primary, #D4AF37)',
      border: '1px solid var(--ktheme-outline, #334155)',
    };
  } else if (variant === 'text') {
    variantStyle = {
      backgroundColor: 'transparent',
      color: 'var(--ktheme-primary, #D4AF37)',
    };
  } else if (variant === 'metallic') {
    variantStyle = {
      background: 'linear-gradient(135deg, #856D34 0%, #D4AF37 50%, #FFD700 100%)',
      color: '#0A1630',
      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
    };
  }

  return (
    <button style={{ ...baseStyle, ...variantStyle }} className={`ktheme-dc-btn ${className}`} {...props}>
      {children}
    </button>
  );
};

// ─── Cards / Panels ───
export interface CardProps {
  variant?: 'flat' | 'elevated' | 'glass';
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const KCard: React.FC<CardProps> = ({
  variant = 'flat',
  title,
  subtitle,
  children,
  style
}) => {
  let cardStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--ktheme-border, #2e3140)',
    backgroundColor: 'var(--ktheme-bg-surface, #1a1c25)',
    color: 'var(--ktheme-text, #f3f4f6)',
    ...style
  };

  if (variant === 'elevated') {
    cardStyle = {
      ...cardStyle,
      boxShadow: 'var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.4))',
      backgroundColor: 'var(--ktheme-bg-elevated, #22252f)',
    };
  } else if (variant === 'glass') {
    cardStyle = {
      ...cardStyle,
      backgroundColor: 'rgba(26, 28, 37, 0.7)',
      backdropFilter: 'blur(12px) saturate(160%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    };
  }

  return (
    <div style={cardStyle}>
      {title && <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>{title}</h3>}
      {subtitle && <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ktheme-text-muted, #9ca3af)' }}>{subtitle}</p>}
      {children}
    </div>
  );
};

// ─── Chips ───
export interface ChipProps {
  label: string;
  active?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

export const KChip: React.FC<ChipProps> = ({ label, active, onDelete, onClick }) => {
  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onDelete?.();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        cursor: 'pointer',
        backgroundColor: active ? 'var(--ktheme-primary, #D4AF37)' : 'var(--ktheme-bg-elevated, #22252f)',
        color: active ? 'var(--ktheme-on-primary, #0A1630)' : 'var(--ktheme-text, #f3f4f6)',
        border: '1px solid var(--ktheme-border, #2e3140)',
        transition: 'all 0.15s ease'
      }}
    >
      {label}
      {onDelete && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label}`}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          onKeyDown={handleDeleteKeyDown}
          style={{ cursor: 'pointer', fontWeight: 'bold', marginLeft: '2px' }}
        >
          ×
        </span>
      )}
    </button>
  );
};

// ─── Nav Rail ───
export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface NavRailProps {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const KNavRail: React.FC<NavRailProps> = ({ items, activeId, onSelect }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '72px',
      backgroundColor: 'var(--ktheme-bg-surface, #1a1c25)',
      padding: '12px 8px',
      borderRight: '1px solid var(--ktheme-border, #2e3140)',
      alignItems: 'center'
    }}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            aria-selected={isActive}
            onClick={() => onSelect(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: isActive ? 'var(--ktheme-accent-muted, rgba(129, 140, 248, 0.2))' : 'transparent',
              color: isActive ? 'var(--ktheme-accent, #818cf8)' : 'var(--ktheme-text-muted, #9ca3af)',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              gap: '4px'
            }}
          >
            {item.icon || <span>●</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Dialogs ───
export interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

export const KDialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmText = 'Confirm'
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '400px',
        backgroundColor: 'var(--ktheme-bg-surface, #1a1c25)',
        border: '1px solid var(--ktheme-border, #2e3140)',
        borderRadius: '16px',
        padding: '24px',
        color: 'var(--ktheme-text, #f3f4f6)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{title}</h3>
        {description && <p style={{ fontSize: '14px', color: 'var(--ktheme-text-muted)', marginBottom: '20px' }}>{description}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <KButton variant="outlined" onClick={onClose}>Cancel</KButton>
          {onConfirm && <KButton variant="filled" onClick={onConfirm}>{confirmText}</KButton>}
        </div>
      </div>
    </div>
  );
};

// ─── Toggles & Controls ───
export interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export const KToggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '9999px',
          backgroundColor: checked ? 'var(--ktheme-accent, #818cf8)' : 'var(--ktheme-border, #2e3140)',
          position: 'relative',
          transition: 'background-color 0.2s ease',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: '3px',
          left: checked ? '23px' : '3px',
          transition: 'left 0.2s ease'
        }} />
      </button>
      {label && <span style={{ fontSize: '14px' }}>{label}</span>}
    </label>
  );
};

// ─── Sliders ───
export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange: (val: number) => void;
}

export const KSlider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--ktheme-text-muted)' }}>
          <span>{label}</span>
          <span>{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--ktheme-accent, #818cf8)' }}
      />
    </div>
  );
};

// ─── Swatches ───
export interface SwatchProps {
  color: string;
  name: string;
  hex: string;
}

export const KSwatch: React.FC<SwatchProps> = ({ color, name, hex }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', borderRadius: '8px', backgroundColor: 'var(--ktheme-bg-elevated)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: color, border: '1px solid rgba(255,255,255,0.1)' }} />
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: '11px', color: 'var(--ktheme-text-muted)', fontFamily: 'var(--font-family-mono)' }}>{hex}</div>
      </div>
    </div>
  );
};

// ─── Forms ───
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const KInput: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {label && <label style={{ fontSize: '12px', color: 'var(--ktheme-text-muted)' }}>{label}</label>}
      <input
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          backgroundColor: 'var(--ktheme-bg-elevated, #22252f)',
          border: `1px solid ${error ? 'var(--ktheme-error, #ef4444)' : 'var(--ktheme-border, #2e3140)'}`,
          color: 'var(--ktheme-text, #f3f4f6)',
          fontSize: '14px',
          outline: 'none',
          ...style
        }}
        {...props}
      />
      {error && <span style={{ fontSize: '11px', color: 'var(--ktheme-error, #ef4444)' }}>{error}</span>}
    </div>
  );
};
