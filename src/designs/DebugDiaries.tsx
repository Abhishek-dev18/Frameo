// Debug Diaries — four visual directions for the channel, shown as stills.
// Each design renders one "beat" of the same sample episode: hook, explain, end card.
// Render: npx remotion still src/index.ts DD-<Design>-<beat> out.png
import React from "react";
import {AbsoluteFill} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/kalam/400.css";
import "@fontsource/kalam/700.css";

export type Beat = "hook" | "explain" | "end";
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";
const HAND = "Kalam, cursive";
const DISPLAY: React.CSSProperties = {fontFamily: SANS, fontWeight: 900, fontStretch: "70%", textTransform: "uppercase", lineHeight: 0.9};

const EP = {n: "01", title: "The token that died too early", handle: "@debugdiaries.io"};

// ===================== A · Diary page =====================
const paper = "#F3E9D2";
const ink = "#1E2A44";
const red = "#C8372D";
export const Diary: React.FC<{beat: Beat}> = ({beat}) => (
  <AbsoluteFill style={{background: paper, fontFamily: HAND, color: ink}}>
    {/* ruled lines + margin */}
    <AbsoluteFill style={{backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 78px, rgba(30,42,68,.16) 78px 80px)", backgroundPosition: "0 40px"}} />
    <div style={{position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(200,55,45,.5)"}} />
    {/* header */}
    <div style={{position: "absolute", left: 160, right: 70, top: 120, display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
      <span style={{fontSize: 44, fontWeight: 700}}>Debug Diaries</span>
      <span style={{fontSize: 36, color: red}}>Entry #{EP.n}</span>
    </div>
    {beat === "hook" ? (
      <div style={{position: "absolute", left: 160, right: 90, top: 330}}>
        <div style={{fontSize: 52, color: "#6B7387"}}>Tuesday, 3:12 AM</div>
        <div style={{fontSize: 118, fontWeight: 700, lineHeight: 1.05, marginTop: 30}}>
          Users keep getting <span style={{background: "linear-gradient(transparent 55%, #FFE066 55%)"}}>logged out.</span>
        </div>
        <div style={{fontSize: 64, marginTop: 50, lineHeight: 1.25}}>Every 10 minutes. 10,412 of them. Nobody knows why.</div>
        <div style={{position: "absolute", right: 0, top: 720, transform: "rotate(-8deg)", border: `6px solid ${red}`, color: red, padding: "10px 28px", fontFamily: SANS, fontWeight: 900, fontSize: 54, letterSpacing: "0.06em", borderRadius: 12}}>BUG</div>
      </div>
    ) : beat === "explain" ? (
      <div style={{position: "absolute", left: 160, right: 90, top: 300}}>
        <div style={{fontSize: 74, fontWeight: 700, lineHeight: 1.1}}>Found it. Look at this line:</div>
        <div style={{marginTop: 50, background: "#FFF4A8", padding: "40px 40px", transform: "rotate(-1.5deg)", boxShadow: "0 18px 30px rgba(0,0,0,.18)", fontFamily: MONO, fontSize: 42, lineHeight: 1.6}}>
          <div style={{color: "#6B7387"}}>// session.js</div>
          <div>if (token.exp &lt; <span style={{border: `5px solid ${red}`, borderRadius: 40, padding: "0 10px"}}>Date.now()</span>)</div>
          <div>&nbsp;&nbsp;logout();</div>
        </div>
        <div style={{fontSize: 62, marginTop: 70, lineHeight: 1.3}}>
          <b>exp</b> is in <u>seconds</u>.<br />
          <b>Date.now()</b> is in <u>milliseconds</u>.
        </div>
        <div style={{fontSize: 62, marginTop: 30, color: red}}>→ multiply by 1000. That's it.</div>
      </div>
    ) : (
      <div style={{position: "absolute", left: 160, right: 90, top: 380}}>
        <div style={{fontSize: 60, color: "#6B7387"}}>Lesson learned:</div>
        <div style={{fontSize: 130, fontWeight: 700, lineHeight: 1.02, marginTop: 20}}>Always check your units.</div>
        <div style={{display: "inline-block", marginTop: 70, transform: "rotate(-6deg)", border: `7px solid #2E8B57`, color: "#2E8B57", padding: "8px 30px", fontFamily: SANS, fontWeight: 900, fontSize: 70, letterSpacing: "0.08em", borderRadius: 14}}>SOLVED</div>
        <div style={{fontSize: 56, marginTop: 120}}>Next entry: <b>the cache that lied.</b></div>
        <div style={{fontSize: 48, marginTop: 20, color: red}}>Follow {EP.handle}</div>
      </div>
    )}
  </AbsoluteFill>
);

// ===================== B · Terminal log (themeable) =====================
export type TermTheme = {bg: string; win: string; bar: string; line: string; text: string; strong: string; dim: string; ok: string; warn: string; err: string; accent: string; glow: string};
export const TERM_THEMES: Record<string, TermTheme> = {
  // soft pastel on deep indigo (Catppuccin-like)
  mocha: {bg: "#1E1E2E", win: "#181825", bar: "#11111B", line: "#313244", text: "#BAC2DE", strong: "#CDD6F4", dim: "#7F849C", ok: "#A6E3A1", warn: "#FAB387", err: "#F38BA8", accent: "#CBA6F7", glow: "rgba(203,166,247,.16)"},
  // night blue with neon blue/purple (Tokyo Night-like)
  tokyo: {bg: "#1A1B26", win: "#16161E", bar: "#13131A", line: "#292E42", text: "#A9B1D6", strong: "#C0CAF5", dim: "#565F89", ok: "#9ECE6A", warn: "#E0AF68", err: "#F7768E", accent: "#7AA2F7", glow: "rgba(122,162,247,.18)"},
  // warm dark with coral/amber (sunset)
  sunset: {bg: "#1C1517", win: "#161012", bar: "#120D0F", line: "#3A2A2E", text: "#D9C7C2", strong: "#FFF1EC", dim: "#8E7A76", ok: "#8BD5A8", warn: "#FFC46B", err: "#FF7A85", accent: "#FF8A5B", glow: "rgba(255,138,91,.16)"},
};
const Win: React.FC<{t: TermTheme; title: string; children: React.ReactNode}> = ({t, title, children}) => (
  <div style={{background: t.win, border: `2px solid ${t.line}`, borderRadius: 24, overflow: "hidden", boxShadow: `0 30px 80px rgba(0,0,0,.35), 0 0 0 1px ${t.glow}`}}>
    <div style={{display: "flex", alignItems: "center", gap: 12, padding: "18px 24px", borderBottom: `2px solid ${t.line}`, background: t.bar}}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{width: 18, height: 18, borderRadius: 9, background: c}} />)}
      <span style={{marginLeft: 16, fontFamily: MONO, fontSize: 24, color: t.dim}}>{title}</span>
    </div>
    <div style={{padding: "28px 30px", fontFamily: MONO, fontSize: 32, lineHeight: 1.65, color: t.text}}>{children}</div>
  </div>
);
export const Terminal: React.FC<{beat: Beat; theme?: string}> = ({beat, theme = "mocha"}) => {
  const t = TERM_THEMES[theme];
  const ts = (x: string) => <span style={{color: t.dim}}>[{x}]</span>;
  return (
    <AbsoluteFill style={{background: t.bg, color: t.text, fontFamily: MONO}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 700px at 85% 8%, ${t.glow}, transparent 65%), radial-gradient(700px 600px at 0% 100%, ${t.glow}, transparent 60%)`}} />
      <div style={{position: "absolute", left: 70, right: 70, top: 110, display: "flex", justifyContent: "space-between", fontSize: 30, color: t.dim}}>
        <span><span style={{color: t.accent}}>~</span>/debug-diaries</span>
        <span>entry_{EP.n}.log</span>
      </div>
      {beat === "hook" ? (
        <div style={{position: "absolute", left: 70, right: 70, top: 260}}>
          <Win t={t} title="prod — auth-service">
            <div>{ts("03:12:41")} <span style={{color: t.warn}}>WARN</span> session expired uid=8812</div>
            <div>{ts("03:12:41")} <span style={{color: t.warn}}>WARN</span> session expired uid=8813</div>
            <div>{ts("03:12:42")} <span style={{color: t.err}}>ERROR</span> 10,412 users logged out</div>
            <div>{ts("03:12:42")} <span style={{color: t.err}}>ERROR</span> token lifetime: 0.6s ??</div>
          </Win>
          <div style={{fontWeight: 700, fontSize: 96, lineHeight: 1.1, color: t.strong, marginTop: 90}}>
            Tokens dying in<br /><span style={{color: t.err}}>0.6 seconds.</span>
          </div>
          <div style={{fontSize: 44, marginTop: 40, color: t.accent}}>$ why_<span style={{background: t.accent, color: t.bg}}> </span></div>
        </div>
      ) : beat === "explain" ? (
        <div style={{position: "absolute", left: 70, right: 70, top: 260}}>
          <div style={{fontSize: 40, color: t.dim, marginBottom: 24}}><span style={{color: t.accent}}>$</span> git diff session.js</div>
          <Win t={t} title="session.js">
            <div style={{background: `${t.err}22`, color: t.err, margin: "0 -30px", padding: "0 30px"}}>- if (token.exp &lt; Date.now())</div>
            <div style={{background: `${t.ok}22`, color: t.ok, margin: "0 -30px", padding: "0 30px"}}>+ if (token.exp * 1000 &lt; Date.now())</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;logout();</div>
          </Win>
          <div style={{marginTop: 70, display: "grid", gap: 26}}>
            {[
              ["exp", "seconds", "1735689600"],
              ["Date.now()", "milliseconds", "1735689600000"],
            ].map(([k, u, v]) => (
              <div key={k} style={{border: `2px solid ${t.line}`, borderRadius: 20, padding: "24px 28px", background: t.win}}>
                <div style={{fontSize: 44, color: t.strong, fontWeight: 700}}>{k} <span style={{color: t.warn}}>→ {u}</span></div>
                <div style={{fontSize: 34, color: t.dim, marginTop: 6}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize: 52, fontWeight: 700, color: t.strong, marginTop: 60}}><span style={{color: t.accent}}>1000×</span> off. That's the bug.</div>
        </div>
      ) : (
        <div style={{position: "absolute", left: 70, right: 70, top: 300}}>
          <div style={{fontSize: 40, color: t.dim}}><span style={{color: t.accent}}>$</span> git commit -m</div>
          <div style={{fontSize: 46, color: t.strong, marginTop: 10}}>"fix: exp is in seconds"</div>
          <div style={{fontSize: 40, color: t.ok, marginTop: 20}}>✓ deployed · 0 logouts since</div>
          <div style={{fontWeight: 700, fontSize: 108, color: t.strong, marginTop: 150, lineHeight: 1}}>
            debug<span style={{color: t.accent}}>_</span>diaries
          </div>
          <div style={{fontSize: 40, color: t.dim, marginTop: 30}}>// lesson: always check your units</div>
          <div style={{fontSize: 40, color: t.warn, marginTop: 90}}>next: entry_02 — the cache that lied</div>
          <div style={{fontSize: 40, color: t.accent, marginTop: 16}}>follow {EP.handle}</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===================== C · Anime night =====================
const navy = "linear-gradient(175deg, #0A0F2A 0%, #1A1446 55%, #2A1240 100%)";
const cyan = "#5BE1FF";
const pink = "#FF4F8B";
const City: React.FC = () => (
  <div style={{position: "absolute", left: 0, right: 0, bottom: 520, height: 420, display: "flex", alignItems: "flex-end", gap: 8, padding: "0 10px"}}>
    {[220, 340, 180, 400, 260, 300, 150, 360, 240, 320, 200].map((h, i) => (
      <div key={i} style={{flex: 1, height: h, background: "#0B0A22", position: "relative"}}>
        {Array.from({length: Math.floor(h / 60)}).map((_, j) => (
          <div key={j} style={{position: "absolute", left: "30%", top: 24 + j * 52, width: 14, height: 18, background: (i + j) % 3 ? "rgba(255,220,140,.5)" : "transparent"}} />
        ))}
      </div>
    ))}
  </div>
);
export const Anime: React.FC<{beat: Beat}> = ({beat}) => (
  <AbsoluteFill style={{background: navy, fontFamily: SANS, color: "#fff"}}>
    {/* letterbox */}
    <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 210, background: "#000"}} />
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 420, background: "#000"}} />
    <div style={{position: "absolute", left: 60, top: 120, fontFamily: MONO, fontSize: 26, letterSpacing: "0.18em", color: "#8A86B8"}}>DEBUG DIARIES · 第{Number(EP.n)}話</div>
    {beat === "hook" ? (
      <>
        <div style={{position: "absolute", right: 140, top: 320, width: 190, height: 190, borderRadius: 95, background: "radial-gradient(circle at 40% 40%, #FFF6E0, #F3D8A0)", boxShadow: "0 0 120px 40px rgba(255,230,180,.25)"}} />
        <City />
        {/* speed lines */}
        <AbsoluteFill style={{background: "repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,79,139,.0) 0deg 6deg, rgba(255,79,139,.18) 6deg 7deg)", maskImage: "radial-gradient(circle at 50% 45%, transparent 30%, black 70%)", WebkitMaskImage: "radial-gradient(circle at 50% 45%, transparent 30%, black 70%)"}} />
        <div style={{position: "absolute", left: 60, right: 60, top: 560, textAlign: "center", ...DISPLAY, fontSize: 210, color: pink, textShadow: "8px 8px 0 #000", transform: "rotate(-4deg)"}}>LOGGED<br />OUT?!</div>
        <div style={{position: "absolute", left: 60, right: 60, bottom: 230, textAlign: "center", fontSize: 46, fontWeight: 700, lineHeight: 1.3}}>
          <span style={{color: "#FFD15C"}}>KAI</span> 3:12 AM. Ten thousand users. Again.
        </div>
      </>
    ) : beat === "explain" ? (
      <>
        <div style={{position: "absolute", left: 70, right: 70, top: 300, border: `3px solid ${cyan}`, borderRadius: 26, background: "rgba(91,225,255,.08)", boxShadow: `0 0 60px rgba(91,225,255,.35)`, padding: "36px 36px", fontFamily: MONO, fontSize: 38, lineHeight: 1.7, color: "#DDF8FF"}}>
          <div style={{color: cyan, fontSize: 26, letterSpacing: "0.16em", marginBottom: 10}}>BYTE · SCANNING session.js</div>
          <div>if (token.exp &lt; Date.now())</div>
          <div style={{color: pink}}>&nbsp;&nbsp;↑ seconds &nbsp;&nbsp;↑ milliseconds</div>
        </div>
        <div style={{position: "absolute", left: "50%", top: 820, width: 260, height: 260, marginLeft: -130, borderRadius: 130, border: `8px solid ${cyan}`, boxShadow: `0 0 80px ${cyan}`, display: "grid", placeItems: "center"}}>
          <div style={{width: 90, height: 90, borderRadius: 45, background: cyan}} />
        </div>
        <div style={{position: "absolute", left: 60, right: 60, top: 1160, textAlign: "center", ...DISPLAY, fontSize: 120, color: "#fff", textShadow: `0 0 30px ${cyan}`}}>×1000</div>
        <div style={{position: "absolute", left: 60, right: 60, bottom: 230, textAlign: "center", fontSize: 46, fontWeight: 700, lineHeight: 1.3}}>
          <span style={{color: cyan}}>BYTE</span> Found it. Seconds versus milliseconds.
        </div>
      </>
    ) : (
      <>
        <City />
        <div style={{position: "absolute", left: 60, right: 60, top: 400, textAlign: "center"}}>
          <div style={{fontFamily: MONO, fontSize: 32, letterSpacing: "0.3em", color: "#8A86B8"}}>EPISODE {EP.n}</div>
          <div style={{...DISPLAY, fontSize: 190, marginTop: 30, textShadow: "6px 6px 0 #000"}}>DEBUG<br /><span style={{color: pink}}>DIARIES</span></div>
          <div style={{fontSize: 46, marginTop: 40, color: "#C9C5F0"}}>{EP.title}</div>
        </div>
        <div style={{position: "absolute", left: 60, right: 60, bottom: 230, textAlign: "center", fontSize: 44, fontWeight: 700}}>
          Next: <span style={{color: "#FFD15C"}}>The cache that lied</span> · {EP.handle}
        </div>
      </>
    )}
  </AbsoluteFill>
);

// ===================== D · Clean cards =====================
const lime = "#C6F432";
const card = "#161922";
const Steps: React.FC<{at: number}> = ({at}) => (
  <div style={{display: "flex", gap: 14}}>
    {["BUG", "CAUSE", "FIX"].map((s, i) => (
      <div key={s} style={{flex: 1, height: 64, borderRadius: 32, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 24, fontWeight: 700, letterSpacing: "0.1em", background: i === at ? lime : i < at ? "rgba(198,244,50,.18)" : card, color: i === at ? "#0E1104" : i < at ? lime : "#5E6577", border: `2px solid ${i <= at ? lime : "#262B37"}`}}>
        0{i + 1} {s}
      </div>
    ))}
  </div>
);
export const Cards: React.FC<{beat: Beat}> = ({beat}) => (
  <AbsoluteFill style={{background: "#0C0E13", fontFamily: SANS, color: "#F2F4F8"}}>
    <AbsoluteFill style={{background: "radial-gradient(900px 700px at 80% 10%, rgba(198,244,50,.10), transparent 60%)"}} />
    <div style={{position: "absolute", left: 70, right: 70, top: 120, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <span style={{...DISPLAY, fontSize: 46}}>Debug<span style={{color: lime}}>Diaries</span></span>
      <span style={{fontFamily: MONO, fontSize: 26, color: "#8B93A7"}}>ENTRY #{EP.n}</span>
    </div>
    <div style={{position: "absolute", left: 70, right: 70, top: 230}}>
      <Steps at={beat === "hook" ? 0 : beat === "explain" ? 1 : 2} />
    </div>
    {beat === "hook" ? (
      <div style={{position: "absolute", left: 70, right: 70, top: 400}}>
        <div style={{...DISPLAY, fontSize: 150}}>Users logged out every <span style={{color: lime}}>10 min</span></div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 70}}>
          {[["10,412", "users affected"], ["0.6s", "token lifetime"]].map(([n, l]) => (
            <div key={l} style={{background: card, border: "2px solid #262B37", borderRadius: 28, padding: "34px 30px"}}>
              <div style={{...DISPLAY, fontSize: 96, color: lime}}>{n}</div>
              <div style={{fontSize: 34, color: "#8B93A7", marginTop: 10}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize: 44, color: "#C3C9D6", marginTop: 50}}>The fix was one character. Can you spot it?</div>
      </div>
    ) : beat === "explain" ? (
      <div style={{position: "absolute", left: 70, right: 70, top: 400}}>
        <div style={{...DISPLAY, fontSize: 110}}>Two clocks, two units</div>
        <div style={{display: "grid", gap: 20, marginTop: 50}}>
          {[["token.exp", "seconds", "1735689600", "#8B93A7"], ["Date.now()", "milliseconds", "1735689600000", lime]].map(([k, u, v, c]) => (
            <div key={k} style={{background: card, border: "2px solid #262B37", borderRadius: 28, padding: "30px 32px", display: "flex", alignItems: "center", gap: 24}}>
              <div style={{flex: 1}}>
                <div style={{fontFamily: MONO, fontSize: 42, fontWeight: 700}}>{k}</div>
                <div style={{fontFamily: MONO, fontSize: 30, color: "#8B93A7", marginTop: 8}}>{v}</div>
              </div>
              <div style={{fontSize: 34, fontWeight: 800, color: c as string, border: `2px solid ${c}`, borderRadius: 999, padding: "10px 22px"}}>{u}</div>
            </div>
          ))}
        </div>
        <div style={{background: lime, color: "#0E1104", borderRadius: 28, padding: "30px 32px", marginTop: 30, fontFamily: MONO, fontSize: 38, fontWeight: 700}}>
          token.exp * 1000 &lt; Date.now()
        </div>
      </div>
    ) : (
      <div style={{position: "absolute", left: 70, right: 70, top: 420}}>
        <div style={{fontFamily: MONO, fontSize: 30, color: lime, letterSpacing: "0.12em"}}>TAKEAWAY</div>
        <div style={{...DISPLAY, fontSize: 160, marginTop: 20}}>Check your <span style={{color: lime}}>units.</span></div>
        <div style={{background: card, border: "2px solid #262B37", borderRadius: 28, padding: "34px 32px", marginTop: 80}}>
          <div style={{fontSize: 30, color: "#8B93A7"}}>NEXT ENTRY</div>
          <div style={{fontSize: 52, fontWeight: 800, marginTop: 8}}>The cache that lied</div>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 20, marginTop: 50}}>
          <div style={{background: lime, color: "#0E1104", borderRadius: 999, padding: "18px 34px", fontSize: 38, fontWeight: 800}}>Follow</div>
          <div style={{fontFamily: MONO, fontSize: 38}}>{EP.handle}</div>
        </div>
      </div>
    )}
  </AbsoluteFill>
);

export const DESIGNS = {Diary, Terminal, Anime, Cards};
