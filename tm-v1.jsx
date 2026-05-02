// ThemeMakerV1.jsx — Conservative variant.
// Material Theme Builder feel: 3-column layout (sidebar nav · customizer · preview).
// Indigo accent, neutral chrome, MD3-by-the-book.
//
// Window-exports: ThemeMakerV1

const v1Icon = (d, sz=16) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;
const I1 = {
  palette: '<circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12.5" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.5 1.5-1.5 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.7-1.6 1.6-1.6H16c2.7 0 5-2.3 5-5 0-5-4.5-9-9-9z"/>',
  sparkles: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
  ruler: '<path d="m21.3 8.7-9.6 9.6c-.4.4-1 .4-1.4 0L2.7 11c-.4-.4-.4-1 0-1.4L12.3.7"/><path d="m7.5 12.5 2 2"/><path d="m11 9 2 2"/><path d="m14.5 5.5 2 2"/>',
  metal: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/>',
  presets: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  warn: '<path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  bsky: '<path d="M6 2c2.5 1 4.5 3 6 6 1.5-3 3.5-5 6-6 3 0 4 2 4 5s-1 5-4 6c-1.5.4-3 .5-3 .5s1.5.5 3 1c2.5 1 4 3 4 6s-2 4-4 4c-2-1-4-3-6-7-2 4-4 6-6 7-2 0-4-1-4-4s1.5-5 4-6c1.5-.5 3-1 3-1s-1.5-.1-3-.5c-3-1-4-3-4-6s1-5 4-5z"/>',
};

const ROLES = [
  ["primary", "#D4AF37"], ["onPrimary", "#0A1630"],
  ["primaryContainer", "#856D34"], ["onPrimaryContainer", "#FFF8DC"],
  ["secondary", "#4A90E2"], ["onSecondary", "#FFFFFF"],
  ["secondaryContainer", "#2C5F9E"], ["onSecondaryContainer", "#E3F2FD"],
  ["tertiary", "#9C8970"], ["error", "#CF6679"],
  ["background", "#0A1630"], ["onBackground", "#E8E3D8"],
  ["surface", "#1A2645"], ["onSurface", "#E8E3D8"],
  ["surfaceVariant", "#2A3655"], ["outline", "#938F84"],
];

function NavItem({ icon, label, on }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 12px", borderRadius: 6, cursor: "pointer",
      background: on ? "var(--tm-accent-mu)" : "transparent",
      color: on ? "var(--tm-text)" : "var(--tm-text-mute)",
      fontSize: 13, fontWeight: on ? 600 : 500,
    }}>
      <span style={{ color: on ? "var(--tm-accent)" : "var(--tm-text-dim)" }}>{v1Icon(icon)}</span>
      {label}
    </div>
  );
}

function ColorRoleRow({ name, hex, warn }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "20px 1fr auto auto", alignItems: "center",
      gap: 10, padding: "7px 8px", borderRadius: 6,
      background: "var(--tm-bg-elev2)",
    }}>
      <div style={{ width: 16, height: 16, borderRadius: 4, background: hex, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08)" }}/>
      <div style={{ fontFamily: "var(--kt-font-mono)", fontSize: 11, color: "var(--tm-text)" }}>{name}</div>
      {warn && <span style={{ color: "var(--tm-warn)", display: "flex" }} title="Low contrast">{v1Icon(I1.warn, 12)}</span>}
      <div style={{ fontFamily: "var(--kt-font-mono)", fontSize: 11, color: "var(--tm-text-mute)" }}>{hex}</div>
    </div>
  );
}

function ThemeMakerV1({ themeKey = "navy-gold", view = "sampler", aiOpen = false }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--tm-bg)", color: "var(--tm-text)",
      fontFamily: "var(--kt-font-ui)",
      display: "grid", gridTemplateRows: "44px 1fr",
      borderRadius: 10, overflow: "hidden",
    }}>
      {/* Title bar */}
      <div style={{
        display: "grid", gridTemplateColumns: "220px 1fr auto",
        alignItems: "center",
        background: "var(--tm-bg-elev)", borderBottom: "1px solid var(--tm-border)",
        padding: "0 14px 0 14px", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg,#818cf8,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f1117", fontWeight: 800, fontSize: 12 }}>K</div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Ktheme</div>
          <div style={{ fontSize: 11, color: "var(--tm-text-dim)", marginLeft: 4 }}>Theme Maker</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, color: "var(--tm-text-mute)" }}>Editing</div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Navy Gold</div>
          <div style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "var(--tm-bg-elev2)", color: "var(--tm-text-mute)", fontFamily: "var(--kt-font-mono)" }}>v1.0.0 · draft</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={btn1Ghost}>{v1Icon(I1.share, 14)} Share</button>
          <button style={btn1Primary}>{v1Icon(I1.download, 14)} Export</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 320px 1fr 280px", height: "100%", minHeight: 0 }}>
        {/* Left rail */}
        <div style={{ background: "var(--tm-bg-elev)", borderRight: "1px solid var(--tm-border)", padding: 10, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", padding: "8px 10px 4px" }}>Workspace</div>
          <NavItem icon={I1.presets} label="Presets" />
          <NavItem icon={I1.palette} label="Customizer" on />
          <NavItem icon={I1.sparkles} label="AI Generate" />
          <NavItem icon={I1.bsky} label="Community" />
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", padding: "12px 10px 4px" }}>This theme</div>
          <NavItem icon={I1.palette} label="Color" on />
          <NavItem icon={I1.metal} label="Metallic" />
          <NavItem icon={I1.type} label="Typography" />
          <NavItem icon={I1.ruler} label="Shape & spacing" />
          <div style={{ marginTop: "auto", padding: 8, borderRadius: 6, background: "var(--tm-bg-elev2)", border: "1px solid var(--tm-border)", fontSize: 11, color: "var(--tm-text-mute)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--tm-success)" }}>{v1Icon(I1.check, 12)}<span style={{ color: "var(--tm-text)", fontWeight: 600 }}>Auto-saved</span></div>
            <div style={{ marginTop: 2 }}>2 contrast warnings to review</div>
          </div>
        </div>

        {/* Customizer */}
        <div style={{ borderRight: "1px solid var(--tm-border)", padding: 14, overflow: "auto" }} className="km-noscroll">
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 6 }}>Color · MD3 roles</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <button style={{ ...segBtn, ...segBtnOn }}>Dark</button>
            <button style={segBtn}>Light</button>
            <button style={{ ...segBtn, marginLeft: "auto", padding: "5px 10px", color: "var(--tm-accent)" }}>Generate</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {ROLES.map(([n, h], i) => <ColorRoleRow key={n} name={n} hex={h} warn={i === 4 || i === 14} />)}
          </div>

          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", margin: "16px 0 6px" }}>Metallic effect</div>
          <div style={{ background: "var(--tm-bg-elev2)", padding: 10, borderRadius: 6, border: "1px solid var(--tm-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div className="km-metal" style={{ width: 32, height: 32, borderRadius: 6, position: "relative", overflow: "hidden", "--mb-b":"var(--m-grb-b)","--mb-h":"var(--m-grb-h)","--mb-s":"var(--m-grb-s)","--mb-sh":"var(--m-grb-sh)" }}>
                <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.6}}></span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>GOLD_ROYAL_BLUE</div>
                <div style={{ fontSize: 10, color: "var(--tm-text-mute)" }}>10 variants</div>
              </div>
              <div style={{ position: "relative", width: 38, height: 20, borderRadius: 999, background: "var(--tm-accent)" }}>
                <div style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: 999, background: "#fff" }}/>
              </div>
            </div>
            <div style={{ fontSize: 10, color: "var(--tm-text-mute)", marginTop: 4 }}>Intensity</div>
            <div style={{ height: 4, background: "var(--tm-bg)", borderRadius: 2, marginTop: 4, position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "80%", background: "var(--tm-accent)", borderRadius: 2 }}/>
              <div style={{ position: "absolute", left: "78%", top: -4, width: 12, height: 12, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.5)" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--tm-text-dim)", marginTop: 2, fontFamily: "var(--kt-font-mono)" }}><span>0.0</span><span>0.80</span><span>1.0</span></div>
          </div>

          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", margin: "16px 0 6px" }}>Typography</div>
          <div style={{ background: "var(--tm-bg-elev2)", padding: 10, borderRadius: 6, border: "1px solid var(--tm-border)", fontSize: 12 }}>
            <div style={{ color: "var(--tm-text-mute)", fontSize: 10, marginBottom: 4 }}>Font family</div>
            <div style={{ padding: "6px 8px", background: "var(--tm-bg)", borderRadius: 4, fontFamily: "var(--kt-font-mono)", fontSize: 11 }}>system-ui, -apple-system, …</div>
          </div>
        </div>

        {/* Live preview */}
        <div style={{ padding: 18, background: "var(--tm-bg)", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)" }}>Live preview</div>
            <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
              {["Sampler", "Dashboard", "Mail", "Iconic"].map((s, i) => (
                <button key={s} style={{ ...segBtn, ...(i === 0 ? segBtnOn : {}) }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, borderRadius: 12, overflow: "hidden", boxShadow: "0 0 0 1px var(--tm-border)" }}>
            <ThemedSurface theme={themeKey} view={view} />
          </div>
        </div>

        {/* Right inspector */}
        <div style={{ background: "var(--tm-bg-elev)", borderLeft: "1px solid var(--tm-border)", padding: 14, overflow: "auto", display: "flex", flexDirection: "column", gap: 12 }} className="km-noscroll">
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 6 }}>Inspector · primary</div>
            <div style={{ height: 64, borderRadius: 6, background: "#D4AF37", display: "flex", alignItems: "flex-end", padding: 8 }}>
              <span style={{ fontFamily: "var(--kt-font-mono)", fontSize: 11, color: "#0A1630", fontWeight: 600 }}>#D4AF37</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginTop: 6, fontFamily: "var(--kt-font-mono)", fontSize: 10 }}>
              <div style={{ padding: 6, background: "var(--tm-bg-elev2)", borderRadius: 4 }}><div style={{color:"var(--tm-text-dim)"}}>H</div>46°</div>
              <div style={{ padding: 6, background: "var(--tm-bg-elev2)", borderRadius: 4 }}><div style={{color:"var(--tm-text-dim)"}}>S</div>65%</div>
              <div style={{ padding: 6, background: "var(--tm-bg-elev2)", borderRadius: 4 }}><div style={{color:"var(--tm-text-dim)"}}>L</div>53%</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 6 }}>Contrast · WCAG</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
              <ContrastRow a="primary" b="onPrimary" ratio="11.8" pass />
              <ContrastRow a="surface" b="onSurface" ratio="13.2" pass />
              <ContrastRow a="secondary" b="onSecondary" ratio="3.9" pass={false} />
              <ContrastRow a="outline" b="surface" ratio="2.1" pass={false} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--tm-text-dim)", marginBottom: 6 }}>Export targets</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
              {["CSS vars", "Tailwind", "Compose", "SwiftUI", "Flutter", "JSON"].map((t, i) => (
                <div key={t} style={{
                  padding: "6px 8px", borderRadius: 4,
                  background: i === 0 ? "var(--tm-accent-mu)" : "var(--tm-bg-elev2)",
                  color: i === 0 ? "var(--tm-accent)" : "var(--tm-text-mute)",
                  border: i === 0 ? "1px solid var(--tm-accent)" : "1px solid var(--tm-border)",
                }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContrastRow({ a, b, ratio, pass }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 6, alignItems: "center", fontSize: 11, padding: "5px 8px", borderRadius: 4, background: "var(--tm-bg-elev2)" }}>
      <span style={{ fontFamily: "var(--kt-font-mono)", fontSize: 10, color: "var(--tm-text-mute)" }}>{a}/{b}</span>
      <span style={{ fontFamily: "var(--kt-font-mono)", fontWeight: 600, color: pass ? "var(--tm-success)" : "var(--tm-warn)" }}>{ratio}:1</span>
      <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, background: pass ? "rgba(74,222,128,.15)" : "rgba(251,191,36,.18)", color: pass ? "var(--tm-success)" : "var(--tm-warn)" }}>{pass ? "AAA" : "FAIL"}</span>
    </div>
  );
}

const segBtn = {
  fontFamily: "var(--kt-font-ui)", fontSize: 11, fontWeight: 500,
  padding: "5px 10px", borderRadius: 5,
  background: "var(--tm-bg-elev2)", color: "var(--tm-text-mute)",
  border: "1px solid var(--tm-border)", cursor: "pointer",
  display: "flex", alignItems: "center", gap: 4,
};
const segBtnOn = { background: "var(--tm-accent-mu)", color: "var(--tm-accent)", borderColor: "var(--tm-accent)" };
const btn1Primary = { ...segBtn, background: "var(--tm-accent)", color: "#0f1117", borderColor: "var(--tm-accent)", fontWeight: 600 };
const btn1Ghost = { ...segBtn, background: "transparent" };

window.ThemeMakerV1 = ThemeMakerV1;
