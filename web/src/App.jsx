import React, {useCallback, useEffect, useMemo, useState} from "react";
import {api} from "./api.js";
import Episodes from "./Episodes.jsx";
import Settings from "./Settings.jsx";
import Activity from "./Activity.jsx";

const pageFromHash = () => {
  const p = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return ["episodes", "settings", "activity"].includes(p) ? p : "episodes";
};

export default function App() {
  const [page, setPage] = useState(pageFromHash());
  const [state, setState] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [offline, setOffline] = useState(false);
  const [filter, setFilter] = useState("all");

  const toast = useCallback((text, tone = "info") => {
    const id = Math.random();
    setToasts((t) => [...t, {id, text, tone}]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [s, e] = await Promise.all([api.state(), api.episodes()]);
      setState(s);
      setEpisodes(e);
      setOffline(false);
    } catch {
      setOffline(true);
    }
  }, []);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const busy = episodes.some((e) => e.job?.state === "running");
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, busy ? 1500 : 8000);
    return () => clearInterval(t);
  }, [refresh, busy]);

  const counts = useMemo(() => {
    const c = {all: episodes.length, scheduled: 0, draft: 0, posted: 0, failed: 0};
    episodes.forEach((e) => (c[e.status] = (c[e.status] || 0) + 1));
    return c;
  }, [episodes]);

  const go = (p, f) => {
    if (f) setFilter(f);
    window.location.hash = `#/${p}`;
  };

  async function toggleAir() {
    const on = !state.scheduler.enabled;
    try {
      await api.settings({scheduler: {enabled: on}});
      toast(on ? "On air. Queued episodes will post at their scheduled time." : "Off air. Nothing will post automatically.", on ? "good" : "info");
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    }
  }

  const conn = state?.connections;
  const side = [
    {label: "All episodes", p: "episodes", f: "all", c: counts.all},
    {label: "Queued", p: "episodes", f: "scheduled", c: counts.scheduled},
    {label: "Drafts", p: "episodes", f: "draft", c: counts.draft},
    {label: "Posted", p: "episodes", f: "posted", c: counts.posted},
    {label: "Failed", p: "episodes", f: "failed", c: counts.failed},
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div className="mark" aria-hidden="true" />
        <div className="wordmark">Frameo</div>
        {state ? <div className="channel mono">{state.channel.name} · {state.channel.handle}</div> : null}
        {state ? (
          <button className={`air ${state.scheduler.enabled ? "on" : ""}`} onClick={toggleAir} title="Turn automatic posting on or off">
            <i />
            {state.scheduler.enabled ? "ON AIR" : "OFF AIR"}
            <span className="air-hint">{state.scheduler.enabled ? "auto-posting" : "click to auto-post"}</span>
          </button>
        ) : null}
      </header>

      <nav className="mobnav">
        <button className={page === "episodes" ? "on" : ""} onClick={() => go("episodes", "all")}>Episodes</button>
        <button className={page === "settings" ? "on" : ""} onClick={() => go("settings")}>Connections</button>
        <button className={page === "activity" ? "on" : ""} onClick={() => go("activity")}>Activity</button>
      </nav>

      <div className="frame">
        <aside className="sidebar">
          <div className="sl">EPISODES</div>
          {side.map((s) => (
            <button key={s.f} className={`si ${page === "episodes" && filter === s.f ? "on" : ""}`} onClick={() => go(s.p, s.f)}>
              {s.label}
              <span className="c">{s.c || 0}</span>
            </button>
          ))}
          <div className="sl">SYSTEM</div>
          <button className={`si ${page === "settings" ? "on" : ""}`} onClick={() => go("settings")}>
            Connections
            {conn ? <span className="c">{[conn.storage.configured, conn.instagram.configured, conn.youtube.connected].filter(Boolean).length}/3</span> : null}
          </button>
          <button className={`si ${page === "activity" ? "on" : ""}`} onClick={() => go("activity")}>
            Activity log
          </button>
        </aside>

        <main className="main">
          {offline ? (
            <div className="banner bad">
              <b>Server not reachable.</b> Check the terminal running <span className="mono">npm run dev</span>.
            </div>
          ) : null}
          {!state ? (
            <div className="loading mono">CONNECTING…</div>
          ) : page === "episodes" ? (
            <Episodes state={state} episodes={episodes} filter={filter} setFilter={setFilter} refresh={refresh} toast={toast} />
          ) : page === "settings" ? (
            <Settings state={state} refresh={refresh} toast={toast} />
          ) : (
            <Activity />
          )}
        </main>
      </div>

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}
      </div>
    </div>
  );
}
