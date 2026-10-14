import React, {useState} from "react";
import {api, go, canPipeline} from "../api.js";
import {Brand, Field, Platform} from "../ui.jsx";

const NICHES = ["Tech and AI", "Programming", "Cybersecurity", "Cloud and DevOps", "Data science", "Startups", "Other"];

export default function Onboarding({state, refresh, toast}) {
  const u = state.user;
  const [step, setStep] = useState(1);
  const [p, setP] = useState({channelName: u.profile.channelName || "", handle: u.profile.handle || "", niche: u.profile.niche || "Tech and AI", language: u.profile.language || "English"});
  const [template, setTemplate] = useState(state.templates[0].id);
  const paid = canPipeline(state);
  const [busy, setBusy] = useState(false);
  const c = state.connections;

  async function saveChannel(e) {
    e.preventDefault();
    if (!p.channelName.trim()) return toast("Give your channel a name.", "bad");
    const handle = p.handle.trim() ? (p.handle.trim().startsWith("@") ? p.handle.trim() : `@${p.handle.trim()}`) : "";
    setBusy(true);
    try {
      await api.updateMe({profile: {...p, channelName: p.channelName.trim(), handle}});
      setStep(2);
    } catch (err) {
      toast(err.message, "bad");
    } finally {
      setBusy(false);
    }
  }
  async function finish(to) {
    setBusy(true);
    try {
      await api.updateMe({onboarded: true});
      await refresh();
      go(to);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="onb">
      <header className="public-top">
        <Brand to="#/onboarding" />
        <ol className="onb-steps" aria-label="Setup steps">
          {["Your channel", "Connect", "First style"].map((s, i) => (
            <li key={s} className={step === i + 1 ? "on" : step > i + 1 ? "done" : ""}>
              <span className="mono">{step > i + 1 ? "✓" : i + 1}</span> {s}
            </li>
          ))}
        </ol>
      </header>

      <div className="onb-body">
        {step === 1 ? (
          <form className="onb-card" onSubmit={saveChannel}>
            <div className="eyebrow mono">STEP 1 OF 3</div>
            <h1 className="title-l">Tell us about your channel</h1>
            <p className="dim">This goes on every episode's end card and shapes how scripts are written.</p>
            <div className="grid2">
              <Field label="Channel name">
                <input id="onb-name" value={p.channelName} onChange={(e) => setP({...p, channelName: e.target.value})} placeholder="3AM Deploy" />
              </Field>
              <Field label="Handle" hint="Shown once, at the end of each video.">
                <input id="onb-handle" value={p.handle} onChange={(e) => setP({...p, handle: e.target.value})} placeholder="@3amdeploy" />
              </Field>
              <Field label="What's it about?">
                <select id="onb-niche" value={p.niche} onChange={(e) => setP({...p, niche: e.target.value})}>
                  {NICHES.map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Language" hint="Hindi and Hinglish are coming soon.">
                <select id="onb-lang" value={p.language} onChange={(e) => setP({...p, language: e.target.value})}>
                  <option>English</option>
                </select>
              </Field>
            </div>
            <div className="onb-foot">
              <span className="spacer" />
              <button className="btn primary big" disabled={busy}>Continue</button>
            </div>
          </form>
        ) : step === 2 ? (
          <div className="onb-card">
            <div className="eyebrow mono">STEP 2 OF 3</div>
            <h1 className="title-l">{paid ? "Where should episodes post?" : "How posting works"}</h1>
            <p className="dim">
              {paid
                ? "PixelScript posts to Instagram as Reels and to YouTube as Shorts."
                : "On the Free plan you download each video and post it yourself. Starter and up connect Instagram and YouTube so pipelines post for you."}
            </p>
            <div className="onb-conns">
              <div className="onb-conn">
                <Platform name="instagram" />
                <div>
                  <b>Instagram</b>
                  <span className="dim small">Needs a Creator or Business account.</span>
                </div>
                <span className={`state mono ${c.instagram.configured ? "ok" : ""}`}>{c.instagram.configured ? "CONNECTED" : "NOT YET"}</span>
              </div>
              <div className="onb-conn">
                <Platform name="youtube" />
                <div>
                  <b>YouTube</b>
                  <span className="dim small">Uploads as Shorts.</span>
                </div>
                <span className={`state mono ${c.youtube.connected ? "ok" : ""}`}>{c.youtube.connected ? "CONNECTED" : "NOT YET"}</span>
              </div>
            </div>
            <p className="note-box">
              {!paid
                ? "Nothing to connect yet. You can make your first video right after this."
                : u.role === "admin"
                ? "You can connect both later under Settings → Connections. You can still create pipelines and approve videos before connecting."
                : "One-click connect is coming with the public launch. You can create pipelines and approve videos now; they'll post once your accounts are connected."}
            </p>
            <div className="onb-foot">
              <button className="btn" type="button" onClick={() => setStep(1)}>Back</button>
              <span className="spacer" />
              <button className="btn primary big" type="button" onClick={() => setStep(3)}>Continue</button>
            </div>
          </div>
        ) : (
          <div className="onb-card wide">
            <div className="eyebrow mono">STEP 3 OF 3</div>
            <h1 className="title-l">Pick your first style</h1>
            <p className="dim">You can switch styles for every video or pipeline later.</p>
            <div className="tpl-grid">
              {state.templates.map((t) => (
                <TemplateCard key={t.id} t={t} selected={template === t.id} onSelect={() => setTemplate(t.id)} />
              ))}
            </div>
            <div className="onb-foot">
              <button className="btn" type="button" onClick={() => setStep(2)}>Back</button>
              <span className="spacer" />
              <button className="btn" type="button" onClick={() => finish("home")} disabled={busy}>Skip for now</button>
              {paid ? (
                <button className="btn primary big" type="button" onClick={() => finish(`pipelines/new?template=${template}`)} disabled={busy}>Set up my first pipeline</button>
              ) : (
                <button className="btn primary big" type="button" onClick={() => finish(`create?template=${template}`)} disabled={busy}>Make my first video</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function TemplateCard({t, selected, onSelect}) {
  return (
    <button type="button" className={`tpl ${selected ? "on" : ""}`} onClick={onSelect} aria-pressed={selected}>
      <span className="tpl-video">
        <video src={t.preview} poster={t.preview.replace(".mp4", ".jpg")} muted loop playsInline autoPlay preload="metadata" />
        {selected ? <span className="tpl-check" aria-hidden="true">✓</span> : null}
      </span>
      <span className="tpl-text">
        <b>{t.name}</b>
        <span className="dim small">{t.blurb}</span>
        <span className="mono small accent">{t.credits} credit{t.credits > 1 ? "s" : ""} <span className="dim">· voice +1</span></span>
        <span className="dim small">Best for {t.best.toLowerCase()}</span>
      </span>
    </button>
  );
}
