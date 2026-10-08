/**
 * Ktheme Reusable Design Components (DCs) & Specimen Cards
 * Buttons, Cards, Chips, Nav Rail, Dialogs, Toggles, Sliders, Swatches, Forms
 */

import React from "react";

// ─── Buttons ───
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "tonal" | "outlined" | "text" | "metallic";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const KButton: React.FC<ButtonProps> = ({
  variant = "filled",
  size = "md",
  children,
  style,
  className = "",
  ...props
}) => {
  const paddingMap = { sm: "4px 10px", md: "8px 16px", lg: "12px 24px" };
  const fontMap = { sm: "12px", md: "14px", lg: "16px" };

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: paddingMap[size],
    fontSize: fontMap[size],
    fontWeight: 600,
    fontFamily: "var(--font-family-sans, system-ui)",
    borderRadius: "var(--radius-md, 8px)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
    ...style,
  };

  let variantStyle: React.CSSProperties = {};
  if (variant === "filled") {
    variantStyle = {
      backgroundColor: "var(--ktheme-primary, #D4AF37)",
      color: "var(--ktheme-on-primary, #0A1630)",
    };
  } else if (variant === "tonal") {
    variantStyle = {
      backgroundColor: "var(--ktheme-primary-container, #1E293B)",
      color: "var(--ktheme-on-primary-container, #F1F5F9)",
    };
  } else if (variant === "outlined") {
    variantStyle = {
      backgroundColor: "transparent",
      color: "var(--ktheme-primary, #D4AF37)",
      border: "1px solid var(--ktheme-outline, #334155)",
    };
  } else if (variant === "text") {
    variantStyle = {
      backgroundColor: "transparent",
      color: "var(--ktheme-primary, #D4AF37)",
    };
  } else if (variant === "metallic") {
    variantStyle = {
      background:
        "linear-gradient(135deg, var(--ktheme-shadow, #856D34) 0%, var(--ktheme-primary, #D4AF37) 50%, var(--ktheme-shimmer, #FFD700) 100%)",
      color: "var(--ktheme-on-primary, #0A1630)",
      boxShadow: "0 2px 8px rgba(212, 175, 55, 0.3)",
    };
  }

  return (
    <button
      style={{ ...baseStyle, ...variantStyle }}
      className={`ktheme-dc-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Main Landmark Container ───
export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const KMain: React.FC<MainProps> = ({
  children,
  style,
  className = "",
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    flex: 1,
    width: "100%",
    ...style,
  };

  return (
    <main
      style={baseStyle}
      className={`ktheme-dc-main ${className}`.trim()}
      {...props}
    >
      {children}
    </main>
  );
};

// ─── Cards / Panels ───
export interface CardProps {
  variant?: "flat" | "elevated" | "glass";
  as?: React.ElementType;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const KCard: React.FC<CardProps> = ({
  variant = "flat",
  as: Component = "div",
  title,
  subtitle,
  children,
  style,
  className = "",
  ...props
}) => {
  let cardStyle: React.CSSProperties = {
    padding: "16px",
    borderRadius: "var(--radius-lg, 12px)",
    border: "1px solid var(--ktheme-border, #2e3140)",
    backgroundColor: "var(--ktheme-bg-surface, #1a1c25)",
    color: "var(--ktheme-text, #f3f4f6)",
    ...style,
  };

  if (variant === "elevated") {
    cardStyle = {
      ...cardStyle,
      boxShadow: "var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.4))",
      backgroundColor: "var(--ktheme-bg-elevated, #22252f)",
    };
  } else if (variant === "glass") {
    cardStyle = {
      ...cardStyle,
      backgroundColor: "rgba(26, 28, 37, 0.7)",
      backdropFilter: "blur(12px) saturate(160%)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
    };
  }

  return (
    <Component style={cardStyle} className={className} {...props}>
      {title && (
        <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 700 }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "13px",
            color: "var(--ktheme-text-muted, #9ca3af)",
          }}
        >
          {subtitle}
        </p>
      )}
      {children}
    </Component>
  );
};

// ─── Chips ───
export interface ChipProps {
  label: string;
  active?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
}

export const KChip: React.FC<ChipProps> = ({
  label,
  active,
  onDelete,
  onClick,
}) => {
  const handleDeleteKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
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
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "9999px",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        backgroundColor: active
          ? "var(--ktheme-primary, #D4AF37)"
          : "var(--ktheme-bg-elevated, #22252f)",
        color: active
          ? "var(--ktheme-on-primary, #0A1630)"
          : "var(--ktheme-text, #f3f4f6)",
        border: "1px solid var(--ktheme-border, #2e3140)",
        transition: "all 0.15s ease",
      }}
    >
      {label}
      {onDelete && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onKeyDown={handleDeleteKeyDown}
          style={{ cursor: "pointer", fontWeight: "bold", marginLeft: "2px" }}
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
  ariaLabel?: string;
}

export const KNavRail: React.FC<NavRailProps> = ({
  items,
  activeId,
  onSelect,
  ariaLabel = "Sidebar Navigation",
}) => {
  return (
    <nav
      aria-label={ariaLabel}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "72px",
        backgroundColor: "var(--ktheme-bg-surface, #1a1c25)",
        padding: "12px 8px",
        borderRight: "1px solid var(--ktheme-border, #2e3140)",
        alignItems: "center",
      }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onSelect(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: isActive
                ? "var(--ktheme-accent-muted, rgba(129, 140, 248, 0.2))"
                : "transparent",
              color: isActive
                ? "var(--ktheme-accent, #818cf8)"
                : "var(--ktheme-text-muted, #9ca3af)",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: 600,
              gap: "4px",
            }}
          >
            {item.icon || <span>●</span>}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
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
  confirmText = "Confirm",
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    const container = dialogRef.current;
    if (!container) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelector),
    );
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === "function"
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kdialog-title"
        aria-describedby={description ? "kdialog-desc" : undefined}
        tabIndex={-1}
        style={{
          width: "400px",
          backgroundColor: "var(--ktheme-bg-surface, #1a1c25)",
          border: "1px solid var(--ktheme-border, #2e3140)",
          borderRadius: "16px",
          padding: "24px",
          color: "var(--ktheme-text, #f3f4f6)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          outline: "none",
        }}
      >
        <h3
          id="kdialog-title"
          style={{ margin: "0 0 8px 0", fontSize: "20px" }}
        >
          {title}
        </h3>
        {description && (
          <p
            id="kdialog-desc"
            style={{
              fontSize: "14px",
              color: "var(--ktheme-text-muted)",
              marginBottom: "20px",
            }}
          >
            {description}
          </p>
        )}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <KButton variant="outlined" onClick={onClose}>
            Cancel
          </KButton>
          {onConfirm && (
            <KButton variant="filled" onClick={onConfirm}>
              {confirmText}
            </KButton>
          )}
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

export const KToggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
}) => {
  const generatedId = React.useId
    ? React.useId()
    : `ktoggle-${Math.random().toString(36).substring(2, 9)}`;
  const toggleId = generatedId;
  const labelId = `${toggleId}-label`;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : "Toggle switch"}
        onClick={() => onChange(!checked)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "9999px",
          backgroundColor: checked
            ? "var(--ktheme-accent, #818cf8)"
            : "var(--ktheme-border, #2e3140)",
          position: "relative",
          transition: "background-color 0.2s ease",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "var(--ktheme-surface, #ffffff)",
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            transition: "left 0.2s ease",
          }}
        />
      </button>
      {label && (
        <span
          id={labelId}
          onClick={() => onChange(!checked)}
          style={{ fontSize: "14px", cursor: "pointer", userSelect: "none" }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

// ─── Sliders ───
export interface SliderProps {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  onChange: (val: number) => void;
}

export const KSlider: React.FC<SliderProps> = ({
  id: explicitId,
  value,
  min = 0,
  max = 100,
  step = 1,
  label,
  onChange,
}) => {
  const generatedId = React.useId
    ? React.useId()
    : `kslider-${Math.random().toString(36).substring(2, 9)}`;
  const sliderId = explicitId || generatedId;
  const labelId = `${sliderId}-label`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--ktheme-text-muted)",
          }}
        >
          <span id={labelId}>{label}</span>
          <span>{value}</span>
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : "Slider"}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--ktheme-accent, #818cf8)" }}
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px",
        borderRadius: "8px",
        backgroundColor: "var(--ktheme-bg-elevated)",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          backgroundColor: color,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <div>
        <div style={{ fontSize: "12px", fontWeight: 600 }}>{name}</div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--ktheme-text-muted)",
            fontFamily: "var(--font-family-mono)",
          }}
        >
          {hex}
        </div>
      </div>
    </div>
  );
};

// ─── Forms ───
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const KInput: React.FC<InputProps> = ({
  id: explicitId,
  label,
  error,
  style,
  ...props
}) => {
  const generatedId = React.useId
    ? React.useId()
    : `kinput-${Math.random().toString(36).substring(2, 9)}`;
  const inputId = explicitId || generatedId;
  const labelId = `${inputId}-label`;
  const errorId = `${inputId}-error`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {label && (
        <label
          id={labelId}
          htmlFor={inputId}
          style={{ fontSize: "12px", color: "var(--ktheme-text-muted)" }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        aria-errormessage={error ? errorId : undefined}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          backgroundColor: "var(--ktheme-bg-elevated, #22252f)",
          border: `1px solid ${
            error
              ? "var(--ktheme-error, #ef4444)"
              : "var(--ktheme-border, #2e3140)"
          }`,
          color: "var(--ktheme-text, #f3f4f6)",
          fontSize: "14px",
          outline: "none",
          ...style,
        }}
        {...props}
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          style={{ fontSize: "11px", color: "var(--ktheme-error, #ef4444)" }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
