import React, {useEffect, useRef, useState} from "react";
import {api} from "./api.js";

export default function Activity() {
  const [lines, setLines] = useState([]);
  const box = useRef(null);
  useEffect(() => {
    let alive = true;
    const load = () => api.logs().then((r) => alive && setLines(r.lines)).catch(() => {});
    load();
    const t = setInterval(load, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);
  const tone = (l) => (/✗|failed|error/i.test(l) ? "bad" : /✓|connected|posted|started/i.test(l) ? "good" : "");
  return (
    <>
      <h1 className="title-l">Activity</h1>
      <p className="lede">Everything Frameo does: previews, uploads, posts and errors.</p>
      <div className="log" ref={box}>
        {lines.length === 0 ? <div className="dim">No activity yet.</div> : null}
        {lines.map((l, i) => {
          const m = l.match(/^\[(.*?)\]\s?(.*)$/);
          return (
            <div key={i} className={`log-line ${tone(l)}`}>
              <span className="log-t">{m ? m[1] : ""}</span>
              <span>{m ? m[2] : l}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
