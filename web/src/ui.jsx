import React from "react";
import {STAGES} from "./api.js";

export function Logo({size = 30}) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#FF7A45" />
      <rect x="21" y="11" width="22" height="42" rx="3" fill="#0E0C0B" />
      {[13, 23, 33, 43].map((y) => (
        <g key={y} fill="#0E0C0B">
          <rect x="11" y={y} width="5" height="5" rx="1.5" />
          <rect x="48" y={y} width="5" height="5" rx="1.5" />
        </g>
      ))}
    </svg>
  );
}

export function Brand({to = "#/"}) {
  return (
    <a className="brand" href={to} aria-label="PixelScript">
      <Logo />
      <span className="wordmark">PIXEL<span className="accent">SCRIPT</span></span>
    </a>
  );
}

export function Stage({stage}) {
  const s = STAGES[stage] || {label: stage, tone: "neutral"};
  return <span className={`stage stage-${s.tone}`}>{s.label}</span>;
}

export function Platform({name, small}) {
  const label = name === "instagram" ? "IG" : name === "youtube" ? "YT" : name;
  return (
    <span className={`plat plat-${name} ${small ? "plat-sm" : ""}`} title={name === "instagram" ? "Instagram" : "YouTube"}>
      {label}
    </span>
  );
}

export function Toggle({checked, onChange, label, id}) {
  return (
    <button type="button" id={id} role="switch" aria-checked={checked} aria-label={label} className={`toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
      <span className="knob" />
    </button>
  );
}

export function Field({label, hint, children, counter, error}) {
  return (
    <label className="field">
      <span className="field-top">
        <span className="field-label">{label}</span>
        {counter ? <span className="field-counter">{counter}</span> : null}
      </span>
      {children}
      {error ? <span className="field-hint bad">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function RenderBar({progress}) {
  if (progress == null) return null;
  const pct = Math.round(progress * 100);
  return (
    <div className="job">
      <div className="job-row">
        <span>Making video</span>
        <span className="mono">{pct}%</span>
      </div>
      <div className="bar"><div style={{width: `${pct}%`}} /></div>
    </div>
  );
}

export function Empty({title, children, action}) {
  return (
    <div className="empty">
      <span className="frame-icon" aria-hidden="true" />
      <h3 className="title-s">{title}</h3>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  );
}

export function Credits({n}) {
  return (
    <a className="credits mono" href="#/settings/plan" title="Credits left">
      <span aria-hidden="true">◆</span> {n} credits
    </a>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} PixelScript</span>
      <nav aria-label="Legal">
        <a href="#/legal/privacy">Privacy</a>
        <a href="#/legal/terms">Terms</a>
        <a href="#/legal/refunds">Refunds</a>
        <a href="#/legal/data-deletion">Data deletion</a>
      </nav>
    </footer>
  );
}

// Voiceover choice. Voice adds 1 credit per 30 seconds. Disabled (with "SOON") until the voice pipeline is live.
export function VoiceChoice({voice, onChange, ready, length = 30}) {
  const extra = (length >= 60 ? 2 : 1) * 2;
  return (
    <div className="seg-choice" role="radiogroup" aria-label="Voiceover">
      <button type="button" role="radio" aria-checked={!voice} className={!voice ? "on" : ""} onClick={() => onChange(false)}>
        Music only
      </button>
      <button type="button" role="radio" aria-checked={voice} className={voice ? "on" : ""} disabled={!ready} onClick={() => ready && onChange(true)} title={ready ? "" : "AI voiceover is coming soon"}>
        AI voice <span className="dim small">+{extra} credit{extra > 1 ? "s" : ""}</span>
        {!ready ? <span className="soon mono">SOON</span> : null}
      </button>
    </div>
  );
}

export function LanguageSelect({id, value, onChange, languages = ["English", "Hindi", "Hinglish"]}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {languages.map((l) => <option key={l}>{l}</option>)}
    </select>
  );
}
