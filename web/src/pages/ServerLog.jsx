import React, {useEffect, useRef, useState} from "react";
import {api} from "../api.js";

// Server log, shown on the Admin page only. Users don't get an activity page:
// anything that needs them arrives as a pop-up and in the bell.
export default function ServerLog() {
  const [rows, setRows] = useState([]);
  const box = useRef(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      api
        .adminLog()
        .then((r) =>
          r.lines.map((l) => {
            const m = l.match(/^\[(.*?)\]\s?(.*)$/);
            return {t: m ? m[1] : "", text: m ? m[2] : l, tone: /✗|fail|error/i.test(l) ? "bad" : ""};
          }),
        )
        .then((r) => alive && setRows(r))
        .catch(() => {});
    load();
    const t = setInterval(load, 5000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [rows]);
  return (
    <div className="log log-admin" ref={box}>
      {rows.length === 0 ? <div className="dim">Nothing yet.</div> : null}
      {rows.map((r, i) => (
        <div key={i} className={`log-line ${r.tone}`}>
          <span className="log-t">{r.t}</span>
          <span>{r.text}</span>
        </div>
      ))}
    </div>
  );
}
