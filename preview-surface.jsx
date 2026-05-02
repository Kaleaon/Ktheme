// PreviewSurface.jsx — shared preview pane content for Theme Maker artboards.
// Renders one of: components-sampler / mini-dashboard / iconic-row / archetype.
// Consumes CSS vars from the parent .ng / .lcars / .metro / .aero scope.
//
// Exports to window: PreviewSurface, ThemedSurface (which sets the right vars).

const ICONS = {
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  spark: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>,
  bell: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  trend: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// A button rendered with the active scope's MD3 tokens.
function PvButton({ label, kind = "filled", metallic = false, mb }) {
  const base = {
    fontFamily: "var(--kt-font-ui)",
    fontSize: 13, fontWeight: 600, padding: "8px 14px",
    borderRadius: "var(--pv-radius, 8px)", border: "none", cursor: "pointer",
    letterSpacing: 0.1,
    transition: "transform .08s",
  };
  if (metallic) {
    return (
      <button className="km-metal" style={{
        ...base, ...mb,
        color: "var(--pv-on-metal, #1A1405)",
        boxShadow: "0 2px 6px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.4)",
        position: "relative", overflow: "hidden",
      }}>
        <span style={{ position: "relative", zIndex: 2 }}>{label}</span>
        <span className="km-shimmer-overlay" style={{ "--shimmer-intensity": 0.45 }}></span>
      </button>
    );
  }
  if (kind === "filled") return <button style={{ ...base, background: "var(--pv-primary)", color: "var(--pv-on-primary)" }}>{label}</button>;
  if (kind === "tonal")  return <button style={{ ...base, background: "var(--pv-primary-c)", color: "var(--pv-on-primary-c)" }}>{label}</button>;
  if (kind === "outline")return <button style={{ ...base, background: "transparent", color: "var(--pv-primary)", boxShadow: "inset 0 0 0 1px var(--pv-outline)" }}>{label}</button>;
  return <button style={{ ...base, background: "transparent", color: "var(--pv-primary)" }}>{label}</button>;
}

function PvChip({ label, on }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "var(--kt-font-ui)", fontSize: 11, fontWeight: 500,
      padding: "4px 10px", borderRadius: 999,
      background: on ? "var(--pv-primary-c)" : "transparent",
      color: on ? "var(--pv-on-primary-c)" : "var(--pv-on-surf-v)",
      boxShadow: on ? "none" : "inset 0 0 0 1px var(--pv-outline-v)",
    }}>{on && ICONS.check}{label}</span>
  );
}

function PvCard({ children, style }) {
  return (
    <div style={{
      background: "var(--pv-surface)", color: "var(--pv-on-surf)",
      borderRadius: "var(--pv-radius, 8px)",
      boxShadow: "var(--pv-elev, 0 2px 8px rgba(0,0,0,.25))",
      padding: 14, ...style,
    }}>{children}</div>
  );
}

// ── Sampler ── full-bleed components grid
function SamplerSurface() {
  return (
    <div style={{ padding: 18, color: "var(--pv-on-bg)", fontFamily: "var(--kt-font-ui)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--pv-on-surf-v)" }}>Components</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>Sampler</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <PvChip label="All" on />
          <PvChip label="Inputs" />
          <PvChip label="Display" />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <PvCard>
          <div style={{ fontSize: 11, color: "var(--pv-on-surf-v)", marginBottom: 8 }}>BUTTONS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <PvButton label="Filled" />
            <PvButton label="Tonal" kind="tonal" />
            <PvButton label="Outline" kind="outline" />
            <PvButton label="Text" kind="text" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <PvButton label="Metallic" metallic />
          </div>
        </PvCard>

        <PvCard>
          <div style={{ fontSize: 11, color: "var(--pv-on-surf-v)", marginBottom: 8 }}>CHIPS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <PvChip label="Selected" on />
            <PvChip label="Default" />
            <PvChip label="Filter" />
            <PvChip label="Tag" />
          </div>
          <div style={{ fontSize: 11, color: "var(--pv-on-surf-v)", marginTop: 14, marginBottom: 6 }}>INPUT</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: "var(--pv-radius, 8px)",
            background: "var(--pv-surface-v)", color: "var(--pv-on-surf-v)",
            boxShadow: "inset 0 0 0 1px var(--pv-outline-v)",
            fontSize: 12,
          }}>
            {ICONS.search}<span>Search components…</span>
          </div>
        </PvCard>

        <PvCard style={{ gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "var(--pv-on-surf-v)" }}>DATA TABLE</div>
            <div style={{ fontSize: 11, color: "var(--pv-primary)" }}>View all →</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr .8fr .6fr", gap: 0, fontSize: 12 }}>
            {["Theme", "Author", "Tags", "v"].map(h => (
              <div key={h} style={{ padding: "6px 8px", color: "var(--pv-on-surf-v)", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, borderBottom: "1px solid var(--pv-outline-v)" }}>{h}</div>
            ))}
            {[
              ["Navy Gold", "Ktheme", "metallic, dark", "1.0"],
              ["Frutiger Aero", "Ktheme", "glassy, nostalgia", "1.0"],
              ["LCARS", "Ktheme", "iconic, console", "1.0"],
            ].map((row, i) => row.map((c, j) => (
              <div key={`${i}-${j}`} style={{
                padding: "8px", borderBottom: "1px solid var(--pv-outline-v)",
                color: j === 0 ? "var(--pv-primary)" : "var(--pv-on-surf)",
                fontWeight: j === 0 ? 600 : 400,
              }}>{c}</div>
            )))}
          </div>
        </PvCard>
      </div>
    </div>
  );
}

// ── Mini dashboard ── KPI cards + chart
function DashboardSurface() {
  return (
    <div style={{ padding: 18, color: "var(--pv-on-bg)", fontFamily: "var(--kt-font-ui)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--pv-on-surf-v)" }}>Operations</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>Dashboard</div>
        </div>
        <PvButton label="+ New" metallic />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
        {[
          { l: "Active", v: "1,284", d: "+12.4%", ok: true },
          { l: "Revenue", v: "$48.2k", d: "+8.1%", ok: true },
          { l: "Errors", v: "0.4%", d: "-2.1%", ok: true },
        ].map(k => (
          <PvCard key={k.l}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "var(--pv-on-surf-v)" }}>{k.l}</div>
            <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, color: "var(--pv-primary)" }}>{k.v}</div>
            <div style={{ fontSize: 11, marginTop: 2, color: "var(--pv-tertiary, #79D87E)" }}>{k.d}</div>
          </PvCard>
        ))}
      </div>
      <PvCard>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Engagement · 30d</div>
          <div style={{ display: "flex", gap: 4 }}>
            <PvChip label="Day" />
            <PvChip label="Week" on />
            <PvChip label="Month" />
          </div>
        </div>
        <svg viewBox="0 0 320 100" style={{ width: "100%", height: 100 }}>
          <defs>
            <linearGradient id="pv-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--pv-primary)" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="var(--pv-primary)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,80 L20,72 L40,68 L60,55 L80,60 L100,42 L120,48 L140,30 L160,38 L180,22 L200,28 L220,18 L240,24 L260,12 L280,16 L300,8 L320,14 L320,100 L0,100 Z" fill="url(#pv-area)"/>
          <path d="M0,80 L20,72 L40,68 L60,55 L80,60 L100,42 L120,48 L140,30 L160,38 L180,22 L200,28 L220,18 L240,24 L260,12 L280,16 L300,8 L320,14"
            fill="none" stroke="var(--pv-primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </PvCard>
    </div>
  );
}

// ── Iconic row ── side-by-side LCARS / Metro / Aero panels
function IconicSurface() {
  return (
    <div style={{ padding: 16, fontFamily: "var(--kt-font-ui)" }}>
      <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", color: "var(--pv-on-surf-v)", marginBottom: 10 }}>Iconic format rules</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {/* LCARS */}
        <div style={{ background: "var(--lcars-bg)", borderRadius: 10, overflow: "hidden", color: "#F3E9FF", display: "grid", gridTemplateColumns: "60px 1fr", height: 200 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 6px" }}>
            <div style={{ background: "var(--lcars-orange)", color: "#1B0E24", padding: "6px 8px", borderTopLeftRadius: 24, borderBottomLeftRadius: 24, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>OPS</div>
            <div style={{ background: "var(--lcars-rose)", color: "#1B0E24", padding: "6px 8px", borderTopLeftRadius: 24, borderBottomLeftRadius: 24, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>NAV</div>
            <div style={{ background: "var(--lcars-violet)", color: "#1B0E24", padding: "6px 8px", borderTopLeftRadius: 24, borderBottomLeftRadius: 24, fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>SEC</div>
            <div style={{ flex: 1, background: "var(--lcars-orange)", borderTopLeftRadius: 24, borderBottomLeftRadius: 24, marginTop: 4 }}/>
          </div>
          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 16, background: "var(--lcars-orange)", borderRadius: 8 }}/>
            <div style={{ fontSize: 9, color: "var(--lcars-orange)", textTransform: "uppercase", letterSpacing: 1.6, marginTop: 4 }}>SECTOR · 47</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>STARDATE 47634.4</div>
            <div style={{ fontSize: 10, color: "rgba(243,233,255,.6)" }}>SYSTEMS NOMINAL</div>
          </div>
        </div>
        {/* Metro */}
        <div style={{ background: "var(--metro-bg)", borderRadius: 10, overflow: "hidden", padding: 10, height: 200, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 6 }}>
          <div style={{ background: "var(--metro-cyan)", color: "#00151F", padding: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "flex-end" }}>Mail<br/>4 new</div>
          <div style={{ background: "var(--metro-blue)", color: "#fff", padding: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "flex-end" }}>Calendar</div>
          <div style={{ background: "#005A9E", color: "#fff", padding: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "flex-end", gridColumn: "1 / -1" }}>People · 18 updates</div>
        </div>
        {/* Aero */}
        <div style={{ background: "linear-gradient(135deg, var(--aero-bg) 0%, #DAF0FF 58%, #BEEBFF 100%)", borderRadius: 14, padding: 12, height: 200, color: "var(--aero-ink)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 8, borderRadius: 10, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(8px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.8), 0 6px 18px rgba(0,80,140,.18)" }}/>
          <div style={{ position: "relative", padding: 6 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--aero-sky)", fontWeight: 700 }}>Aqua</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Today is sunny</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              <span style={{ padding: "3px 10px", borderRadius: 999, background: "linear-gradient(180deg,#9be6ff,#39B6F0)", color: "#022A40", fontSize: 10, fontWeight: 600, boxShadow: "inset 0 1px 0 rgba(255,255,255,.7)" }}>Open</span>
              <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(255,255,255,.6)", color: "#173A52", fontSize: 10, fontWeight: 600, boxShadow: "inset 0 1px 0 rgba(255,255,255,.9), inset 0 0 0 1px rgba(110,147,171,.4)" }}>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mail archetype
function MailSurface() {
  const items = [
    { from: "Aria Chen", subj: "Theme review for Aurora release", t: "9:42", on: true },
    { from: "Build bot", subj: "navy-gold@1.2.0 published to npm", t: "9:18" },
    { from: "Marin", subj: "LCARS rule cards — feedback?", t: "Tue" },
    { from: "Daichi", subj: "Contrast warnings: 3 to fix in Calm Clinical", t: "Mon" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", height: "100%", fontFamily: "var(--kt-font-ui)", color: "var(--pv-on-bg)" }}>
      <div style={{ borderRight: "1px solid var(--pv-outline-v)", padding: 12 }}>
        <PvButton label="Compose" metallic />
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 2, fontSize: 12 }}>
          {["Inbox · 12", "Starred", "Sent", "Drafts", "Archive"].map((s, i) => (
            <div key={s} style={{
              padding: "6px 10px", borderRadius: 6,
              background: i === 0 ? "var(--pv-primary-c)" : "transparent",
              color: i === 0 ? "var(--pv-on-primary-c)" : "var(--pv-on-surf-v)",
              fontWeight: i === 0 ? 600 : 400,
            }}>{s}</div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--pv-outline-v)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Inbox</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--pv-on-surf-v)" }}>{ICONS.search} Search</div>
        </div>
        {items.map((m, i) => (
          <div key={i} style={{
            padding: "10px 14px", borderBottom: "1px solid var(--pv-outline-v)",
            background: m.on ? "var(--pv-primary-c)" : "transparent",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 4,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: m.on ? "var(--pv-on-primary-c)" : "var(--pv-on-surf)" }}>{m.from}</div>
            <div style={{ fontSize: 11, color: m.on ? "var(--pv-on-primary-c)" : "var(--pv-on-surf-v)" }}>{m.t}</div>
            <div style={{ fontSize: 12, color: m.on ? "var(--pv-on-primary-c)" : "var(--pv-on-surf-v)", gridColumn: "1 / -1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.subj}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Themed surface — sets MD3 vars on a wrapper div based on selected theme.
const THEMES = {
  "navy-gold": {
    bg: "#0A1630", surface: "#1A2645", surfaceV: "#2A3655",
    onBg: "#E8E3D8", onSurf: "#E8E3D8", onSurfV: "#C9C4B9",
    primary: "#D4AF37", onPrimary: "#0A1630", primaryC: "#856D34", onPrimaryC: "#FFF8DC",
    tertiary: "#E5BE8A", outline: "#938F84", outlineV: "#44483E",
    radius: 6, elev: "0 4px 16px rgba(0,0,0,.45)",
  },
  "rose-gold": {
    bg: "#3D1F2B", surface: "#4D2F3B", surfaceV: "#5D3F4B",
    onBg: "#F5E5E8", onSurf: "#F5E5E8", onSurfV: "#E5D5D8",
    primary: "#B76E79", onPrimary: "#3D1F2B", primaryC: "#7D4A52", onPrimaryC: "#F5D5D8",
    tertiary: "#E5BE8A", outline: "#9E8A8E", outlineV: "#4E3A3E",
    radius: 10, elev: "0 4px 16px rgba(0,0,0,.35)",
  },
  "emerald-silver": {
    bg: "#0F2A1E", surface: "#163524", surfaceV: "#1F4530",
    onBg: "#E6F0EB", onSurf: "#E6F0EB", onSurfV: "#B8CFC1",
    primary: "#C0C0C0", onPrimary: "#0F2A1E", primaryC: "#3D6B52", onPrimaryC: "#E6F5EC",
    tertiary: "#79D87E", outline: "#7A9A88", outlineV: "#2A4D3A",
    radius: 8, elev: "0 4px 12px rgba(0,0,0,.4)",
  },
  "neo-noir-neon": {
    bg: "#090A10", surface: "#111420", surfaceV: "#1C2130",
    onBg: "#E7EAF7", onSurf: "#E7EAF7", onSurfV: "#B9C0D8",
    primary: "#A73CFF", onPrimary: "#140022", primaryC: "#4B1D73", onPrimaryC: "#E7CBFF",
    tertiary: "#FF3D9E", outline: "#6F7992", outlineV: "#363D52",
    radius: 4, elev: "0 0 16px rgba(167,60,255,.35), 0 4px 12px rgba(0,0,0,.6)",
  },
  "frutiger-aero": {
    bg: "#EAF7FF", surface: "#F7FCFF", surfaceV: "#DDF1FF",
    onBg: "#14344A", onSurf: "#173A52", onSurfV: "#34566E",
    primary: "#39B6F0", onPrimary: "#022A40", primaryC: "#A9E6FF", onPrimaryC: "#00314D",
    tertiary: "#79D87E", outline: "#6E93AB", outlineV: "#A9C7DA",
    radius: 18, elev: "0 8px 24px rgba(20,80,120,.18)",
  },
};

function ThemedSurface({ theme = "navy-gold", view = "sampler", style }) {
  const t = THEMES[theme] || THEMES["navy-gold"];
  const vars = {
    "--pv-bg": t.bg, "--pv-surface": t.surface, "--pv-surface-v": t.surfaceV,
    "--pv-on-bg": t.onBg, "--pv-on-surf": t.onSurf, "--pv-on-surf-v": t.onSurfV,
    "--pv-primary": t.primary, "--pv-on-primary": t.onPrimary,
    "--pv-primary-c": t.primaryC, "--pv-on-primary-c": t.onPrimaryC,
    "--pv-tertiary": t.tertiary, "--pv-outline": t.outline, "--pv-outline-v": t.outlineV,
    "--pv-radius": t.radius + "px", "--pv-elev": t.elev,
    // Metallic basis for in-preview metallic buttons
    "--mb-b": "var(--m-grb-b)", "--mb-h": "var(--m-grb-h)",
    "--mb-s": t.bg, "--mb-sh": "var(--m-grb-sh)",
    "--pv-on-metal": t.bg,
  };
  return (
    <div style={{
      ...vars, background: t.bg, color: t.onBg, height: "100%",
      overflow: "auto", borderRadius: 10,
      ...style,
    }} className="km-noscroll">
      {view === "sampler" && <SamplerSurface />}
      {view === "dashboard" && <DashboardSurface />}
      {view === "iconic" && <IconicSurface />}
      {view === "mail" && <MailSurface />}
    </div>
  );
}

window.ThemedSurface = ThemedSurface;
window.PvButton = PvButton;
window.PvChip = PvChip;
window.PvCard = PvCard;
window.PV_THEMES = THEMES;
window.PV_ICONS = ICONS;
