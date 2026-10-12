import React, {useCallback, useEffect, useRef, useState} from "react";
import {api, readRoute, go, relative, canPipeline} from "./api.js";
import {Brand, Credits, Footer} from "./ui.jsx";
import Landing from "./pages/Landing.jsx";
import {Login, Signup, Forgot, Reset} from "./pages/Auth.jsx";
import Legal from "./pages/Legal.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Home from "./pages/Home.jsx";
import Wizard from "./pages/Wizard.jsx";
import Pipeline from "./pages/Pipeline.jsx";
import Review from "./pages/Review.jsx";
import Posted from "./pages/Posted.jsx";
import Create from "./pages/Create.jsx";
import Videos from "./pages/Videos.jsx";
import Settings from "./pages/Settings.jsx";
import Activity from "./pages/Activity.jsx";
import Admin from "./pages/Admin.jsx";

const PUBLIC = ["", "login", "signup", "forgot", "reset", "legal"];

export default function App() {
  const [route, setRoute] = useState(readRoute());
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [state, setState] = useState(null);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((text, tone = "info") => {
    const id = Math.random();
    setToasts((t) => [...t, {id, text, tone}]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  useEffect(() => {
    const on = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const s = await api.state();
      setState(s);
      setUser(s.user);
      return s;
    } catch (e) {
      if (e.status === 401) {
        setUser(null);
        setState(null);
      }
    }
  }, []);

  useEffect(() => {
    api
      .me()
      .then((r) => {
        setUser(r.user);
        if (r.user) refresh();
      })
      .catch(() => setUser(null));
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [user, refresh]);

  const page = route.path[0] || "";

  useEffect(() => {
    if (user === undefined) return;
    if (!user && !PUBLIC.includes(page)) go("login");
    else if (user && !user.onboarded && page !== "onboarding" && page !== "legal") go("onboarding");
    else if (user && user.onboarded && ["", "login", "signup", "forgot", "reset"].includes(page)) go("home");
  }, [user, page]);

  const onAuthed = async (u) => {
    setUser(u);
    await refresh();
    go(u.onboarded ? "home" : "onboarding");
  };

  if (user === undefined) return <div className="loading mono center">LOADING…</div>;

  if (!user) {
    if (page === "login") return <Shell><Login onAuthed={onAuthed} /></Shell>;
    if (page === "signup") return <Shell><Signup onAuthed={onAuthed} /></Shell>;
    if (page === "forgot") return <Shell><Forgot /></Shell>;
    if (page === "reset") return <Shell><Reset token={route.query.token} onAuthed={onAuthed} /></Shell>;
    if (page === "legal") return <Shell><Legal doc={route.path[1]} /></Shell>;
    return <Landing />;
  }

  if (page === "legal") return <Shell><Legal doc={route.path[1]} /></Shell>;
  if (!state) return <div className="loading mono center">LOADING…</div>;
  if (page === "onboarding") return <Onboarding state={state} refresh={refresh} toast={toast} />;

  const props = {state, user, refresh, toast, route};
  let body;
  if (page === "pipelines" && route.path[1] === "new") body = <Wizard {...props} />;
  else if (page === "pipelines" && route.path[1]) body = <Pipeline {...props} id={route.path[1]} />;
  else if (page === "review" && route.path[1]) body = <Review {...props} id={route.path[1]} />;
  else if (page === "create") body = <Create {...props} />;
  else if (page === "videos") body = <Videos {...props} />;
  else if (page === "posted") body = <Posted {...props} />;
  else if (page === "activity") body = <Activity {...props} />;
  else if (page === "settings") body = <Settings {...props} tab={route.path[1] || "profile"} />;
  else if (page === "admin" && user.role === "admin") body = <Admin {...props} />;
  else body = <Home {...props} />;

  return (
    <div className="app">
      <TopBar
        user={user}
        state={state}
        page={page}
        refresh={refresh}
        onLogout={async () => {
          await api.logout();
          setUser(null);
          setState(null);
          go("");
        }}
      />
      <main className={`main ${page === "home" ? "main-home" : ""}`}>{body}</main>
      <Toasts toasts={toasts} />
    </div>
  );
}

function Shell({children}) {
  return (
    <div className="public-shell">
      <header className="public-top">
        <Brand to="#/" />
      </header>
      <div className="public-body">{children}</div>
      <Footer />
    </div>
  );
}

function Toasts({toasts}) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>)}
    </div>
  );
}

const NAV = [
  ["home", "Home"],
  ["videos", "Videos"],
  ["posted", "Posted", "pipelines"],
  ["activity", "Activity"],
  ["settings", "Settings"],
];

function TopBar({user, state, page, onLogout, refresh}) {
  const [open, setOpen] = useState(null);
  const [items, setItems] = useState([]);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(null);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  async function openBell() {
    if (open === "bell") return setOpen(null);
    setOpen("bell");
    setItems(await api.notifications());
    if (state.unread) {
      await api.readAll();
      refresh();
    }
  }
  return (
    <header className="topbar" ref={ref}>
      <Brand to="#/home" />
      <nav className="nav" aria-label="Main">
        {NAV.filter(([, , needs]) => !needs || canPipeline(state)).map(([id, label]) => (
          <a key={id} href={`#/${id}`} className={page === id || (id === "home" && ["pipelines", "review"].includes(page)) || (id === "videos" && page === "create") ? "on" : ""}>
            {label}
          </a>
        ))}
        {user.role === "admin" ? (
          <a href="#/admin" className={page === "admin" ? "on" : ""}>
            Admin
          </a>
        ) : null}
      </nav>
      <div className="top-right">
        <Credits n={user.credits} />
        <div className="pop-wrap">
          <button className={`icobtn bell ${state.unread ? "has" : ""}`} onClick={openBell} aria-label={`Notifications${state.unread ? `, ${state.unread} new` : ""}`} aria-expanded={open === "bell"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {state.unread ? <i>{state.unread > 9 ? "9+" : state.unread}</i> : null}
          </button>
          {open === "bell" ? (
            <div className="pop pop-wide" role="dialog" aria-label="Notifications">
              <div className="pop-head">Notifications</div>
              {items.length === 0 ? <p className="dim small pad">Nothing yet. You'll hear here when an episode needs review or gets posted.</p> : null}
              {items.map((n) => (
                <a key={n.id} href={n.link || "#/activity"} className={`note note-${n.tone}`} onClick={() => setOpen(null)}>
                  <span>{n.text}</span>
                  <span className="dim mono">{relative(n.at)}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <div className="pop-wrap">
          <button className="avatar" onClick={() => setOpen(open === "menu" ? null : "menu")} aria-label="Account menu" aria-expanded={open === "menu"}>
            {(user.name || user.email)[0].toUpperCase()}
          </button>
          {open === "menu" ? (
            <div className="pop" role="menu">
              <div className="pop-head">
                <b>{user.name}</b>
                <span className="dim small">{user.email}</span>
              </div>
              <a role="menuitem" href="#/settings/profile" onClick={() => setOpen(null)}>Profile</a>
              <a role="menuitem" href="#/settings/plan" onClick={() => setOpen(null)}>Plan and credits</a>
              <a role="menuitem" href="#/legal/privacy" onClick={() => setOpen(null)}>Privacy</a>
              <button role="menuitem" onClick={onLogout}>Log out</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
