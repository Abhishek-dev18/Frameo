import React, {useCallback, useEffect, useState} from "react";
import {api} from "./api.js";
import Home from "./Home.jsx";
import Settings from "./Settings.jsx";
import Activity from "./Activity.jsx";

const PAGES = [
  ["home", "Home"],
  ["settings", "Connections"],
  ["activity", "Activity"],
];

const pageFromHash = () => {
  const p = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return PAGES.some(([id]) => id === p) ? p : "home";
};

export default function App() {
  const [page, setPage] = useState(pageFromHash());
  const [state, setState] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [offline, setOffline] = useState(false);

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

  const busy = episodes.some((e) => e.job?.state === "running" || e.status === "posting");
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, busy ? 1500 : 8000);
    return () => clearInterval(t);
  }, [refresh, busy]);

  async function toggleAir() {
    const on = !state.scheduler.enabled;
    try {
      await api.settings({scheduler: {enabled: on}});
      toast(on ? "On air. Scheduled episodes will post at their time." : "Off air. Nothing will post by itself.", on ? "good" : "info");
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#/home" aria-label="Frameo home">
          <svg className="logo" viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#FF7A45" />
            <rect x="21" y="11" width="22" height="42" rx="3" fill="#0E0C0B" />
            {[13, 23, 33, 43].map((y) => (
              <g key={y} fill="#0E0C0B">
                <rect x="11" y={y} width="5" height="5" rx="1.5" />
                <rect x="48" y={y} width="5" height="5" rx="1.5" />
              </g>
            ))}
          </svg>
          <span className="wordmark">FRAMEO</span>
        </a>
        <nav className="nav" aria-label="Main">
          {PAGES.map(([id, label]) => (
            <a key={id} href={`#/${id}`} className={page === id ? "on" : ""} aria-current={page === id ? "page" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        {state ? <span className="channel mono">{state.channel.name} · {state.channel.handle}</span> : null}
        {state ? (
          <button className={`air ${state.scheduler.enabled ? "on" : ""}`} onClick={toggleAir} title={state.scheduler.enabled ? "Click to stop posting automatically" : "Click to start posting automatically"}>
            <i />
            {state.scheduler.enabled ? "ON AIR" : "OFF AIR"}
          </button>
        ) : null}
      </header>

      <main className={`main ${page === "home" ? "main-home" : ""}`}>
        {offline ? (
          <div className="banner bad">
            Frameo's server isn't responding. Check the terminal where you ran <span className="mono">npm run dev</span>.
          </div>
        ) : null}
        {!state ? (
          <div className="loading mono">LOADING…</div>
        ) : page === "home" ? (
          <Home state={state} episodes={episodes} refresh={refresh} toast={toast} />
        ) : page === "settings" ? (
          <Settings state={state} refresh={refresh} toast={toast} />
        ) : (
          <Activity />
        )}
      </main>

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}
      </div>
    </div>
  );
}
