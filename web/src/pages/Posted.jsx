import React, {useEffect, useState} from "react";
import {api, fmtWhen} from "../api.js";
import {Platform, Empty} from "../ui.jsx";

export default function Posted({toast}) {
  const [eps, setEps] = useState(null);
  useEffect(() => {
    api.episodes({stage: "posted"}).then((e) => setEps(e.reverse())).catch((e) => toast(e.message, "bad"));
  }, [toast]);
  if (!eps) return <div className="loading mono">LOADING…</div>;
  return (
    <div>
      <h1 className="title-l">Posted</h1>
      <p className="lede">Everything PixelScript has published for you. View counts arrive once Instagram and YouTube insights are connected.</p>
      {eps.length === 0 ? (
        <Empty title="Nothing posted yet">Approved episodes show up here once they're live, with links to each post.</Empty>
      ) : (
        <div className="posted-grid">
          {eps.map((e) => (
            <article key={e.id} className="posted">
              <a href={`#/review/${e.id}`} className="posted-video">{e.videoUrl ? <video src={`${e.videoUrl}#t=3`} muted preload="metadata" /> : null}</a>
              <div className="posted-text">
                <span className="mono dim small">{e.pipelineName.toUpperCase()} · EP {e.number}</span>
                <b>{e.title}</b>
                <span className="dim small">{fmtWhen(e.postedAt || e.at)}</span>
                <div className="posted-links">
                  {Object.entries(e.results || {}).map(([p, r]) => (
                    <a key={p} href={r.url || "#"} target="_blank" rel="noreferrer" className="chip-link"><Platform name={p} small /> Open ↗</a>
                  ))}
                </div>
                <div className="stats mono small dim">VIEWS — · LIKES — · SAVES —</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
