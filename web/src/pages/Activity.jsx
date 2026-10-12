import React, {useEffect, useRef, useState} from "react";
import {api} from "../api.js";

export default function Activity({user}) {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("mine");
  const box = useRef(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      (tab === "mine" ? api.activity().then((r) => r.map((x) => ({t: x.at, text: x.text, tone: x.tone}))) : api.adminLog().then((r) => r.lines.map((l) => {
        const m = l.match(/^\[(.*?)\]\s?(.*)$/);
        return {t: m ? m[1] : "", text: m ? m[2] : l, tone: /✗|fail|error/i.test(l) ? "bad" : ""};
      })))
        .then((r) => alive && setRows(r))
        .catch(() => {});
    load();
    const t = setInterval(load, 4000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [tab]);
  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [rows]);
  return (
    <div>
      <h1 className="title-l">Activity</h1>
      <p className="lede">Everything that happened: scripts written, videos made, posts and problems.</p>
      {user.role === "admin" ? (
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "mine"} className={tab === "mine" ? "on" : ""} onClick={() => setTab("mine")}>My activity</button>
          <button role="tab" aria-selected={tab === "server"} className={tab === "server" ? "on" : ""} onClick={() => setTab("server")}>Server log</button>
        </div>
      ) : null}
      <div className="log" ref={box}>
        {rows.length === 0 ? <div className="dim">Nothing yet.</div> : null}
        {rows.map((r, i) => (
          <div key={i} className={`log-line ${r.tone}`}>
            <span className="log-t">{tab === "mine" ? new Date(r.t).toLocaleString(undefined, {day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"}) : r.t}</span>
            <span>{r.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
