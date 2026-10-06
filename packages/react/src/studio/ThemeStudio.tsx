import React, { useState, useRef } from "react";
import { useKtheme } from "../useKtheme";
import { DEFAULT_THEMES } from "../KthemeProvider";

export interface ThemeStudioProps {
  embedded?: boolean;
  onExport?: (json: string) => void;
  onSave?: (name: string, tokens: Record<string, string>) => void;
  className?: string;
  style?: React.CSSProperties;
}

const EDITABLE_TOKENS: Array<[string, string]> = [
  ["primary", "Primary Color"],
  ["secondary", "Secondary Accent"],
  ["surface", "Surface Panel"],
  ["background", "Background"],
  ["outline", "Outline / Stroke"],
  ["error", "Error / Critical"],
  ["warning", "Warning / Notice"],
  ["success", "Success / OK"],
];

const METALLIC_VARIANTS = [
  {
    id: "GOLD",
    label: "Gold",
    base: "#D4AF37",
    highlight: "#FFD700",
    shadow: "#856D34",
  },
  {
    id: "SILVER",
    label: "Silver",
    base: "#C0C0C0",
    highlight: "#E8E8E8",
    shadow: "#808080",
  },
  {
    id: "ROSE_GOLD",
    label: "Rose Gold",
    base: "#B76E79",
    highlight: "#E5BE8A",
    shadow: "#7D4A52",
  },
  {
    id: "BRONZE",
    label: "Bronze",
    base: "#CD7F32",
    highlight: "#D99952",
    shadow: "#6B4423",
  },
  {
    id: "COPPER",
    label: "Copper",
    base: "#B87333",
    highlight: "#D49A63",
    shadow: "#6D421E",
  },
  {
    id: "PLATINUM",
    label: "Platinum",
    base: "#E5E4E2",
    highlight: "#FFFFFF",
    shadow: "#9C9A98",
  },
  {
    id: "TITANIUM",
    label: "Titanium",
    base: "#878681",
    highlight: "#BDBBB8",
    shadow: "#4A4A48",
  },
  {
    id: "CHROME",
    label: "Chrome",
    base: "#DBE2E9",
    highlight: "#FFFFFF",
    shadow: "#4A5C6E",
  },
  {
    id: "COBALT",
    label: "Cobalt",
    base: "#3A6BD9",
    highlight: "#7FA5F0",
    shadow: "#1A3A8A",
  },
];

type StudioTab = "customizer" | "presets" | "metallic" | "preview";

export function ThemeStudio({
  embedded = false,
  onExport,
  onSave,
  className = "",
  style = {},
}: ThemeStudioProps) {
  const { themeId, tokens, setThemeId, setToken, setTokens, resetTheme } =
    useKtheme();
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "customizer" | "presets" | "metallic" | "preview"
  >("customizer");
  const [themeName, setThemeName] = useState<string>(
    tokens.name || themeId || "Custom Theme",
  );
  const [activeMetallic, setActiveMetallic] = useState<string>("GOLD");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (key: string, val: string) => {
    setToken(key, val);
  };

  const handleExportJSON = () => {
    const payload = JSON.stringify(
      {
        schemaVersion: 1,
        metadata: {
          id: themeId,
          name: themeName,
          author: "ThemeStudio User",
          version: "1.0.0",
        },
        tokens,
      },
      null,
      2,
    );

    if (onExport) {
      onExport(payload);
    } else if (typeof document !== "undefined") {
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${themeName.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.tokens) {
          setTokens(parsed.tokens);
          if (parsed.metadata?.name) setThemeName(parsed.metadata.name);
        } else if (typeof parsed === "object") {
          setTokens(parsed);
        }
      } catch (err) {
        console.error("Failed to import theme JSON:", err);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleShareLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const encoded = encodeURIComponent(JSON.stringify(tokens));
      const shareUrl = `${window.location.origin}${window.location.pathname}?theme=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToDevice = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "ktheme_custom_theme",
        JSON.stringify({ name: themeName, tokens }),
      );
    }
    if (onSave) onSave(themeName, tokens as Record<string, string>);
  };

  return (
    <div
      className={`ktheme-studio ${className}`}
      style={{
        background: "var(--md-sys-color-background, #0F1117)",
        color: "var(--md-sys-color-on-background, #E8E3D8)",
        borderRadius: 12,
        border: "1px solid var(--md-sys-color-outline, #2A3655)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        padding: embedded ? "16px" : "20px",
        fontFamily: "var(--ktheme-font, system-ui, sans-serif)",
        maxHeight: embedded ? "none" : "90vh",
        overflowY: "auto",
        ...style,
      }}
    >
      {/* Studio Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--md-sys-color-outline, #2A3655)",
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "linear-gradient(135deg, #D4AF37, #FFD700)",
              color: "#0A1630",
              fontWeight: 800,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            K
          </div>
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 14, letterSpacing: "0.05em" }}
            >
              THEME STUDIO
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>
              Consolidated Ktheme Theme Builder & Token Engine
            </div>
          </div>
        </div>

        {!embedded && (
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "transparent",
              border: "1px solid var(--md-sys-color-outline, #2A3655)",
              color: "inherit",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {open ? "Collapse −" : "Expand +"}
          </button>
        )}
      </div>

      {open && (
        <>
          {/* Tab Navigation */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
              borderBottom: "1px solid var(--md-sys-color-outline, #2A3655)",
              paddingBottom: 8,
            }}
          >
            {[
              ["customizer", "🎨 Customizer"],
              ["presets", "📱 Presets"],
              ["metallic", "✨ Metallic"],
              ["preview", "👁️ Preview Deck"],
            ].map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey as StudioTab)}
                style={{
                  background:
                    activeTab === tabKey
                      ? "var(--md-sys-color-primary, #D4AF37)"
                      : "transparent",
                  color:
                    activeTab === tabKey
                      ? "var(--md-sys-color-on-primary, #0A1630)"
                      : "var(--md-sys-color-on-background, #E8E3D8)",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontWeight: activeTab === tabKey ? 700 : 500,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab 1: Color Customizer */}
          {activeTab === "customizer" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  THEME NAME
                </label>
                <input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--md-sys-color-surface, #1A2645)",
                    color: "inherit",
                    border: "1px solid var(--md-sys-color-outline, #2A3655)",
                    borderRadius: 6,
                    padding: "8px 10px",
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 10,
                }}
              >
                {EDITABLE_TOKENS.map(([key, label]) => {
                  const val = tokens[key] || "#000000";
                  return (
                    <div
                      key={key}
                      style={{
                        background: "var(--md-sys-color-surface, #1A2645)",
                        border:
                          "1px solid var(--md-sys-color-outline, #2A3655)",
                        borderRadius: 6,
                        padding: "8px 10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 600 }}>
                        {label}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <input
                          type="color"
                          value={val.startsWith("#") ? val : "#D4AF37"}
                          onChange={(e) =>
                            handleColorChange(key, e.target.value)
                          }
                          style={{
                            width: 24,
                            height: 24,
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            background: "transparent",
                          }}
                        />
                        <code style={{ fontSize: 11, fontFamily: "monospace" }}>
                          {val.toUpperCase()}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Preset Gallery */}
          {activeTab === "presets" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 10,
              }}
            >
              {Object.keys(DEFAULT_THEMES).map((id) => {
                const p = DEFAULT_THEMES[id];
                const active = themeId === id;
                return (
                  <div
                    key={id}
                    onClick={() => setThemeId(id)}
                    style={{
                      background: p.surface || "#1A2645",
                      border: active
                        ? "2px solid #D4AF37"
                        : "1px solid #2A3655",
                      borderRadius: 8,
                      padding: 10,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ display: "flex", gap: 4 }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: p.primary,
                        }}
                      />
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: p.secondary,
                        }}
                      />
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          background: p.background,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: p.onSurface || "#fff",
                      }}
                    >
                      {id.replace(/-/g, " ").toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Metallic Forge */}
          {activeTab === "metallic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                Select Metallic Shimmer Finish:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {METALLIC_VARIANTS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveMetallic(m.id);
                      setToken("primary", m.base);
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${m.shadow}, ${m.base}, ${m.highlight})`,
                      color: "#0A1630",
                      border:
                        activeMetallic === m.id ? "2px solid #fff" : "none",
                      borderRadius: 6,
                      padding: "8px 14px",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    ✨ {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Preview Deck */}
          {activeTab === "preview" && (
            <div
              style={{
                background: "var(--md-sys-color-surface, #1A2645)",
                borderRadius: 8,
                padding: 16,
                border: "1px solid var(--md-sys-color-outline, #2A3655)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--md-sys-color-primary, #D4AF37)",
                }}
              >
                Live Component Preview
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  style={{
                    background: "var(--md-sys-color-primary, #D4AF37)",
                    color: "var(--md-sys-color-on-primary, #0A1630)",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 16px",
                    fontWeight: 700,
                  }}
                >
                  Primary Action
                </button>
                <button
                  style={{
                    background: "transparent",
                    border: "1px solid var(--md-sys-color-outline, #2A3655)",
                    color: "inherit",
                    borderRadius: 6,
                    padding: "8px 16px",
                  }}
                >
                  Outline Button
                </button>
              </div>
            </div>
          )}

          {/* Studio Actions Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 18,
              paddingTop: 12,
              borderTop: "1px solid var(--md-sys-color-outline, #2A3655)",
            }}
          >
            <button onClick={handleSaveToDevice} style={actionBtnStyle}>
              💾 Save to Device
            </button>
            <button onClick={handleShareLink} style={actionBtnStyle}>
              {copied ? "✅ Link Copied!" : "🔗 Share Link"}
            </button>
            <button onClick={handleExportJSON} style={actionBtnStyle}>
              📥 Export JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              style={actionBtnStyle}
            >
              📤 Import JSON
            </button>
            <button
              onClick={resetTheme}
              style={{
                ...actionBtnStyle,
                background: "rgba(207,102,121,0.2)",
                color: "#CF6679",
              }}
            >
              🔄 Reset
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              style={{ display: "none" }}
            />
          </div>
        </>
      )}
    </div>
  );
}

const actionBtnStyle: React.CSSProperties = {
  background: "var(--md-sys-color-surface, #1A2645)",
  color: "inherit",
  border: "1px solid var(--md-sys-color-outline, #2A3655)",
  borderRadius: 6,
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};
