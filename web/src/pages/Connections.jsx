import React, {createContext, useContext, useEffect, useState} from "react";

// One card open at a time, so the page fits on one screen.
const Accordion = createContext({open: null, setOpen: () => {}});
import {api} from "../api.js";
import {Field} from "../ui.jsx";

export default function Connections({state, refresh, toast}) {
  const c = state.connections;

  // Back from Google sign-in?
  useEffect(() => {
    const q = new URLSearchParams(window.location.hash.split("?")[1] || "");
    if (q.get("youtube") === "connected") toast("YouTube connected", "good");
    if (q.get("youtube") === "error") toast(`YouTube sign-in failed: ${q.get("message") || "unknown error"}`, "bad");
    if (q.get("youtube")) window.history.replaceState(null, "", "#/settings/connections");
  }, [toast]);

  const [open, setOpen] = useState(null);
  return (
    <Accordion.Provider value={{open, setOpen}}>
      <p className="dim small">Set these up once, in order. Keys stay on this computer, in the <span className="mono">.env</span> file.</p>
      <div className="conn-list">
        <StorageCard c={c.storage} refresh={refresh} toast={toast} />
        <InstagramCard c={c.instagram} storage={c.storage} refresh={refresh} toast={toast} />
        <YouTubeCard c={c.youtube} refresh={refresh} toast={toast} />
        <KeysCard c={c} refresh={refresh} toast={toast} />
      </div>
    </Accordion.Provider>
  );
}

function useBusy(toast, refresh) {
  const [busy, setBusy] = useState(false);
  const run = async (fn, ok) => {
    setBusy(true);
    try {
      const r = await fn();
      if (ok) toast(typeof ok === "function" ? ok(r) : ok, "good");
      await refresh();
      return r;
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  };
  return [busy, run];
}

function Conn({title, code, step, sub, live, children}) {
  const acc = useContext(Accordion);
  const open = acc.open === title;
  const setOpen = () => acc.setOpen(open ? null : title);
  return (
    <div className={`conn-card ${open ? "open" : ""}`}>
      <button className="dev" onClick={setOpen} aria-expanded={open}>
        <div className={`ic mono ${live ? "ok" : ""}`}>{live ? "✓" : step}</div>
        <div>
          <div className="nm">{title}</div>
          <div className="mt">{sub}</div>
        </div>
        <span className={`state mono ${live ? "ok" : ""}`}>{live ? "CONNECTED" : "NOT SET UP"}</span>
        <span className="chev mono">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="conn-body">{children}</div> : null}
    </div>
  );
}

function StorageCard({c, refresh, toast}) {
  const [f, setF] = useState({accountId: "", accessKeyId: "", secretAccessKey: "", bucket: c.bucket || "pixelscript-videos", publicUrl: c.publicUrl || ""});
  const [busy, run] = useBusy(toast, refresh);
  const set = (k) => (e) => setF((x) => ({...x, [k]: e.target.value}));
  return (
    <Conn title="Video hosting" code="R2" step="1" sub={c.configured ? `Cloudflare R2 · ${c.bucket}` : "Where videos are uploaded so Instagram can fetch them"} live={c.configured}>
      <p className="help">Instagram downloads each video from a public link, so PixelScript uploads the MP4 to a Cloudflare R2 bucket first. The free tier covers this. Setup steps are in README section 3.</p>
      <div className="grid2">
        <Field label="Account ID"><input value={f.accountId} onChange={set("accountId")} placeholder={c.configured ? "Saved · leave blank to keep" : ""} /></Field>
        <Field label="Bucket name"><input value={f.bucket} onChange={set("bucket")} /></Field>
        <Field label="Access key ID"><input value={f.accessKeyId} onChange={set("accessKeyId")} placeholder={c.configured ? "Saved · leave blank to keep" : ""} /></Field>
        <Field label="Secret access key"><input type="password" value={f.secretAccessKey} onChange={set("secretAccessKey")} placeholder={c.configured ? "Saved · leave blank to keep" : ""} /></Field>
      </div>
      <Field label="Public bucket URL" hint="From the bucket's settings, e.g. https://pub-1234abcd.r2.dev">
        <input value={f.publicUrl} onChange={set("publicUrl")} placeholder="https://pub-xxxx.r2.dev" />
      </Field>
      <div className="panel-foot">
        <button className="btn" disabled={busy || !c.configured} onClick={() => run(() => api.testStorage(), "Upload and public link both work")}>Test</button>
        <button className="btn primary" disabled={busy} onClick={() => run(() => api.saveStorage(f), "Storage settings saved")}>Save</button>
      </div>
    </Conn>
  );
}

function InstagramCard({c, storage, refresh, toast}) {
  const [token, setToken] = useState("");
  const [who, setWho] = useState(null);
  const [busy, run] = useBusy(toast, refresh);
  return (
    <Conn
      title="Instagram"
      code="IG"
      step="2"
      sub={c.configured ? (who ? `@${who.username}` : `Account ID ${c.userId}`) : "Posts your episodes as Reels"}
      live={c.configured}
    >
      <p className="help">
        Needs an Instagram professional account and a Meta app using the Instagram API with Instagram Login. Generate an access token in the app dashboard and paste it here (README section 4).
        {!storage.configured ? <b> Video hosting must be set up too.</b> : null}
      </p>
      <Field label="Access token" hint="Long-lived tokens last about 60 days. PixelScript refreshes it every Sunday while it's running.">
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder={c.configured ? "Saved · paste a new one to replace it" : "IGAA…"} />
      </Field>
      <div className="panel-foot">
        {c.configured ? (
          <>
            <button className="btn" disabled={busy} onClick={() => run(async () => setWho(await api.checkInstagram()), "Token works")}>Check</button>
            <button className="btn" disabled={busy} onClick={() => run(() => api.refreshInstagram(), (r) => `Token refreshed, valid ~${r.days} days`)}>Refresh token</button>
          </>
        ) : null}
        <button
          className="btn primary"
          disabled={busy || !token}
          onClick={() =>
            run(async () => {
              const me = await api.connectInstagram(token);
              setWho(me);
              setToken("");
              return me;
            }, (me) => `Connected as @${me.username}`)
          }
        >
          Connect
        </button>
      </div>
    </Conn>
  );
}

function YouTubeCard({c, refresh, toast}) {
  const [f, setF] = useState({clientId: "", clientSecret: "", privacy: c.privacy});
  const [busy, run] = useBusy(toast, refresh);
  const signIn = () =>
    run(async () => {
      if (f.clientId || f.clientSecret || f.privacy !== c.privacy) await api.saveYouTube(f);
      const {url} = await api.youtubeAuthUrl(`${window.location.origin}/#/settings/connections`);
      window.location.href = url;
    });
  return (
    <Conn
      title="YouTube"
      code="YT"
      step="3"
      sub={c.connected ? `Uploads as ${c.privacy}` : c.configured ? "Almost there: sign in with Google" : "Posts your episodes as Shorts"}
      live={c.connected}
    >
      <p className="help">
        Create a Google Cloud OAuth client of type <b>Desktop app</b> with the YouTube Data API enabled, and publish the consent screen to production so the sign-in doesn't expire after 7 days (README section 5).
      </p>
      <div className="grid2">
        <Field label="Client ID"><input value={f.clientId} onChange={(e) => setF({...f, clientId: e.target.value})} placeholder={c.configured ? "Saved · leave blank to keep" : "…apps.googleusercontent.com"} /></Field>
        <Field label="Client secret"><input type="password" value={f.clientSecret} onChange={(e) => setF({...f, clientSecret: e.target.value})} placeholder={c.configured ? "Saved · leave blank to keep" : "GOCSPX-…"} /></Field>
      </div>
      <Field label="Upload as" hint="Until Google audits your API project, uploads stay private no matter what you pick. Publish them from YouTube Studio meanwhile.">
        <select value={f.privacy} onChange={(e) => setF({...f, privacy: e.target.value})}>
          <option value="private">Private</option>
          <option value="unlisted">Unlisted</option>
          <option value="public">Public</option>
        </select>
      </Field>
      <div className="panel-foot">
        {c.connected ? <button className="btn ghost danger" disabled={busy} onClick={() => run(() => api.disconnectYouTube(), "YouTube disconnected")}>Disconnect</button> : null}
        <span className="spacer" />
        <button className="btn primary" disabled={busy || (!c.configured && !(f.clientId && f.clientSecret))} onClick={signIn}>
          {c.connected ? "Sign in again" : "Sign in with Google"}
        </button>
      </div>
    </Conn>
  );
}

function KeysCard({c, refresh, toast}) {
  const [gemini, setGemini] = useState("");
  const [telegram, setTelegram] = useState("");
  const [busy, run] = useBusy(toast, refresh);
  return (
    <Conn title="AI writer and Telegram alerts" code="AI" step="4" sub={c.writer.configured ? "Gemini key saved" : "Without a key, scripts are simple placeholders"} live={c.writer.configured}>
      <p className="help">
        <b>Gemini API key</b> lets PixelScript write a real script for each topic. Get one free at Google AI Studio (aistudio.google.com).{" "}
        <b>Telegram bot token</b> lets PixelScript message you when something needs review: create a bot with @BotFather, paste its token here, then add your chat ID under Settings → Notifications.
      </p>
      <div className="grid2">
        <Field label="Gemini API key" hint={c.writer.configured ? "Saved. Paste a new one to replace it." : ""}>
          <input type="password" value={gemini} onChange={(e) => setGemini(e.target.value)} placeholder="AIza…" />
        </Field>
        <Field label="Telegram bot token" hint={c.telegram.configured ? "Saved. Paste a new one to replace it." : ""}>
          <input type="password" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="123456:ABC-…" />
        </Field>
      </div>
      <div className="panel-foot">
        <button className="btn primary" disabled={busy || (!gemini && !telegram)} onClick={() => run(() => api.saveKeys({gemini, telegram}), "Keys saved").then(() => (setGemini(""), setTelegram("")))}>Save keys</button>
      </div>
    </Conn>
  );
}
