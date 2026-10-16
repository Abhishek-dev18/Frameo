// Debug Diaries · Entry 007 "One .unwrap() took down 20% of the internet" — Cloudflare, 18 Nov 2025.
// Facts (Cloudflare post-mortem): a ClickHouse permission change made a query return duplicate rows → the Bot
// Management feature file doubled → it exceeded the proxy's 200-feature limit → Rust code called .unwrap() on the
// Err → panic → 5xx across Cloudflare's network (ChatGPT, X, Spotify, Discord…).
// Every scene is a 3D card that flips in and out (Card3D) with the coral wipe.
// Timed to the Hinglish Sarvam voice played at 1.08× (content/debug-diaries/007/voice-fast.wav). Cue times below are
// in the ORIGINAL voice.wav seconds and converted with T().
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Backdrop, Hud, Section, Slam, Card, Cut, Card3D} from "./cine";

const SPEED = 1.08;
const T = (s: number) => Math.round((s / SPEED) * 30);

export const S2 = T(8.9);
export const S3 = T(17.86);
export const S4 = T(27.2);
export const S5 = T(33.75);
export const E7_TOTAL = T(40.41) + 9;

// ---------- scene 1: the internet goes down ----------
const APPS: [string, number][] = [["ChatGPT", T(0.3)], ["X", T(1.18)], ["Spotify", T(1.69)], ["Discord", T(2.5)]];
const GLOBE = Array.from({length: 420}, (_, i) => {
  const y = 1 - (i / 419) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = i * 2.399963;
  return {p: [Math.cos(th) * r, y, Math.sin(th) * r] as [number, number, number], dark: ((i * 7919) % 100) < 20};
});
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ay = f * 0.012, ax = -0.35;
  const dark = out(f, T(3.83), T(6.4));
  const pts = GLOBE.map((g) => {
    let [x, y, z] = g.p;
    let c = Math.cos(ay), s = Math.sin(ay);
    [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(ax); s = Math.sin(ax);
    [y, z] = [y * c - z * s, y * s + z * c];
    const k = 3.2 / (z + 3.2);
    return {x: 540 + x * 200 * k, y: 1110 + y * 200 * k, z, k, dark: g.dark};
  }).sort((a, b) => b.z - a.z);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 268}}>
        <Slam at={-30} size={86}>One line of code</Slam>
        <Slam at={-30} size={86} color={C.bug} style={{marginTop: 8}}>broke the internet.</Slam>
      </div>
      {/* app status cards flip from 200 to 500 */}
      <div style={{position: "absolute", left: 64, right: 150, top: 520, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        {APPS.map(([name, at]) => {
          const flip = interpolate(f, [at, at + 10], [0, 180], {...clamp, easing: Easing.inOut(Easing.cubic)});
          const back = flip > 90;
          return (
            <div key={name} style={{height: 150, perspective: 900}}>
              <div style={{position: "relative", width: "100%", height: "100%", transform: `rotateX(${flip}deg)`, transformStyle: "preserve-3d"}}>
                <div style={{position: "absolute", inset: 0, borderRadius: 20, background: C.card, border: `2.5px solid ${C.line}`, padding: "20px 22px", backfaceVisibility: "hidden"}}>
                  <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, color: C.text}}>{name}</div>
                  <div style={{fontFamily: MONO, fontSize: 24, color: C.g, marginTop: 10}}>● 200 OK</div>
                </div>
                <div style={{position: "absolute", inset: 0, borderRadius: 20, background: "#2A1D1B", border: `2.5px solid ${C.bug}`, padding: "20px 22px", transform: "rotateX(180deg)", backfaceVisibility: "hidden", opacity: back ? 1 : 0}}>
                  <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, color: C.text}}>{name}</div>
                  <div style={{fontFamily: MONO, fontSize: 24, color: C.bug, marginTop: 10}}>✕ 500 · server error</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* 3D globe: ~20% of the internet goes dark */}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4 * p.k} fill={p.dark && dark > 0 ? C.bug : C.g} opacity={(p.dark ? 0.5 + dark * 0.5 : 0.55) * Math.min(1, 0.3 + p.k * 0.6)} />
        ))}
      </svg>
      <div style={{position: "absolute", left: 64, right: 150, top: 1330, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: out(f, T(3.83), T(4.2))}}>
        <span style={{fontFamily: MONO, fontSize: 24, color: C.dim}}>18 NOV 2025 · CLOUDFLARE</span>
        <span style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 80, color: C.bug}}>{Math.round(20 * dark)}%</span>
      </div>
      <div style={{position: "absolute", right: 150, top: 1415, fontFamily: MONO, fontSize: 22, color: C.dim, opacity: out(f, T(4.5), T(5))}}>of internet traffic, stuck</div>
      {f > T(7.4) ? (
        <div style={{position: "absolute", left: 64, top: 1470}}>
          <Slam at={T(7.59)} size={110} color={C.bug} style={{fontFamily: MONO, textTransform: "none", fontWeight: 700}}>.unwrap()</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- scene 2: permission change → duplicate rows → file doubles ----------
const ROWS = ["bot_score", "ja3_hash", "ua_entropy", "tls_order"];
const What: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const feats = Math.round(interpolate(f, [L(14.9), L(17.0)], [60, 200], {...clamp, easing: Easing.in(Easing.quad)}));
  const over = f >= L(17.0);
  const fileH = interpolate(f, [L(14.9), L(17.0)], [170, 380], {...clamp, easing: Easing.in(Easing.quad)}) + (over ? 40 : 0);
  return (
    <AbsoluteFill>
      <Section text="02 / WHAT HAPPENED" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(9.99)} size={78}>One permission change.</Slam>
      </div>
      <Card title="clickhouse · permissions" tag={f > L(11) ? "CHANGED" : "DB"} tagColor={f > L(11) ? C.bug : C.dim} style={{top: 440}}>
        <span style={{color: C.dim}}>{typed("-- query: list bot features", f, L(9.99), 70)}</span>
        {"\n"}
        <span style={{color: C.g}}>{typed("+ now also sees db r0.*", f, L(10.6), 60)}</span>
      </Card>
      {/* 3D table: rows come back twice */}
      <div style={{position: "absolute", left: 64, top: 660, width: 470, height: 520, perspective: 1000}}>
        <div style={{transform: "rotateX(22deg) rotateY(14deg)", transformOrigin: "50% 0%", borderRadius: 20, background: C.card, border: `2.5px solid ${C.line}`, overflow: "hidden", boxShadow: "30px 40px 60px rgba(0,0,0,.45)"}}>
          <div style={{padding: "12px 18px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 21, color: C.dim}}>query result</div>
          {[...ROWS.map((r) => [r, false] as const), ...ROWS.map((r) => [r, true] as const)].map(([r, dup], i) => {
            const at = dup ? L(12.46) + (i - 4) * 7 : L(9.0);
            return (
              <div key={i} style={{display: "flex", justifyContent: "space-between", padding: "9px 18px", fontFamily: MONO, fontSize: 23, borderTop: i ? `1px solid ${C.line}` : "none", color: dup ? C.bug : C.text, background: dup ? `${C.bug}14` : "transparent", opacity: out(f, at, at + 6), transform: `translateX(${(1 - out(f, at, at + 6)) * -40}px)`}}>
                <span>{r}</span>
                <span style={{color: dup ? C.bug : C.dim}}>{dup ? "×2 dup" : "ok"}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* the feature file grows past the limit */}
      <div style={{position: "absolute", left: 590, top: 680, width: 340, height: 520}}>
        <div style={{position: "absolute", left: 0, right: 0, top: 58, height: 3, borderTop: `3px dashed ${C.bug}`, opacity: out(f, L(14.5), L(14.9))}} />
        <div style={{position: "absolute", right: 0, top: 22, fontFamily: MONO, fontSize: 20, color: C.bug, opacity: out(f, L(14.5), L(14.9))}}>LIMIT 200</div>
        <div style={{position: "absolute", left: 30, right: 30, bottom: 80, height: fileH, borderRadius: 16, background: over ? "#2A1D1B" : C.card2, border: `2.5px solid ${over ? C.bug : C.line}`, transform: `perspective(800px) rotateY(-16deg)`, padding: "14px 18px", boxSizing: "border-box", opacity: out(f, L(13.5), L(14.2)), overflow: "hidden"}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>bot_features.cfg</div>
          {Array.from({length: Math.floor(fileH / 26) - 2}).map((_, i) => (
            <div key={i} style={{height: 8, marginTop: 14, borderRadius: 4, width: `${60 + ((i * 37) % 40)}%`, background: over && i > 12 ? C.bug : "#3A3C42"}} />
          ))}
        </div>
      </div>
      {/* bottom: the counter */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1250, display: "flex", alignItems: "baseline", justifyContent: "space-between", opacity: out(f, L(14.6), L(15))}}>
        <div>
          <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim}}>FEATURES IN FILE</div>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 120, lineHeight: 1, color: over ? C.bug : C.text}}>{over ? "200+" : feats}</div>
        </div>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, textAlign: "right"}}>usual: ~60<br /><span style={{color: C.bug}}>limit: 200</span></div>
      </div>
      {over ? (
        <div style={{position: "absolute", left: 64, top: 1430}}>
          <Slam at={L(17.0)} size={64} color={C.bug}>File doubled.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- scene 3: .unwrap() → panic → proxy shatters ----------
const PIECES = Array.from({length: 6}, (_, i) => ({cx: i % 3, cy: Math.floor(i / 3), rx: ((i * 53) % 7) - 3, ry: ((i * 31) % 9) - 4}));
const Crash: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const ring = out(f, L(24.03), L(24.5));
  const boom = interpolate(f, [L(26.27), L(26.27) + 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Section text="03 / THE CRASH" />
      <Card title="proxy.rs · FL2" tag={f > L(24.03) ? "BUG" : "RUST"} tagColor={f > L(24.03) ? C.bug : C.dim} border={f > L(24.03) ? C.bug : C.line} style={{top: 330}}>
        <span style={{color: C.dim}}>{typed("// preallocated: max 200 features", f, L(17.9), 60)}</span>
        {"\n"}
        {typed("if file.len() > 200 { return Err(..) }", f, L(19.5), 60)}
        {"\n\n"}
        {typed("let features = load(file)", f, L(22.14), 60)}
        <span style={{position: "relative", color: ring > 0.4 ? C.bug : C.text}}>
          {typed(".unwrap();", f, L(23.6), 60)}
          {ring > 0 ? <span style={{position: "absolute", inset: "-8px -14px", border: `4px solid ${C.bug}`, borderRadius: 40, opacity: ring, transform: `scale(${1.4 - ring * 0.4})`}} /> : null}
        </span>
      </Card>
      {f > L(20.71) ? (
        <div style={{position: "absolute", left: 64, top: 650, display: "flex", gap: 14, fontFamily: MONO, fontSize: 24}}>
          <span style={{padding: "8px 16px", borderRadius: 12, border: `2px solid ${C.bug}`, color: C.bug, opacity: out(f, L(20.71), L(21.1))}}>file.len() = 200+</span>
          {f > L(22.14) ? <span style={{padding: "8px 16px", borderRadius: 12, border: `2px solid ${C.line}`, color: C.dim, opacity: out(f, L(22.14), L(22.5))}}>error check: none</span> : null}
        </div>
      ) : null}
      {f > L(25.2) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 730, padding: "14px 20px", borderRadius: 14, background: "#2A1D1B", border: `2px solid ${C.bug}`, fontFamily: MONO, fontSize: 22, color: C.bug, lineHeight: 1.5, opacity: out(f, L(25.2), L(25.6))}}>
          {typed("thread 'fl2' panicked: called `Result::unwrap()` on an `Err` value", f, L(25.2), 90)}
        </div>
      ) : null}
      {/* the proxy server, shattering in 3D */}
      <div style={{position: "absolute", left: 300, top: 880, width: 420, height: 270, perspective: 900}}>
        {PIECES.map((p, i) => (
          <div key={i} style={{position: "absolute", left: p.cx * 140, top: p.cy * 135, width: 140, height: 135, boxSizing: "border-box", background: boom > 0 ? "#2A1D1B" : C.card, border: `2px solid ${boom > 0 ? C.bug : C.line}`, transform: `translate3d(${p.rx * 60 * boom}px, ${(p.ry * 30 + 260) * boom}px, ${p.ry * 80 * boom}px) rotateX(${p.rx * 50 * boom}deg) rotateY(${p.ry * 45 * boom}deg)`, opacity: 1 - boom * 0.7}}>
            {i === 1 && boom < 0.2 ? <div style={{fontFamily: MONO, fontSize: 24, color: C.text, textAlign: "center", marginTop: 50}}>PROXY</div> : null}
            {i === 0 || i === 3 ? <span style={{position: "absolute", left: 16, top: 16, width: 14, height: 14, borderRadius: 7, background: boom > 0 ? C.bug : C.g}} /> : null}
          </div>
        ))}
      </div>
      {/* bottom: 5xx flood */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1220, height: 340, overflow: "hidden"}}>
        {Array.from({length: 22}).map((_, i) => {
          const at = L(25.4) + i * 2;
          const y = interpolate(f, [at, at + 24], [-60, 260 + (i % 4) * 20], clamp);
          return f > at ? <span key={i} style={{position: "absolute", left: (i * 97) % 760, top: y, padding: "6px 12px", borderRadius: 10, background: "#2A1D1B", border: `2px solid ${C.bug}`, fontFamily: MONO, fontSize: 24, color: C.bug}}>{["500", "502", "503", "500"][i % 4]}</span> : null;
        })}
      </div>
      {f > L(26.27) ? (
        <div style={{position: "absolute", left: 64, top: 1560}}>
          <Slam at={L(26.27)} size={58} color={C.bug}>Whole proxy. Down.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- scene 4: the fix ----------
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const bad = interpolate(f, [L(29.1), L(30.4)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const bounce = f > L(30.4) ? interpolate(f, [L(30.4), L(31.0)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const good = interpolate(f, [L(32.26), L(33.2)], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Section text="04 / THE FIX" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(27.24)} size={84} color={C.g}>Validate config</Slam>
        <Slam at={L(28.6)} size={84} style={{marginTop: 8}}>like user input.</Slam>
      </div>
      {/* bad file → validator gate → rejected; last good file → proxy */}
      <div style={{position: "absolute", left: 470, top: 600, width: 130, height: 420, borderRadius: 20, border: `3px solid ${C.g}`, background: `${C.g}10`, display: "grid", placeItems: "center", opacity: out(f, L(28.8), L(29.2))}}>
        <span style={{fontFamily: MONO, fontSize: 22, color: C.g, writingMode: "vertical-rl", letterSpacing: "0.2em"}}>VALIDATOR</span>
      </div>
      <div style={{position: "absolute", left: 64 + bad * 250 - bounce * 230, top: 640, width: 260, padding: "16px 18px", borderRadius: 16, background: "#2A1D1B", border: `2.5px solid ${C.bug}`, transform: `perspective(700px) rotateY(${bounce * -25}deg)`, opacity: out(f, L(28.9), L(29.2)) * (1 - bounce * 0.35)}}>
        <div style={{fontFamily: MONO, fontSize: 21, color: C.dim}}>bot_features.cfg</div>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.bug, marginTop: 6}}>200+ features</div>
      </div>
      {bounce > 0 ? <div style={{position: "absolute", left: 360, top: 600, fontFamily: MONO, fontSize: 60, fontWeight: 700, color: C.bug, opacity: bounce}}>✕</div> : null}
      <div style={{position: "absolute", left: 64 + good * 560, top: 850, width: 260, padding: "16px 18px", borderRadius: 16, background: "#1C2A21", border: `2.5px solid ${C.g}`, opacity: out(f, L(31.6), L(32.1)), transform: `perspective(700px) rotateY(${(1 - good) * 20}deg)`}}>
        <div style={{fontFamily: MONO, fontSize: 21, color: C.dim}}>last good · v41</div>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.g, marginTop: 6}}>60 features ✓</div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1060, fontFamily: MONO, fontSize: 26, color: C.dim, opacity: out(f, L(31.1), L(31.5))}}>bad file? keep running on the last good one</div>
      {/* bottom: everything back to 200 */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1180, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
        {APPS.map(([name], i) => (
          <div key={name} style={{padding: "16px 20px", borderRadius: 18, background: C.card, border: `2.5px solid ${good > 0.9 ? C.g : C.line}`, opacity: out(f, L(32.4) + i * 3, L(32.4) + i * 3 + 6)}}>
            <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 800}}>{name}</div>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.g, marginTop: 4}}>● 200 OK</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene 5: rule + follow ----------
const SHEET: [string, string][] = [[".unwrap()", "only if failure is impossible"], ["?", "pass the error up"], [".unwrap_or(last_good)", "fall back, don't die"], ["config files", "validate like user input"]];
const Rule: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="05 / THE RULE" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(34.32)} size={92} style={{fontFamily: MONO, textTransform: "none", fontWeight: 700}}>unwrap() in prod</Slam>
        <Slam at={L(36.13)} size={92} color={C.bug} style={{marginTop: 10}}>= crash invite.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 590, borderRadius: 24, background: C.card, border: `2.5px solid ${C.line}`, overflow: "hidden", opacity: out(f, L(34.6), L(35))}}>
        <div style={{padding: "14px 24px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 22, color: C.dim}}>rust error handling · save this</div>
        {SHEET.map(([k, v], i) => (
          <div key={k} style={{display: "flex", justifyContent: "space-between", gap: 20, padding: "17px 24px", borderTop: i ? `2px solid ${C.line}` : "none", opacity: out(f, L(34.8) + i * 6, L(34.8) + i * 6 + 8)}}>
            <span style={{fontFamily: MONO, fontSize: 26, color: k === ".unwrap()" ? C.bug : C.g}}>{k}</span>
            <span style={{fontFamily: SANS, fontSize: 27, color: C.text, textAlign: "right"}}>{v}</span>
          </div>
        ))}
      </div>
      {f > L(37.4) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1030, borderRadius: 24, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "22px 30px", opacity: out(f, L(37.4), L(37.9)), transform: `translateY(${(1 - out(f, L(37.4), L(37.9))) * 30}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>INTERNET'S BIGGEST CRASHES</div>
          <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, marginTop: 6, color: C.text}}>More of these, <span style={{color: C.bug}}>every week</span></div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, L(37.9), 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1300, display: "flex", alignItems: "center", gap: 18, opacity: out(f, L(35.6), L(36))}}>
        <svg width={34} height={44}><path d="M3 3 H31 V41 L17 30 L3 41 Z" fill="none" stroke={C.g} strokeWidth={4} strokeLinejoin="round" /></svg>
        <div>
          <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.g}}>SAVE FOR LATER</div>
          <div style={{fontFamily: SANS, fontSize: 26, color: C.dim}}>before your next .unwrap()</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1440, fontFamily: MONO, fontSize: 22, color: C.dim, opacity: out(f, L(36.4), L(36.8))}}>source: Cloudflare post-mortem, 18 Nov 2025</div>
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC<{off: number}>][] = [
  [0, S2, () => <Hook />],
  [S2, S3, What],
  [S3, S4, Crash],
  [S4, S5, Fix],
  [S5, E7_TOTAL, Rule],
];

export const DebugDiaries007: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text}}>
    <Backdrop />
    {SCENES.map(([a, b, Comp], i) => (
      <Sequence key={i} from={a} durationInFrames={b - a}>
        <Card3D len={b - a} first={i === 0} last={i === SCENES.length - 1}>
          <Comp off={a} />
        </Card3D>
      </Sequence>
    ))}
    {[S2, S3, S4, S5].map((c) => <Cut key={c} at={c} />)}
    <Hud ep="007" total={E7_TOTAL} />
  </AbsoluteFill>
);
