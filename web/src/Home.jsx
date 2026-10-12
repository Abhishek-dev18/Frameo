import React, {useEffect, useMemo, useState} from "react";
import {api, fmtWhen} from "./api.js";
import {Platform, Progress} from "./ui.jsx";
import Editor from "./Editor.jsx";

const DAY = 86400000;
const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // Monday
  return x;
};
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const timeOf = (iso) => new Date(iso).toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});

const STATUS_LABEL = {scheduled: "Scheduled", draft: "Draft", posting: "Posting…", posted: "Posted", failed: "Failed"};

export default function Home({state, episodes, refresh, toast}) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [editing, setEditing] = useState(null); // {id} | {new: true, at}

  const today = new Date();
  const shift = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };
  const days = Array.from({length: 7}, (_, i) => shift(weekStart, i));

  const next = useMemo(
    () => episodes.filter((e) => e.status === "scheduled" && e.at).sort((a, b) => new Date(a.at) - new Date(b.at))[0],
    [episodes],
  );
  const unscheduled = episodes.filter((e) => !e.at && e.status !== "posted");
  const c = state.connections;
  const ready = [c.storage.configured, c.instagram.configured, c.youtube.connected].filter(Boolean).length;

  const addOn = (day) => {
    const at = new Date(day);
    at.setHours(21, 0, 0, 0);
    setEditing({new: true, at: at.toISOString()});
  };

  const label = `${days[0].toLocaleDateString(undefined, {day: "numeric", month: "short"})} – ${days[6].toLocaleDateString(undefined, {day: "numeric", month: "short"})}`;
  const isThisWeek = sameDay(weekStart, startOfWeek(today));
  const editingEpisode = editing?.id ? episodes.find((e) => e.id === editing.id) : null;

  return (
    <div className="home">
      {ready < 3 ? (
        <a className="setup" href="#/settings">
          <span className="setup-count mono">{ready}/3</span>
          <span>
            <b>Finish setup to post automatically.</b> Connect video hosting, Instagram and YouTube.
          </span>
          <span className="setup-go">Set up →</span>
        </a>
      ) : null}

      <NextUp next={next} state={state} onOpen={(id) => setEditing({id})} onPlan={() => addOn(new Date(Date.now() + DAY))} refresh={refresh} toast={toast} />

      <div className="home-grid">
      <section className="week" aria-label="Calendar">
        <div className="week-head">
          <h2 className="title-s">This week</h2>
          <span className="mono dim">{label}</span>
          <div className="week-nav">
            <button className="icobtn" aria-label="Previous week" onClick={() => setWeekStart(shift(weekStart, -7))}>‹</button>
            <button className="btn small" disabled={isThisWeek} onClick={() => setWeekStart(startOfWeek(new Date()))}>Today</button>
            <button className="icobtn" aria-label="Next week" onClick={() => setWeekStart(shift(weekStart, 7))}>›</button>
          </div>
          <button className="btn primary" onClick={() => setEditing({new: true, at: null})}>+ New episode</button>
        </div>

        <div className="cal">
          {days.map((day) => {
            const items = episodes.filter((e) => e.at && sameDay(new Date(e.at), day)).sort((a, b) => new Date(a.at) - new Date(b.at));
            const isToday = sameDay(day, today);
            const past = day < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return (
              <div key={day.toISOString()} className={`col ${isToday ? "today" : ""} ${past ? "past" : ""}`}>
                <div className="col-head">
                  <span className="mono">{day.toLocaleDateString(undefined, {weekday: "short"}).toUpperCase()}</span>
                  <b>{day.getDate()}</b>
                  {isToday ? <span className="mono today-tag">TODAY</span> : null}
                </div>
                <div className="col-body">
                  {items.map((e) => (
                    <button key={e.id} className={`ep ep-${e.status}`} onClick={() => setEditing({id: e.id})}>
                      <span className="ep-time mono">{timeOf(e.at)}</span>
                      <span className="ep-title">{e.title}</span>
                      <span className="ep-foot">
                        <span className="ep-status mono">{e.job?.state === "running" ? e.job.step : STATUS_LABEL[e.status] || e.status}</span>
                        <span className="ep-plats">{e.platforms.map((p) => <Platform key={p} name={p} small />)}</span>
                      </span>
                    </button>
                  ))}
                  {!past ? (
                    <button className="add" onClick={() => addOn(day)} aria-label={`Add an episode on ${day.toDateString()}`}>
                      +
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="tray" aria-label="Not scheduled yet">
        <div className="week-head">
          <h2 className="title-s">Drafts</h2>
          <span className="mono dim">{unscheduled.length}</span>
        </div>
        {unscheduled.length ? (
          <div className="tray-list">
            {unscheduled.map((e) => (
              <button key={e.id} className="draft" onClick={() => setEditing({id: e.id})}>
                <span className="draft-thumb">{e.videoUrl ? <video src={`${e.videoUrl}#t=2`} muted preload="metadata" /> : null}</span>
                <span className="draft-text">
                  <span className="mono dim">{e.id.toUpperCase()} · {e.status === "failed" ? "FAILED" : "DRAFT"}</span>
                  <b>{e.title}</b>
                  <span className="dim small">Open it to pick a day</span>
                  {e.job ? <Progress job={e.job} /> : null}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="dim small tray-empty">Episodes without a date wait here.</p>
        )}
      </section>
      </div>

      {editing ? (
        <Editor
          key={editing.id || "new"}
          episode={editingEpisode}
          initialAt={editing.at}
          state={state}
          onClose={() => setEditing(null)}
          onCreated={(ep) => setEditing({id: ep.id})}
          refresh={refresh}
          toast={toast}
        />
      ) : null}
    </div>
  );
}

function NextUp({next, state, onOpen, onPlan, refresh, toast}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!next) {
    return (
      <section className="next empty-next">
        <div>
          <div className="eyebrow mono">NEXT ON AIR</div>
          <h1 className="title-next muted">Nothing scheduled</h1>
          <p className="dim">Pick a day in the calendar below, or start a new episode.</p>
        </div>
        <button className="btn primary" onClick={onPlan}>Plan an episode</button>
      </section>
    );
  }

  const left = Math.max(0, new Date(next.at) - now);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const job = next.job;

  async function postNow() {
    try {
      await api.post(next.id);
      toast("Posting started", "good");
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    }
  }

  return (
    <section className="next" aria-label="Next on air">
      <div className="next-main">
        <div className="eyebrow mono">NEXT ON AIR · {fmtWhen(next.at).toUpperCase()}</div>
        <h1 className="title-next">{next.title}</h1>
        <div className="next-meta">
          {next.platforms.map((p) => <Platform key={p} name={p} />)}
          <span className="dim">{state.scheduler.enabled ? "Will post automatically" : "Auto-posting is off. Turn on ON AIR at the top."}</span>
        </div>
        {job ? <Progress job={job} /> : null}
      </div>
      <div className="next-side">
        <div className="clock" role="timer" aria-label={`${h} hours ${m} minutes until posting`}>
          <div><b>{pad(h)}</b><span>HRS</span></div>
          <div><b>{pad(m)}</b><span>MIN</span></div>
          <div><b className="accent">{pad(s)}</b><span>SEC</span></div>
        </div>
        <div className="next-actions">
          <button className="btn light" onClick={postNow} disabled={job?.state === "running"}>Post now</button>
          <button className="btn" onClick={() => onOpen(next.id)}>Open</button>
        </div>
      </div>
    </section>
  );
}
