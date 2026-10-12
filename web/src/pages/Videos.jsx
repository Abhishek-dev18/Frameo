import React, {useCallback, useEffect, useState} from "react";
import {api, relative} from "../api.js";
import {Stage, Empty, RenderBar} from "../ui.jsx";

// Single videos: made one at a time, downloaded and posted by hand.
export default function Videos({state, toast}) {
  const [eps, setEps] = useState(null);
  const load = useCallback(() => api.episodes({single: "1"}).then((e) => setEps(e.reverse())).catch((e) => toast(e.message, "bad")), [toast]);
  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);
  if (!eps) return <div className="loading mono">LOADING…</div>;
  const tpl = (id) => state.templates.find((t) => t.id === id)?.name || "";

  return (
    <div>
      <div className="home-head">
        <h1 className="title-l">Videos</h1>
        <a className="btn primary" href="#/create">+ Make a video</a>
      </div>
      <p className="lede">Videos you make one at a time. Download the MP4, then post it on Instagram, YouTube or anywhere else.</p>
      {eps.length === 0 ? (
        <div className="section-gap">
          <Empty title="No videos yet" action={<a className="btn primary big" href="#/create">Make your first video</a>}>
            Pick a style, type a topic, approve the script, and download a finished vertical video.
          </Empty>
        </div>
      ) : (
        <div className="posted-grid">
          {eps.map((e) => (
            <article key={e.id} className="posted">
              <a href={`#/review/${e.id}`} className="posted-video" aria-label={`Open ${e.title}`}>
                {e.videoUrl ? <video src={`${e.videoUrl}#t=3`} muted preload="metadata" /> : <span className="frame-icon" aria-hidden="true" />}
              </a>
              <div className="posted-text">
                <span className="mono dim small">{tpl(e.template).toUpperCase()} · {relative(e.createdAt).toUpperCase()}</span>
                <b>{e.title}</b>
                <span><Stage stage={e.stage} /></span>
                {e.stage === "rendering" ? <RenderBar progress={e.progress ?? 0} /> : null}
                <div className="posted-links">
                  {e.stage === "ready" ? <a className="btn small primary" href={api.downloadUrl(e.id)} download>Download</a> : null}
                  {e.stage === "script_review" ? <a className="btn small" href={`#/review/${e.id}`}>Review script</a> : <a className="btn small" href={`#/review/${e.id}`}>Open</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
