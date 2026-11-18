import React, { useState } from "react";

export interface SkipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = "main-content",
  href,
  children = "Skip to main content",
  className = "",
  style,
  onClick,
  ...props
}) => {
  const resolvedTargetId = href ? href.replace(/^#/, "") : targetId;
  const resolvedHref = href || `#${resolvedTargetId}`;
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (!resolvedTargetId) return;

    const targetElement = document.getElementById(resolvedTargetId);
    if (targetElement) {
      e.preventDefault();

      // Ensure target is focusable
      if (!targetElement.hasAttribute("tabindex")) {
        targetElement.setAttribute("tabindex", "-1");
      }

      // Update DOM focus
      targetElement.focus();

      // Scroll into view smoothly
      if (typeof targetElement.scrollIntoView === "function") {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      // Update URL hash without pushing duplicate entry to browser history
      if (
        typeof window !== "undefined" &&
        window.history &&
        typeof window.history.replaceState === "function"
      ) {
        window.history.replaceState(null, "", `#${resolvedTargetId}`);
      }
    }
  };

  // High contrast styles satisfying WCAG 1.4.3 (foreground #ffffff on #0f172a > 15:1)
  const defaultHiddenStyle: React.CSSProperties = {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    zIndex: 99999,
  };

  const defaultFocusedStyle: React.CSSProperties = {
    position: "fixed",
    top: "12px",
    left: "12px",
    width: "auto",
    height: "auto",
    padding: "10px 16px",
    clip: "auto",
    overflow: "visible",
    whiteSpace: "normal",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "underline",
    borderRadius: "6px",
    border: "2px solid #38bdf8",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
    outline: "3px solid #60a5fa",
    outlineOffset: "2px",
    zIndex: 999999,
  };

  const combinedStyle: React.CSSProperties = {
    ...(isFocused ? defaultFocusedStyle : defaultHiddenStyle),
    ...style,
  };

  return (
    <a
      href={resolvedHref}
      className={`skip-link ${className}`.trim()}
      style={combinedStyle}
      onClick={handleClick}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export default SkipLink;
