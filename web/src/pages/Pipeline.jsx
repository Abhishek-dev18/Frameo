import React, {useCallback, useEffect, useState} from "react";
import {api, go, DAYS, fmtWhen, relative, scheduleText, isReview} from "../api.js";
import {Stage, Platform, Field, RenderBar, Empty} from "../ui.jsx";

const FLOW = [
  ["writing", "Script"],
  ["script_review", "Check"],
  ["rendering", "Video"],
  ["video_review", "Check"],
  ["scheduled", "Queued"],
  ["posted", "Posted"],
];
const ORDER = {writing: 0, script_review: 1, render_queued: 2, rendering: 2, video_review: 3, scheduled: 4, posting: 4, posted: 5};

export default function Pipeline({id, state, toast, refresh}) {
  const [p, setP] = useState(null);
  const [eps, setEps] = useState([]);
  const [newTopics, setNewTopics] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [pp, ee] = await Promise.all([api.pipeline(id), api.episodes({pipeline: id})]);
      setP(pp);
      setEps(ee);
    } catch (e) {
      toast(e.message, "bad");
      if (e.status === 404) go("home");
    }
  }, [id, toast]);
  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);

  if (!p) return <div className="loading mono">LOADING…</div>;
  const t = state.templates.find((x) => x.id === p.template);
  const queue = eps.filter((e) => !["posted", "failed", "skipped"].includes(e.stage));
  const history = eps.filter((e) => ["posted", "failed", "skipped"].includes(e.stage)).reverse();
  const left = p.topics.filter((x) => !x.used);

  async function run(fn, ok) {
    setBusy(true);
    try {
      await fn();
      if (ok) toast(ok, "good");
      await load();
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pipeline-page">
      <a className="linkbtn" href="#/home">← Home</a>
      <div className="pl-head">
        <div>
          <div className="eyebrow mono">{t?.name.toUpperCase()} · {p.length}S · {p.costPerEpisode} CREDITS PER EPISODE</div>
          <h1 className="title-l">{p.name}</h1>
          <div className="pl-meta">
            <span className={`live-tag mono ${p.status === "active" ? "on" : ""}`}>{p.status === "active" ? "● LIVE" : "‖ PAUSED"}</span>
            <span>{scheduleText(p.schedule)}</span>
            <span className="row-gap">{p.channels.map((c) => <Platform key={c} name={c} small />)}</span>
            <span className="dim">{p.reviewMode === "review" ? "You review each episode" : "Fully automatic"}</span>
          </div>
        </div>
        <div className="pl-actions">
          <button className="btn" onClick={() => setEditing(!editing)} aria-expanded={editing}>{editing ? "Close settings" : "Edit settings"}</button>
          <button className={`btn ${p.status === "active" ? "" : "primary"}`} disabled={busy} onClick={() => run(() => api.updatePipeline(p.id, {status: p.status === "active" ? "paused" : "active"}), p.status === "active" ? "Paused. Nothing new will be made or posted." : "Resumed")}>
            {p.status === "active" ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      {editing ? <EditSettings p={p} onSave={(b) => run(() => api.updatePipeline(p.id, b), "Settings saved").then(() => setEditing(false))} onDelete={() => {
        if (window.confirm(`Delete "${p.name}"? Upcoming episodes are removed; posted ones stay in your library.`)) run(() => api.deletePipeline(p.id), "Pipeline deleted").then(() => go("home"));
      }} busy={busy} /> : null}

      {p.topicsLeft === 0 ? (
        <div className="setup warn-bar"><span className="setup-count mono">!</span><span><b>Out of topics.</b> Add more below to keep this pipeline posting.</span></div>
      ) : null}

      <div className="pl-grid">
        <section aria-label="Upcoming episodes">
          <div className="week-head">
            <h2 className="title-s">Coming up</h2>
            <span className="mono dim">{queue.length}</span>
          </div>
          {queue.length === 0 ? (
            <Empty title={p.status === "active" ? "Preparing episodes" : "Paused"}>{p.status === "active" ? "Frameo prepares the next 3 episodes ahead. They'll appear here within a minute." : "Resume the pipeline to start preparing episodes."}</Empty>
          ) : (
            <div className="queue">
              {queue.map((e) => (
                <a key={e.id} href={`#/review/${e.id}`} className={`q-item ${isReview(e) ? "needs" : ""}`}>
                  <div className="q-top">
                    <span className="mono dim">EP {e.number}</span>
                    <Stage stage={e.stage} />
                    <span className="mono dim q-when">{fmtWhen(e.at)} · {relative(e.at)}</span>
                  </div>
                  <b className="q-title">{e.title}</b>
                  <ol className="flow" aria-label="Progress">
                    {FLOW.filter(([s]) => p.reviewMode === "review" || !s.endsWith("review")).map(([s, label]) => (
                      <li key={s} className={(ORDER[e.stage] ?? -1) > ORDER[s] ? "done" : (ORDER[e.stage] ?? -1) === ORDER[s] ? "now" : ""}>{label}</li>
                    ))}
                  </ol>
                  {e.stage === "rendering" ? <RenderBar progress={e.progress ?? 0} /> : null}
                  {e.error === "credits" ? <span className="small warn-text">Waiting for credits. <span className="linkish">Get more</span></span> : null}
                  {isReview(e) ? <span className="q-cta">Review now →</span> : null}
                </a>
              ))}
            </div>
          )}

          {history.length ? (
            <>
              <div className="week-head spaced">
                <h2 className="title-s">Earlier</h2>
              </div>
              <div className="history">
                {history.map((e) => (
                  <a key={e.id} href={`#/review/${e.id}`} className="h-row">
                    <span className="mono dim">EP {e.number}</span>
                    <span className="h-title">{e.title}</span>
                    <Stage stage={e.stage} />
                    <span className="mono dim small">{fmtWhen(e.at)}</span>
                  </a>
                ))}
              </div>
            </>
          ) : null}
        </section>

        <aside className="topics" aria-label="Topics">
          <div className="week-head">
            <h2 className="title-s">Topics</h2>
            <span className="mono dim">{left.length} left</span>
          </div>
          <ol className="topic-list">
            {left.map((x) => (
              <li key={x.id}>
                <span>{x.text}</span>
                <button className="icobtn small-x" aria-label={`Remove ${x.text}`} onClick={() => run(() => api.removeTopic(p.id, x.id))}>✕</button>
              </li>
            ))}
          </ol>
          {left.length === 0 ? <p className="dim small">No topics left.</p> : null}
          <Field label="Add topics" hint="One per line. They're used in order.">
            <textarea id="pl-topics" rows={4} value={newTopics} onChange={(e) => setNewTopics(e.target.value)} placeholder="The N+1 query that slowed every page" />
          </Field>
          <button className="btn" disabled={busy || !newTopics.trim()} onClick={() => run(() => api.addTopics(p.id, newTopics), "Topics added").then(() => setNewTopics(""))}>Add topics</button>
          <p className="dim small">{p.topics.length - left.length} already used.</p>
        </aside>
      </div>
    </div>
  );
}

function EditSettings({p, onSave, onDelete, busy}) {
  const [f, setF] = useState({name: p.name, schedule: p.schedule, reviewMode: p.reviewMode, missedPolicy: p.missedPolicy, channels: p.channels, length: p.length});
  const toggleDay = (d) => setF({...f, schedule: {...f.schedule, days: f.schedule.days.includes(d) ? f.schedule.days.filter((x) => x !== d) : [...f.schedule.days, d].sort()}});
  return (
    <div className="panel edit-panel">
      <div className="grid2">
        <Field label="Name"><input id="ed-name" value={f.name} onChange={(e) => setF({...f, name: e.target.value})} /></Field>
        <Field label="Time"><input id="ed-time" type="time" value={f.schedule.time} onChange={(e) => setF({...f, schedule: {...f.schedule, time: e.target.value}})} /></Field>
      </div>
      <div className="field">
        <span className="field-label">Days</span>
        <div className="day-pick">
          {DAYS.map(([n, d]) => <button key={n} type="button" aria-pressed={f.schedule.days.includes(n)} className={f.schedule.days.includes(n) ? "on" : ""} onClick={() => toggleDay(n)}>{d}</button>)}
        </div>
      </div>
      <div className="grid2">
        <Field label="Before posting">
          <select id="ed-review" value={f.reviewMode} onChange={(e) => setF({...f, reviewMode: e.target.value})}>
            <option value="review">Let me review</option>
            <option value="auto">Fully automatic</option>
          </select>
        </Field>
        <Field label="If not reviewed in time">
          <select id="ed-missed" value={f.missedPolicy} onChange={(e) => setF({...f, missedPolicy: e.target.value})} disabled={f.reviewMode === "auto"}>
            <option value="next">Move to the next free slot</option>
            <option value="skip">Skip it</option>
            <option value="post">Post anyway</option>
          </select>
        </Field>
      </div>
      <div className="field">
        <span className="field-label">Post to</span>
        <div className="choices">
          {["instagram", "youtube"].map((ch) => (
            <button key={ch} type="button" aria-pressed={f.channels.includes(ch)} className={f.channels.includes(ch) ? "on" : ""} onClick={() => setF({...f, channels: f.channels.includes(ch) ? f.channels.filter((x) => x !== ch) : [...f.channels, ch]})}>
              <Platform name={ch} /> {ch === "instagram" ? "Instagram" : "YouTube"}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-foot">
        <button className="linkbtn danger" onClick={onDelete} disabled={busy}>Delete pipeline</button>
        <span className="spacer" />
        <button className="btn primary" onClick={() => onSave(f)} disabled={busy}>Save settings</button>
      </div>
      <p className="dim small">New settings apply to episodes prepared from now on.</p>
    </div>
  );
}
