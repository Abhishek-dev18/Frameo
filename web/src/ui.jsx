import React from "react";
import {STATUS} from "./api.js";

export function Pill({status}) {
  const s = STATUS[status] || {label: status, tone: "neutral"};
  return <span className={`pill pill-${s.tone}`}>{s.label}</span>;
}

export function Chip({ok, children}) {
  return <span className={`chip ${ok ? "chip-ok" : "chip-off"}`}><i />{children}</span>;
}

export function Platform({name, small}) {
  const label = name === "instagram" ? "IG" : name === "youtube" ? "YT" : name;
  return <span className={`plat plat-${name} ${small ? "plat-sm" : ""}`} title={name}>{label}</span>;
}

export function Toggle({checked, onChange, label}) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={`toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
      <span className="knob" />
      {label ? <span className="toggle-label">{label}</span> : null}
    </button>
  );
}

export function Field({label, hint, children, counter}) {
  return (
    <label className="field">
      <span className="field-top">
        <span className="field-label">{label}</span>
        {counter ? <span className="field-counter">{counter}</span> : null}
      </span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

export function Progress({job}) {
  // Post failures are shown by the episode's own error; only show finished/running jobs and render failures here.
  if (!job || (job.state === "error" && job.type === "post")) return null;
  const pct = Math.round((job.progress || 0) * 100);
  return (
    <div className={`job job-${job.state}`}>
      <div className="job-row">
        <span>{job.state === "error" ? "Failed" : job.state === "done" ? (job.type === "render" ? "Render finished" : "Posted") : job.step}</span>
        {job.state === "running" && job.step === "Rendering video" ? <span className="mono">{pct}%</span> : null}
      </div>
      {job.state === "running" ? (
        <div className="bar"><div className={job.step === "Rendering video" ? "" : "indeterminate"} style={job.step === "Rendering video" ? {width: `${pct}%`} : undefined} /></div>
      ) : null}
      {job.error ? <div className="job-error">{job.error}</div> : null}
    </div>
  );
}

export function Empty({title, children, action}) {
  return (
    <div className="empty">
      <div className="empty-frame" aria-hidden="true"><span /><span /><span /></div>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
