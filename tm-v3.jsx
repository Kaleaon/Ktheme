// ThemeMakerV3.jsx — Bold, novel metallic-forward UI.
// Concept: theme as a living, spinning "metallic medallion" at center stage.
// Surrounding orbital controls (color rings, metallic dial, AI scrying glass).
// Preview is presented as a "card stack" you can flip through.
// Dark obsidian chrome with gold filigree.

const v3I = (d, sz=16) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:d}}/>;
const I3 = {
  spark: '<path d="M12 3 13.6 8.4 19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2.5-1.5-3.5C8 7 7.5 5 7.5 3 6 4 4.5 6 4.5 9c0 4 4 6 4 6s4-2 4-6c0-1-.5-2-1-3"/>',
};

function ThemeMakerV3({ themeKey = "navy-gold", view = "dashboard" }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(ellipse at center top, #1a1230 0%, #0a0a18 40%, #050308 100%)`,
      color: "#F3E8D0", fontFamily: "var(--kt-font-ui)",
      borderRadius: 10, overflow: "hidden", position: "relative",
    }}>
      {/* Filigree ambient noise */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(rgba(212,175,55,.6) 1px, transparent 1px)", backgroundSize: "4px 4px", pointerEvents: "none" }}/>

      {/* Top bar */}
      <div style={{
        position: "absolute", top: 14, left: 18, right: 18,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg,#856D34 0%,#D4AF37 50%,#FFD700 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(212,175,55,.5), inset 0 1px 0 rgba(255,255,255,.5)",
          }}>
            <span style={{ color: "#0A1630", fontWeight: 800, fontSize: 14 }}>K</span>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2.2, textTransform: "uppercase", color: "#D4AF37", fontWeight: 600 }}>Ktheme · Forge</div>
            <div style={{ fontSize: 10, color: "rgba(243,232,208,.5)", fontFamily: "var(--kt-font-mono)" }}>navy-gold · GOLD_RB · v1.0.0</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...v3Pill, background: "rgba(212,175,55,.08)", color: "#D4AF37", borderColor: "rgba(212,175,55,.3)" }}>{v3I(I3.flame, 14)} Cast as preset</button>
          <button style={{ ...v3Pill, background: "linear-gradient(135deg,#D4AF37,#FFD700)", color: "#0A1630", border: "none", fontWeight: 700, position: "relative", overflow: "hidden" }}>
            <span style={{position:"relative", zIndex:2, display:"flex", gap:6, alignItems:"center"}}>{v3I(I3.download, 14)} Forge & Export</span>
            <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.55,"--mb-sh":"#FFF8DC"}}></span>
          </button>
        </div>
      </div>

      {/* Body grid: left rings · center medallion · right preview stack */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr",
        height: "100%", paddingTop: 60, paddingBottom: 100,
        position: "relative",
      }}>
        {/* Left — color rings */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", gap: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(212,175,55,.7)" }}>Color rings</div>

          <ColorRing label="primary" size={150} stops={["#D4AF37", "#FFD700", "#856D34"]} value={0.18} hex="#D4AF37" />
          <ColorRing label="secondary" size={120} stops={["#4A90E2", "#7FB3F0", "#2C5F9E"]} value={0.55} hex="#4A90E2" />
          <ColorRing label="surface" size={100} stops={["#1A2645", "#0A1630", "#2A3655"]} value={0.32} hex="#1A2645" />
        </div>

        {/* Center — the medallion */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <Medallion />

          <div style={{ marginTop: 26, textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: 2.4, textTransform: "uppercase", color: "rgba(212,175,55,.7)" }}>Active variant</div>
            <div style={{
              fontSize: 28, fontWeight: 800, fontFamily: "var(--kt-font-mono)",
              background: "linear-gradient(135deg,#856D34 0%,#D4AF37 30%,#FFD700 50%,#FFF8DC 60%,#D4AF37 80%,#856D34 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              letterSpacing: 2, marginTop: 4,
            }}>GOLD_RB</div>
            <div style={{ fontSize: 11, color: "rgba(243,232,208,.5)", marginTop: 2 }}>Intensity 0.80 · Speed 3.0s · 135°</div>
          </div>
        </div>

        {/* Right — preview card stack */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", position: "relative" }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(212,175,55,.7)", marginBottom: 12 }}>Preview deck</div>

          <div style={{ position: "relative", height: 320 }}>
            {/* Back card */}
            <div style={{
              position: "absolute", top: 22, right: -10, width: "94%", height: "100%",
              borderRadius: 14, transform: "rotate(4deg)",
              background: "rgba(26,38,69,.6)", border: "1px solid rgba(212,175,55,.25)",
              boxShadow: "0 16px 40px rgba(0,0,0,.6)",
            }}/>
            <div style={{
              position: "absolute", top: 12, right: -4, width: "97%", height: "100%",
              borderRadius: 14, transform: "rotate(2deg)",
              background: "rgba(26,38,69,.8)", border: "1px solid rgba(212,175,55,.3)",
              boxShadow: "0 12px 30px rgba(0,0,0,.5)",
            }}/>
            {/* Front card */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: 14, overflow: "hidden",
              border: "1px solid rgba(212,175,55,.45)",
              boxShadow: "0 24px 48px rgba(0,0,0,.7), 0 0 0 1px rgba(255,248,220,.08) inset, 0 0 30px rgba(212,175,55,.2)",
            }}>
              <ThemedSurface theme={themeKey} view={view} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
            {["dashboard", "sampler", "mail", "iconic"].map((k, i) => (
              <span key={k} style={{
                width: i === 0 ? 24 : 8, height: 8, borderRadius: 4,
                background: i === 0 ? "#D4AF37" : "rgba(212,175,55,.3)",
                transition: "all .2s",
              }}/>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 10, fontSize: 10, color: "rgba(243,232,208,.5)", fontFamily: "var(--kt-font-mono)", letterSpacing: 1 }}>
            DASHBOARD · SAMPLER · MAIL · ICONIC
          </div>
        </div>
      </div>

      {/* Bottom — AI scrying glass / prompt */}
      <div style={{
        position: "absolute", left: 18, right: 18, bottom: 14,
        display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 14, alignItems: "center",
        padding: "12px 16px", borderRadius: 14,
        background: "linear-gradient(135deg, rgba(20,15,30,.92), rgba(10,8,18,.92))",
        border: "1px solid rgba(212,175,55,.4)",
        backdropFilter: "blur(14px) saturate(140%)",
        boxShadow: "0 0 0 1px rgba(255,255,255,.04) inset, 0 16px 36px rgba(0,0,0,.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "radial-gradient(circle at 30% 30%, #FFD700 0%, #D4AF37 50%, #856D34 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(212,175,55,.6), inset 0 2px 4px rgba(255,255,255,.5), inset 0 -2px 4px rgba(0,0,0,.3)",
            color: "#0A1630",
          }}>{v3I(I3.spark, 18)}</div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(212,175,55,.7)", letterSpacing: 1.6, textTransform: "uppercase" }}>Scrying glass</div>
            <div style={{ fontSize: 11, color: "rgba(243,232,208,.5)" }}>describe a feeling, mood, or product…</div>
          </div>
        </div>
        <div style={{
          padding: "10px 16px", borderRadius: 10,
          background: "rgba(212,175,55,.06)", border: "1px solid rgba(212,175,55,.2)",
          fontSize: 13, color: "#F3E8D0",
        }}>
          "art deco speakeasy, midnight + champagne metallic, geometric uppercase headers"
        </div>
        <button style={{
          padding: "10px 18px", borderRadius: 10,
          background: "linear-gradient(135deg,#D4AF37,#FFD700)", color: "#0A1630", border: "none",
          fontWeight: 700, fontSize: 12, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          position: "relative", overflow: "hidden",
        }}>
          <span style={{ position: "relative", zIndex: 2, display: "flex", gap: 6, alignItems: "center" }}>
            {v3I(I3.send, 14)} Conjure
          </span>
          <span className="km-shimmer-overlay" style={{"--shimmer-intensity":0.6,"--mb-sh":"#FFF8DC"}}></span>
        </button>
      </div>
    </div>
  );
}

// Animated central medallion
function Medallion() {
  const sz = 280;
  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%", position: "relative",
      background: "radial-gradient(circle at 35% 30%, #FFF8DC 0%, #FFD700 18%, #D4AF37 35%, #856D34 70%, #0A1630 100%)",
      boxShadow: `
        0 0 60px rgba(212,175,55,.5),
        0 0 120px rgba(212,175,55,.25),
        inset 0 4px 8px rgba(255,255,255,.4),
        inset 0 -8px 16px rgba(10,22,48,.6),
        inset 0 0 0 2px rgba(255,248,220,.3)
      `,
      overflow: "hidden",
    }}>
      {/* Spinning shimmer */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "conic-gradient(from 0deg, transparent 0deg, rgba(255,248,220,.6) 30deg, transparent 80deg, transparent 360deg)",
        animation: "km-spin 8s linear infinite",
        mixBlendMode: "overlay",
      }}/>

      {/* Concentric rings (filigree) */}
      <svg width={sz} height={sz} style={{ position: "absolute", inset: 0 }}>
        <circle cx={sz/2} cy={sz/2} r={sz/2 - 8} fill="none" stroke="rgba(255,248,220,.35)" strokeWidth="0.8" strokeDasharray="2 4"/>
        <circle cx={sz/2} cy={sz/2} r={sz/2 - 22} fill="none" stroke="rgba(255,248,220,.18)" strokeWidth="0.6"/>
        <circle cx={sz/2} cy={sz/2} r={sz/2 - 60} fill="none" stroke="rgba(10,22,48,.5)" strokeWidth="1"/>
        {/* tick marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = sz/2 - 4, r2 = sz/2 - 12;
          return (
            <line key={i}
              x1={sz/2 + Math.cos(a)*r1} y1={sz/2 + Math.sin(a)*r1}
              x2={sz/2 + Math.cos(a)*r2} y2={sz/2 + Math.sin(a)*r2}
              stroke="rgba(10,22,48,.5)" strokeWidth={i % 6 === 0 ? 2 : 1}/>
          );
        })}
      </svg>

      {/* Center K monogram */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #1A2645 0%, #0A1630 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,.6), inset 0 -2px 4px rgba(255,248,220,.1), 0 0 0 2px rgba(255,248,220,.4)",
        }}>
          <span style={{
            fontSize: 44, fontWeight: 900,
            background: "linear-gradient(135deg,#856D34 0%,#D4AF37 30%,#FFD700 50%,#FFF8DC 60%,#D4AF37 80%,#856D34 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            fontFamily: "Georgia, serif",
          }}>K</span>
        </div>
      </div>

      <style>{`@keyframes km-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ColorRing({ label, size = 120, stops = ["#D4AF37","#FFD700","#856D34"], value = 0.5, hex = "#D4AF37" }) {
  const r = size / 2 - 8;
  const cx = size / 2;
  const angle = value * Math.PI * 2 - Math.PI/2;
  const handleX = cx + Math.cos(angle) * r;
  const handleY = cx + Math.sin(angle) * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: `conic-gradient(from -90deg, ${stops[0]}, ${stops[1]}, ${stops[2]}, ${stops[0]})`,
          mask: "radial-gradient(circle, transparent 38%, #000 39%, #000 100%)",
          WebkitMask: "radial-gradient(circle, transparent 38%, #000 39%, #000 100%)",
          boxShadow: "0 0 0 1px rgba(212,175,55,.3), 0 0 20px rgba(212,175,55,.2)",
        }}/>
        {/* handle */}
        <div style={{
          position: "absolute", left: handleX - 8, top: handleY - 8,
          width: 16, height: 16, borderRadius: "50%", background: hex,
          boxShadow: "0 0 0 2px #fff, 0 2px 6px rgba(0,0,0,.7)",
        }}/>
        {/* center hex */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--kt-font-mono)", fontSize: size > 130 ? 13 : 11, color: hex, fontWeight: 700,
        }}>{hex}</div>
      </div>
      <div>
        <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(212,175,55,.65)", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 10, color: "rgba(243,232,208,.4)", fontFamily: "var(--kt-font-mono)" }}>HSL · drag to tune</div>
      </div>
    </div>
  );
}

const v3Pill = {
  fontFamily: "var(--kt-font-ui)", fontSize: 11, fontWeight: 600,
  padding: "7px 12px", borderRadius: 8,
  background: "rgba(255,255,255,.04)", color: "#F3E8D0",
  border: "1px solid rgba(255,255,255,.08)", cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
};

window.ThemeMakerV3 = ThemeMakerV3;
