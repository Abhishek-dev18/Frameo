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
    <a className="brand" href={to} aria-label="Frameo">
      <Logo />
      <span className="wordmark">FRAMEO</span>
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
      <span>© {new Date().getFullYear()} Frameo</span>
      <nav aria-label="Legal">
        <a href="#/legal/privacy">Privacy</a>
        <a href="#/legal/terms">Terms</a>
        <a href="#/legal/refunds">Refunds</a>
        <a href="#/legal/data-deletion">Data deletion</a>
      </nav>
    </footer>
  );
}
