import React, {useCallback, useEffect, useState} from "react";
import {api, fmtWhen, PLANS} from "../api.js";
import {Stage} from "../ui.jsx";

export default function Admin({toast, refresh}) {
  const [d, setD] = useState(null);
  const load = useCallback(() => api.admin().then(setD).catch((e) => toast(e.message, "bad")), [toast]);
  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);
  if (!d) return <div className="loading mono">LOADING…</div>;
  const give = async (u) => {
    const n = Number(window.prompt(`Add how many credits to ${u.email}? (use a negative number to remove)`, "10"));
    if (!n) return;
    try {
      await api.addCredits(u.id, n);
      toast(`Credits updated for ${u.email}`, "good");
      load();
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const setPlan = async (u, plan) => {
    try {
      await api.setPlan(u.id, plan);
      toast(`${u.email} is now on ${PLANS.find((p) => p.id === plan).name}`, "good");
      load();
      refresh();
    } catch (e) {
      toast(e.message, "bad");
    }
  };
  const c = d.connections;
  return (
    <div className="admin">
      <h1 className="title-l">Admin</h1>
      <div className="stat-row">
        {[
          ["Users", d.totals.users],
          ["Live pipelines", `${d.totals.live}/${d.totals.pipelines}`],
          ["In progress", d.totals.inProgress],
          ["Posted", d.totals.posted],
          ["Failed", d.totals.failed],
          ["Credits used", d.totals.creditsUsed],
        ].map(([k, v]) => (
          <div key={k} className="panel stat"><span className="mono dim">{k.toUpperCase()}</span><b>{v}</b></div>
        ))}
      </div>

      <h2 className="title-s section-gap">Services</h2>
      <div className="svc-row">
        {[
          ["Video hosting (R2)", c.storage.configured],
          ["Instagram", c.instagram.configured],
          ["YouTube", c.youtube.connected],
          ["AI writer (Gemini)", c.writer.configured],
          ["Telegram bot", c.telegram.configured],
        ].map(([k, ok]) => (
          <span key={k} className={`svc ${ok ? "ok" : ""}`}><i />{k}</span>
        ))}
      </div>

      <h2 className="title-s section-gap">Users</h2>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Credits</th><th>Videos</th><th>Pipelines</th><th>Posted</th><th>Failed</th><th>Joined</th><th /></tr></thead>
          <tbody>
            {d.users.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b><br /><span className="dim small">{u.email}</span></td>
                <td className="mono small">{u.role}</td>
                <td>
                  <select className="plan-select" value={u.plan} onChange={(e) => setPlan(u, e.target.value)} aria-label={`Plan for ${u.email}`}>
                    {PLANS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </td>
                <td className="mono">{u.credits}</td>
                <td className="mono">{u.videos}</td>
                <td className="mono">{u.pipelines}</td>
                <td className="mono">{u.posted}</td>
                <td className={`mono ${u.failed ? "bad" : ""}`}>{u.failed}</td>
                <td className="small dim">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><button className="btn small" onClick={() => give(u)}>Credits</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="title-s section-gap">Recent failures</h2>
      {d.failures.length === 0 ? <p className="dim small">None.</p> : (
        <div className="history">
          {d.failures.map((e) => (
            <a key={e.id} href={`#/review/${e.id}`} className="h-row">
              <Stage stage={e.stage} />
              <span className="h-title">{e.title}<br /><span className="small bad">{e.error}</span></span>
              <span className="mono dim small">{fmtWhen(e.at)}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
