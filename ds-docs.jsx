// DesignSystemDocs.jsx — four design-system reference cards.
// Window-exports: DSComponents, DSIconic, DSAccess, DSParity

const dsI = (d, sz=14) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;

// ─── Card chrome ───
function DSFrame({ title, subtitle, children, accent = "#D4AF37" }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(180deg, #14171f 0%, #0e1117 100%)",
      color: "#e8eaf2", fontFamily: "var(--kt-font-ui)",
      borderRadius: 10, overflow: "hidden",
      display: "grid", gridTemplateRows: "auto 1fr",
    }}>
      <div style={{
        padding: "20px 28px", borderBottom: "1px solid #262b3a",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(180deg, #1a1d28, #14171f)",
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2.4, textTransform: "uppercase", color: accent, fontWeight: 700 }}>Ktheme · Design System</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: "#8e94a8", marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--kt-font-mono)", fontSize: 11, color: "#5d6378" }}>
          <span style={{ padding: "3px 9px", borderRadius: 4, background: "#1d2230", color: "#a78bfa" }}>v0.4 · draft</span>
          <span>github.com/Kaleaon/Ktheme</span>
        </div>
      </div>
      <div style={{ overflow: "auto", padding: 28 }} className="km-noscroll">{children}</div>
    </div>
  );
}

// ─── Component library spec ───
function DSComponents() {
  return (
    <DSFrame title="Component library spec" subtitle="MD3-aligned primitives, with Ktheme metallic & adaptation hooks">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <SpecCard name="Button" desc="filled · tonal · outlined · text · metallic" tokens={["primary","onPrimary","primaryContainer","outline"]}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <FauxBtn kind="filled" label="Filled" />
            <FauxBtn kind="tonal" label="Tonal" />
            <FauxBtn kind="outline" label="Outlined" />
            <FauxBtn kind="text" label="Text" />
            <FauxBtn kind="metal" label="Metallic" />
          </div>
          <SpecRule>States: enabled · hover (state-layer 8%) · pressed (12%) · focused (focusRing) · disabled (38% on-)</SpecRule>
          <SpecRule>Shape inherits theme.adaptation.layout.cornerStyle (sharp/rounded/pill)</SpecRule>
        </SpecCard>

        <SpecCard name="Input" desc="filled · outlined" tokens={["surfaceVariant","outline","onSurfaceVariant","error"]}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <FauxInput label="Theme name" value="Navy Gold" />
            <FauxInput label="Tags" value="metallic, dark" outlined />
            <FauxInput label="ID" value="navy_gold" error="Use kebab-case (navy-gold)" />
          </div>
          <SpecRule>Validation: contrast against `surface` ≥ 3.0; show inline `error` color message</SpecRule>
        </SpecCard>

        <SpecCard name="Card / Panel" desc="flat · elevated · glass" tokens={["surface","outlineVariant","elevation"]}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <FauxCard label="flat" style={{ background: "#1a2645", boxShadow: "none" }}/>
            <FauxCard label="elevated" style={{ background: "#1a2645", boxShadow: "0 4px 14px rgba(0,0,0,.45)" }}/>
            <FauxCard label="glass" style={{ background: "rgba(255,255,255,.07)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.16)" }}/>
          </div>
          <SpecRule>panelStyle ∈ flat | elevated | glass — set per-theme; affects all cards</SpecRule>
        </SpecCard>

        <SpecCard name="Navigation" desc="rail · tabs · pivot · bottom" tokens={["primary","onPrimary","surface","onSurface"]}>
          <div style={{ display: "flex", gap: 6, padding: 8, background: "#1a2645", borderRadius: 6, fontSize: 11 }}>
            <span style={{ padding: "5px 10px", borderRadius: 4, background: "#D4AF37", color: "#0A1630", fontWeight: 700 }}>Color</span>
            <span style={{ padding: "5px 10px", color: "#C9C4B9" }}>Metal</span>
            <span style={{ padding: "5px 10px", color: "#C9C4B9" }}>Type</span>
            <span style={{ padding: "5px 10px", color: "#C9C4B9" }}>Shape</span>
          </div>
          <SpecRule>navigationStyle key drives layout — engine maps to platform-correct primitive</SpecRule>
        </SpecCard>

        <SpecCard name="Modal / Dialog" desc="centered · scrim · focus-trap" tokens={["scrim","surface","onSurface","outline"]}>
          <div style={{ position: "relative", height: 90, background: "#0A1630", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)" }}/>
            <div style={{ position: "absolute", left: "20%", right: "20%", top: 14, bottom: 14, background: "#1a2645", borderRadius: 6, padding: 8, fontSize: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}>Confirm export</div>
              <div style={{ color: "#C9C4B9", marginTop: 2 }}>Will overwrite the existing tokens.css</div>
            </div>
          </div>
          <SpecRule>scrim is always #000000 — opacity from theme.effects.shadows.color</SpecRule>
        </SpecCard>

        <SpecCard name="Chip / Tag" desc="assist · filter · input · suggestion" tokens={["primaryContainer","onPrimaryContainer","outlineVariant"]}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["metallic","elegant","dark","glassy","nostalgia"].map(t => (
              <span key={t} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#856D34", color: "#FFF8DC" }}>{t}</span>
            ))}
            <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, color: "#D4AF37", border: "1px solid #44483E" }}>+ tag</span>
          </div>
          <SpecRule>cornerStyle pill = always 999px regardless of theme — chips are fixed-shape</SpecRule>
        </SpecCard>
      </div>
    </DSFrame>
  );
}

function SpecCard({ name, desc, tokens, children }) {
  return (
    <div style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
          <div style={{ fontSize: 11, color: "#8e94a8" }}>{desc}</div>
        </div>
      </div>
      {children}
      <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px dashed #262b3a", display: "flex", flexWrap: "wrap", gap: 4 }}>
        {tokens.map(t => (
          <span key={t} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "#1d2230", color: "#a78bfa", fontFamily: "var(--kt-font-mono)" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
function SpecRule({ children }) {
  return <div style={{ fontSize: 11, color: "#8e94a8", lineHeight: 1.55 }}>· {children}</div>;
}

function FauxBtn({ kind, label }) {
  const base = { fontSize: 11, padding: "6px 12px", borderRadius: 6, fontWeight: 600, border: "none", fontFamily: "var(--kt-font-ui)" };
  if (kind === "filled") return <span style={{ ...base, background: "#D4AF37", color: "#0A1630" }}>{label}</span>;
  if (kind === "tonal")  return <span style={{ ...base, background: "#856D34", color: "#FFF8DC" }}>{label}</span>;
  if (kind === "outline")return <span style={{ ...base, background: "transparent", color: "#D4AF37", boxShadow: "inset 0 0 0 1px #938F84" }}>{label}</span>;
  if (kind === "text")   return <span style={{ ...base, background: "transparent", color: "#D4AF37" }}>{label}</span>;
  if (kind === "metal")  return (
    <span className="km-metal" style={{ ...base, position: "relative", overflow: "hidden", color: "#0A1630", "--mb-b":"#D4AF37","--mb-h":"#FFD700","--mb-s":"#856D34","--mb-sh":"#FFF8DC", boxShadow:"0 1px 3px rgba(0,0,0,.4)" }}>
      <span style={{ position: "relative", zIndex: 2 }}>{label}</span>
      <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.5}}></span>
    </span>
  );
}

function FauxInput({ label, value, outlined, error }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "#8e94a8", marginBottom: 2 }}>{label}</div>
      <div style={{
        padding: "6px 10px", borderRadius: 4, fontSize: 11,
        background: outlined ? "transparent" : "#1d2230",
        border: outlined ? "1px solid #44483E" : "none",
        color: "#e8eaf2",
      }}>{value}</div>
      {error && <div style={{ fontSize: 10, color: "#f87171", marginTop: 2 }}>! {error}</div>}
    </div>
  );
}
function FauxCard({ label, style }) {
  return (
    <div style={{ borderRadius: 6, height: 60, padding: 8, color: "#E8E3D8", fontSize: 10, ...style }}>{label}</div>
  );
}

// ─── Iconic theme rule cards ───
function DSIconic() {
  const rules = [
    {
      name: "LCARS", colors: ["#F2A65A", "#A485F7", "#C5678D", "#120C1C"],
      keep: "Rail/sweep geometry · centered rail labels · pill borders · UPPERCASE",
      vary: "Palette by era (TNG warm, DS9 cool, VOY desaturated)",
      sample: <LCARSSample />,
    },
    {
      name: "Frutiger Aero", colors: ["#39B6F0", "#79D87E", "#DAF0FF", "#EAF7FF"],
      keep: "Glass blur ≥ 12px · sky-water gradient · glossy pill buttons",
      vary: "Underlying scene (sky / forest / grass / underwater)",
      sample: <AeroSample />,
    },
    {
      name: "Windows Phone Metro", colors: ["#00AEEF", "#0078D7", "#001A33", "#002448"],
      keep: "Sharp 0px corners · UPPERCASE tile labels · grid-row 92px tiles · pivot nav",
      vary: "Accent hue (single saturated color per app)",
      sample: <MetroSample />,
    },
    {
      name: "Art Deco", colors: ["#D4AF37", "#F4E7CF", "#0B0A0A", "#141314"],
      keep: "Geometric symmetry · stepped motifs · letter-spacing 0.35 · 1px gold rule at 45% α",
      vary: "Density of geometric ornament",
      sample: <DecoSample />,
    },
    {
      name: "Art Nouveau", colors: ["#8B6F47", "#C9A86A", "#2C3E2D", "#F4ECD8"],
      keep: "Curvilinear borders · floral asymmetry · serif display · earthy palette",
      vary: "Botanical motif (lily, peacock, iris)",
      sample: <NouveauSample />,
    },
    {
      name: "Neo-Noir Neon", colors: ["#A73CFF", "#00D1FF", "#FF3D9E", "#090A10"],
      keep: "Constrained neon (≤ 2 accents per surface) · cinematic dark base · glow only on active",
      vary: "Primary neon (violet / cyan / pink)",
      sample: <NoirSample />,
    },
  ];

  return (
    <DSFrame title="Iconic theme rule cards" subtitle="What stays constant, what varies — when adding new themes to the iconic family" accent="#A485F7">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {rules.map(r => (
          <div key={r.name} style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 10, padding: 14, display: "grid", gridTemplateColumns: "1fr 110px", gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.4 }}>{r.name}</div>
              <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                {r.colors.map(c => <div key={c} style={{ width: 14, height: 14, borderRadius: 3, background: c, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)" }}/>)}
              </div>
              <div style={{ marginTop: 10, fontSize: 10, lineHeight: 1.55 }}>
                <div><span style={{color:"#4ade80", fontWeight:700, letterSpacing:1}}>KEEP</span> <span style={{color:"#C9C4B9"}}>{r.keep}</span></div>
                <div style={{marginTop: 4}}><span style={{color:"#fbbf24", fontWeight:700, letterSpacing:1}}>VARY</span> <span style={{color:"#C9C4B9"}}>{r.vary}</span></div>
              </div>
            </div>
            <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)" }}>{r.sample}</div>
          </div>
        ))}
      </div>
    </DSFrame>
  );
}

function LCARSSample() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#120C1C", display: "grid", gridTemplateColumns: "30px 1fr", padding: 4, gap: 3 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ background: "#F2A65A", borderTopLeftRadius: 12, borderBottomLeftRadius: 12, height: 18 }}/>
        <div style={{ background: "#C5678D", borderTopLeftRadius: 12, borderBottomLeftRadius: 12, height: 18 }}/>
        <div style={{ background: "#A485F7", borderTopLeftRadius: 12, borderBottomLeftRadius: 12, flex: 1 }}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, padding: 4 }}>
        <div style={{ background: "#F2A65A", height: 8, borderRadius: 4 }}/>
        <div style={{ fontSize: 7, color: "#F2A65A", letterSpacing: 1 }}>STARDATE</div>
        <div style={{ fontSize: 9, color: "#F3E9FF", fontWeight: 700 }}>47634.4</div>
      </div>
    </div>
  );
}
function AeroSample() {
  return (
    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#EAF7FF,#BEEBFF)", padding: 6, position: "relative" }}>
      <div style={{ position: "absolute", inset: 6, borderRadius: 6, background: "rgba(255,255,255,.55)", border: "1px solid rgba(110,147,171,.4)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.9)" }}/>
      <div style={{ position: "relative", padding: 4 }}>
        <div style={{ fontSize: 7, color: "#39B6F0", fontWeight: 700, letterSpacing: 0.6 }}>AQUA</div>
        <div style={{ fontSize: 9, color: "#173A52", fontWeight: 600 }}>Sunny</div>
      </div>
    </div>
  );
}
function MetroSample() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#001A33", padding: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
      <div style={{ background: "#00AEEF", color: "#00151F", padding: 4, fontSize: 7, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, display: "flex", alignItems: "flex-end" }}>Mail</div>
      <div style={{ background: "#0078D7", color: "#fff", padding: 4, fontSize: 7, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, display: "flex", alignItems: "flex-end" }}>Cal</div>
      <div style={{ background: "#005A9E", color: "#fff", padding: 4, fontSize: 7, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6, gridColumn: "1 / -1", display: "flex", alignItems: "flex-end" }}>People</div>
    </div>
  );
}
function DecoSample() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#0B0A0A", padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ height: 1, background: "rgba(212,175,55,.45)" }}/>
      <div style={{ fontSize: 7, color: "#D4AF37", letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 600 }}>Salon</div>
      <div style={{ fontSize: 13, color: "#F4E7CF", fontWeight: 800, fontFamily: "Georgia, serif", letterSpacing: 1 }}>JAZZ</div>
      <div style={{ height: 1, background: "rgba(212,175,55,.45)", marginTop: "auto" }}/>
      <div style={{ height: 1, background: "rgba(212,175,55,.25)" }}/>
    </div>
  );
}
function NouveauSample() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#F4ECD8", padding: 4, position: "relative", overflow: "hidden" }}>
      <svg viewBox="0 0 100 80" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M0,40 Q25,20 50,40 T100,40" fill="none" stroke="#8B6F47" strokeWidth="1.2"/>
        <path d="M0,55 Q25,35 50,55 T100,55" fill="none" stroke="#C9A86A" strokeWidth="1"/>
        <circle cx="22" cy="32" r="3" fill="#2C3E2D"/>
        <circle cx="78" cy="48" r="2" fill="#2C3E2D"/>
      </svg>
      <div style={{ position: "relative", fontSize: 11, color: "#2C3E2D", fontFamily: "Georgia, serif", fontStyle: "italic" }}>Nouveau</div>
    </div>
  );
}
function NoirSample() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#090A10", padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 7, color: "#A73CFF", letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 700 }}>Sector</div>
      <div style={{ fontSize: 12, color: "#E7EAF7", fontWeight: 800, textShadow: "0 0 8px rgba(167,60,255,.7)" }}>0X42</div>
      <div style={{ marginTop: "auto", display: "flex", gap: 2 }}>
        <div style={{ width: 14, height: 3, background: "#A73CFF", boxShadow: "0 0 6px #A73CFF" }}/>
        <div style={{ width: 14, height: 3, background: "#00D1FF", boxShadow: "0 0 6px #00D1FF" }}/>
        <div style={{ width: 14, height: 3, background: "#FF3D9E" }}/>
      </div>
    </div>
  );
}

// ─── Accessibility / contrast tooling spec ───
function DSAccess() {
  const wcag = [
    { name: "primary / onPrimary", a: "#D4AF37", b: "#0A1630", ratio: 11.81, big: false },
    { name: "secondary / onSecondary", a: "#4A90E2", b: "#FFFFFF", ratio: 3.91, big: false },
    { name: "surface / onSurface", a: "#1A2645", b: "#E8E3D8", ratio: 13.21, big: false },
    { name: "outline / surface", a: "#938F84", b: "#1A2645", ratio: 4.63, big: false },
    { name: "outlineVariant / surface", a: "#44483E", b: "#1A2645", ratio: 1.44, big: true },
    { name: "error / surface", a: "#CF6679", b: "#1A2645", ratio: 4.91, big: false },
  ];

  return (
    <DSFrame title="Accessibility & contrast tooling" subtitle="WCAG 2.2 + APCA — what the engine must enforce, warn, and let through" accent="#4ade80">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 22 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: "#e8eaf2" }}>Token-pair contrast matrix</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {wcag.map(r => {
              const passAA = r.ratio >= 4.5 || (r.big && r.ratio >= 3);
              const passAAA = r.ratio >= 7;
              const passUI = r.ratio >= 3;
              return (
                <div key={r.name} style={{
                  display: "grid", gridTemplateColumns: "1.4fr auto auto auto auto",
                  gap: 8, alignItems: "center",
                  padding: "8px 12px", background: "#16191f", border: "1px solid #262b3a", borderRadius: 6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex" }}>
                      <div style={{ width: 14, height: 14, background: r.a, borderTopLeftRadius: 3, borderBottomLeftRadius: 3 }}/>
                      <div style={{ width: 14, height: 14, background: r.b, borderTopRightRadius: 3, borderBottomRightRadius: 3 }}/>
                    </div>
                    <span style={{ fontFamily: "var(--kt-font-mono)", fontSize: 10, color: "#c9c4b9" }}>{r.name}</span>
                  </div>
                  <span style={{ fontFamily: "var(--kt-font-mono)", fontSize: 11, fontWeight: 700, color: passAA ? "#4ade80" : "#f87171" }}>{r.ratio.toFixed(2)}:1</span>
                  <Badge ok={passAA} label="AA" />
                  <Badge ok={passAAA} label="AAA" />
                  <Badge ok={passUI} label="UI 3:1" />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 18, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Validator pipeline</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              ["1. Pair extraction", "every (X / onX) and (outline / surface*) pair from the colorScheme"],
              ["2. Compute", "WCAG 2.2 relative luminance + APCA Lc (silver+ for body)"],
              ["3. Classify", "ERROR < 3 · WARN 3-4.5 · OK ≥ 4.5 · BEST ≥ 7"],
              ["4. Mark", "stamp each role with __contrast: { wcag, apca, level }"],
              ["5. Surface", "inline icons in customizer + summary in inspector + blockable export"],
            ].map(([t, d]) => (
              <div key={t} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12, padding: "8px 0", borderBottom: "1px dashed #262b3a" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>{t}</div>
                <div style={{ fontSize: 11, color: "#c9c4b9" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Warning UI patterns</div>
          <div style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#8e94a8", marginBottom: 6 }}>1 · Inline next to role</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "#1d2230", borderRadius: 4, fontFamily: "var(--kt-font-mono)", fontSize: 11 }}>
              <div style={{ width: 14, height: 14, background: "#4A90E2", borderRadius: 3 }}/>
              <span style={{ flex: 1 }}>secondary</span>
              <span style={{ color: "#fbbf24", fontSize: 10 }}>! 3.9:1 below AA</span>
            </div>

            <div style={{ fontSize: 11, color: "#8e94a8", margin: "16px 0 6px" }}>2 · Summary banner</div>
            <div style={{ padding: 10, borderRadius: 6, background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.4)", fontSize: 11, color: "#fbbf24" }}>
              <strong>2 contrast issues</strong> — secondary/onSecondary, outlineVariant/surface
            </div>

            <div style={{ fontSize: 11, color: "#8e94a8", margin: "16px 0 6px" }}>3 · Export gate (configurable)</div>
            <div style={{ display: "flex", gap: 6, fontSize: 11 }}>
              <span style={{ padding: "5px 10px", borderRadius: 4, background: "#1d2230", color: "#8e94a8" }}>Allow with warning</span>
              <span style={{ padding: "5px 10px", borderRadius: 4, background: "rgba(248,113,113,.15)", color: "#f87171", border: "1px solid #f87171" }}>Block AA fails</span>
              <span style={{ padding: "5px 10px", borderRadius: 4, background: "#1d2230", color: "#8e94a8" }}>Force AAA</span>
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Auto-fix suggestions</div>
          <div style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 8, padding: 14, fontSize: 11, color: "#c9c4b9", lineHeight: 1.7 }}>
            For each failing pair, the engine proposes the nearest <strong style={{color:"#a78bfa"}}>onColor</strong> in the same hue family that lands at WCAG ≥ 4.5. Suggestions are <strong>never auto-applied</strong> — they appear as a one-click "Fix" chip the author can accept.
          </div>

          <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Motion accessibility</div>
          <div style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 8, padding: 14, fontSize: 11, color: "#c9c4b9", lineHeight: 1.7 }}>
            Shimmer + ripple + slideIn auto-disable under <code style={{color:"#a78bfa", fontFamily:"var(--kt-font-mono)"}}>prefers-reduced-motion</code>. Shadow elevation is preserved. Engine emits <code style={{color:"#a78bfa", fontFamily:"var(--kt-font-mono)"}}>@media</code> guards in every export target.
          </div>
        </div>
      </div>
    </DSFrame>
  );
}

function Badge({ ok, label }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 0.4,
      padding: "2px 7px", borderRadius: 3,
      background: ok ? "rgba(74,222,128,.16)" : "rgba(248,113,113,.16)",
      color: ok ? "#4ade80" : "#f87171",
    }}>{label}</span>
  );
}

// ─── Cross-platform parity matrix ───
function DSParity() {
  const features = [
    ["MD3 color roles (24)",        "✓", "✓", "✓", "✓", "✓"],
    ["Metallic gradient (10 var.)", "✓", "✓", "✓", "✓", "~"],
    ["Shimmer animation",           "✓", "✓", "✓", "✓", "✗"],
    ["Glassmorphism / blur",        "✓", "✓", "✓", "✓", "~"],
    ["Glow effect",                 "✓", "✓", "✓", "✓", "✓"],
    ["Adaptation: density",         "✓", "✓", "✓", "✓", "✓"],
    ["Adaptation: cornerStyle",     "✓", "✓", "✓", "✓", "✓"],
    ["Adaptation: panelStyle",      "✓", "✓", "✓", "✓", "✓"],
    ["Adaptation: navigationStyle", "✓", "✓", "✓", "✓", "✓"],
    ["Component overrides",         "✓", "✓", "~", "~", "~"],
    ["Icon family swap",            "✓", "✓", "✓", "✓", "✓"],
    ["State layers (hover/press)",  "✓", "✓", "✓", "✓", "~"],
    ["Reduced-motion guard",        "✓", "✓", "✓", "✓", "n/a"],
    ["Hot-swap at runtime",         "✓", "~", "~", "~", "n/a"],
    ["Live theme preview",          "✓", "✓", "~", "~", "✗"],
    ["Live shimmer perf budget",    "60fps","60fps","60fps","60fps","static"],
  ];

  const platforms = [
    { name: "Web · CSS vars", icon: "</>", note: "engine target" },
    { name: "Tailwind plugin", icon: "TW", note: "v3 + v4" },
    { name: "Android · Compose", icon: "▼", note: "kotlin-plugin" },
    { name: "iOS · SwiftUI", icon: "", note: "Swift Package" },
    { name: "Flutter", icon: "F", note: "Dart package" },
  ];

  return (
    <DSFrame title="Cross-platform parity matrix" subtitle="What ships on each runtime · ~ = partial · ✗ = unsupported" accent="#4A90E2">
      <div style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr repeat(5, 1fr)", borderBottom: "1px solid #262b3a", background: "#1a1d28" }}>
          <div style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8e94a8" }}>Feature</div>
          {platforms.map(p => (
            <div key={p.name} style={{ padding: "12px 14px", borderLeft: "1px solid #262b3a" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 22, height: 22, borderRadius: 5, background: "#1d2230", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", fontSize: 10, fontWeight: 800, fontFamily: "var(--kt-font-mono)" }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 9, color: "#5d6378", fontFamily: "var(--kt-font-mono)" }}>{p.note}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {features.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr repeat(5, 1fr)", borderBottom: "1px solid #262b3a", background: i % 2 ? "transparent" : "rgba(255,255,255,.015)" }}>
            <div style={{ padding: "10px 16px", fontSize: 12, color: "#e8eaf2" }}>{row[0]}</div>
            {row.slice(1).map((cell, j) => (
              <div key={j} style={{ padding: "10px 14px", borderLeft: "1px solid #262b3a", fontFamily: "var(--kt-font-mono)", fontSize: 11, fontWeight: 700,
                color: cell === "✓" ? "#4ade80" : cell === "~" ? "#fbbf24" : cell === "✗" ? "#f87171" : "#8e94a8",
              }}>{cell}</div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <PolicyCard color="#4ade80" label="Hard parity" desc="Color roles, density, cornerStyle, glow, icon family — ship simultaneously across all 5 targets. New themes block release if any platform regresses."/>
        <PolicyCard color="#fbbf24" label="Soft parity" desc="Shimmer, blur, component overrides — best-effort. Documented per-platform fallbacks; engine emits a static gradient where animation isn't free."/>
        <PolicyCard color="#a78bfa" label="Native primacy" desc="Each target uses its native motion system (CSS keyframes / Compose Animation / SwiftUI .animation / Flutter AnimationController). Tokens drive timing; runtime owns interpolation."/>
      </div>
    </DSFrame>
  );
}

function PolicyCard({ color, label, desc }) {
  return (
    <div style={{ background: "#16191f", border: "1px solid #262b3a", borderRadius: 8, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: color }}/>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>{label}</div>
      </div>
      <div style={{ fontSize: 11, color: "#c9c4b9", marginTop: 8, lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

window.DSComponents = DSComponents;
window.DSIconic = DSIconic;
window.DSAccess = DSAccess;
window.DSParity = DSParity;
