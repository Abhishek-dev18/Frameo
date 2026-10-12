import React, {useState} from "react";
import {api, go} from "../api.js";
import {Field} from "../ui.jsx";
import Connections from "./Connections.jsx";

const TABS = [
  ["profile", "Profile"],
  ["connections", "Connections"],
  ["notifications", "Notifications"],
  ["plan", "Plan and credits"],
];

export default function Settings({tab, state, user, refresh, toast}) {
  const t = TABS.some(([id]) => id === tab) ? tab : "profile";
  return (
    <div className="settings">
      <h1 className="title-l">Settings</h1>
      <nav className="tabs" aria-label="Settings sections">
        {TABS.map(([id, label]) => (
          <a key={id} href={`#/settings/${id}`} className={t === id ? "on" : ""} aria-current={t === id ? "page" : undefined}>{label}</a>
        ))}
      </nav>
      {t === "profile" ? <Profile user={user} refresh={refresh} toast={toast} /> : null}
      {t === "connections" ? (user.role === "admin" ? <Connections state={state} refresh={refresh} toast={toast} /> : <ComingSoon />) : null}
      {t === "notifications" ? <Notifications user={user} state={state} refresh={refresh} toast={toast} /> : null}
      {t === "plan" ? <Plan user={user} /> : null}
    </div>
  );
}

function Profile({user, refresh, toast}) {
  const [f, setF] = useState({name: user.name, channelName: user.profile.channelName, handle: user.profile.handle, niche: user.profile.niche});
  const [busy, setBusy] = useState(false);
  const dirty = f.name !== user.name || f.channelName !== user.profile.channelName || f.handle !== user.profile.handle || f.niche !== user.profile.niche;
  async function save() {
    setBusy(true);
    try {
      await api.updateMe({name: f.name, profile: {channelName: f.channelName.trim(), handle: f.handle.trim() && !f.handle.trim().startsWith("@") ? `@${f.handle.trim()}` : f.handle.trim(), niche: f.niche}});
      await refresh();
      toast("Profile saved", "good");
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!window.confirm("Delete your account? Your pipelines, scripts and videos are removed. This can't be undone.")) return;
    try {
      await api.deleteMe();
      go("");
      window.location.reload();
    } catch (e) {
      toast(e.message, "bad");
    }
  }
  return (
    <>
      <div className="panel">
        <div className="grid2">
          <Field label="Your name"><input id="pf-name" value={f.name} onChange={(e) => setF({...f, name: e.target.value})} /></Field>
          <Field label="Email" hint="Can't be changed yet."><input id="pf-email" value={user.email} disabled /></Field>
          <Field label="Channel name" hint="Shown on every episode's end card."><input id="pf-channel" value={f.channelName} onChange={(e) => setF({...f, channelName: e.target.value})} /></Field>
          <Field label="Handle"><input id="pf-handle" value={f.handle} onChange={(e) => setF({...f, handle: e.target.value})} placeholder="@yourchannel" /></Field>
          <Field label="Niche"><input id="pf-niche" value={f.niche} onChange={(e) => setF({...f, niche: e.target.value})} /></Field>
        </div>
        <div className="panel-foot">
          <span className="dim small">Applies to videos made after you save.</span>
          <button className="btn primary" disabled={!dirty || busy} onClick={save}>Save profile</button>
        </div>
      </div>
      <h2 className="title-s section-gap">Danger zone</h2>
      <div className="panel danger-panel">
        <div>
          <b>Delete account</b>
          <p className="dim small">Removes your pipelines, scripts, videos and connected accounts. Posts already on Instagram and YouTube stay there.</p>
        </div>
        <button className="btn danger-btn" onClick={remove}>Delete account</button>
      </div>
    </>
  );
}

function Notifications({user, state, refresh, toast}) {
  const [chat, setChat] = useState(user.notify?.telegramChatId || "");
  const [busy, setBusy] = useState(false);
  const run = async (fn, ok) => {
    setBusy(true);
    try {
      await fn();
      await refresh();
      toast(ok, "good");
    } catch (e) {
      toast(e.message, "bad");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <p className="lede">Frameo tells you when a script or video is ready to review, when something posts, and when something goes wrong.</p>
      <div className="notif-list">
        <div className="panel notif">
          <div><b>In the app</b><span className="dim small">The bell at the top. Always on.</span></div>
          <span className="state mono ok">ON</span>
        </div>
        <div className="panel notif col">
          <div className="notif-row">
            <div><b>Telegram</b><span className="dim small">Free and instant, on your phone.</span></div>
            <span className={`state mono ${user.notify?.telegramChatId && state.connections.telegram.configured ? "ok" : ""}`}>{user.notify?.telegramChatId && state.connections.telegram.configured ? "ON" : "OFF"}</span>
          </div>
          {!state.connections.telegram.configured ? (
            <p className="small warn-text">{user.role === "admin" ? "Add a Telegram bot token under Settings → Connections first." : "Telegram alerts aren't available on this Frameo yet."}</p>
          ) : (
            <>
              <ol className="dim small steps-list">
                <li>Open Telegram and start a chat with your Frameo bot (send it any message).</li>
                <li>Message @userinfobot to see your chat ID, and paste it below.</li>
              </ol>
              <div className="inline-form">
                <input id="nt-chat" value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Your chat ID, e.g. 123456789" />
                <button className="btn" disabled={busy} onClick={() => run(() => api.updateMe({notify: {telegramChatId: chat.trim()}}), "Saved")}>Save</button>
                <button className="btn" disabled={busy || !user.notify?.telegramChatId} onClick={() => run(() => api.testNotify(), "Test sent")}>Send test</button>
              </div>
            </>
          )}
        </div>
        <div className="panel notif">
          <div><b>Email</b><span className="dim small">Needs an email service; coming with the public launch.</span></div>
          <span className="state mono">SOON</span>
        </div>
      </div>
    </>
  );
}

const PLANS = [
  {id: "free", name: "Free", price: "₹0", credits: "30 credits once"},
  {id: "starter", name: "Starter", price: "₹499/mo", credits: "30 credits a month"},
  {id: "creator", name: "Creator", price: "₹999/mo", credits: "70 credits a month"},
  {id: "pro", name: "Pro", price: "₹2,499/mo", credits: "200 credits a month"},
];

function Plan({user}) {
  return (
    <>
      <div className="panel credit-panel">
        <div>
          <span className="mono dim">CREDITS LEFT</span>
          <b className="big-num">{user.credits}</b>
          <span className="dim small">1 credit ≈ one 30-second explainer. Story styles use 2–3. Failed videos are refunded automatically.</span>
        </div>
        <div>
          <span className="mono dim">CURRENT PLAN</span>
          <b className="plan-name">{PLANS.find((p) => p.id === user.plan)?.name || "Free"}</b>
        </div>
      </div>
      <h2 className="title-s section-gap">Plans</h2>
      <div className="plan-grid">
        {PLANS.map((p) => (
          <div key={p.id} className={`panel plan ${user.plan === p.id ? "current" : ""}`}>
            <b>{p.name}</b>
            <span className="plan-price">{p.price}</span>
            <span className="dim small">{p.credits}</span>
            {user.plan === p.id ? <span className="state mono ok">CURRENT</span> : <button className="btn" disabled title="Payments are coming soon">Upgrade · soon</button>}
          </div>
        ))}
      </div>
      <p className="dim small">Payments by UPI and card (Razorpay) are coming with the public launch. {user.role === "admin" ? "As admin, you can add credits to any account from the Admin page." : ""}</p>
    </>
  );
}

function ComingSoon() {
  return (
    <div className="panel">
      <b>One-click connect is coming</b>
      <p className="dim">Soon you'll connect Instagram and YouTube with a single sign-in here. Until then, your pipelines and reviews work as normal, and episodes wait for your accounts to be connected.</p>
    </div>
  );
}
