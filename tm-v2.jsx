// ThemeMakerV2.jsx — Featured/Balanced. Signature Ktheme look:
// Top toolbar with theme breadcrumb · floating left customizer w/ tab pills ·
// big hero preview · floating AI prompt at bottom · right metallic strip.
// Uses Navy Gold chrome accents (gold rule lines) on slate base.
//
// Window-exports: ThemeMakerV2

const v2I = (d, sz=16) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;
const I2 = {
  back: '<polyline points="15 18 9 12 15 6"/>',
  spark: '<path d="M12 3 13.6 8.4 19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/><path d="M19 16v3M21 17.5h-4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  layers: '<path d="m12 2 9 4.5-9 4.5L3 6.5z"/><path d="m3 11.5 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
};

const METAL_VARIANTS = [
  ["GOLD", "#D4AF37", "#FFD700", "#856D34"],
  ["SILVER", "#C0C0C0", "#E8E8E8", "#808080"],
  ["ROSE_GOLD", "#B76E79", "#E5BE8A", "#7D4A52"],
  ["BRONZE", "#CD7F32", "#D99952", "#6B4423"],
  ["COPPER", "#B87333", "#D49A63", "#6D421E"],
  ["PLATINUM", "#E5E4E2", "#FFFFFF", "#9C9A98"],
  ["TITANIUM", "#878681", "#BDBBB8", "#4A4A48"],
  ["CHROME", "#DBE2E9", "#FFFFFF", "#4A5C6E"],
  ["COBALT", "#3A6BD9", "#7FA5F0", "#1A3A8A"],
  ["GOLD_RB", "#D4AF37", "#FFD700", "#0A1630"],
];

const v2RolePairs = [
  ["primary", "#D4AF37", "onPrimary", "#0A1630"],
  ["secondary", "#4A90E2", "onSecondary", "#FFFFFF"],
  ["tertiary", "#9C8970", "onTertiary", "#FFFFFF"],
  ["surface", "#1A2645", "onSurface", "#E8E3D8"],
];

function ThemeMakerV2({ themeKey = "navy-gold", view = "dashboard", aiOpen = true }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--tm-bg)", color: "var(--tm-text)",
      fontFamily: "var(--kt-font-ui)",
      borderRadius: 10, overflow: "hidden", position: "relative",
      display: "grid", gridTemplateRows: "52px 1fr",
    }}>
      {/* Top toolbar */}
      <div style={{
        background: "var(--tm-bg-elev)", borderBottom: "1px solid var(--tm-border)",
        padding: "0 18px", display: "grid",
        gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display:"flex", alignItems:"center", color: "var(--tm-text-mute)" }}>{v2I(I2.back)}</div>
          <div style={{ width: 26, height: 26, borderRadius: 6, position: "relative", overflow: "hidden", background: "linear-gradient(135deg, #0A1630, #1A2645)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontWeight: 800, fontSize: 13, background:"linear-gradient(135deg,#856D34,#D4AF37 50%,#FFD700)", WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>Navy Gold</div>
            <div style={{ fontSize: 10, color: "var(--tm-text-mute)", fontFamily: "var(--kt-font-mono)" }}>navy-gold · v1.0.0</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", background: "var(--tm-bg-elev2)", borderRadius: 8, padding: 3, border: "1px solid var(--tm-border)", gap: 2 }}>
            {[
              ["Color", true],
              ["Metallic", false],
              ["Type", false],
              ["Shape", false],
              ["Effects", false],
            ].map(([l, on]) => (
              <button key={l} style={{
                padding: "6px 14px", fontSize: 12, fontWeight: 600,
                borderRadius: 6, border: "none", cursor: "pointer",
                background: on ? "var(--tm-bg)" : "transparent",
                color: on ? "var(--tm-text)" : "var(--tm-text-mute)",
                boxShadow: on ? "0 1px 2px rgba(0,0,0,.4)" : "none",
              }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button style={pillBtn}>{v2I(I2.history, 14)}</button>
          <button style={pillBtn}>{v2I(I2.copy, 14)} Duplicate</button>
          <button style={{ ...pillBtn, background: "linear-gradient(135deg,#D4AF37,#FFD700)", color: "#0A1630", border: "none", fontWeight: 700, position: "relative", overflow: "hidden" }}>
            {v2I(I2.download, 14)} Export
            <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.4,"--mb-sh":"#FFF8DC"}}></span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 240px", minHeight: 0, position: "relative" }}>
        {/* Left customizer panel */}
        <div style={{ borderRight: "1px solid var(--tm-border)", padding: 16, overflow: "auto", display: "flex", flexDirection: "column", gap: 16 }} className="km-noscroll">
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Color roles</div>
              <div style={{ fontSize: 10, color: "var(--tm-text-mute)", fontFamily: "var(--kt-font-mono)" }}>MD3 · 24 tokens</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {v2RolePairs.map(([n1, h1, n2, h2]) => (
                <div key={n1} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  <RoleSwatch name={n1} hex={h1} />
                  <RoleSwatch name={n2} hex={h2} muted />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Metallic studio</div>
            <div style={{
              padding: 12, borderRadius: 10,
              background: "linear-gradient(180deg, #1a2645 0%, #0a1630 100%)",
              border: "1px solid rgba(212,175,55,.35)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="km-metal" style={{ width: 56, height: 56, borderRadius: 8, position: "relative", overflow: "hidden", "--mb-b":"#D4AF37","--mb-h":"#FFD700","--mb-s":"#0A1630","--mb-sh":"#FFF8DC" }}>
                  <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.7,"--shimmer-speed":"3s"}}></span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--ng-on-surf)", letterSpacing: 1, textTransform: "uppercase" }}>Variant</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#FFD700", fontFamily: "var(--kt-font-mono)" }}>GOLD_RB</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, marginTop: 12 }}>
                {METAL_VARIANTS.map(([name, b, h, s], i) => (
                  <div key={name} title={name} style={{
                    aspectRatio: "1", borderRadius: 6, position: "relative", overflow: "hidden",
                    background: `linear-gradient(135deg, ${s} 0%, ${b} 50%, ${h} 100%)`,
                    boxShadow: i === 9 ? "0 0 0 2px #FFD700" : "0 0 0 1px rgba(255,255,255,.1)",
                  }}/>
                ))}
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ng-on-surf)", marginBottom: 4 }}>
                  <span>Intensity</span><span style={{ fontFamily: "var(--kt-font-mono)" }}>0.80</span>
                </div>
                <Slider value={0.8} accent="#FFD700" />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ng-on-surf)", margin: "10px 0 4px" }}>
                  <span>Shimmer speed</span><span style={{ fontFamily: "var(--kt-font-mono)" }}>3.0s</span>
                </div>
                <Slider value={0.5} accent="#FFD700" />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ng-on-surf)", margin: "10px 0 4px" }}>
                  <span>Angle</span><span style={{ fontFamily: "var(--kt-font-mono)" }}>135°</span>
                </div>
                <Slider value={0.375} accent="#FFD700" />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Shape & spacing</div>
            <div style={{ background: "var(--tm-bg-elev2)", borderRadius: 8, padding: 10, border: "1px solid var(--tm-border)" }}>
              <div style={{ fontSize: 10, color: "var(--tm-text-mute)", marginBottom: 6 }}>Density</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Compact", "Comfortable", "Spacious"].map((d, i) => (
                  <button key={d} style={{ flex: 1, ...pillBtn, padding: "6px 0", fontSize: 11, justifyContent: "center", ...(i === 1 ? { background: "var(--tm-accent-mu)", color: "var(--tm-accent)", borderColor: "var(--tm-accent)" } : {}) }}>{d}</button>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "var(--tm-text-mute)", margin: "10px 0 6px" }}>Corner</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["Sharp", "Rounded", "Pill"].map((d, i) => (
                  <button key={d} style={{ flex: 1, ...pillBtn, padding: "6px 0", fontSize: 11, justifyContent: "center", ...(i === 1 ? { background: "var(--tm-accent-mu)", color: "var(--tm-accent)", borderColor: "var(--tm-accent)" } : {}) }}>{d}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center preview */}
        <div style={{ padding: 22, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.4, color: "var(--tm-text-dim)" }}>Live preview</div>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, var(--tm-border), transparent)" }}/>
            <div style={{ display: "flex", gap: 4, background: "var(--tm-bg-elev2)", padding: 3, borderRadius: 7, border: "1px solid var(--tm-border)" }}>
              {[
                ["Dashboard", "dashboard"],
                ["Sampler", "sampler"],
                ["Mail", "mail"],
                ["Iconic", "iconic"],
              ].map(([l, k]) => (
                <button key={k} style={{
                  padding: "5px 10px", fontSize: 11, fontWeight: 600, borderRadius: 5,
                  border: "none", cursor: "pointer",
                  background: k === view ? "var(--tm-bg)" : "transparent",
                  color: k === view ? "var(--tm-text)" : "var(--tm-text-mute)",
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{
            flex: 1, minHeight: 0, borderRadius: 14, overflow: "hidden",
            boxShadow: "0 0 0 1px var(--tm-border), 0 24px 48px rgba(0,0,0,.4), 0 0 0 1px rgba(212,175,55,.18)",
          }}>
            <ThemedSurface theme={themeKey} view={view} />
          </div>

          {/* Floating AI prompt */}
          {aiOpen && (
            <div style={{
              position: "absolute", left: "50%", bottom: 22, transform: "translateX(-50%)",
              width: "min(640px, 85%)",
              background: "linear-gradient(135deg, rgba(26,38,69,.95), rgba(10,22,48,.95))",
              backdropFilter: "blur(12px) saturate(140%)",
              border: "1px solid rgba(212,175,55,.45)",
              borderRadius: 14, padding: 12,
              boxShadow: "0 12px 36px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#D4AF37,#FFD700)", color: "#0A1630" }}>
                  {v2I(I2.spark, 16)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "rgba(212,175,55,.85)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>AI Theme Generator</div>
                  <div style={{ fontSize: 13, color: "#E8E3D8", marginTop: 2 }}>
                    "A calm clinical palette with platinum accents for a healthcare dashboard…"
                  </div>
                </div>
                <button style={{
                  padding: "8px 14px", borderRadius: 8,
                  background: "linear-gradient(135deg,#D4AF37,#FFD700)",
                  color: "#0A1630", border: "none", fontWeight: 700, fontSize: 12,
                  display: "flex", alignItems: "center", gap: 6,
                  position: "relative", overflow: "hidden",
                }}>
                  <span style={{ position: "relative", zIndex: 2, display: "flex", gap: 6, alignItems: "center" }}>{v2I(I2.send, 14)} Generate</span>
                  <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.6,"--mb-sh":"#FFF8DC"}}></span>
                </button>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {["Cyberpunk dashboard", "Calm clinical app", "Retro arcade", "Editorial reading mode", "1990s metallic"].map(t => (
                  <span key={t} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,.06)", color: "#C9C4B9", border: "1px solid rgba(255,255,255,.12)" }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right strip — current theme summary */}
        <div style={{ borderLeft: "1px solid var(--tm-border)", padding: 14, overflow: "auto", display: "flex", flexDirection: "column", gap: 14 }} className="km-noscroll">
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 8 }}>Token export</div>
            <div style={{ background: "#0a0d14", border: "1px solid var(--tm-border)", borderRadius: 8, padding: 10, fontFamily: "var(--kt-font-mono)", fontSize: 10, color: "var(--tm-text-mute)", lineHeight: 1.6 }}>
              <div><span style={{color:"#C792EA"}}>--md-primary</span>: <span style={{color:"#FFD700"}}>#D4AF37</span>;</div>
              <div><span style={{color:"#C792EA"}}>--md-on-primary</span>: <span style={{color:"#82AAFF"}}>#0A1630</span>;</div>
              <div><span style={{color:"#C792EA"}}>--md-surface</span>: <span style={{color:"#82AAFF"}}>#1A2645</span>;</div>
              <div><span style={{color:"#C792EA"}}>--md-on-surface</span>: <span style={{color:"#FFCB6B"}}>#E8E3D8</span>;</div>
              <div style={{color:"var(--tm-text-dim)", marginTop: 4}}>… +20 more</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 8 }}>Contrast</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                ["primary/on", 11.8, true],
                ["surface/on", 13.2, true],
                ["secondary/on", 3.9, false],
                ["outline/surf", 2.1, false],
              ].map(([l, r, ok]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "5px 8px", borderRadius: 4, background: "var(--tm-bg-elev2)" }}>
                  <span style={{ color: "var(--tm-text-mute)", fontFamily: "var(--kt-font-mono)", fontSize: 10 }}>{l}</span>
                  <span style={{ fontFamily: "var(--kt-font-mono)", fontWeight: 700, color: ok ? "var(--tm-success)" : "var(--tm-warn)" }}>{r}:1</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 8 }}>Community</div>
            <div style={{ background: "var(--tm-bg-elev2)", borderRadius: 8, padding: 10, fontSize: 11, color: "var(--tm-text-mute)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: 999, background: "linear-gradient(135deg,#33d,#9bf)" }}/>
                <div>
                  <div style={{ color: "var(--tm-text)", fontSize: 12, fontWeight: 600 }}>Share to Bluesky</div>
                  <div>@ktheme · 412 likes this week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleSwatch({ name, hex, muted }) {
  return (
    <div style={{
      padding: 8, borderRadius: 6, background: hex,
      color: muted ? "rgba(0,0,0,.55)" : (hex === "#0A1630" || hex === "#FFFFFF" ? "#fff" : "#0A1630"),
      fontFamily: "var(--kt-font-mono)", fontSize: 10,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)",
      minHeight: 38, display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div style={{ fontSize: 9, opacity: 0.8 }}>{name}</div>
      <div style={{ fontWeight: 700 }}>{hex}</div>
    </div>
  );
}

function Slider({ value = 0.5, accent = "var(--tm-accent)" }) {
  return (
    <div style={{ height: 4, background: "rgba(255,255,255,.1)", borderRadius: 2, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${value*100}%`, background: accent, borderRadius: 2 }}/>
      <div style={{ position: "absolute", left: `calc(${value*100}% - 6px)`, top: -4, width: 12, height: 12, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.5)" }}/>
    </div>
  );
}

const pillBtn = {
  fontFamily: "var(--kt-font-ui)", fontSize: 12, fontWeight: 500,
  padding: "6px 10px", borderRadius: 6,
  background: "var(--tm-bg-elev2)", color: "var(--tm-text-mute)",
  border: "1px solid var(--tm-border)", cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 5,
};

window.ThemeMakerV2 = ThemeMakerV2;
